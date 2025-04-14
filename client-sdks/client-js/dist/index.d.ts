import { CoreMessage, AiMessageType, StorageThreadType, MessageType, StepAction, StepGraph, WorkflowRunResult as WorkflowRunResult$1, QueryResult, BaseLogMessage, GenerateReturn } from '@mastra/core';
import { JSONSchema7 } from 'json-schema';
import { ZodSchema } from 'zod';
import { processDataStream } from '@ai-sdk/ui-utils';
import { AgentGenerateOptions, AgentStreamOptions } from '@mastra/core/agent';

interface ClientOptions {
    /** Base URL for API requests */
    baseUrl: string;
    /** Number of retry attempts for failed requests */
    retries?: number;
    /** Initial backoff time in milliseconds between retries */
    backoffMs?: number;
    /** Maximum backoff time in milliseconds between retries */
    maxBackoffMs?: number;
    /** Custom headers to include with requests */
    headers?: Record<string, string>;
}
interface RequestOptions {
    method?: string;
    headers?: Record<string, string>;
    body?: any;
    stream?: boolean;
    signal?: AbortSignal;
}
interface GetAgentResponse {
    name: string;
    instructions: string;
    tools: Record<string, GetToolResponse>;
    provider: string;
    modelId: string;
}
type GenerateParams<T extends JSONSchema7 | ZodSchema | undefined = undefined> = {
    messages: string | string[] | CoreMessage[] | AiMessageType[];
} & Partial<AgentGenerateOptions<T>>;
type StreamParams<T extends JSONSchema7 | ZodSchema | undefined = undefined> = {
    messages: string | string[] | CoreMessage[] | AiMessageType[];
} & Omit<AgentStreamOptions<T>, 'onFinish' | 'onStepFinish' | 'telemetry'>;
interface GetEvalsByAgentIdResponse extends GetAgentResponse {
    evals: any[];
}
interface GetToolResponse {
    id: string;
    description: string;
    inputSchema: string;
    outputSchema: string;
}
interface GetWorkflowResponse {
    name: string;
    triggerSchema: string;
    steps: Record<string, StepAction<any, any, any, any>>;
    stepGraph: StepGraph;
    stepSubscriberGraph: Record<string, StepGraph>;
    workflowId?: string;
}
type WorkflowRunResult = {
    activePaths: Record<string, {
        status: string;
        suspendPayload?: any;
        stepPath: string[];
    }>;
    results: WorkflowRunResult$1<any, any, any>['results'];
    timestamp: number;
    runId: string;
};
interface UpsertVectorParams {
    indexName: string;
    vectors: number[][];
    metadata?: Record<string, any>[];
    ids?: string[];
}
interface CreateIndexParams {
    indexName: string;
    dimension: number;
    metric?: 'cosine' | 'euclidean' | 'dotproduct';
}
interface QueryVectorParams {
    indexName: string;
    queryVector: number[];
    topK?: number;
    filter?: Record<string, any>;
    includeVector?: boolean;
}
interface QueryVectorResponse {
    results: QueryResult[];
}
interface GetVectorIndexResponse {
    dimension: number;
    metric: 'cosine' | 'euclidean' | 'dotproduct';
    count: number;
}
interface SaveMessageToMemoryParams {
    messages: MessageType[];
    agentId: string;
}
type SaveMessageToMemoryResponse = MessageType[];
interface CreateMemoryThreadParams {
    title: string;
    metadata: Record<string, any>;
    resourceid: string;
    threadId: string;
    agentId: string;
}
type CreateMemoryThreadResponse = StorageThreadType;
interface GetMemoryThreadParams {
    resourceId: string;
    agentId: string;
}
type GetMemoryThreadResponse = StorageThreadType[];
interface UpdateMemoryThreadParams {
    title: string;
    metadata: Record<string, any>;
    resourceid: string;
}
interface GetMemoryThreadMessagesResponse {
    messages: CoreMessage[];
    uiMessages: AiMessageType[];
}
interface GetLogsParams {
    transportId: string;
}
interface GetLogParams {
    runId: string;
    transportId: string;
}
type GetLogsResponse = BaseLogMessage[];
type RequestFunction = (path: string, options?: RequestOptions) => Promise<any>;
type SpanStatus = {
    code: number;
};
type SpanOther = {
    droppedAttributesCount: number;
    droppedEventsCount: number;
    droppedLinksCount: number;
};
type SpanEventAttributes = {
    key: string;
    value: {
        [key: string]: string | number | boolean | null;
    };
};
type SpanEvent = {
    attributes: SpanEventAttributes[];
    name: string;
    timeUnixNano: string;
    droppedAttributesCount: number;
};
type Span = {
    id: string;
    parentSpanId: string | null;
    traceId: string;
    name: string;
    scope: string;
    kind: number;
    status: SpanStatus;
    events: SpanEvent[];
    links: any[];
    attributes: Record<string, string | number | boolean | null>;
    startTime: number;
    endTime: number;
    duration: number;
    other: SpanOther;
    createdAt: string;
};
interface GetTelemetryResponse {
    traces: {
        traces: Span[];
    };
}
interface GetTelemetryParams {
    name?: string;
    scope?: string;
    page?: number;
    perPage?: number;
    attribute?: Record<string, string>;
}
interface GetNetworkResponse {
    name: string;
    instructions: string;
    agents: Array<{
        name: string;
        provider: string;
        modelId: string;
    }>;
    routingModel: {
        provider: string;
        modelId: string;
    };
    state?: Record<string, any>;
}

declare class BaseResource {
    readonly options: ClientOptions;
    constructor(options: ClientOptions);
    /**
     * Makes an HTTP request to the API with retries and exponential backoff
     * @param path - The API endpoint path
     * @param options - Optional request configuration
     * @returns Promise containing the response data
     */
    request<T>(path: string, options?: RequestOptions): Promise<T>;
}

declare class AgentVoice extends BaseResource {
    private agentId;
    constructor(options: ClientOptions, agentId: string);
    /**
     * Convert text to speech using the agent's voice provider
     * @param text - Text to convert to speech
     * @param options - Optional provider-specific options for speech generation
     * @returns Promise containing the audio data
     */
    speak(text: string, options?: {
        speaker?: string;
        [key: string]: any;
    }): Promise<Response>;
    /**
     * Convert speech to text using the agent's voice provider
     * @param audio - Audio data to transcribe
     * @param options - Optional provider-specific options
     * @returns Promise containing the transcribed text
     */
    listen(audio: Blob, options?: Record<string, any>): Promise<Response>;
    /**
     * Get available speakers for the agent's voice provider
     * @returns Promise containing list of available speakers
     */
    getSpeakers(): Promise<Array<{
        voiceId: string;
        [key: string]: any;
    }>>;
}
declare class Agent extends BaseResource {
    private agentId;
    readonly voice: AgentVoice;
    constructor(options: ClientOptions, agentId: string);
    /**
     * Retrieves details about the agent
     * @returns Promise containing agent details including model and instructions
     */
    details(): Promise<GetAgentResponse>;
    /**
     * Generates a response from the agent
     * @param params - Generation parameters including prompt
     * @returns Promise containing the generated response
     */
    generate<T extends JSONSchema7 | ZodSchema | undefined = undefined>(params: GenerateParams<T>): Promise<GenerateReturn<T>>;
    /**
     * Streams a response from the agent
     * @param params - Stream parameters including prompt
     * @returns Promise containing the enhanced Response object with processDataStream method
     */
    stream<T extends JSONSchema7 | ZodSchema | undefined = undefined>(params: StreamParams<T>): Promise<Response & {
        processDataStream: (options?: Omit<Parameters<typeof processDataStream>[0], 'stream'>) => Promise<void>;
    }>;
    /**
     * Gets details about a specific tool available to the agent
     * @param toolId - ID of the tool to retrieve
     * @returns Promise containing tool details
     */
    getTool(toolId: string): Promise<GetToolResponse>;
    /**
     * Retrieves evaluation results for the agent
     * @returns Promise containing agent evaluations
     */
    evals(): Promise<GetEvalsByAgentIdResponse>;
    /**
     * Retrieves live evaluation results for the agent
     * @returns Promise containing live agent evaluations
     */
    liveEvals(): Promise<GetEvalsByAgentIdResponse>;
}

declare class Network extends BaseResource {
    private networkId;
    constructor(options: ClientOptions, networkId: string);
    /**
     * Retrieves details about the network
     * @returns Promise containing network details
     */
    details(): Promise<GetNetworkResponse>;
    /**
     * Generates a response from the agent
     * @param params - Generation parameters including prompt
     * @returns Promise containing the generated response
     */
    generate<T extends JSONSchema7 | ZodSchema | undefined = undefined>(params: GenerateParams<T>): Promise<GenerateReturn<T>>;
    /**
     * Streams a response from the agent
     * @param params - Stream parameters including prompt
     * @returns Promise containing the enhanced Response object with processDataStream method
     */
    stream<T extends JSONSchema7 | ZodSchema | undefined = undefined>(params: StreamParams<T>): Promise<Response & {
        processDataStream: (options?: Omit<Parameters<typeof processDataStream>[0], 'stream'>) => Promise<void>;
    }>;
}

declare class MemoryThread extends BaseResource {
    private threadId;
    private agentId;
    constructor(options: ClientOptions, threadId: string, agentId: string);
    /**
     * Retrieves the memory thread details
     * @returns Promise containing thread details including title and metadata
     */
    get(): Promise<StorageThreadType>;
    /**
     * Updates the memory thread properties
     * @param params - Update parameters including title and metadata
     * @returns Promise containing updated thread details
     */
    update(params: UpdateMemoryThreadParams): Promise<StorageThreadType>;
    /**
     * Deletes the memory thread
     * @returns Promise containing deletion result
     */
    delete(): Promise<{
        result: string;
    }>;
    /**
     * Retrieves messages associated with the thread
     * @returns Promise containing thread messages and UI messages
     */
    getMessages(): Promise<GetMemoryThreadMessagesResponse>;
}

declare class Vector extends BaseResource {
    private vectorName;
    constructor(options: ClientOptions, vectorName: string);
    /**
     * Retrieves details about a specific vector index
     * @param indexName - Name of the index to get details for
     * @returns Promise containing vector index details
     */
    details(indexName: string): Promise<GetVectorIndexResponse>;
    /**
     * Deletes a vector index
     * @param indexName - Name of the index to delete
     * @returns Promise indicating deletion success
     */
    delete(indexName: string): Promise<{
        success: boolean;
    }>;
    /**
     * Retrieves a list of all available indexes
     * @returns Promise containing array of index names
     */
    getIndexes(): Promise<{
        indexes: string[];
    }>;
    /**
     * Creates a new vector index
     * @param params - Parameters for index creation including dimension and metric
     * @returns Promise indicating creation success
     */
    createIndex(params: CreateIndexParams): Promise<{
        success: boolean;
    }>;
    /**
     * Upserts vectors into an index
     * @param params - Parameters containing vectors, metadata, and optional IDs
     * @returns Promise containing array of vector IDs
     */
    upsert(params: UpsertVectorParams): Promise<string[]>;
    /**
     * Queries vectors in an index
     * @param params - Query parameters including query vector and search options
     * @returns Promise containing query results
     */
    query(params: QueryVectorParams): Promise<QueryVectorResponse>;
}

declare class Workflow extends BaseResource {
    private workflowId;
    constructor(options: ClientOptions, workflowId: string);
    /**
     * Retrieves details about the workflow
     * @returns Promise containing workflow details including steps and graphs
     */
    details(): Promise<GetWorkflowResponse>;
    /**
     * @deprecated Use `startAsync` instead
     * Executes the workflow with the provided parameters
     * @param params - Parameters required for workflow execution
     * @returns Promise containing the workflow execution results
     */
    execute(params: Record<string, any>): Promise<WorkflowRunResult>;
    /**
     * Creates a new workflow run
     * @returns Promise containing the generated run ID
     */
    createRun(params?: {
        runId?: string;
    }): Promise<{
        runId: string;
    }>;
    /**
     * Starts a workflow run synchronously without waiting for the workflow to complete
     * @param params - Object containing the runId and triggerData
     * @returns Promise containing success message
     */
    start(params: {
        runId: string;
        triggerData: Record<string, any>;
    }): Promise<{
        message: string;
    }>;
    /**
     * Resumes a suspended workflow step synchronously without waiting for the workflow to complete
     * @param stepId - ID of the step to resume
     * @param runId - ID of the workflow run
     * @param context - Context to resume the workflow with
     * @returns Promise containing the workflow resume results
     */
    resume({ stepId, runId, context, }: {
        stepId: string;
        runId: string;
        context: Record<string, any>;
    }): Promise<{
        message: string;
    }>;
    /**
     * Starts a workflow run asynchronously and returns a promise that resolves when the workflow is complete
     * @param params - Object containing the optional runId and triggerData
     * @returns Promise containing the workflow execution results
     */
    startAsync(params: {
        runId?: string;
        triggerData: Record<string, any>;
    }): Promise<WorkflowRunResult>;
    /**
     * Resumes a suspended workflow step asynchronously and returns a promise that resolves when the workflow is complete
     * @param params - Object containing the runId, stepId, and context
     * @returns Promise containing the workflow resume results
     */
    resumeAsync(params: {
        runId: string;
        stepId: string;
        context: Record<string, any>;
    }): Promise<WorkflowRunResult>;
    /**
     * Creates an async generator that processes a readable stream and yields records
     * separated by the Record Separator character (\x1E)
     *
     * @param stream - The readable stream to process
     * @returns An async generator that yields parsed records
     */
    private streamProcessor;
    /**
     * Watches workflow transitions in real-time
     * @param runId - Optional run ID to filter the watch stream
     * @returns AsyncGenerator that yields parsed records from the workflow watch stream
     */
    watch({ runId }: {
        runId?: string;
    }, onRecord: (record: WorkflowRunResult) => void): Promise<void>;
}

declare class Tool extends BaseResource {
    private toolId;
    constructor(options: ClientOptions, toolId: string);
    /**
     * Retrieves details about the tool
     * @returns Promise containing tool details including description and schemas
     */
    details(): Promise<GetToolResponse>;
    /**
     * Executes the tool with the provided parameters
     * @param params - Parameters required for tool execution
     * @returns Promise containing the tool execution results
     */
    execute(params: {
        data: any;
    }): Promise<any>;
}

declare class MastraClient extends BaseResource {
    constructor(options: ClientOptions);
    /**
     * Retrieves all available agents
     * @returns Promise containing map of agent IDs to agent details
     */
    getAgents(): Promise<Record<string, GetAgentResponse>>;
    /**
     * Gets an agent instance by ID
     * @param agentId - ID of the agent to retrieve
     * @returns Agent instance
     */
    getAgent(agentId: string): Agent;
    /**
     * Retrieves memory threads for a resource
     * @param params - Parameters containing the resource ID
     * @returns Promise containing array of memory threads
     */
    getMemoryThreads(params: GetMemoryThreadParams): Promise<GetMemoryThreadResponse>;
    /**
     * Creates a new memory thread
     * @param params - Parameters for creating the memory thread
     * @returns Promise containing the created memory thread
     */
    createMemoryThread(params: CreateMemoryThreadParams): Promise<CreateMemoryThreadResponse>;
    /**
     * Gets a memory thread instance by ID
     * @param threadId - ID of the memory thread to retrieve
     * @returns MemoryThread instance
     */
    getMemoryThread(threadId: string, agentId: string): MemoryThread;
    /**
     * Saves messages to memory
     * @param params - Parameters containing messages to save
     * @returns Promise containing the saved messages
     */
    saveMessageToMemory(params: SaveMessageToMemoryParams): Promise<SaveMessageToMemoryResponse>;
    /**
     * Gets the status of the memory system
     * @returns Promise containing memory system status
     */
    getMemoryStatus(agentId: string): Promise<{
        result: boolean;
    }>;
    /**
     * Retrieves all available tools
     * @returns Promise containing map of tool IDs to tool details
     */
    getTools(): Promise<Record<string, GetToolResponse>>;
    /**
     * Gets a tool instance by ID
     * @param toolId - ID of the tool to retrieve
     * @returns Tool instance
     */
    getTool(toolId: string): Tool;
    /**
     * Retrieves all available workflows
     * @returns Promise containing map of workflow IDs to workflow details
     */
    getWorkflows(): Promise<Record<string, GetWorkflowResponse>>;
    /**
     * Gets a workflow instance by ID
     * @param workflowId - ID of the workflow to retrieve
     * @returns Workflow instance
     */
    getWorkflow(workflowId: string): Workflow;
    /**
     * Gets a vector instance by name
     * @param vectorName - Name of the vector to retrieve
     * @returns Vector instance
     */
    getVector(vectorName: string): Vector;
    /**
     * Retrieves logs
     * @param params - Parameters for filtering logs
     * @returns Promise containing array of log messages
     */
    getLogs(params: GetLogsParams): Promise<GetLogsResponse>;
    /**
     * Gets logs for a specific run
     * @param params - Parameters containing run ID to retrieve
     * @returns Promise containing array of log messages
     */
    getLogForRun(params: GetLogParams): Promise<GetLogsResponse>;
    /**
     * List of all log transports
     * @returns Promise containing list of log transports
     */
    getLogTransports(): Promise<{
        transports: string[];
    }>;
    /**
     * List of all traces (paged)
     * @param params - Parameters for filtering traces
     * @returns Promise containing telemetry data
     */
    getTelemetry(params?: GetTelemetryParams): Promise<GetTelemetryResponse>;
    /**
     * Retrieves all available networks
     * @returns Promise containing map of network IDs to network details
     */
    getNetworks(): Promise<Record<string, GetNetworkResponse>>;
    /**
     * Gets a network instance by ID
     * @param networkId - ID of the network to retrieve
     * @returns Network instance
     */
    getNetwork(networkId: string): Network;
}

export { type ClientOptions, type CreateIndexParams, type CreateMemoryThreadParams, type CreateMemoryThreadResponse, type GenerateParams, type GetAgentResponse, type GetEvalsByAgentIdResponse, type GetLogParams, type GetLogsParams, type GetLogsResponse, type GetMemoryThreadMessagesResponse, type GetMemoryThreadParams, type GetMemoryThreadResponse, type GetNetworkResponse, type GetTelemetryParams, type GetTelemetryResponse, type GetToolResponse, type GetVectorIndexResponse, type GetWorkflowResponse, MastraClient, type QueryVectorParams, type QueryVectorResponse, type RequestFunction, type RequestOptions, type SaveMessageToMemoryParams, type SaveMessageToMemoryResponse, type StreamParams, type UpdateMemoryThreadParams, type UpsertVectorParams, type WorkflowRunResult };
