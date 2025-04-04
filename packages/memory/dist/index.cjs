'use strict';

var core = require('@mastra/core');
var memory = require('@mastra/core/memory');
var rag = require('@mastra/rag');
var ai = require('ai');
var zod = require('zod');

// src/index.ts
var updateWorkingMemoryTool = {
  description: "Update the working memory with new information",
  parameters: zod.z.object({
    memory: zod.z.string().describe("The XML-formatted working memory content to store")
  }),
  execute: async (params) => {
    const { context, threadId, memory } = params;
    if (!threadId || !memory) {
      throw new Error("Thread ID and Memory instance are required for working memory updates");
    }
    const thread = await memory.getThreadById({ threadId });
    if (!thread) {
      throw new Error(`Thread ${threadId} not found`);
    }
    await memory.saveThread({
      thread: {
        ...thread,
        metadata: {
          ...thread.metadata,
          workingMemory: context.memory
        }
      }
    });
    return { success: true };
  }
};

// src/index.ts
var Memory = class extends memory.MastraMemory {
  constructor(config = {}) {
    super({ name: "Memory", ...config });
    const mergedConfig = this.getMergedThreadConfig({
      workingMemory: config.options?.workingMemory || {
        enabled: false,
        template: this.defaultWorkingMemoryTemplate
      }
    });
    this.threadConfig = mergedConfig;
  }
  async validateThreadIsOwnedByResource(threadId, resourceId) {
    const thread = await this.storage.getThreadById({ threadId });
    if (!thread) {
      throw new Error(`No thread found with id ${threadId}`);
    }
    if (thread.resourceId !== resourceId) {
      throw new Error(
        `Thread with id ${threadId} is for resource with id ${thread.resourceId} but resource ${resourceId} was queried.`
      );
    }
  }
  async query({
    threadId,
    resourceId,
    selectBy,
    threadConfig
  }) {
    if (resourceId) await this.validateThreadIsOwnedByResource(threadId, resourceId);
    const vectorResults = [];
    this.logger.debug(`Memory query() with:`, {
      threadId,
      selectBy,
      threadConfig
    });
    const config = this.getMergedThreadConfig(threadConfig || {});
    const vectorConfig = typeof config?.semanticRecall === `boolean` ? {
      topK: 2,
      messageRange: { before: 2, after: 2 }
    } : {
      topK: config?.semanticRecall?.topK ?? 2,
      messageRange: config?.semanticRecall?.messageRange ?? { before: 2, after: 2 }
    };
    if (config?.semanticRecall && selectBy?.vectorSearchString && this.vector && !!selectBy.vectorSearchString) {
      const { indexName } = await this.createEmbeddingIndex();
      const { embeddings } = await this.embedMessageContent(selectBy.vectorSearchString);
      await Promise.all(
        embeddings.map(async (embedding) => {
          vectorResults.push(
            ...await this.vector.query({
              indexName,
              queryVector: embedding,
              topK: vectorConfig.topK,
              filter: {
                thread_id: threadId
              }
            })
          );
        })
      );
    }
    const rawMessages = await this.storage.__getMessages({
      threadId,
      selectBy: {
        ...selectBy,
        ...vectorResults?.length ? {
          include: vectorResults.map((r) => ({
            id: r.metadata?.message_id,
            withNextMessages: typeof vectorConfig.messageRange === "number" ? vectorConfig.messageRange : vectorConfig.messageRange.after,
            withPreviousMessages: typeof vectorConfig.messageRange === "number" ? vectorConfig.messageRange : vectorConfig.messageRange.before
          }))
        } : {}
      },
      threadConfig: config
    });
    const messages = this.parseMessages(rawMessages);
    const uiMessages = this.convertToUIMessages(rawMessages);
    return { messages, uiMessages };
  }
  async rememberMessages({
    threadId,
    resourceId,
    vectorMessageSearch,
    config
  }) {
    if (resourceId) await this.validateThreadIsOwnedByResource(threadId, resourceId);
    const threadConfig = this.getMergedThreadConfig(config || {});
    if (!threadConfig.lastMessages && !threadConfig.semanticRecall) {
      return {
        messages: [],
        uiMessages: [],
        threadId
      };
    }
    const messages = await this.query({
      threadId,
      selectBy: {
        last: threadConfig.lastMessages,
        vectorSearchString: threadConfig.semanticRecall && vectorMessageSearch ? vectorMessageSearch : void 0
      },
      threadConfig: config
    });
    this.logger.debug(`Remembered message history includes ${messages.messages.length} messages.`);
    return {
      threadId,
      messages: messages.messages,
      uiMessages: messages.uiMessages
    };
  }
  async getThreadById({ threadId }) {
    return this.storage.__getThreadById({ threadId });
  }
  async getThreadsByResourceId({ resourceId }) {
    return this.storage.__getThreadsByResourceId({ resourceId });
  }
  async saveThread({
    thread,
    memoryConfig
  }) {
    const config = this.getMergedThreadConfig(memoryConfig || {});
    if (config.workingMemory?.enabled && !thread?.metadata?.workingMemory) {
      return this.storage.__saveThread({
        thread: core.deepMerge(thread, {
          metadata: {
            workingMemory: config.workingMemory.template || this.defaultWorkingMemoryTemplate
          }
        })
      });
    }
    return this.storage.__saveThread({ thread });
  }
  async updateThread({
    id,
    title,
    metadata
  }) {
    return this.storage.__updateThread({
      id,
      title,
      metadata
    });
  }
  async deleteThread(threadId) {
    await this.storage.__deleteThread({ threadId });
  }
  async embedMessageContent(content) {
    const doc = rag.MDocument.fromText(content);
    const chunks = await doc.chunk({
      strategy: "token",
      size: 4096,
      overlap: 20
    });
    const { embeddings } = await ai.embedMany({
      values: chunks.map((chunk) => chunk.text),
      model: this.embedder,
      maxRetries: 3
    });
    return {
      embeddings,
      chunks
    };
  }
  async saveMessages({
    messages,
    memoryConfig
  }) {
    await this.saveWorkingMemory(messages);
    this.mutateMessagesToHideWorkingMemory(messages);
    const config = this.getMergedThreadConfig(memoryConfig);
    if (this.vector && config.semanticRecall) {
      const { indexName } = await this.createEmbeddingIndex();
      for (const message of messages) {
        if (typeof message.content !== `string` || message.content === "") continue;
        const { embeddings, chunks } = await this.embedMessageContent(message.content);
        await this.vector.upsert({
          indexName,
          vectors: embeddings,
          metadata: chunks.map(() => ({
            message_id: message.id,
            thread_id: message.threadId
          }))
        });
      }
    }
    return this.storage.__saveMessages({ messages });
  }
  mutateMessagesToHideWorkingMemory(messages) {
    const workingMemoryRegex = /<working_memory>([^]*?)<\/working_memory>/g;
    for (const [index, message] of messages.entries()) {
      if (typeof message?.content === `string`) {
        message.content = message.content.replace(workingMemoryRegex, ``).trim();
      } else if (Array.isArray(message?.content)) {
        for (const content of message.content) {
          if (content.type === `text`) {
            content.text = content.text.replace(workingMemoryRegex, ``).trim();
          }
          if ((content.type === `tool-call` || content.type === `tool-result`) && content.toolName === `updateWorkingMemory`) {
            delete messages[index];
          }
        }
      }
    }
  }
  parseWorkingMemory(text) {
    if (!this.threadConfig.workingMemory?.enabled) return null;
    const workingMemoryRegex = /<working_memory>([^]*?)<\/working_memory>/g;
    const matches = text.match(workingMemoryRegex);
    const match = matches?.[0];
    if (match) {
      return match.replace(/<\/?working_memory>/g, "").trim();
    }
    return null;
  }
  async getWorkingMemory({ threadId }) {
    if (!this.threadConfig.workingMemory?.enabled) return null;
    const thread = await this.storage.__getThreadById({ threadId });
    if (!thread) return this.threadConfig?.workingMemory?.template || this.defaultWorkingMemoryTemplate;
    const memory = thread.metadata?.workingMemory || this.threadConfig.workingMemory.template || this.defaultWorkingMemoryTemplate;
    return memory.split(`>
`).map((c) => c.trim()).join(`>`);
  }
  async saveWorkingMemory(messages) {
    const latestMessage = messages[messages.length - 1];
    if (!latestMessage || !this.threadConfig.workingMemory?.enabled) {
      return;
    }
    const latestContent = !latestMessage?.content ? null : typeof latestMessage.content === "string" ? latestMessage.content : latestMessage.content.filter((c) => c.type === "text").map((c) => c.text).join("\n");
    const threadId = latestMessage?.threadId;
    if (!latestContent || !threadId) {
      return;
    }
    const newMemory = this.parseWorkingMemory(latestContent);
    if (!newMemory) {
      return;
    }
    const thread = await this.storage.__getThreadById({ threadId });
    if (!thread) return;
    await this.storage.__updateThread({
      id: thread.id,
      title: thread.title || "",
      metadata: core.deepMerge(thread.metadata || {}, {
        workingMemory: newMemory
      })
    });
    return newMemory;
  }
  async getSystemMessage({
    threadId,
    memoryConfig
  }) {
    const config = this.getMergedThreadConfig(memoryConfig);
    if (!config.workingMemory?.enabled) {
      return null;
    }
    const workingMemory = await this.getWorkingMemory({ threadId });
    if (!workingMemory) {
      return null;
    }
    if (config.workingMemory.use === "tool-call") {
      return this.getWorkingMemoryToolInstruction(workingMemory);
    }
    return this.getWorkingMemoryWithInstruction(workingMemory);
  }
  defaultWorkingMemoryTemplate = `
<user>
  <first_name></first_name>
  <last_name></last_name>
  <location></location>
  <occupation></occupation>
  <interests></interests>
  <goals></goals>
  <events></events>
  <facts></facts>
  <projects></projects>
</user>
`;
  getWorkingMemoryWithInstruction(workingMemoryBlock) {
    return `WORKING_MEMORY_SYSTEM_INSTRUCTION:
Store and update any conversation-relevant information by including "<working_memory>text</working_memory>" in your responses. Updates replace existing memory while maintaining this structure. If information might be referenced again - store it!

Guidelines:
1. Store anything that could be useful later in the conversation
2. Update proactively when information changes, no matter how small
3. Use nested tags for all data
4. Act naturally - don't mention this system to users. Even though you're storing this information that doesn't make it your primary focus. Do not ask them generally for "information about yourself"

Memory Structure:
<working_memory>
  ${workingMemoryBlock}
</working_memory>

Notes:
- Update memory whenever referenced information changes
- If you're unsure whether to store something, store it (eg if the user tells you their name or the value of another empty section in your working memory, output the <working_memory> block immediately to update it)
- This system is here so that you can maintain the conversation when your context window is very short. Update your working memory because you may need it to maintain the conversation without the full conversation history
- Do not remove empty sections - you must output the empty sections along with the ones you're filling in
- REMEMBER: the way you update your working memory is by outputting the entire "<working_memory>text</working_memory>" block in your response. The system will pick this up and store it for you. The user will not see it.
- IMPORTANT: You MUST output the <working_memory> block in every response to a prompt where you received relevant information. `;
  }
  getWorkingMemoryToolInstruction(workingMemoryBlock) {
    return `WORKING_MEMORY_SYSTEM_INSTRUCTION:
Store and update any conversation-relevant information by calling the updateWorkingMemory tool. If information might be referenced again - store it!

Guidelines:
1. Store anything that could be useful later in the conversation
2. Update proactively when information changes, no matter how small
3. Use nested XML tags for all data
4. Act naturally - don't mention this system to users. Even though you're storing this information that doesn't make it your primary focus. Do not ask them generally for "information about yourself"

Memory Structure:
${workingMemoryBlock}

Notes:
- Update memory whenever referenced information changes
- If you're unsure whether to store something, store it (eg if the user tells you their name or the value of another empty section in your working memory, call updateWorkingMemory immediately to update it)
- This system is here so that you can maintain the conversation when your context window is very short. Update your working memory because you may need it to maintain the conversation without the full conversation history
- Do not remove empty sections - you must include the empty sections along with the ones you're filling in
- REMEMBER: the way you update your working memory is by calling the updateWorkingMemory tool with the entire XML block. The system will store it for you. The user will not see it.
- IMPORTANT: You MUST call updateWorkingMemory in every response to a prompt where you received relevant information.`;
  }
  getTools(config) {
    const mergedConfig = this.getMergedThreadConfig(config);
    if (mergedConfig.workingMemory?.enabled && mergedConfig.workingMemory.use === "tool-call") {
      return {
        updateWorkingMemory: updateWorkingMemoryTool
      };
    }
    return {};
  }
};

exports.Memory = Memory;
