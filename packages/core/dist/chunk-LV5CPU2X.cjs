'use strict';

var chunkXXM463NA_cjs = require('./chunk-XXM463NA.cjs');
var chunkZZSLONUU_cjs = require('./chunk-ZZSLONUU.cjs');
var chunkSUWCCDLE_cjs = require('./chunk-SUWCCDLE.cjs');
var chunkQVQCHA2A_cjs = require('./chunk-QVQCHA2A.cjs');
var chunk4FUCJCP2_cjs = require('./chunk-4FUCJCP2.cjs');
var chunk7D636BPD_cjs = require('./chunk-7D636BPD.cjs');
var ai = require('ai');
var zod = require('zod');

// src/llm/model/base.ts
var _mastra, _model;
var _MastraLLMBase = class _MastraLLMBase extends chunkSUWCCDLE_cjs.MastraBase {
  constructor({
    name,
    model
  }) {
    super({
      component: chunkQVQCHA2A_cjs.RegisteredLogger.LLM,
      name
    });
    // @ts-ignore
    chunk7D636BPD_cjs.__privateAdd(this, _mastra);
    chunk7D636BPD_cjs.__privateAdd(this, _model);
    chunk7D636BPD_cjs.__privateSet(this, _model, model);
  }
  getProvider() {
    return chunk7D636BPD_cjs.__privateGet(this, _model).provider;
  }
  getModelId() {
    return chunk7D636BPD_cjs.__privateGet(this, _model).modelId;
  }
  getModel() {
    return chunk7D636BPD_cjs.__privateGet(this, _model);
  }
  convertToMessages(messages) {
    if (Array.isArray(messages)) {
      return messages.map(m => {
        if (typeof m === "string") {
          return {
            role: "user",
            content: m
          };
        }
        return m;
      });
    }
    return [{
      role: "user",
      content: messages
    }];
  }
  __registerPrimitives(p) {
    if (p.telemetry) {
      this.__setTelemetry(p.telemetry);
    }
    if (p.logger) {
      this.__setLogger(p.logger);
    }
  }
  __registerMastra(p) {
    chunk7D636BPD_cjs.__privateSet(this, _mastra, p);
  }
  async __text(input) {
    this.logger.debug(`[LLMs:${this.name}] Generating text.`, {
      input
    });
    throw new Error("Method not implemented.");
  }
  async __textObject(input) {
    this.logger.debug(`[LLMs:${this.name}] Generating object.`, {
      input
    });
    throw new Error("Method not implemented.");
  }
  async generate(messages, options = {}) {
    this.logger.debug(`[LLMs:${this.name}] Generating text.`, {
      messages,
      options
    });
    throw new Error("Method not implemented.");
  }
  async __stream(input) {
    this.logger.debug(`[LLMs:${this.name}] Streaming text.`, {
      input
    });
    throw new Error("Method not implemented.");
  }
  async __streamObject(input) {
    this.logger.debug(`[LLMs:${this.name}] Streaming object.`, {
      input
    });
    throw new Error("Method not implemented.");
  }
  async stream(messages, options = {}) {
    this.logger.debug(`[LLMs:${this.name}] Streaming text.`, {
      messages,
      options
    });
    throw new Error("Method not implemented.");
  }
};
_mastra = new WeakMap();
_model = new WeakMap();
chunk7D636BPD_cjs.__name(_MastraLLMBase, "MastraLLMBase");
var MastraLLMBase = _MastraLLMBase;
var _model2, _mastra2;
var _MastraLLM = class _MastraLLM extends MastraLLMBase {
  constructor({
    model,
    mastra
  }) {
    super({
      name: "aisdk",
      model
    });
    chunk7D636BPD_cjs.__privateAdd(this, _model2);
    chunk7D636BPD_cjs.__privateAdd(this, _mastra2);
    chunk7D636BPD_cjs.__privateSet(this, _model2, model);
    if (mastra) {
      chunk7D636BPD_cjs.__privateSet(this, _mastra2, mastra);
      if (mastra.getLogger()) {
        this.__setLogger(mastra.getLogger());
      }
    }
  }
  __registerPrimitives(p) {
    if (p.telemetry) {
      this.__setTelemetry(p.telemetry);
    }
    if (p.logger) {
      this.__setLogger(p.logger);
    }
  }
  __registerMastra(p) {
    chunk7D636BPD_cjs.__privateSet(this, _mastra2, p);
  }
  getProvider() {
    return chunk7D636BPD_cjs.__privateGet(this, _model2).provider;
  }
  getModelId() {
    return chunk7D636BPD_cjs.__privateGet(this, _model2).modelId;
  }
  getModel() {
    return chunk7D636BPD_cjs.__privateGet(this, _model2);
  }
  convertTools({
    tools,
    runId,
    threadId,
    resourceId,
    memory
  } = {}) {
    this.logger.debug("Starting tool conversion for LLM");
    let mastraProxy = void 0;
    const logger = this.logger;
    if (chunk7D636BPD_cjs.__privateGet(this, _mastra2)) {
      mastraProxy = chunkZZSLONUU_cjs.createMastraProxy({
        mastra: chunk7D636BPD_cjs.__privateGet(this, _mastra2),
        logger
      });
    }
    const converted = Object.entries(tools || {}).reduce((memo, value) => {
      const k = value[0];
      const tool = value[1];
      if (tool) {
        const options = {
          name: k,
          runId,
          threadId,
          resourceId,
          logger: this.logger,
          memory,
          mastra: mastraProxy
        };
        memo[k] = chunkZZSLONUU_cjs.makeCoreTool(tool, options);
      }
      return memo;
    }, {});
    this.logger.debug(`Converted tools for LLM`);
    return converted;
  }
  async __text({
    runId,
    messages,
    maxSteps,
    tools,
    convertedTools,
    temperature,
    toolChoice = "auto",
    onStepFinish,
    experimental_output,
    telemetry,
    threadId,
    resourceId,
    memory,
    ...rest
  }) {
    const model = chunk7D636BPD_cjs.__privateGet(this, _model2);
    this.logger.debug(`[LLM] - Generating text`, {
      runId,
      messages,
      maxSteps,
      threadId,
      resourceId,
      tools: Object.keys(tools || convertedTools || {})
    });
    const finalTools = convertedTools || this.convertTools({
      tools,
      runId,
      threadId,
      resourceId,
      memory
    });
    const argsForExecute = {
      model,
      temperature,
      tools: {
        ...finalTools
      },
      toolChoice,
      maxSteps,
      onStepFinish: /* @__PURE__ */chunk7D636BPD_cjs.__name(async props => {
        void onStepFinish?.(props);
        this.logger.debug("[LLM] - Step Change:", {
          text: props?.text,
          toolCalls: props?.toolCalls,
          toolResults: props?.toolResults,
          finishReason: props?.finishReason,
          usage: props?.usage,
          runId
        });
        if (props?.response?.headers?.["x-ratelimit-remaining-tokens"] && parseInt(props?.response?.headers?.["x-ratelimit-remaining-tokens"], 10) < 2e3) {
          this.logger.warn("Rate limit approaching, waiting 10 seconds", {
            runId
          });
          await chunkZZSLONUU_cjs.delay(10 * 1e3);
        }
      }, "onStepFinish"),
      ...rest
    };
    let schema;
    if (experimental_output) {
      this.logger.debug("[LLM] - Using experimental output", {
        runId
      });
      if (typeof experimental_output.parse === "function") {
        schema = experimental_output;
        if (schema instanceof zod.z.ZodArray) {
          schema = schema._def.type;
        }
      } else {
        schema = ai.jsonSchema(experimental_output);
      }
    }
    return await ai.generateText({
      messages,
      ...argsForExecute,
      experimental_telemetry: {
        ...this.experimental_telemetry,
        ...telemetry
      },
      experimental_output: schema ? ai.Output.object({
        schema
      }) : void 0
    });
  }
  async __textObject({
    messages,
    onStepFinish,
    maxSteps = 5,
    tools,
    convertedTools,
    structuredOutput,
    runId,
    temperature,
    toolChoice = "auto",
    telemetry,
    threadId,
    resourceId,
    memory,
    ...rest
  }) {
    const model = chunk7D636BPD_cjs.__privateGet(this, _model2);
    this.logger.debug(`[LLM] - Generating a text object`, {
      runId
    });
    const finalTools = convertedTools || this.convertTools({
      tools,
      runId,
      threadId,
      resourceId,
      memory
    });
    const argsForExecute = {
      model,
      temperature,
      tools: {
        ...finalTools
      },
      maxSteps,
      toolChoice,
      onStepFinish: /* @__PURE__ */chunk7D636BPD_cjs.__name(async props => {
        void onStepFinish?.(props);
        this.logger.debug("[LLM] - Step Change:", {
          text: props?.text,
          toolCalls: props?.toolCalls,
          toolResults: props?.toolResults,
          finishReason: props?.finishReason,
          usage: props?.usage,
          runId
        });
        if (props?.response?.headers?.["x-ratelimit-remaining-tokens"] && parseInt(props?.response?.headers?.["x-ratelimit-remaining-tokens"], 10) < 2e3) {
          this.logger.warn("Rate limit approaching, waiting 10 seconds", {
            runId
          });
          await chunkZZSLONUU_cjs.delay(10 * 1e3);
        }
      }, "onStepFinish"),
      ...rest
    };
    let schema;
    let output = "object";
    if (typeof structuredOutput.parse === "function") {
      schema = structuredOutput;
      if (schema instanceof zod.z.ZodArray) {
        output = "array";
        schema = schema._def.type;
      }
    } else {
      schema = ai.jsonSchema(structuredOutput);
    }
    return await ai.generateObject({
      messages,
      ...argsForExecute,
      output,
      schema,
      experimental_telemetry: {
        ...this.experimental_telemetry,
        ...telemetry
      }
    });
  }
  async __stream({
    messages,
    onStepFinish,
    onFinish,
    maxSteps = 5,
    tools,
    convertedTools,
    runId,
    temperature,
    toolChoice = "auto",
    experimental_output,
    telemetry,
    threadId,
    resourceId,
    memory,
    ...rest
  }) {
    const model = chunk7D636BPD_cjs.__privateGet(this, _model2);
    this.logger.debug(`[LLM] - Streaming text`, {
      runId,
      threadId,
      resourceId,
      messages,
      maxSteps,
      tools: Object.keys(tools || convertedTools || {})
    });
    const finalTools = convertedTools || this.convertTools({
      tools,
      runId,
      threadId,
      resourceId,
      memory
    });
    const argsForExecute = {
      model,
      temperature,
      tools: {
        ...finalTools
      },
      maxSteps,
      toolChoice,
      onStepFinish: /* @__PURE__ */chunk7D636BPD_cjs.__name(async props => {
        void onStepFinish?.(props);
        this.logger.debug("[LLM] - Stream Step Change:", {
          text: props?.text,
          toolCalls: props?.toolCalls,
          toolResults: props?.toolResults,
          finishReason: props?.finishReason,
          usage: props?.usage,
          runId
        });
        if (props?.response?.headers?.["x-ratelimit-remaining-tokens"] && parseInt(props?.response?.headers?.["x-ratelimit-remaining-tokens"], 10) < 2e3) {
          this.logger.warn("Rate limit approaching, waiting 10 seconds", {
            runId
          });
          await chunkZZSLONUU_cjs.delay(10 * 1e3);
        }
      }, "onStepFinish"),
      onFinish: /* @__PURE__ */chunk7D636BPD_cjs.__name(async props => {
        void onFinish?.(props);
        this.logger.debug("[LLM] - Stream Finished:", {
          text: props?.text,
          toolCalls: props?.toolCalls,
          toolResults: props?.toolResults,
          finishReason: props?.finishReason,
          usage: props?.usage,
          runId,
          threadId,
          resourceId
        });
      }, "onFinish"),
      ...rest
    };
    let schema;
    if (experimental_output) {
      this.logger.debug("[LLM] - Using experimental output", {
        runId
      });
      if (typeof experimental_output.parse === "function") {
        schema = experimental_output;
        if (schema instanceof zod.z.ZodArray) {
          schema = schema._def.type;
        }
      } else {
        schema = ai.jsonSchema(experimental_output);
      }
    }
    return await ai.streamText({
      messages,
      ...argsForExecute,
      experimental_telemetry: {
        ...this.experimental_telemetry,
        ...telemetry
      },
      experimental_output: schema ? ai.Output.object({
        schema
      }) : void 0
    });
  }
  async __streamObject({
    messages,
    onStepFinish,
    onFinish,
    maxSteps = 5,
    tools,
    convertedTools,
    structuredOutput,
    runId,
    temperature,
    toolChoice = "auto",
    telemetry,
    threadId,
    resourceId,
    memory,
    ...rest
  }) {
    const model = chunk7D636BPD_cjs.__privateGet(this, _model2);
    this.logger.debug(`[LLM] - Streaming structured output`, {
      runId,
      messages,
      maxSteps,
      tools: Object.keys(tools || convertedTools || {})
    });
    const finalTools = convertedTools || this.convertTools({
      tools,
      runId,
      threadId,
      resourceId,
      memory
    });
    const argsForExecute = {
      model,
      temperature,
      tools: {
        ...finalTools
      },
      maxSteps,
      toolChoice,
      onStepFinish: /* @__PURE__ */chunk7D636BPD_cjs.__name(async props => {
        void onStepFinish?.(props);
        this.logger.debug("[LLM] - Stream Step Change:", {
          text: props?.text,
          toolCalls: props?.toolCalls,
          toolResults: props?.toolResults,
          finishReason: props?.finishReason,
          usage: props?.usage,
          runId,
          threadId,
          resourceId
        });
        if (props?.response?.headers?.["x-ratelimit-remaining-tokens"] && parseInt(props?.response?.headers?.["x-ratelimit-remaining-tokens"], 10) < 2e3) {
          this.logger.warn("Rate limit approaching, waiting 10 seconds", {
            runId
          });
          await chunkZZSLONUU_cjs.delay(10 * 1e3);
        }
      }, "onStepFinish"),
      onFinish: /* @__PURE__ */chunk7D636BPD_cjs.__name(async props => {
        void onFinish?.(props);
        this.logger.debug("[LLM] - Stream Finished:", {
          text: props?.text,
          toolCalls: props?.toolCalls,
          toolResults: props?.toolResults,
          finishReason: props?.finishReason,
          usage: props?.usage,
          runId,
          threadId,
          resourceId
        });
      }, "onFinish"),
      ...rest
    };
    let schema;
    let output = "object";
    if (typeof structuredOutput.parse === "function") {
      schema = structuredOutput;
      if (schema instanceof zod.z.ZodArray) {
        output = "array";
        schema = schema._def.type;
      }
    } else {
      schema = ai.jsonSchema(structuredOutput);
    }
    return ai.streamObject({
      messages,
      ...argsForExecute,
      output,
      schema,
      experimental_telemetry: {
        ...this.experimental_telemetry,
        ...telemetry
      }
    });
  }
  async generate(messages, {
    maxSteps = 5,
    onStepFinish,
    tools,
    convertedTools,
    runId,
    output,
    temperature,
    telemetry,
    memory,
    ...rest
  } = {}) {
    const msgs = this.convertToMessages(messages);
    if (!output) {
      return await this.__text({
        messages: msgs,
        onStepFinish,
        maxSteps,
        tools,
        convertedTools,
        runId,
        temperature,
        memory,
        ...rest
      });
    }
    return await this.__textObject({
      messages: msgs,
      structuredOutput: output,
      onStepFinish,
      maxSteps,
      tools,
      convertedTools,
      runId,
      telemetry,
      memory,
      ...rest
    });
  }
  async stream(messages, {
    maxSteps = 5,
    onFinish,
    onStepFinish,
    tools,
    convertedTools,
    runId,
    output,
    temperature,
    telemetry,
    ...rest
  } = {}) {
    const msgs = this.convertToMessages(messages);
    if (!output) {
      return await this.__stream({
        messages: msgs,
        onStepFinish,
        onFinish,
        maxSteps,
        tools,
        convertedTools,
        runId,
        temperature,
        telemetry,
        ...rest
      });
    }
    return await this.__streamObject({
      messages: msgs,
      structuredOutput: output,
      onStepFinish,
      onFinish,
      maxSteps,
      tools,
      convertedTools,
      runId,
      temperature,
      telemetry,
      ...rest
    });
  }
  convertToUIMessages(messages) {
    function addToolMessageToChat({
      toolMessage,
      messages: messages2,
      toolResultContents
    }) {
      const chatMessages2 = messages2.map(message => {
        if (message.toolInvocations) {
          return {
            ...message,
            toolInvocations: message.toolInvocations.map(toolInvocation => {
              const toolResult = toolMessage.content.find(tool => tool.toolCallId === toolInvocation.toolCallId);
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
      return {
        chatMessages: chatMessages2,
        toolResultContents: resultContents
      };
    }
    chunk7D636BPD_cjs.__name(addToolMessageToChat, "addToolMessageToChat");
    const {
      chatMessages
    } = messages.reduce((obj, message) => {
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
            const toolResult = obj.toolResultContents.find(tool => tool.toolCallId === content.toolCallId);
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
    }, {
      chatMessages: [],
      toolResultContents: []
    });
    return chatMessages;
  }
};
_model2 = new WeakMap();
_mastra2 = new WeakMap();
chunk7D636BPD_cjs.__name(_MastraLLM, "MastraLLM");
var MastraLLM = _MastraLLM;

// src/agent/index.ts
var randomUUID = crypto.randomUUID.bind(crypto);
var _Agent_decorators, _mastra3, _memory, _init, _a;
_Agent_decorators = [chunkXXM463NA_cjs.InstrumentClass({
  prefix: "agent",
  excludeMethods: ["__setTools", "__setLogger", "__setTelemetry", "log"]
})];
var _Agent = class _Agent extends (_a = chunkSUWCCDLE_cjs.MastraBase) {
  constructor(config) {
    super({
      component: chunkQVQCHA2A_cjs.RegisteredLogger.AGENT
    });
    chunk7D636BPD_cjs.__publicField(this, "name");
    chunk7D636BPD_cjs.__publicField(this, "llm");
    chunk7D636BPD_cjs.__publicField(this, "instructions");
    chunk7D636BPD_cjs.__publicField(this, "model");
    chunk7D636BPD_cjs.__privateAdd(this, _mastra3);
    chunk7D636BPD_cjs.__privateAdd(this, _memory);
    chunk7D636BPD_cjs.__publicField(this, "tools");
    /** @deprecated This property is deprecated. Use evals instead. */
    chunk7D636BPD_cjs.__publicField(this, "metrics");
    chunk7D636BPD_cjs.__publicField(this, "evals");
    chunk7D636BPD_cjs.__publicField(this, "voice");
    this.name = config.name;
    this.instructions = config.instructions;
    if (!config.model) {
      throw new Error(`LanguageModel is required to create an Agent. Please provide the 'model'.`);
    }
    this.llm = new MastraLLM({
      model: config.model,
      mastra: config.mastra
    });
    this.tools = {};
    this.metrics = {};
    this.evals = {};
    if (config.tools) {
      this.tools = chunkZZSLONUU_cjs.ensureToolProperties(config.tools);
    }
    if (config.mastra) {
      this.__registerMastra(config.mastra);
      this.__registerPrimitives({
        telemetry: config.mastra.getTelemetry(),
        logger: config.mastra.getLogger()
      });
    }
    if (config.metrics) {
      this.logger.warn("The metrics property is deprecated. Please use evals instead to add evaluation metrics.");
      this.metrics = config.metrics;
      this.evals = config.metrics;
    }
    if (config.evals) {
      this.evals = config.evals;
    }
    if (config.memory) {
      chunk7D636BPD_cjs.__privateSet(this, _memory, config.memory);
    }
    if (config.voice) {
      this.voice = config.voice;
      this.voice?.addTools(this.tools);
      this.voice?.addInstructions(config.instructions);
    }
  }
  hasOwnMemory() {
    return Boolean(chunk7D636BPD_cjs.__privateGet(this, _memory));
  }
  getMemory() {
    return chunk7D636BPD_cjs.__privateGet(this, _memory) ?? chunk7D636BPD_cjs.__privateGet(this, _mastra3)?.memory;
  }
  __updateInstructions(newInstructions) {
    this.instructions = newInstructions;
    this.logger.debug(`[Agents:${this.name}] Instructions updated.`, {
      model: this.model,
      name: this.name
    });
  }
  __registerPrimitives(p) {
    if (p.telemetry) {
      this.__setTelemetry(p.telemetry);
    }
    if (p.logger) {
      this.__setLogger(p.logger);
    }
    this.llm.__registerPrimitives(p);
    this.logger.debug(`[Agents:${this.name}] initialized.`, {
      model: this.model,
      name: this.name
    });
  }
  __registerMastra(mastra) {
    chunk7D636BPD_cjs.__privateSet(this, _mastra3, mastra);
    this.llm.__registerMastra(mastra);
  }
  /**
   * Set the concrete tools for the agent
   * @param tools
   */
  __setTools(tools) {
    this.tools = tools;
    this.logger.debug(`[Agents:${this.name}] Tools set for agent ${this.name}`, {
      model: this.model,
      name: this.name
    });
  }
  async generateTitleFromUserMessage({
    message
  }) {
    const {
      text
    } = await this.llm.__text({
      messages: [{
        role: "system",
        content: `

      - you will generate a short title based on the first message a user begins a conversation with
      - ensure it is not more than 80 characters long
      - the title should be a summary of the user's message
      - do not use quotes or colons
      - the entire text you return will be used as the title`
      }, {
        role: "user",
        content: JSON.stringify(message)
      }]
    });
    const cleanedText = text.replace(/<think>[\s\S]*?<\/think>/g, "").trim();
    return cleanedText;
  }
  getMostRecentUserMessage(messages) {
    const userMessages = messages.filter(message => message.role === "user");
    return userMessages.at(-1);
  }
  async genTitle(userMessage) {
    let title = `New Thread ${(/* @__PURE__ */new Date()).toISOString()}`;
    try {
      if (userMessage) {
        title = await this.generateTitleFromUserMessage({
          message: userMessage
        });
      }
    } catch (e) {
      console.error("Error generating title:", e);
    }
    return title;
  }
  async fetchMemory({
    threadId,
    memoryConfig,
    resourceId,
    userMessages,
    runId
  }) {
    const memory = this.getMemory();
    if (memory) {
      const thread = await memory.getThreadById({
        threadId
      });
      if (!thread) {
        return {
          threadId: threadId || "",
          messages: userMessages
        };
      }
      const newMessages = chunkZZSLONUU_cjs.ensureAllMessagesAreCoreMessages(userMessages);
      const messages = newMessages.map(u => {
        return {
          id: this.getMemory()?.generateId(),
          createdAt: /* @__PURE__ */new Date(),
          threadId,
          ...u,
          content: u.content,
          role: u.role,
          type: "text"
        };
      });
      const [memoryMessages, memorySystemMessage] = threadId && memory ? await Promise.all([memory.rememberMessages({
        threadId,
        resourceId,
        config: memoryConfig,
        vectorMessageSearch: messages.slice(-1).map(m => {
          if (typeof m === `string`) {
            return m;
          }
          return m?.content || ``;
        }).join(`
`)
      }).then(r => r.messages), memory.getSystemMessage({
        threadId,
        memoryConfig
      })]) : [[], null];
      this.logger.debug("Saved messages to memory", {
        threadId,
        runId
      });
      return {
        threadId: thread.id,
        messages: [memorySystemMessage ? {
          role: "system",
          content: memorySystemMessage
        } : null, ...this.sanitizeResponseMessages(memoryMessages), ...newMessages].filter(message => Boolean(message))
      };
    }
    return {
      threadId: threadId || "",
      messages: userMessages
    };
  }
  async saveResponse({
    result,
    threadId,
    resourceId,
    runId,
    memoryConfig
  }) {
    const {
      response
    } = result;
    try {
      if (response.messages) {
        const ms = Array.isArray(response.messages) ? response.messages : [response.messages];
        const responseMessagesWithoutIncompleteToolCalls = this.sanitizeResponseMessages(ms);
        const memory = this.getMemory();
        if (memory) {
          this.logger.debug(`[Agent:${this.name}] - Memory persistence: store=${this.getMemory()?.constructor.name} threadId=${threadId}`, {
            runId,
            resourceId,
            threadId,
            memoryStore: this.getMemory()?.constructor.name
          });
          await memory.saveMessages({
            memoryConfig,
            messages: responseMessagesWithoutIncompleteToolCalls.map((message, index) => {
              const messageId = randomUUID();
              let toolCallIds;
              let toolCallArgs;
              let toolNames;
              let type = "text";
              if (message.role === "tool") {
                toolCallIds = message.content.map(content => content.toolCallId);
                type = "tool-result";
              }
              if (message.role === "assistant") {
                const assistantContent = message.content;
                const assistantToolCalls = assistantContent.map(content => {
                  if (content.type === "tool-call") {
                    return {
                      toolCallId: content.toolCallId,
                      toolArgs: content.args,
                      toolName: content.toolName
                    };
                  }
                  return void 0;
                })?.filter(Boolean);
                toolCallIds = assistantToolCalls?.map(toolCall => toolCall.toolCallId);
                toolCallArgs = assistantToolCalls?.map(toolCall => toolCall.toolArgs);
                toolNames = assistantToolCalls?.map(toolCall => toolCall.toolName);
                type = assistantContent?.[0]?.type;
              }
              return {
                id: messageId,
                threadId,
                role: message.role,
                content: message.content,
                createdAt: new Date(Date.now() + index),
                // use Date.now() + index to make sure every message is atleast one millisecond apart
                toolCallIds: toolCallIds?.length ? toolCallIds : void 0,
                toolCallArgs: toolCallArgs?.length ? toolCallArgs : void 0,
                toolNames: toolNames?.length ? toolNames : void 0,
                type
              };
            })
          });
        }
      }
    } catch (err) {
      this.logger.error(`[Agent:${this.name}] - Failed to save assistant response`, {
        error: err,
        runId
      });
    }
  }
  sanitizeResponseMessages(messages) {
    let toolResultIds = [];
    let toolCallIds = [];
    for (const message of messages) {
      if (!Array.isArray(message.content)) continue;
      if (message.role === "tool") {
        for (const content of message.content) {
          if (content.type === "tool-result") {
            toolResultIds.push(content.toolCallId);
          }
        }
      } else if (message.role === "assistant" || message.role === "user") {
        for (const content of message.content) {
          if (typeof content !== `string`) {
            if (content.type === `tool-call`) {
              toolCallIds.push(content.toolCallId);
            }
          }
        }
      }
    }
    const messagesBySanitizedContent = messages.map(message => {
      if (message.role !== "assistant" && message.role !== `tool` && message.role !== `user`) return message;
      if (!message.content || typeof message.content === "string" || typeof message.content === "number") {
        return message;
      }
      const sanitizedContent = message.content.filter(content => {
        if (content.type === `tool-call`) {
          return toolResultIds.includes(content.toolCallId);
        }
        if (content.type === `text`) {
          return content.text.trim() !== ``;
        }
        if (content.type === `tool-result`) {
          return toolCallIds.includes(content.toolCallId);
        }
        return true;
      });
      return {
        ...message,
        content: sanitizedContent
      };
    });
    return messagesBySanitizedContent.filter(message => {
      if (typeof message.content === `string`) {
        return message.content !== "";
      }
      if (Array.isArray(message.content)) {
        return message.content.length && message.content.every(c => {
          if (c.type === `text`) {
            return c.text && c.text !== "";
          }
          return true;
        });
      }
      return true;
    });
  }
  convertTools({
    toolsets,
    threadId,
    resourceId,
    runId
  }) {
    this.logger.debug(`[Agents:${this.name}] - Assigning tools`, {
      runId,
      threadId,
      resourceId
    });
    const memory = this.getMemory();
    const memoryTools = memory?.getTools?.();
    let mastraProxy = void 0;
    const logger = this.logger;
    if (chunk7D636BPD_cjs.__privateGet(this, _mastra3)) {
      mastraProxy = chunkZZSLONUU_cjs.createMastraProxy({
        mastra: chunk7D636BPD_cjs.__privateGet(this, _mastra3),
        logger
      });
    }
    const converted = Object.entries(this.tools || {}).reduce((memo, value) => {
      const k = value[0];
      const tool = this.tools[k];
      if (tool) {
        const options = {
          name: k,
          runId,
          threadId,
          resourceId,
          logger: this.logger,
          mastra: mastraProxy,
          memory,
          agentName: this.name
        };
        memo[k] = chunkZZSLONUU_cjs.makeCoreTool(tool, options);
      }
      return memo;
    }, {});
    const convertedMemoryTools = memoryTools ? Object.entries(memoryTools).reduce((memo, [k, tool]) => {
      memo[k] = {
        description: tool.description,
        parameters: tool.parameters,
        execute: typeof tool?.execute === "function" ? async (args, options) => {
          try {
            this.logger.debug(`[Agent:${this.name}] - Executing memory tool ${k}`, {
              name: k,
              description: tool.description,
              args,
              runId,
              threadId,
              resourceId
            });
            return tool?.execute?.({
              context: args,
              mastra: mastraProxy,
              memory,
              runId,
              threadId,
              resourceId
            }, options) ?? void 0;
          } catch (err) {
            this.logger.error(`[Agent:${this.name}] - Failed memory tool execution`, {
              error: err,
              runId,
              threadId,
              resourceId
            });
            throw err;
          }
        } : void 0
      };
      return memo;
    }, {}) : {};
    const toolsFromToolsetsConverted = {
      ...converted,
      ...convertedMemoryTools
    };
    const toolsFromToolsets = Object.values(toolsets || {});
    if (toolsFromToolsets.length > 0) {
      this.logger.debug(`[Agent:${this.name}] - Adding tools from toolsets ${Object.keys(toolsets || {}).join(", ")}`, {
        runId
      });
      toolsFromToolsets.forEach(toolset => {
        Object.entries(toolset).forEach(([toolName, tool]) => {
          const toolObj = tool;
          const options = {
            name: toolName,
            runId,
            threadId,
            resourceId,
            logger: this.logger,
            agentName: this.name
          };
          toolsFromToolsetsConverted[toolName] = chunkZZSLONUU_cjs.makeCoreTool(toolObj, options, "toolset");
        });
      });
    }
    return toolsFromToolsetsConverted;
  }
  async preExecute({
    resourceId,
    runId,
    threadId,
    memoryConfig,
    messages
  }) {
    let coreMessages = [];
    let threadIdToUse = threadId;
    this.logger.debug(`Saving user messages in memory for agent ${this.name}`, {
      runId
    });
    const saveMessageResponse = await this.fetchMemory({
      threadId,
      resourceId,
      userMessages: messages,
      memoryConfig
    });
    coreMessages = saveMessageResponse.messages;
    threadIdToUse = saveMessageResponse.threadId;
    return {
      coreMessages,
      threadIdToUse
    };
  }
  __primitive({
    instructions,
    messages,
    context,
    threadId,
    memoryConfig,
    resourceId,
    runId,
    toolsets
  }) {
    return {
      before: /* @__PURE__ */chunk7D636BPD_cjs.__name(async () => {
        if (process.env.NODE_ENV !== "test") {
          this.logger.debug(`[Agents:${this.name}] - Starting generation`, {
            runId
          });
        }
        const systemMessage = {
          role: "system",
          content: instructions || `${this.instructions}.`
        };
        let coreMessages = messages;
        let threadIdToUse = threadId;
        const memory = this.getMemory();
        if (threadId && memory && !resourceId) {
          throw new Error(`A resourceId must be provided when passing a threadId and using Memory. Saw threadId ${threadId} but resourceId is ${resourceId}`);
        }
        if (memory && resourceId) {
          this.logger.debug(`[Agent:${this.name}] - Memory persistence enabled: store=${this.getMemory()?.constructor.name}, resourceId=${resourceId}`, {
            runId,
            resourceId,
            threadId: threadIdToUse,
            memoryStore: this.getMemory()?.constructor.name
          });
          let thread = threadIdToUse ? await memory.getThreadById({
            threadId: threadIdToUse
          }) : void 0;
          if (!thread) {
            thread = await memory.createThread({
              threadId: threadIdToUse,
              resourceId,
              memoryConfig
            });
          }
          threadIdToUse = thread.id;
          const preExecuteResult = await this.preExecute({
            resourceId,
            runId,
            threadId: threadIdToUse,
            memoryConfig,
            messages
          });
          coreMessages = preExecuteResult.coreMessages;
          threadIdToUse = preExecuteResult.threadIdToUse;
        }
        let convertedTools;
        if (toolsets && Object.keys(toolsets || {}).length > 0 || this.getMemory() && resourceId) {
          const reasons = [];
          if (toolsets && Object.keys(toolsets || {}).length > 0) {
            reasons.push(`toolsets present (${Object.keys(toolsets || {}).length} tools)`);
          }
          if (this.getMemory() && resourceId) {
            reasons.push("memory and resourceId available");
          }
          this.logger.debug(`[Agent:${this.name}] - Enhancing tools: ${reasons.join(", ")}`, {
            runId,
            toolsets: toolsets ? Object.keys(toolsets) : void 0,
            hasMemory: !!this.getMemory(),
            hasResourceId: !!resourceId
          });
          convertedTools = this.convertTools({
            toolsets,
            threadId: threadIdToUse,
            resourceId,
            runId
          });
        }
        const messageObjects = [systemMessage, ...(context || []), ...coreMessages];
        return {
          messageObjects,
          convertedTools,
          threadId: threadIdToUse
        };
      }, "before"),
      after: /* @__PURE__ */chunk7D636BPD_cjs.__name(async ({
        result,
        threadId: threadId2,
        memoryConfig: memoryConfig2,
        outputText,
        runId: runId2
      }) => {
        const resToLog = {
          text: result?.text,
          object: result?.object,
          toolResults: result?.toolResults,
          toolCalls: result?.toolCalls,
          usage: result?.usage,
          steps: result?.steps?.map(s => {
            return {
              stepType: s?.stepType,
              text: result?.text,
              object: result?.object,
              toolResults: result?.toolResults,
              toolCalls: result?.toolCalls,
              usage: result?.usage
            };
          })
        };
        this.logger.debug(`[Agent:${this.name}] - Post processing LLM response`, {
          runId: runId2,
          result: resToLog,
          threadId: threadId2
        });
        const memory = this.getMemory();
        const thread = threadId2 ? await memory?.getThreadById({
          threadId: threadId2
        }) : void 0;
        if (memory && resourceId && thread) {
          try {
            const userMessage = this.getMostRecentUserMessage(messages);
            const newMessages = userMessage ? [userMessage] : messages;
            const threadMessages = newMessages.map(u => {
              return {
                id: this.getMemory()?.generateId(),
                createdAt: /* @__PURE__ */new Date(),
                threadId: thread.id,
                ...u,
                content: u.content,
                role: u.role,
                type: "text"
              };
            });
            await Promise.all([(async () => {
              await memory.saveMessages({
                messages: threadMessages,
                memoryConfig: memoryConfig2
              });
              await this.saveResponse({
                result,
                threadId: threadId2,
                resourceId,
                memoryConfig: memoryConfig2,
                runId: runId2
              });
            })(), (async () => {
              if (!thread.title?.startsWith("New Thread")) {
                return;
              }
              const config = memory.getMergedThreadConfig(memoryConfig2);
              const title = config?.threads?.generateTitle ? await this.genTitle(userMessage) : void 0;
              if (!title) {
                return;
              }
              return memory.createThread({
                threadId: thread.id,
                resourceId,
                memoryConfig: memoryConfig2,
                title
              });
            })()]);
          } catch (e) {
            this.logger.error("Error saving response", {
              error: e,
              runId: runId2,
              result: resToLog,
              threadId: threadId2
            });
          }
        }
        if (Object.keys(this.evals || {}).length > 0) {
          const input = messages.map(message => message.content).join("\n");
          const runIdToUse = runId2 || crypto.randomUUID();
          for (const metric of Object.values(this.evals || {})) {
            chunk4FUCJCP2_cjs.executeHook("onGeneration" /* ON_GENERATION */, {
              input,
              output: outputText,
              runId: runIdToUse,
              metric,
              agentName: this.name,
              instructions: instructions || this.instructions
            });
          }
        }
      }, "after")
    };
  }
  async generate(messages, {
    instructions,
    context,
    threadId: threadIdInFn,
    memoryOptions,
    resourceId,
    maxSteps = 5,
    onStepFinish,
    runId,
    output,
    toolsets,
    temperature,
    toolChoice = "auto",
    experimental_output,
    telemetry,
    ...rest
  } = {}) {
    let messagesToUse = [];
    if (typeof messages === `string`) {
      messagesToUse = [{
        role: "user",
        content: messages
      }];
    } else if (Array.isArray(messages)) {
      messagesToUse = messages.map(message => {
        if (typeof message === `string`) {
          return {
            role: "user",
            content: message
          };
        }
        return message;
      });
    } else {
      messagesToUse = [messages];
    }
    const runIdToUse = runId || randomUUID();
    const {
      before,
      after
    } = this.__primitive({
      instructions,
      messages: messagesToUse,
      context,
      threadId: threadIdInFn,
      memoryConfig: memoryOptions,
      resourceId,
      runId: runIdToUse,
      toolsets
    });
    const {
      threadId,
      messageObjects,
      convertedTools
    } = await before();
    if (!output && experimental_output) {
      const result2 = await this.llm.__text({
        messages: messageObjects,
        tools: this.tools,
        convertedTools,
        onStepFinish: /* @__PURE__ */chunk7D636BPD_cjs.__name(result3 => {
          void onStepFinish?.(result3);
        }, "onStepFinish"),
        maxSteps: maxSteps || 5,
        runId: runIdToUse,
        temperature,
        toolChoice: toolChoice || "auto",
        experimental_output,
        threadId,
        resourceId,
        memory: this.getMemory(),
        ...rest
      });
      const outputText2 = result2.text;
      await after({
        result: result2,
        threadId,
        memoryConfig: memoryOptions,
        outputText: outputText2,
        runId: runIdToUse
      });
      const newResult = result2;
      newResult.object = result2.experimental_output;
      return newResult;
    }
    if (!output) {
      const result2 = await this.llm.__text({
        messages: messageObjects,
        tools: this.tools,
        convertedTools,
        onStepFinish: /* @__PURE__ */chunk7D636BPD_cjs.__name(result3 => {
          void onStepFinish?.(result3);
        }, "onStepFinish"),
        maxSteps,
        runId: runIdToUse,
        temperature,
        toolChoice,
        telemetry,
        threadId,
        resourceId,
        memory: this.getMemory(),
        ...rest
      });
      const outputText2 = result2.text;
      await after({
        result: result2,
        threadId,
        memoryConfig: memoryOptions,
        outputText: outputText2,
        runId: runIdToUse
      });
      return result2;
    }
    const result = await this.llm.__textObject({
      messages: messageObjects,
      tools: this.tools,
      structuredOutput: output,
      convertedTools,
      onStepFinish: /* @__PURE__ */chunk7D636BPD_cjs.__name(result2 => {
        void onStepFinish?.(result2);
      }, "onStepFinish"),
      maxSteps,
      runId: runIdToUse,
      temperature,
      toolChoice,
      telemetry,
      memory: this.getMemory(),
      ...rest
    });
    const outputText = JSON.stringify(result.object);
    await after({
      result,
      threadId,
      memoryConfig: memoryOptions,
      outputText,
      runId: runIdToUse
    });
    return result;
  }
  async stream(messages, {
    instructions,
    context,
    threadId: threadIdInFn,
    memoryOptions,
    resourceId,
    maxSteps = 5,
    onFinish,
    onStepFinish,
    runId,
    toolsets,
    output,
    temperature,
    toolChoice = "auto",
    experimental_output,
    telemetry,
    ...rest
  } = {}) {
    const runIdToUse = runId || randomUUID();
    let messagesToUse = [];
    if (typeof messages === `string`) {
      messagesToUse = [{
        role: "user",
        content: messages
      }];
    } else {
      messagesToUse = messages.map(message => {
        if (typeof message === `string`) {
          return {
            role: "user",
            content: message
          };
        }
        return message;
      });
    }
    const {
      before,
      after
    } = this.__primitive({
      instructions,
      messages: messagesToUse,
      context,
      threadId: threadIdInFn,
      memoryConfig: memoryOptions,
      resourceId,
      runId: runIdToUse,
      toolsets
    });
    const {
      threadId,
      messageObjects,
      convertedTools
    } = await before();
    if (!output && experimental_output) {
      this.logger.debug(`Starting agent ${this.name} llm stream call`, {
        runId
      });
      const streamResult = await this.llm.__stream({
        messages: messageObjects,
        temperature,
        tools: this.tools,
        convertedTools,
        onStepFinish: /* @__PURE__ */chunk7D636BPD_cjs.__name(result => {
          void onStepFinish?.(result);
        }, "onStepFinish"),
        onFinish: /* @__PURE__ */chunk7D636BPD_cjs.__name(async result => {
          try {
            const outputText = result.text;
            await after({
              result,
              threadId,
              memoryConfig: memoryOptions,
              outputText,
              runId: runIdToUse
            });
          } catch (e) {
            this.logger.error("Error saving memory on finish", {
              error: e,
              runId
            });
          }
          void onFinish?.(result);
        }, "onFinish"),
        maxSteps,
        runId: runIdToUse,
        toolChoice,
        experimental_output,
        memory: this.getMemory(),
        ...rest
      });
      const newStreamResult = streamResult;
      newStreamResult.partialObjectStream = streamResult.experimental_partialOutputStream;
      return newStreamResult;
    } else if (!output) {
      this.logger.debug(`Starting agent ${this.name} llm stream call`, {
        runId
      });
      return this.llm.__stream({
        messages: messageObjects,
        temperature,
        tools: this.tools,
        convertedTools,
        onStepFinish: /* @__PURE__ */chunk7D636BPD_cjs.__name(result => {
          void onStepFinish?.(result);
        }, "onStepFinish"),
        onFinish: /* @__PURE__ */chunk7D636BPD_cjs.__name(async result => {
          try {
            const outputText = result.text;
            await after({
              result,
              threadId,
              memoryConfig: memoryOptions,
              outputText,
              runId: runIdToUse
            });
          } catch (e) {
            this.logger.error("Error saving memory on finish", {
              error: e,
              runId
            });
          }
          void onFinish?.(result);
        }, "onFinish"),
        maxSteps,
        runId: runIdToUse,
        toolChoice,
        telemetry,
        memory: this.getMemory(),
        ...rest
      });
    }
    this.logger.debug(`Starting agent ${this.name} llm streamObject call`, {
      runId
    });
    return this.llm.__streamObject({
      messages: messageObjects,
      tools: this.tools,
      temperature,
      structuredOutput: output,
      convertedTools,
      onStepFinish: /* @__PURE__ */chunk7D636BPD_cjs.__name(result => {
        void onStepFinish?.(result);
      }, "onStepFinish"),
      onFinish: /* @__PURE__ */chunk7D636BPD_cjs.__name(async result => {
        try {
          const outputText = JSON.stringify(result.object);
          await after({
            result,
            threadId,
            memoryConfig: memoryOptions,
            outputText,
            runId: runIdToUse
          });
        } catch (e) {
          this.logger.error("Error saving memory on finish", {
            error: e,
            runId
          });
        }
        void onFinish?.(result);
      }, "onFinish"),
      runId: runIdToUse,
      toolChoice,
      telemetry,
      memory: this.getMemory(),
      ...rest
    });
  }
  /**
   * Convert text to speech using the configured voice provider
   * @param input Text or text stream to convert to speech
   * @param options Speech options including speaker and provider-specific options
   * @returns Audio stream
   * @deprecated Use agent.voice.speak() instead
   */
  async speak(input, options) {
    if (!this.voice) {
      throw new Error("No voice provider configured");
    }
    this.logger.warn("Warning: agent.speak() is deprecated. Please use agent.voice.speak() instead.");
    try {
      return this.voice.speak(input, options);
    } catch (e) {
      this.logger.error("Error during agent speak", {
        error: e
      });
      throw e;
    }
  }
  /**
   * Convert speech to text using the configured voice provider
   * @param audioStream Audio stream to transcribe
   * @param options Provider-specific transcription options
   * @returns Text or text stream
   * @deprecated Use agent.voice.listen() instead
   */
  async listen(audioStream, options) {
    if (!this.voice) {
      throw new Error("No voice provider configured");
    }
    this.logger.warn("Warning: agent.listen() is deprecated. Please use agent.voice.listen() instead");
    try {
      return this.voice.listen(audioStream, options);
    } catch (e) {
      this.logger.error("Error during agent listen", {
        error: e
      });
      throw e;
    }
  }
  /**
   * Get a list of available speakers from the configured voice provider
   * @throws {Error} If no voice provider is configured
   * @returns {Promise<Array<{voiceId: string}>>} List of available speakers
   * @deprecated Use agent.voice.getSpeakers() instead
   */
  async getSpeakers() {
    if (!this.voice) {
      throw new Error("No voice provider configured");
    }
    this.logger.warn("Warning: agent.getSpeakers() is deprecated. Please use agent.voice.getSpeakers() instead.");
    try {
      return await this.voice.getSpeakers();
    } catch (e) {
      this.logger.error("Error during agent getSpeakers", {
        error: e
      });
      throw e;
    }
  }
};
_init = chunk7D636BPD_cjs.__decoratorStart(_a);
_mastra3 = new WeakMap();
_Agent = /*@__PURE__*/(_ => {
  _memory = new WeakMap();
  _Agent = chunk7D636BPD_cjs.__decorateElement(_init, 0, "Agent", _Agent_decorators, _Agent);
  chunk7D636BPD_cjs.__name(_Agent, "Agent");
  return _Agent;
})();
chunk7D636BPD_cjs.__runInitializers(_init, 1, _Agent);
var Agent = _Agent;

exports.Agent = Agent;
//# sourceMappingURL=chunk-LV5CPU2X.cjs.map
//# sourceMappingURL=chunk-LV5CPU2X.cjs.map