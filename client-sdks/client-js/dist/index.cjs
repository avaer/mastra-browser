'use strict';

var zod = require('zod');
var zodToJsonSchema = require('zod-to-json-schema');
var uiUtils = require('@ai-sdk/ui-utils');

// src/resources/agent.ts

// src/resources/base.ts
var BaseResource = class {
  options;
  constructor(options) {
    this.options = options;
  }
  /**
   * Makes an HTTP request to the API with retries and exponential backoff
   * @param path - The API endpoint path
   * @param options - Optional request configuration
   * @returns Promise containing the response data
   */
  async request(path, options = {}) {
    let lastError = null;
    const { baseUrl, retries = 3, backoffMs = 100, maxBackoffMs = 1e3, headers = {} } = this.options;
    let delay = backoffMs;
    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const response = await fetch(`${baseUrl}${path}`, {
          ...options,
          headers: {
            ...headers,
            ...options.headers
            // TODO: Bring this back once we figure out what we/users need to do to make this work with cross-origin requests
            // 'x-mastra-client-type': 'js',
          },
          body: options.body instanceof FormData ? options.body : options.body ? JSON.stringify(options.body) : void 0
        });
        if (!response.ok) {
          const errorBody = await response.text();
          let errorMessage = `HTTP error! status: ${response.status}`;
          try {
            const errorJson = JSON.parse(errorBody);
            errorMessage += ` - ${JSON.stringify(errorJson)}`;
          } catch {
            if (errorBody) {
              errorMessage += ` - ${errorBody}`;
            }
          }
          throw new Error(errorMessage);
        }
        if (options.stream) {
          return response;
        }
        const data = await response.json();
        return data;
      } catch (error) {
        lastError = error;
        if (attempt === retries) {
          break;
        }
        await new Promise((resolve) => setTimeout(resolve, delay));
        delay = Math.min(delay * 2, maxBackoffMs);
      }
    }
    throw lastError || new Error("Request failed");
  }
};

// src/resources/agent.ts
var AgentVoice = class extends BaseResource {
  constructor(options, agentId) {
    super(options);
    this.agentId = agentId;
    this.agentId = agentId;
  }
  /**
   * Convert text to speech using the agent's voice provider
   * @param text - Text to convert to speech
   * @param options - Optional provider-specific options for speech generation
   * @returns Promise containing the audio data
   */
  async speak(text, options) {
    return this.request(`/api/agents/${this.agentId}/voice/speak`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: { input: text, options },
      stream: true
    });
  }
  /**
   * Convert speech to text using the agent's voice provider
   * @param audio - Audio data to transcribe
   * @param options - Optional provider-specific options
   * @returns Promise containing the transcribed text
   */
  listen(audio, options) {
    const formData = new FormData();
    formData.append("audio", audio);
    if (options) {
      formData.append("options", JSON.stringify(options));
    }
    return this.request(`/api/agents/${this.agentId}/voice/listen`, {
      method: "POST",
      body: formData
    });
  }
  /**
   * Get available speakers for the agent's voice provider
   * @returns Promise containing list of available speakers
   */
  getSpeakers() {
    return this.request(`/api/agents/${this.agentId}/voice/speakers`);
  }
};
var Agent = class extends BaseResource {
  constructor(options, agentId) {
    super(options);
    this.agentId = agentId;
    this.voice = new AgentVoice(options, this.agentId);
  }
  voice;
  /**
   * Retrieves details about the agent
   * @returns Promise containing agent details including model and instructions
   */
  details() {
    return this.request(`/api/agents/${this.agentId}`);
  }
  /**
   * Generates a response from the agent
   * @param params - Generation parameters including prompt
   * @returns Promise containing the generated response
   */
  generate(params) {
    const processedParams = {
      ...params,
      output: params.output instanceof zod.ZodSchema ? zodToJsonSchema.zodToJsonSchema(params.output) : params.output,
      experimental_output: params.experimental_output instanceof zod.ZodSchema ? zodToJsonSchema.zodToJsonSchema(params.experimental_output) : params.experimental_output
    };
    return this.request(`/api/agents/${this.agentId}/generate`, {
      method: "POST",
      body: processedParams
    });
  }
  /**
   * Streams a response from the agent
   * @param params - Stream parameters including prompt
   * @returns Promise containing the enhanced Response object with processDataStream method
   */
  async stream(params) {
    const processedParams = {
      ...params,
      output: params.output instanceof zod.ZodSchema ? zodToJsonSchema.zodToJsonSchema(params.output) : params.output,
      experimental_output: params.experimental_output instanceof zod.ZodSchema ? zodToJsonSchema.zodToJsonSchema(params.experimental_output) : params.experimental_output
    };
    const response = await this.request(`/api/agents/${this.agentId}/stream`, {
      method: "POST",
      body: processedParams,
      stream: true
    });
    if (!response.body) {
      throw new Error("No response body");
    }
    response.processDataStream = async (options = {}) => {
      await uiUtils.processDataStream({
        stream: response.body,
        ...options
      });
    };
    return response;
  }
  /**
   * Gets details about a specific tool available to the agent
   * @param toolId - ID of the tool to retrieve
   * @returns Promise containing tool details
   */
  getTool(toolId) {
    return this.request(`/api/agents/${this.agentId}/tools/${toolId}`);
  }
  /**
   * Retrieves evaluation results for the agent
   * @returns Promise containing agent evaluations
   */
  evals() {
    return this.request(`/api/agents/${this.agentId}/evals/ci`);
  }
  /**
   * Retrieves live evaluation results for the agent
   * @returns Promise containing live agent evaluations
   */
  liveEvals() {
    return this.request(`/api/agents/${this.agentId}/evals/live`);
  }
};
var Network = class extends BaseResource {
  constructor(options, networkId) {
    super(options);
    this.networkId = networkId;
  }
  /**
   * Retrieves details about the network
   * @returns Promise containing network details
   */
  details() {
    return this.request(`/api/networks/${this.networkId}`);
  }
  /**
   * Generates a response from the agent
   * @param params - Generation parameters including prompt
   * @returns Promise containing the generated response
   */
  generate(params) {
    const processedParams = {
      ...params,
      output: params.output instanceof zod.ZodSchema ? zodToJsonSchema.zodToJsonSchema(params.output) : params.output,
      experimental_output: params.experimental_output instanceof zod.ZodSchema ? zodToJsonSchema.zodToJsonSchema(params.experimental_output) : params.experimental_output
    };
    return this.request(`/api/networks/${this.networkId}/generate`, {
      method: "POST",
      body: processedParams
    });
  }
  /**
   * Streams a response from the agent
   * @param params - Stream parameters including prompt
   * @returns Promise containing the enhanced Response object with processDataStream method
   */
  async stream(params) {
    const processedParams = {
      ...params,
      output: params.output instanceof zod.ZodSchema ? zodToJsonSchema.zodToJsonSchema(params.output) : params.output,
      experimental_output: params.experimental_output instanceof zod.ZodSchema ? zodToJsonSchema.zodToJsonSchema(params.experimental_output) : params.experimental_output
    };
    const response = await this.request(`/api/networks/${this.networkId}/stream`, {
      method: "POST",
      body: processedParams,
      stream: true
    });
    if (!response.body) {
      throw new Error("No response body");
    }
    response.processDataStream = async (options = {}) => {
      await uiUtils.processDataStream({
        stream: response.body,
        ...options
      });
    };
    return response;
  }
};

// src/resources/memory-thread.ts
var MemoryThread = class extends BaseResource {
  constructor(options, threadId, agentId) {
    super(options);
    this.threadId = threadId;
    this.agentId = agentId;
  }
  /**
   * Retrieves the memory thread details
   * @returns Promise containing thread details including title and metadata
   */
  get() {
    return this.request(`/api/memory/threads/${this.threadId}?agentId=${this.agentId}`);
  }
  /**
   * Updates the memory thread properties
   * @param params - Update parameters including title and metadata
   * @returns Promise containing updated thread details
   */
  update(params) {
    return this.request(`/api/memory/threads/${this.threadId}?agentId=${this.agentId}`, {
      method: "PATCH",
      body: params
    });
  }
  /**
   * Deletes the memory thread
   * @returns Promise containing deletion result
   */
  delete() {
    return this.request(`/api/memory/threads/${this.threadId}?agentId=${this.agentId}`, {
      method: "DELETE"
    });
  }
  /**
   * Retrieves messages associated with the thread
   * @returns Promise containing thread messages and UI messages
   */
  getMessages() {
    return this.request(`/api/memory/threads/${this.threadId}/messages?agentId=${this.agentId}`);
  }
};

// src/resources/vector.ts
var Vector = class extends BaseResource {
  constructor(options, vectorName) {
    super(options);
    this.vectorName = vectorName;
  }
  /**
   * Retrieves details about a specific vector index
   * @param indexName - Name of the index to get details for
   * @returns Promise containing vector index details
   */
  details(indexName) {
    return this.request(`/api/vector/${this.vectorName}/indexes/${indexName}`);
  }
  /**
   * Deletes a vector index
   * @param indexName - Name of the index to delete
   * @returns Promise indicating deletion success
   */
  delete(indexName) {
    return this.request(`/api/vector/${this.vectorName}/indexes/${indexName}`, {
      method: "DELETE"
    });
  }
  /**
   * Retrieves a list of all available indexes
   * @returns Promise containing array of index names
   */
  getIndexes() {
    return this.request(`/api/vector/${this.vectorName}/indexes`);
  }
  /**
   * Creates a new vector index
   * @param params - Parameters for index creation including dimension and metric
   * @returns Promise indicating creation success
   */
  createIndex(params) {
    return this.request(`/api/vector/${this.vectorName}/create-index`, {
      method: "POST",
      body: params
    });
  }
  /**
   * Upserts vectors into an index
   * @param params - Parameters containing vectors, metadata, and optional IDs
   * @returns Promise containing array of vector IDs
   */
  upsert(params) {
    return this.request(`/api/vector/${this.vectorName}/upsert`, {
      method: "POST",
      body: params
    });
  }
  /**
   * Queries vectors in an index
   * @param params - Query parameters including query vector and search options
   * @returns Promise containing query results
   */
  query(params) {
    return this.request(`/api/vector/${this.vectorName}/query`, {
      method: "POST",
      body: params
    });
  }
};

// src/resources/workflow.ts
var RECORD_SEPARATOR = "";
var Workflow = class extends BaseResource {
  constructor(options, workflowId) {
    super(options);
    this.workflowId = workflowId;
  }
  /**
   * Retrieves details about the workflow
   * @returns Promise containing workflow details including steps and graphs
   */
  details() {
    return this.request(`/api/workflows/${this.workflowId}`);
  }
  /**
   * @deprecated Use `startAsync` instead
   * Executes the workflow with the provided parameters
   * @param params - Parameters required for workflow execution
   * @returns Promise containing the workflow execution results
   */
  execute(params) {
    return this.request(`/api/workflows/${this.workflowId}/execute`, {
      method: "POST",
      body: params
    });
  }
  /**
   * Creates a new workflow run
   * @returns Promise containing the generated run ID
   */
  createRun(params) {
    const searchParams = new URLSearchParams();
    if (!!params?.runId) {
      searchParams.set("runId", params.runId);
    }
    return this.request(`/api/workflows/${this.workflowId}/createRun?${searchParams.toString()}`, {
      method: "POST"
    });
  }
  /**
   * Starts a workflow run synchronously without waiting for the workflow to complete
   * @param params - Object containing the runId and triggerData
   * @returns Promise containing success message
   */
  start(params) {
    return this.request(`/api/workflows/${this.workflowId}/start?runId=${params.runId}`, {
      method: "POST",
      body: params?.triggerData
    });
  }
  /**
   * Resumes a suspended workflow step synchronously without waiting for the workflow to complete
   * @param stepId - ID of the step to resume
   * @param runId - ID of the workflow run
   * @param context - Context to resume the workflow with
   * @returns Promise containing the workflow resume results
   */
  resume({
    stepId,
    runId,
    context
  }) {
    return this.request(`/api/workflows/${this.workflowId}/resume?runId=${runId}`, {
      method: "POST",
      body: {
        stepId,
        context
      }
    });
  }
  /**
   * Starts a workflow run asynchronously and returns a promise that resolves when the workflow is complete
   * @param params - Object containing the optional runId and triggerData
   * @returns Promise containing the workflow execution results
   */
  startAsync(params) {
    const searchParams = new URLSearchParams();
    if (!!params?.runId) {
      searchParams.set("runId", params.runId);
    }
    return this.request(`/api/workflows/${this.workflowId}/start-async?${searchParams.toString()}`, {
      method: "POST",
      body: params?.triggerData
    });
  }
  /**
   * Resumes a suspended workflow step asynchronously and returns a promise that resolves when the workflow is complete
   * @param params - Object containing the runId, stepId, and context
   * @returns Promise containing the workflow resume results
   */
  resumeAsync(params) {
    return this.request(`/api/workflows/${this.workflowId}/resume-async?runId=${params.runId}`, {
      method: "POST",
      body: {
        stepId: params.stepId,
        context: params.context
      }
    });
  }
  /**
   * Creates an async generator that processes a readable stream and yields records
   * separated by the Record Separator character (\x1E)
   *
   * @param stream - The readable stream to process
   * @returns An async generator that yields parsed records
   */
  async *streamProcessor(stream) {
    const reader = stream.getReader();
    let doneReading = false;
    let buffer = "";
    try {
      while (!doneReading) {
        const { done, value } = await reader.read();
        doneReading = done;
        if (done && !value) continue;
        try {
          const decoded = value ? new TextDecoder().decode(value) : "";
          const chunks = (buffer + decoded).split(RECORD_SEPARATOR);
          buffer = chunks.pop() || "";
          for (const chunk of chunks) {
            if (chunk) {
              if (typeof chunk === "string") {
                try {
                  const parsedChunk = JSON.parse(chunk);
                  yield parsedChunk;
                } catch {
                }
              }
            }
          }
        } catch (error) {
        }
      }
      if (buffer) {
        try {
          yield JSON.parse(buffer);
        } catch {
        }
      }
    } finally {
      reader.cancel().catch(() => {
      });
    }
  }
  /**
   * Watches workflow transitions in real-time
   * @param runId - Optional run ID to filter the watch stream
   * @returns AsyncGenerator that yields parsed records from the workflow watch stream
   */
  async watch({ runId }, onRecord) {
    const response = await this.request(`/api/workflows/${this.workflowId}/watch?runId=${runId}`, {
      stream: true
    });
    if (!response.ok) {
      throw new Error(`Failed to watch workflow: ${response.statusText}`);
    }
    if (!response.body) {
      throw new Error("Response body is null");
    }
    for await (const record of this.streamProcessor(response.body)) {
      onRecord(record);
    }
  }
};

// src/resources/tool.ts
var Tool = class extends BaseResource {
  constructor(options, toolId) {
    super(options);
    this.toolId = toolId;
  }
  /**
   * Retrieves details about the tool
   * @returns Promise containing tool details including description and schemas
   */
  details() {
    return this.request(`/api/tools/${this.toolId}`);
  }
  /**
   * Executes the tool with the provided parameters
   * @param params - Parameters required for tool execution
   * @returns Promise containing the tool execution results
   */
  execute(params) {
    return this.request(`/api/tools/${this.toolId}/execute`, {
      method: "POST",
      body: params
    });
  }
};

// src/client.ts
var MastraClient = class extends BaseResource {
  constructor(options) {
    super(options);
  }
  /**
   * Retrieves all available agents
   * @returns Promise containing map of agent IDs to agent details
   */
  getAgents() {
    return this.request("/api/agents");
  }
  /**
   * Gets an agent instance by ID
   * @param agentId - ID of the agent to retrieve
   * @returns Agent instance
   */
  getAgent(agentId) {
    return new Agent(this.options, agentId);
  }
  /**
   * Retrieves memory threads for a resource
   * @param params - Parameters containing the resource ID
   * @returns Promise containing array of memory threads
   */
  getMemoryThreads(params) {
    return this.request(`/api/memory/threads?resourceid=${params.resourceId}&agentId=${params.agentId}`);
  }
  /**
   * Creates a new memory thread
   * @param params - Parameters for creating the memory thread
   * @returns Promise containing the created memory thread
   */
  createMemoryThread(params) {
    return this.request(`/api/memory/threads?agentId=${params.agentId}`, { method: "POST", body: params });
  }
  /**
   * Gets a memory thread instance by ID
   * @param threadId - ID of the memory thread to retrieve
   * @returns MemoryThread instance
   */
  getMemoryThread(threadId, agentId) {
    return new MemoryThread(this.options, threadId, agentId);
  }
  /**
   * Saves messages to memory
   * @param params - Parameters containing messages to save
   * @returns Promise containing the saved messages
   */
  saveMessageToMemory(params) {
    return this.request(`/api/memory/save-messages?agentId=${params.agentId}`, {
      method: "POST",
      body: params
    });
  }
  /**
   * Gets the status of the memory system
   * @returns Promise containing memory system status
   */
  getMemoryStatus(agentId) {
    return this.request(`/api/memory/status?agentId=${agentId}`);
  }
  /**
   * Retrieves all available tools
   * @returns Promise containing map of tool IDs to tool details
   */
  getTools() {
    return this.request("/api/tools");
  }
  /**
   * Gets a tool instance by ID
   * @param toolId - ID of the tool to retrieve
   * @returns Tool instance
   */
  getTool(toolId) {
    return new Tool(this.options, toolId);
  }
  /**
   * Retrieves all available workflows
   * @returns Promise containing map of workflow IDs to workflow details
   */
  getWorkflows() {
    return this.request("/api/workflows");
  }
  /**
   * Gets a workflow instance by ID
   * @param workflowId - ID of the workflow to retrieve
   * @returns Workflow instance
   */
  getWorkflow(workflowId) {
    return new Workflow(this.options, workflowId);
  }
  /**
   * Gets a vector instance by name
   * @param vectorName - Name of the vector to retrieve
   * @returns Vector instance
   */
  getVector(vectorName) {
    return new Vector(this.options, vectorName);
  }
  /**
   * Retrieves logs
   * @param params - Parameters for filtering logs
   * @returns Promise containing array of log messages
   */
  getLogs(params) {
    return this.request(`/api/logs?transportId=${params.transportId}`);
  }
  /**
   * Gets logs for a specific run
   * @param params - Parameters containing run ID to retrieve
   * @returns Promise containing array of log messages
   */
  getLogForRun(params) {
    return this.request(`/api/logs/${params.runId}?transportId=${params.transportId}`);
  }
  /**
   * List of all log transports
   * @returns Promise containing list of log transports
   */
  getLogTransports() {
    return this.request("/api/logs/transports");
  }
  /**
   * List of all traces (paged)
   * @param params - Parameters for filtering traces
   * @returns Promise containing telemetry data
   */
  getTelemetry(params) {
    const { name, scope, page, perPage, attribute } = params || {};
    const _attribute = attribute ? Object.entries(attribute).map(([key, value]) => `${key}:${value}`) : [];
    const searchParams = new URLSearchParams();
    if (name) {
      searchParams.set("name", name);
    }
    if (scope) {
      searchParams.set("scope", scope);
    }
    if (page) {
      searchParams.set("page", String(page));
    }
    if (perPage) {
      searchParams.set("perPage", String(perPage));
    }
    if (_attribute) {
      if (Array.isArray(_attribute)) {
        for (const attr of _attribute) {
          searchParams.append("attribute", attr);
        }
      } else {
        searchParams.set("attribute", _attribute);
      }
    }
    if (searchParams.size) {
      return this.request(`/api/telemetry?${searchParams}`);
    } else {
      return this.request(`/api/telemetry`);
    }
  }
  /**
   * Retrieves all available networks
   * @returns Promise containing map of network IDs to network details
   */
  getNetworks() {
    return this.request("/api/networks");
  }
  /**
   * Gets a network instance by ID
   * @param networkId - ID of the network to retrieve
   * @returns Network instance
   */
  getNetwork(networkId) {
    return new Network(this.options, networkId);
  }
};

exports.MastraClient = MastraClient;
