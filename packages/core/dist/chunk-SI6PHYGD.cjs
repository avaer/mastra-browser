'use strict';

var chunkAUCYZR4G_cjs = require('./chunk-AUCYZR4G.cjs');
var chunkSUWCCDLE_cjs = require('./chunk-SUWCCDLE.cjs');
var chunkIXT3T67O_cjs = require('./chunk-IXT3T67O.cjs');
var chunk7D636BPD_cjs = require('./chunk-7D636BPD.cjs');

// src/memory/memory.ts
var _MastraMemory = class _MastraMemory extends chunkSUWCCDLE_cjs.MastraBase {
  constructor(config) {
    super({ component: "MEMORY", name: config.name });
    chunk7D636BPD_cjs.__publicField(this, "MAX_CONTEXT_TOKENS");
    chunk7D636BPD_cjs.__publicField(this, "storage");
    chunk7D636BPD_cjs.__publicField(this, "vector");
    chunk7D636BPD_cjs.__publicField(this, "embedder");
    chunk7D636BPD_cjs.__publicField(this, "threadConfig", {
      lastMessages: 40,
      semanticRecall: true,
      threads: {
        generateTitle: true
        // TODO: should we disable this by default to reduce latency?
      }
    });
    this.storage = config.storage || new chunkAUCYZR4G_cjs.DefaultProxyStorage({
      config: {
        url: "file:memory.db"
      }
    });
    if (config.vector) {
      this.vector = config.vector;
    } else {
      throw new Error("Vector config is required");
    }
    if (config.embedder) {
      this.embedder = config.embedder;
    } else {
      throw new Error("Embedder config is required");
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
    return chunkIXT3T67O_cjs.deepMerge(this.threadConfig, config || {});
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
    chunk7D636BPD_cjs.__name(addToolMessageToChat, "addToolMessageToChat");
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
chunk7D636BPD_cjs.__name(_MastraMemory, "MastraMemory");
var MastraMemory = _MastraMemory;

exports.MastraMemory = MastraMemory;
//# sourceMappingURL=chunk-SI6PHYGD.cjs.map
//# sourceMappingURL=chunk-SI6PHYGD.cjs.map