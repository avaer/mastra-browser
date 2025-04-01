import { LibSQLVector } from './chunk-Y2USYAIT.js';
import { DefaultProxyStorage } from './chunk-D3P2UQXV.js';
import { deepMerge } from './chunk-2YF5JYTJ.js';
import { MastraBase } from './chunk-WUPACWA6.js';
import fs, { existsSync } from 'fs';
import path, { join } from 'path';
import os from 'os';
import { experimental_customProvider } from 'ai';

var fsp = fs.promises;
async function getModelCachePath() {
  const cachePath = path.join(os.homedir(), ".cache", "mastra", "fastembed-models");
  await fsp.mkdir(cachePath, { recursive: true });
  return cachePath;
}
function unbundleableImport(name) {
  const nonStaticallyAnalyzableName = `${name}?d=${Date.now()}`;
  return import(nonStaticallyAnalyzableName.split(`?`)[0]);
}
async function generateEmbeddings(values, modelType) {
  try {
    let mod;
    const importErrors = [];
    {
      try {
        mod = await unbundleableImport("fastembed");
      } catch (e) {
        if (e instanceof Error) {
          importErrors.push(e);
        } else {
          throw e;
        }
      }
    }
    if (!mod) {
      throw new Error(`${importErrors.map((e) => e.message).join(`
`)}

This runtime does not support fastembed-js, which is the default embedder in Mastra. 
Scroll up to read import errors. These errors mean you can't use the default Mastra embedder on this hosting platform.
You can either use Mastra Cloud which supports the default embedder, or you can configure an alternate provider.

For example if you're using Memory:

import { openai } from "@ai-sdk/openai";

const memory = new Memory({
  embedder: openai.embedding("text-embedding-3-small"), // <- doesn't have to be openai
})

Visit https://sdk.vercel.ai/docs/foundations/overview#embedding-models to find an alternate embedding provider

If you do not want to use the Memory semantic recall feature, you can disable it entirely and this error will go away.

const memory = new Memory({
  options: {
    semanticRecall: false // <- an embedder will not be required with this set to false
  }
})
`);
    }
    const { FlagEmbedding, EmbeddingModel } = mod;
    const model = await FlagEmbedding.init({
      model: EmbeddingModel[modelType],
      cacheDir: await getModelCachePath()
    });
    const embeddings = await model.embed(values);
    const allResults = [];
    for await (const result of embeddings) {
      allResults.push(...result.map((embedding) => Array.from(embedding)));
    }
    if (allResults.length === 0) throw new Error("No embeddings generated");
    return {
      embeddings: allResults
    };
  } catch (error) {
    console.error("Error generating embeddings:", error);
    throw error;
  }
}
var fastEmbedProvider = experimental_customProvider({
  textEmbeddingModels: {
    "bge-small-en-v1.5": {
      specificationVersion: "v1",
      provider: "fastembed",
      modelId: "bge-small-en-v1.5",
      maxEmbeddingsPerCall: 256,
      supportsParallelCalls: true,
      async doEmbed({ values }) {
        return generateEmbeddings(values, "BGESmallENV15");
      }
    },
    "bge-base-en-v1.5": {
      specificationVersion: "v1",
      provider: "fastembed",
      modelId: "bge-base-en-v1.5",
      maxEmbeddingsPerCall: 256,
      supportsParallelCalls: true,
      async doEmbed({ values }) {
        return generateEmbeddings(values, "BGEBaseENV15");
      }
    }
  }
});
var defaultEmbedder = fastEmbedProvider.textEmbeddingModel;

// src/memory/memory.ts
var MastraMemory = class extends MastraBase {
  MAX_CONTEXT_TOKENS;
  storage;
  vector;
  embedder;
  threadConfig = {
    lastMessages: 40,
    semanticRecall: true,
    threads: {
      generateTitle: true
      // TODO: should we disable this by default to reduce latency?
    }
  };
  constructor(config) {
    super({ component: "MEMORY", name: config.name });
    this.storage = config.storage || new DefaultProxyStorage({
      config: {
        url: "file:memory.db"
      }
    });
    if (config.vector) {
      this.vector = config.vector;
    } else {
      const oldDb = "memory-vector.db";
      const hasOldDb = existsSync(join(process.cwd(), oldDb)) || existsSync(join(process.cwd(), ".mastra", oldDb));
      const newDb = "memory.db";
      if (hasOldDb) {
        this.logger.warn(
          `Found deprecated Memory vector db file ${oldDb} this db is now merged with the default ${newDb} file. Delete the old one to use the new one. You will need to migrate any data if that's important to you. For now the deprecated path will be used but in a future breaking change we will only use the new db file path.`
        );
      }
      this.vector = new LibSQLVector({
        connectionUrl: hasOldDb ? `file:${oldDb}` : `file:${newDb}`
      });
    }
    if (config.embedder) {
      this.embedder = config.embedder;
    } else {
      this.embedder = defaultEmbedder("bge-small-en-v1.5");
    }
    if (config.options) {
      this.threadConfig = this.getMergedThreadConfig(config.options);
    }
  }
  setStorage(storage) {
    this.storage = storage;
  }
  setVector(vector) {
    this.vector = vector;
  }
  setEmbedder(embedder) {
    this.embedder = embedder;
  }
  /**
   * Get a system message to inject into the conversation.
   * This will be called before each conversation turn.
   * Implementations can override this to inject custom system messages.
   */
  async getSystemMessage(_input) {
    return null;
  }
  /**
   * Get tools that should be available to the agent.
   * This will be called when converting tools for the agent.
   * Implementations can override this to provide additional tools.
   */
  getTools(_config) {
    return {};
  }
  async createEmbeddingIndex() {
    const defaultDimensions = 1536;
    const dimensionsByModelId = {
      "bge-small-en-v1.5": 384,
      "bge-base-en-v1.5": 768,
      "voyage-3-lite": 512
    };
    const dimensions = dimensionsByModelId[this.embedder.modelId] || defaultDimensions;
    const isDefault = dimensions === defaultDimensions;
    const indexName = isDefault ? "memory_messages" : `memory_messages_${dimensions}`;
    await this.vector.createIndex({ indexName, dimension: dimensions });
    return { indexName };
  }
  getMergedThreadConfig(config) {
    return deepMerge(this.threadConfig, config || {});
  }
  estimateTokens(text) {
    return Math.ceil(text.split(" ").length * 1.3);
  }
  parseMessages(messages) {
    return messages.map((msg) => ({
      ...msg,
      content: typeof msg.content === "string" && (msg.content.startsWith("[") || msg.content.startsWith("{")) ? JSON.parse(msg.content) : typeof msg.content === "number" ? String(msg.content) : msg.content
    }));
  }
  convertToUIMessages(messages) {
    function addToolMessageToChat({
      toolMessage,
      messages: messages2,
      toolResultContents
    }) {
      const chatMessages2 = messages2.map((message) => {
        if (message.toolInvocations) {
          return {
            ...message,
            toolInvocations: message.toolInvocations.map((toolInvocation) => {
              const toolResult = toolMessage.content.find((tool) => tool.toolCallId === toolInvocation.toolCallId);
              if (toolResult) {
                return {
                  ...toolInvocation,
                  state: "result",
                  result: toolResult.result
                };
              }
              return toolInvocation;
            })
          };
        }
        return message;
      });
      const resultContents = [...toolResultContents, ...toolMessage.content];
      return { chatMessages: chatMessages2, toolResultContents: resultContents };
    }
    const { chatMessages } = messages.reduce(
      (obj, message) => {
        if (message.role === "tool") {
          return addToolMessageToChat({
            toolMessage: message,
            messages: obj.chatMessages,
            toolResultContents: obj.toolResultContents
          });
        }
        let textContent = "";
        let toolInvocations = [];
        if (typeof message.content === "string") {
          textContent = message.content;
        } else if (typeof message.content === "number") {
          textContent = String(message.content);
        } else if (Array.isArray(message.content)) {
          for (const content of message.content) {
            if (content.type === "text") {
              textContent += content.text;
            } else if (content.type === "tool-call") {
              const toolResult = obj.toolResultContents.find((tool) => tool.toolCallId === content.toolCallId);
              toolInvocations.push({
                state: toolResult ? "result" : "call",
                toolCallId: content.toolCallId,
                toolName: content.toolName,
                args: content.args,
                result: toolResult?.result
              });
            }
          }
        }
        obj.chatMessages.push({
          id: message.id,
          role: message.role,
          content: textContent,
          toolInvocations
        });
        return obj;
      },
      { chatMessages: [], toolResultContents: [] }
    );
    return chatMessages;
  }
  /**
   * Helper method to create a new thread
   * @param title - Optional title for the thread
   * @param metadata - Optional metadata for the thread
   * @returns Promise resolving to the created thread
   */
  async createThread({
    threadId,
    resourceId,
    title,
    metadata,
    memoryConfig
  }) {
    const thread = {
      id: threadId || this.generateId(),
      title: title || `New Thread ${(/* @__PURE__ */ new Date()).toISOString()}`,
      resourceId,
      createdAt: /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date(),
      metadata
    };
    return this.saveThread({ thread, memoryConfig });
  }
  /**
   * Helper method to add a single message to a thread
   * @param threadId - The thread to add the message to
   * @param content - The message content
   * @param role - The role of the message sender
   * @param type - The type of the message
   * @param toolNames - Optional array of tool names that were called
   * @param toolCallArgs - Optional array of tool call arguments
   * @param toolCallIds - Optional array of tool call ids
   * @returns Promise resolving to the saved message
   */
  async addMessage({
    threadId,
    config,
    content,
    role,
    type,
    toolNames,
    toolCallArgs,
    toolCallIds
  }) {
    const message = {
      id: this.generateId(),
      content,
      role,
      createdAt: /* @__PURE__ */ new Date(),
      threadId,
      type,
      toolNames,
      toolCallArgs,
      toolCallIds
    };
    const savedMessages = await this.saveMessages({ messages: [message], memoryConfig: config });
    return savedMessages[0];
  }
  /**
   * Generates a unique identifier
   * @returns A unique string ID
   */
  generateId() {
    return crypto.randomUUID();
  }
};

export { MastraMemory };
