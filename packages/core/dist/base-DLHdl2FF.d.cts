import * as ai from 'ai';
import { Tool as Tool$1, ToolExecutionOptions, CoreMessage as CoreMessage$1, TelemetrySettings, generateText, generateObject, streamText, GenerateTextResult, GenerateObjectResult, streamObject, StreamTextResult, StreamObjectResult, CoreSystemMessage as CoreSystemMessage$1, CoreAssistantMessage as CoreAssistantMessage$1, CoreUserMessage as CoreUserMessage$1, CoreToolMessage as CoreToolMessage$1, EmbedResult as EmbedResult$1, EmbedManyResult as EmbedManyResult$1, EmbeddingModel, Message, UserContent, AssistantContent, LanguageModelV1, GenerateTextOnStepFinishCallback, StreamTextOnFinishCallback, StreamObjectOnFinishCallback, StreamTextOnStepFinishCallback, LanguageModel as LanguageModel$1, DeepPartial, ToolContent } from 'ai';
import { M as MastraBase, T as Telemetry, O as OtelConfig } from './base-D_N8PfP5.cjs';
import { M as Metric, a as MetricResult, T as TestInfo } from './types-CwTG2XyQ.cjs';
import { Query } from 'sift';
import { z, ZodSchema } from 'zod';
import { JSONSchema7 } from 'json-schema';
import { d as Run, B as BaseLogMessage, R as RegisteredLogger, L as Logger } from './index-BXwGr3N7.cjs';
import { Span } from '@opentelemetry/api';
import * as xstate from 'xstate';
import { Snapshot } from 'xstate';
import EventEmitter from 'node:events';
import { MastraVector } from './vector/index.cjs';
import { MastraTTS } from './tts/index.cjs';
import { MastraDeployer } from './deployer/index.cjs';

type VercelTool = Tool$1;
type CoreTool = {
    id?: string;
    description?: string;
    parameters: ZodSchema;
    execute?: (params: any, options: ToolExecutionOptions) => Promise<any>;
} & ({
    type?: 'function' | undefined;
    id?: string;
} | {
    type: 'provider-defined';
    id: `${string}.${string}`;
    args: Record<string, unknown>;
});
interface ToolExecutionContext<TSchemaIn extends z.ZodSchema | undefined = undefined> extends IExecutionContext<TSchemaIn> {
    mastra?: MastraUnion;
}
interface ToolAction<TSchemaIn extends z.ZodSchema | undefined = undefined, TSchemaOut extends z.ZodSchema | undefined = undefined, TContext extends ToolExecutionContext<TSchemaIn> = ToolExecutionContext<TSchemaIn>> extends IAction<string, TSchemaIn, TSchemaOut, TContext, ToolExecutionOptions> {
    description: string;
    execute?: (context: TContext, options?: ToolExecutionOptions) => Promise<TSchemaOut extends z.ZodSchema ? z.infer<TSchemaOut> : unknown>;
    mastra?: Mastra;
}

declare class Tool<TSchemaIn extends z.ZodSchema | undefined = undefined, TSchemaOut extends z.ZodSchema | undefined = undefined, TContext extends ToolExecutionContext<TSchemaIn> = ToolExecutionContext<TSchemaIn>> implements ToolAction<TSchemaIn, TSchemaOut, TContext> {
    id: string;
    description: string;
    inputSchema?: TSchemaIn;
    outputSchema?: TSchemaOut;
    execute?: ToolAction<TSchemaIn, TSchemaOut, TContext>['execute'];
    mastra?: Mastra;
    constructor(opts: ToolAction<TSchemaIn, TSchemaOut, TContext>);
}
declare function createTool<TSchemaIn extends z.ZodSchema | undefined = undefined, TSchemaOut extends z.ZodSchema | undefined = undefined, TContext extends ToolExecutionContext<TSchemaIn> = ToolExecutionContext<TSchemaIn>>(opts: ToolAction<TSchemaIn, TSchemaOut, TContext>): Tool<TSchemaIn, TSchemaOut, TContext>;

type LanguageModel = MastraLanguageModel;
type CoreMessage = CoreMessage$1;
type CoreSystemMessage = CoreSystemMessage$1;
type CoreAssistantMessage = CoreAssistantMessage$1;
type CoreUserMessage = CoreUserMessage$1;
type CoreToolMessage = CoreToolMessage$1;
type EmbedResult<T> = EmbedResult$1<T>;
type EmbedManyResult<T> = EmbedManyResult$1<T>;
type BaseStructuredOutputType = 'string' | 'number' | 'boolean' | 'date';
type StructuredOutputType = 'array' | 'string' | 'number' | 'object' | 'boolean' | 'date';
type StructuredOutputArrayItem = {
    type: BaseStructuredOutputType;
} | {
    type: 'object';
    items: StructuredOutput;
};
type StructuredOutput = {
    [key: string]: {
        type: BaseStructuredOutputType;
    } | {
        type: 'object';
        items: StructuredOutput;
    } | {
        type: 'array';
        items: StructuredOutputArrayItem;
    };
};
type GenerateReturn<Z extends ZodSchema | JSONSchema7 | undefined = undefined> = Z extends undefined ? GenerateTextResult<any, Z extends ZodSchema ? z.infer<Z> : unknown> : GenerateObjectResult<Z extends ZodSchema ? z.infer<Z> : unknown>;
type StreamReturn<Z extends ZodSchema | JSONSchema7 | undefined = undefined> = Z extends undefined ? StreamTextResult<any, Z extends ZodSchema ? z.infer<Z> : unknown> : StreamObjectResult<any, Z extends ZodSchema ? z.infer<Z> : unknown, any>;
type OutputType = StructuredOutput | ZodSchema | JSONSchema7 | undefined;
type GenerateTextOptions = Parameters<typeof generateText>[0];
type StreamTextOptions = Parameters<typeof streamText>[0];
type GenerateObjectOptions = Parameters<typeof generateObject>[0];
type StreamObjectOptions = Parameters<typeof streamObject>[0];
type MastraCustomLLMOptionsKeys = 'messages' | 'tools' | 'model' | 'onStepFinish' | 'experimental_output' | 'experimental_telemetry' | 'messages' | 'onFinish' | 'output';
type DefaultLLMTextOptions = Omit<GenerateTextOptions, MastraCustomLLMOptionsKeys>;
type DefaultLLMTextObjectOptions = Omit<GenerateObjectOptions, MastraCustomLLMOptionsKeys>;
type DefaultLLMStreamOptions = Omit<StreamTextOptions, MastraCustomLLMOptionsKeys>;
type DefaultLLMStreamObjectOptions = Omit<StreamObjectOptions, MastraCustomLLMOptionsKeys>;
type MastraCustomLLMOptions<Z extends ZodSchema | JSONSchema7 | undefined = undefined> = {
    tools?: ToolsInput;
    convertedTools?: Record<string, CoreTool>;
    onStepFinish?: (step: unknown) => void;
    experimental_output?: Z;
    telemetry?: TelemetrySettings;
    threadId?: string;
    resourceId?: string;
} & Run;
type LLMTextOptions<Z extends ZodSchema | JSONSchema7 | undefined = undefined> = {
    messages: CoreMessage[];
} & MastraCustomLLMOptions<Z> & DefaultLLMTextOptions;
type LLMTextObjectOptions<T extends ZodSchema | JSONSchema7 | undefined = undefined> = LLMTextOptions<T> & DefaultLLMTextObjectOptions & {
    structuredOutput: JSONSchema7 | z.ZodType<T> | StructuredOutput;
};
type LLMStreamOptions<Z extends ZodSchema | JSONSchema7 | undefined = undefined> = {
    output?: OutputType | Z;
    onFinish?: (result: string) => Promise<void> | void;
} & MastraCustomLLMOptions<Z> & DefaultLLMStreamOptions;
type LLMInnerStreamOptions<Z extends ZodSchema | JSONSchema7 | undefined = undefined> = {
    messages: CoreMessage[];
    onFinish?: (result: string) => Promise<void> | void;
} & MastraCustomLLMOptions<Z> & DefaultLLMStreamOptions;
type LLMStreamObjectOptions<T extends ZodSchema | JSONSchema7 | undefined = undefined> = {
    structuredOutput: JSONSchema7 | z.ZodType<T> | StructuredOutput;
} & LLMInnerStreamOptions<T> & DefaultLLMStreamObjectOptions;

/**
 * Abstract Memory class that defines the interface for storing and retrieving
 * conversation threads and messages.
 */
declare abstract class MastraMemory extends MastraBase {
    MAX_CONTEXT_TOKENS?: number;
    storage: MastraStorage;
    vector: MastraVector;
    embedder: EmbeddingModel<string>;
    protected threadConfig: MemoryConfig;
    constructor(config: {
        name: string;
    } & SharedMemoryConfig);
    setStorage(storage: MastraStorage): void;
    setVector(vector: MastraVector): void;
    setEmbedder(embedder: EmbeddingModel<string>): void;
    /**
     * Get a system message to inject into the conversation.
     * This will be called before each conversation turn.
     * Implementations can override this to inject custom system messages.
     */
    getSystemMessage(_input: {
        threadId: string;
        memoryConfig?: MemoryConfig;
    }): Promise<string | null>;
    /**
     * Get tools that should be available to the agent.
     * This will be called when converting tools for the agent.
     * Implementations can override this to provide additional tools.
     */
    getTools(_config?: MemoryConfig): Record<string, CoreTool>;
    protected createEmbeddingIndex(): Promise<{
        indexName: string;
    }>;
    getMergedThreadConfig(config?: MemoryConfig): MemoryConfig;
    abstract rememberMessages({ threadId, resourceId, vectorMessageSearch, config, }: {
        threadId: string;
        resourceId?: string;
        vectorMessageSearch?: string;
        config?: MemoryConfig;
    }): Promise<{
        threadId: string;
        messages: CoreMessage$1[];
        uiMessages: Message[];
    }>;
    estimateTokens(text: string): number;
    protected parseMessages(messages: MessageType[]): CoreMessage$1[];
    protected convertToUIMessages(messages: MessageType[]): Message[];
    /**
     * Retrieves a specific thread by its ID
     * @param threadId - The unique identifier of the thread
     * @returns Promise resolving to the thread or null if not found
     */
    abstract getThreadById({ threadId }: {
        threadId: string;
    }): Promise<StorageThreadType | null>;
    abstract getThreadsByResourceId({ resourceId }: {
        resourceId: string;
    }): Promise<StorageThreadType[]>;
    /**
     * Saves or updates a thread
     * @param thread - The thread data to save
     * @returns Promise resolving to the saved thread
     */
    abstract saveThread({ thread, memoryConfig, }: {
        thread: StorageThreadType;
        memoryConfig?: MemoryConfig;
    }): Promise<StorageThreadType>;
    /**
     * Saves messages to a thread
     * @param messages - Array of messages to save
     * @returns Promise resolving to the saved messages
     */
    abstract saveMessages({ messages, memoryConfig, }: {
        messages: MessageType[];
        memoryConfig: MemoryConfig | undefined;
    }): Promise<MessageType[]>;
    /**
     * Retrieves all messages for a specific thread
     * @param threadId - The unique identifier of the thread
     * @returns Promise resolving to array of messages and uiMessages
     */
    abstract query({ threadId, resourceId, selectBy, }: StorageGetMessagesArg): Promise<{
        messages: CoreMessage$1[];
        uiMessages: Message[];
    }>;
    /**
     * Helper method to create a new thread
     * @param title - Optional title for the thread
     * @param metadata - Optional metadata for the thread
     * @returns Promise resolving to the created thread
     */
    createThread({ threadId, resourceId, title, metadata, memoryConfig, }: {
        resourceId: string;
        threadId?: string;
        title?: string;
        metadata?: Record<string, unknown>;
        memoryConfig?: MemoryConfig;
    }): Promise<StorageThreadType>;
    /**
     * Helper method to delete a thread
     * @param threadId - the id of the thread to delete
     */
    abstract deleteThread(threadId: string): Promise<void>;
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
    addMessage({ threadId, config, content, role, type, toolNames, toolCallArgs, toolCallIds, }: {
        threadId: string;
        config?: MemoryConfig;
        content: UserContent | AssistantContent;
        role: 'user' | 'assistant';
        type: 'text' | 'tool-call' | 'tool-result';
        toolNames?: string[];
        toolCallArgs?: Record<string, unknown>[];
        toolCallIds?: string[];
    }): Promise<MessageType>;
    /**
     * Generates a unique identifier
     * @returns A unique string ID
     */
    generateId(): string;
}

type VoiceEventType = 'speaking' | 'writing' | 'error' | string;
interface VoiceEventMap {
    speaker: NodeJS.ReadableStream;
    speaking: {
        audio?: string;
    };
    writing: {
        text: string;
        role: 'assistant' | 'user';
    };
    error: {
        message: string;
        code?: string;
        details?: unknown;
    };
    [key: string]: unknown;
}
interface BuiltInModelConfig {
    name: string;
    baseURL?: string;
    apiKey?: string;
}
interface VoiceConfig<T = unknown> {
    listeningModel?: BuiltInModelConfig;
    speechModel?: BuiltInModelConfig;
    speaker?: string;
    name?: string;
    realtimeConfig?: {
        model?: string;
        apiKey?: string;
        options?: T;
    };
}
declare abstract class MastraVoice<TOptions = unknown, TSpeakOptions = unknown, TListenOptions = unknown, TTools extends ToolsInput = ToolsInput, TEventArgs extends VoiceEventMap = VoiceEventMap, TSpeakerMetadata = unknown> extends MastraBase {
    protected listeningModel?: BuiltInModelConfig;
    protected speechModel?: BuiltInModelConfig;
    protected speaker?: string;
    protected realtimeConfig?: {
        model?: string;
        apiKey?: string;
        options?: TOptions;
    };
    constructor({ listeningModel, speechModel, speaker, realtimeConfig, name }?: VoiceConfig<TOptions>);
    traced<T extends Function>(method: T, methodName: string): T;
    /**
     * Convert text to speech
     * @param input Text or text stream to convert to speech
     * @param options Speech options including speaker and provider-specific options
     * @returns Audio stream
     */
    /**
     * Convert text to speech
     * @param input Text or text stream to convert to speech
     * @param options Speech options including speaker and provider-specific options
     * @returns Audio stream or void if in chat mode
     */
    abstract speak(input: string | NodeJS.ReadableStream, options?: {
        speaker?: string;
    } & TSpeakOptions): Promise<NodeJS.ReadableStream | void>;
    /**
     * Convert speech to text
     * @param audioStream Audio stream to transcribe
     * @param options Provider-specific transcription options
     * @returns Text or text stream
     */
    /**
     * Convert speech to text
     * @param audioStream Audio stream to transcribe
     * @param options Provider-specific transcription options
     * @returns Text, text stream, or void if in chat mode
     */
    abstract listen(audioStream: NodeJS.ReadableStream | unknown, // Allow other audio input types for OpenAI realtime API
    options?: TListenOptions): Promise<string | NodeJS.ReadableStream | void>;
    updateConfig(_options: Record<string, unknown>): void;
    /**
     * Initializes a WebSocket or WebRTC connection for real-time communication
     * @returns Promise that resolves when the connection is established
     */
    connect(_options?: Record<string, unknown>): Promise<void>;
    /**
     * Relay audio data to the voice provider for real-time processing
     * @param audioData Audio data to relay
     */
    send(_audioData: NodeJS.ReadableStream | Int16Array): Promise<void>;
    /**
     * Trigger voice providers to respond
     */
    answer(_options?: Record<string, unknown>): Promise<void>;
    /**
     * Equip the voice provider with instructions
     * @param instructions Instructions to add
     */
    addInstructions(_instructions?: string): void;
    /**
     * Equip the voice provider with tools
     * @param tools Array of tools to add
     */
    addTools(_tools: TTools): void;
    /**
     * Disconnect from the WebSocket or WebRTC connection
     */
    close(): void;
    /**
     * Register an event listener
     * @param event Event name (e.g., 'speaking', 'writing', 'error')
     * @param callback Callback function that receives event data
     */
    on<E extends VoiceEventType>(_event: E, _callback: (data: E extends keyof TEventArgs ? TEventArgs[E] : unknown) => void): void;
    /**
     * Remove an event listener
     * @param event Event name (e.g., 'speaking', 'writing', 'error')
     * @param callback Callback function to remove
     */
    off<E extends VoiceEventType>(_event: E, _callback: (data: E extends keyof TEventArgs ? TEventArgs[E] : unknown) => void): void;
    /**
     * Get available speakers/voices
     * @returns Array of available voice IDs and their metadata
     */
    getSpeakers(): Promise<Array<{
        voiceId: string;
    } & TSpeakerMetadata>>;
}

declare class CompositeVoice extends MastraVoice<unknown, unknown, unknown, ToolsInput, VoiceEventMap> {
    protected speakProvider?: MastraVoice;
    protected listenProvider?: MastraVoice;
    protected realtimeProvider?: MastraVoice;
    constructor({ speakProvider, listenProvider, realtimeProvider, }: {
        speakProvider?: MastraVoice;
        listenProvider?: MastraVoice;
        realtimeProvider?: MastraVoice;
    });
    /**
     * Convert text to speech using the configured provider
     * @param input Text or text stream to convert to speech
     * @param options Speech options including speaker and provider-specific options
     * @returns Audio stream or void if in realtime mode
     */
    speak(input: string | NodeJS.ReadableStream, options?: {
        speaker?: string;
    } & any): Promise<NodeJS.ReadableStream | void>;
    listen(audioStream: NodeJS.ReadableStream, options?: any): Promise<string | void | NodeJS.ReadableStream>;
    getSpeakers(): Promise<{
        voiceId: string;
    }[]>;
    updateConfig(options: Record<string, unknown>): void;
    /**
     * Initializes a WebSocket or WebRTC connection for real-time communication
     * @returns Promise that resolves when the connection is established
     */
    connect(options?: Record<string, unknown>): Promise<void>;
    /**
     * Relay audio data to the voice provider for real-time processing
     * @param audioData Audio data to send
     */
    send(audioData: NodeJS.ReadableStream | Int16Array): Promise<void>;
    /**
     * Trigger voice providers to respond
     */
    answer(options?: Record<string, unknown>): Promise<void>;
    /**
     * Equip the voice provider with instructions
     * @param instructions Instructions to add
     */
    addInstructions(instructions: string): void;
    /**
     * Equip the voice provider with tools
     * @param tools Array of tools to add
     */
    addTools(tools: ToolsInput): void;
    /**
     * Disconnect from the WebSocket or WebRTC connection
     */
    close(): void;
    /**
     * Register an event listener
     * @param event Event name (e.g., 'speaking', 'writing', 'error')
     * @param callback Callback function that receives event data
     */
    on<E extends VoiceEventType>(event: E, callback: (data: E extends keyof VoiceEventMap ? VoiceEventMap[E] : unknown) => void): void;
    /**
     * Remove an event listener
     * @param event Event name (e.g., 'speaking', 'writing', 'error')
     * @param callback Callback function to remove
     */
    off<E extends VoiceEventType>(event: E, callback: (data: E extends keyof VoiceEventMap ? VoiceEventMap[E] : unknown) => void): void;
}

type ToolsInput = Record<string, ToolAction<any, any, any> | VercelTool>;
type ToolsetsInput = Record<string, ToolsInput>;
type MastraLanguageModel = LanguageModelV1;
interface AgentConfig<TTools extends ToolsInput = ToolsInput, TMetrics extends Record<string, Metric> = Record<string, Metric>> {
    name: string;
    instructions: string;
    model: MastraLanguageModel;
    tools?: TTools;
    mastra?: Mastra;
    /** @deprecated This property is deprecated. Use evals instead to add evaluation metrics. */
    metrics?: TMetrics;
    evals?: TMetrics;
    memory?: MastraMemory;
    voice?: CompositeVoice;
}
/**
 * Options for generating responses with an agent
 * @template Z - The schema type for structured output (Zod schema or JSON schema)
 */
type AgentGenerateOptions<Z extends ZodSchema | JSONSchema7 | undefined = undefined> = {
    /** Optional instructions to override the agent's default instructions */
    instructions?: string;
    /** Additional tool sets that can be used for this generation */
    toolsets?: ToolsetsInput;
    /** Additional context messages to include */
    context?: CoreMessage[];
    /** Memory configuration options */
    memoryOptions?: MemoryConfig;
    /** Unique ID for this generation run */
    runId?: string;
    /** Callback fired after each generation step completes */
    onStepFinish?: Z extends undefined ? GenerateTextOnStepFinishCallback<any> : never;
    /** Maximum number of steps allowed for generation */
    maxSteps?: number;
    /** Schema for structured output, does not work with tools, use experimental_output instead */
    output?: OutputType | Z;
    /** Schema for structured output generation alongside tool calls. */
    experimental_output?: Z;
    /** Controls how tools are selected during generation */
    toolChoice?: 'auto' | 'none' | 'required' | {
        type: 'tool';
        toolName: string;
    };
    /** Telemetry settings */
    telemetry?: TelemetrySettings;
} & ({
    resourceId?: undefined;
    threadId?: undefined;
} | {
    resourceId: string;
    threadId: string;
}) & (Z extends undefined ? DefaultLLMTextOptions : DefaultLLMTextObjectOptions);
/**
 * Options for streaming responses with an agent
 * @template Z - The schema type for structured output (Zod schema or JSON schema)
 */
type AgentStreamOptions<Z extends ZodSchema | JSONSchema7 | undefined = undefined> = {
    /** Optional instructions to override the agent's default instructions */
    instructions?: string;
    /** Additional tool sets that can be used for this generation */
    toolsets?: ToolsetsInput;
    /** Additional context messages to include */
    context?: CoreMessage[];
    /** Memory configuration options */
    memoryOptions?: MemoryConfig;
    /** Unique ID for this generation run */
    runId?: string;
    /** Callback fired when streaming completes */
    onFinish?: Z extends undefined ? StreamTextOnFinishCallback<any> : Z extends ZodSchema ? StreamObjectOnFinishCallback<z.infer<Z>> : StreamObjectOnFinishCallback<any>;
    /** Callback fired after each generation step completes */
    onStepFinish?: Z extends undefined ? StreamTextOnStepFinishCallback<any> : never;
    /** Maximum number of steps allowed for generation */
    maxSteps?: number;
    /** Schema for structured output */
    output?: OutputType | Z;
    /** Temperature parameter for controlling randomness */
    temperature?: number;
    /** Controls how tools are selected during generation */
    toolChoice?: 'auto' | 'none' | 'required' | {
        type: 'tool';
        toolName: string;
    };
    /** Experimental schema for structured output */
    experimental_output?: Z;
    /** Telemetry settings */
    telemetry?: TelemetrySettings;
} & ({
    resourceId?: undefined;
    threadId?: undefined;
} | {
    resourceId: string;
    threadId: string;
}) & (Z extends undefined ? DefaultLLMStreamOptions : DefaultLLMStreamObjectOptions);

interface WorkflowOptions<TWorkflowName extends string = string, TSteps extends Step<string, any, any, any>[] = Step<string, any, any, any>[], TTriggerSchema extends z.ZodObject<any> = any, TResultSchema extends z.ZodObject<any> = any> {
    steps?: TSteps;
    name: TWorkflowName;
    triggerSchema?: TTriggerSchema;
    result?: {
        schema: TResultSchema;
        mapping?: {
            [K in keyof z.infer<TResultSchema>]?: any;
        };
    };
    events?: Record<string, {
        schema: z.ZodObject<any>;
    }>;
    retryConfig?: RetryConfig;
    mastra?: Mastra;
}
interface StepExecutionContext<TSchemaIn extends z.ZodSchema | undefined = undefined, TContext extends WorkflowContext = WorkflowContext> extends IExecutionContext<TSchemaIn> {
    context: TSchemaIn extends z.ZodSchema ? {
        inputData: z.infer<TSchemaIn>;
    } & TContext : TContext;
    suspend: (payload?: unknown, softSuspend?: any) => Promise<void>;
    runId: string;
    emit: (event: string, data: any) => void;
    mastra?: MastraUnion;
}
interface StepAction<TId extends string, TSchemaIn extends z.ZodSchema | undefined, TSchemaOut extends z.ZodSchema | undefined, TContext extends StepExecutionContext<TSchemaIn>> extends IAction<TId, TSchemaIn, TSchemaOut, TContext> {
    mastra?: Mastra;
    payload?: TSchemaIn extends z.ZodSchema ? Partial<z.infer<TSchemaIn>> : unknown;
    execute: (context: TContext) => Promise<TSchemaOut extends z.ZodSchema ? z.infer<TSchemaOut> : unknown>;
    retryConfig?: RetryConfig;
    workflow?: Workflow;
}
interface SimpleConditionalType {
    [key: `${string}.${string}`]: string | Query<any>;
}
type StepVariableType<TId extends string, TSchemaIn extends z.ZodSchema | undefined, TSchemaOut extends z.ZodSchema | undefined, TContext extends StepExecutionContext<TSchemaIn>> = StepAction<TId, TSchemaIn, TSchemaOut, TContext> | 'trigger' | {
    id: string;
};
type StepNode = {
    step: StepAction<any, any, any, any>;
    config: StepDef<any, any, any, any>[any];
};
type StepGraph = {
    initial: StepNode[];
    [key: string]: StepNode[];
};
type RetryConfig = {
    attempts?: number;
    delay?: number;
};
type VariableReference<TStep extends StepVariableType<any, any, any, any>, TTriggerSchema extends z.ZodObject<any>> = TStep extends StepAction<any, any, any, any> ? {
    step: TStep;
    path: PathsToStringProps<ExtractSchemaType<ExtractSchemaFromStep<TStep, 'outputSchema'>>> | '' | '.';
} : TStep extends 'trigger' ? {
    step: 'trigger';
    path: PathsToStringProps<ExtractSchemaType<TTriggerSchema>> | '.' | '';
} : {
    step: {
        id: string;
    };
    path: string;
};
interface BaseCondition<TStep extends StepVariableType<any, any, any, any>, TTriggerSchema extends z.ZodObject<any>> {
    ref: TStep extends StepAction<any, any, any, any> ? {
        step: TStep;
        path: PathsToStringProps<ExtractSchemaType<ExtractSchemaFromStep<TStep, 'outputSchema'>>> | '' | '.' | 'status';
    } : TStep extends 'trigger' ? {
        step: 'trigger';
        path: PathsToStringProps<ExtractSchemaType<TTriggerSchema>> | '.' | '';
    } : {
        step: {
            id: string;
        };
        path: string;
    };
    query: Query<any>;
}
type ActionContext<TSchemaIn extends z.ZodType<any>> = StepExecutionContext<z.infer<TSchemaIn>, WorkflowContext>;
declare enum WhenConditionReturnValue {
    CONTINUE = "continue",
    CONTINUE_FAILED = "continue_failed",
    ABORT = "abort",
    LIMBO = "limbo"
}
type StepDef<TStepId extends TSteps[number]['id'], TSteps extends StepAction<any, any, any, any>[], TSchemaIn extends z.ZodType<any>, TSchemaOut extends z.ZodType<any>> = Record<TStepId, {
    when?: Condition<any, any> | ((args: {
        context: WorkflowContext;
        mastra?: Mastra;
    }) => Promise<boolean | WhenConditionReturnValue>);
    serializedWhen?: Condition<any, any> | string;
    loopLabel?: string;
    loopType?: 'while' | 'until';
    data: TSchemaIn;
    handler: (args: ActionContext<TSchemaIn>) => Promise<z.infer<TSchemaOut>>;
}>;
type StepCondition<TStep extends StepVariableType<any, any, any, any>, TTriggerSchema extends z.ZodObject<any>> = BaseCondition<TStep, TTriggerSchema> | SimpleConditionalType | {
    and: StepCondition<TStep, TTriggerSchema>[];
} | {
    or: StepCondition<TStep, TTriggerSchema>[];
} | {
    not: StepCondition<TStep, TTriggerSchema>;
};
type Condition<TStep extends StepVariableType<any, any, any, any>, TTriggerSchema extends z.ZodObject<any>> = BaseCondition<TStep, TTriggerSchema> | SimpleConditionalType | {
    and: Condition<TStep, TTriggerSchema>[];
} | {
    or: Condition<TStep, TTriggerSchema>[];
} | {
    not: Condition<TStep, TTriggerSchema>;
};
interface StepConfig<TStep extends StepAction<any, any, any, any>, CondStep extends StepVariableType<any, any, any, any>, VarStep extends StepVariableType<any, any, any, any>, TTriggerSchema extends z.ZodObject<any>, TSteps extends Step<string, any, any, any>[] = Step<string, any, any, any>[]> {
    when?: Condition<CondStep, TTriggerSchema> | ((args: {
        context: WorkflowContext<TTriggerSchema, TSteps>;
        mastra?: Mastra;
    }) => Promise<boolean | WhenConditionReturnValue>);
    variables?: StepInputType<TStep, 'inputSchema'> extends never ? Record<string, VariableReference<VarStep, TTriggerSchema>> : {
        [K in keyof StepInputType<TStep, 'inputSchema'>]?: VariableReference<VarStep, TTriggerSchema>;
    };
    '#internal'?: {
        when?: Condition<CondStep, TTriggerSchema> | ((args: {
            context: WorkflowContext<TTriggerSchema, TSteps>;
            mastra?: Mastra;
        }) => Promise<boolean | WhenConditionReturnValue>);
        loopLabel?: string;
        loopType?: 'while' | 'until' | undefined;
    };
}
type StepSuccess<T> = {
    status: 'success';
    output: T;
};
type StepSuspended<T> = {
    status: 'suspended';
    suspendPayload?: any;
    output?: T;
};
type StepWaiting = {
    status: 'waiting';
};
type StepFailure = {
    status: 'failed';
    error: string;
};
type StepSkipped = {
    status: 'skipped';
};
type StepResult<T> = StepSuccess<T> | StepFailure | StepSuspended<T> | StepWaiting | StepSkipped;
type StepsRecord<T extends readonly Step<any, any, z.ZodType<any> | undefined>[]> = {
    [K in T[number]['id']]: Extract<T[number], {
        id: K;
    }>;
};
interface WorkflowRunResult<T extends z.ZodObject<any>, TSteps extends Step<string, any, z.ZodType<any> | undefined>[], TResult extends z.ZodObject<any>> {
    triggerData?: z.infer<T>;
    result?: z.infer<TResult>;
    results: {
        [K in keyof StepsRecord<TSteps>]: StepsRecord<TSteps>[K]['outputSchema'] extends undefined ? StepResult<unknown> : StepResult<z.infer<NonNullable<StepsRecord<TSteps>[K]['outputSchema']>>>;
    };
    runId: string;
    activePaths: Map<keyof StepsRecord<TSteps>, {
        status: string;
        suspendPayload?: any;
    }>;
}
interface WorkflowContext<TTrigger extends z.ZodObject<any> = any, TSteps extends Step<string, any, any, any>[] = Step<string, any, any, any>[], TInputData extends Record<string, any> = Record<string, any>> {
    isResume?: {
        runId: string;
        stepId: string;
    };
    mastra?: MastraUnion;
    steps: {
        [K in keyof StepsRecord<TSteps>]: StepsRecord<TSteps>[K]['outputSchema'] extends undefined ? StepResult<unknown> : StepResult<z.infer<NonNullable<StepsRecord<TSteps>[K]['outputSchema']>>>;
    };
    triggerData: z.infer<TTrigger>;
    inputData: TInputData;
    attempts: Record<string, number>;
    getStepResult(stepId: 'trigger'): z.infer<TTrigger>;
    getStepResult<T extends keyof StepsRecord<TSteps> | unknown>(stepId: T extends keyof StepsRecord<TSteps> ? T : string): T extends keyof StepsRecord<TSteps> ? StepsRecord<TSteps>[T]['outputSchema'] extends undefined ? unknown : z.infer<NonNullable<StepsRecord<TSteps>[T]['outputSchema']>> : T;
    getStepResult<T extends Step<any, any, any, any>>(stepId: T): T['outputSchema'] extends undefined ? unknown : z.infer<NonNullable<T['outputSchema']>>;
}
interface WorkflowLogMessage extends BaseLogMessage {
    type: typeof RegisteredLogger.WORKFLOW;
    workflowName: string;
    stepId?: StepId;
    data?: unknown;
    runId?: string;
}
type WorkflowEvent = {
    type: 'RESET_TO_PENDING';
    stepId: string;
} | {
    type: 'CONDITIONS_MET';
    stepId: string;
} | {
    type: 'CONDITION_FAILED';
    stepId: string;
    error: string;
} | {
    type: 'SUSPENDED';
    stepId: string;
    suspendPayload?: any;
    softSuspend?: any;
} | {
    type: 'WAITING';
    stepId: string;
} | {
    type: `xstate.error.actor.${string}`;
    error: Error;
} | {
    type: `xstate.done.actor.${string}`;
    output: ResolverFunctionOutput;
};
type ResolverFunctionInput = {
    stepNode: StepNode;
    context: WorkflowContext;
};
type ResolverFunctionOutput = {
    stepId: StepId;
    result: unknown;
};
type SubscriberFunctionOutput = {
    stepId: StepId;
    result: unknown;
};
type DependencyCheckOutput = {
    type: 'CONDITIONS_MET';
} | {
    type: 'CONDITIONS_SKIPPED';
} | {
    type: 'CONDITIONS_SKIP_TO_COMPLETED';
} | {
    type: 'CONDITION_FAILED';
    error: string;
} | {
    type: 'SUSPENDED';
} | {
    type: 'WAITING';
} | {
    type: 'CONDITIONS_LIMBO';
};
type StepResolverOutput = {
    type: 'STEP_SUCCESS';
    output: unknown;
} | {
    type: 'STEP_FAILED';
    error: string;
} | {
    type: 'STEP_WAITING';
};
type WorkflowActors = {
    resolverFunction: {
        input: ResolverFunctionInput;
        output: StepResolverOutput;
    };
    conditionCheck: {
        input: {
            context: WorkflowContext;
            stepId: string;
        };
        output: DependencyCheckOutput;
    };
    spawnSubscriberFunction: {
        input: {
            context: WorkflowContext;
            stepId: string;
        };
        output: SubscriberFunctionOutput;
    };
};
type WorkflowActionParams = {
    stepId: string;
};
type WorkflowActions = {
    type: 'updateStepResult' | 'setStepError' | 'notifyStepCompletion' | 'decrementAttemptCount';
    params: WorkflowActionParams;
};
type WorkflowState = {
    [key: string]: {
        initial: 'pending';
        states: {
            pending: {
                invoke: {
                    src: 'conditionCheck';
                    input: ({ context }: {
                        context: WorkflowContext;
                    }) => {
                        context: WorkflowContext;
                        stepId: string;
                    };
                    onDone: [
                        {
                            guard: (_: any, event: {
                                output: DependencyCheckOutput;
                            }) => boolean;
                            target: 'executing';
                        },
                        {
                            guard: (_: any, event: {
                                output: DependencyCheckOutput;
                            }) => boolean;
                            target: 'waiting';
                        }
                    ];
                };
            };
            waiting: {
                after: {
                    CHECK_INTERVAL: {
                        target: 'pending';
                    };
                };
            };
            executing: {
                invoke: {
                    src: 'resolverFunction';
                    input: ({ context }: {
                        context: WorkflowContext;
                    }) => ResolverFunctionInput;
                    onDone: {
                        target: 'completed';
                        actions: ['updateStepResult'];
                    };
                    onError: {
                        target: 'failed';
                        actions: ['setStepError'];
                    };
                };
            };
            completed: {
                type: 'final';
                entry: ['notifyStepCompletion'];
            };
            failed: {
                type: 'final';
                entry: ['notifyStepCompletion'];
            };
        };
    };
};
declare const StepIdBrand: unique symbol;
type StepId = string & {
    readonly [StepIdBrand]: typeof StepIdBrand;
};
type ExtractSchemaFromStep<TStep extends StepAction<any, any, any, any>, TKey extends 'inputSchema' | 'outputSchema'> = TStep[TKey];
type ExtractStepResult<T> = T extends (data: any) => Promise<infer R> ? R : never;
type StepInputType<TStep extends StepAction<any, any, any, any>, TKey extends 'inputSchema' | 'outputSchema'> = ExtractSchemaFromStep<TStep, TKey> extends infer Schema ? Schema extends z.ZodType<any> ? z.infer<Schema> : never : never;
type ExtractSchemaType<T extends z.ZodSchema> = T extends z.ZodSchema<infer V> ? V : never;
type PathsToStringProps<T> = T extends object ? {
    [K in keyof T]: T[K] extends object ? K extends string ? K | `${K}.${PathsToStringProps<T[K]>}` : never : K extends string ? K : never;
}[keyof T] : never;
interface WorkflowRunState {
    value: Record<string, string>;
    context: {
        steps: Record<string, {
            status: 'success' | 'failed' | 'suspended' | 'waiting' | 'skipped';
            payload?: any;
            error?: string;
        }>;
        triggerData: Record<string, any>;
        attempts: Record<string, number>;
    };
    activePaths: Array<{
        stepPath: string[];
        stepId: string;
        status: string;
    }>;
    runId: string;
    timestamp: number;
    childStates?: Record<string, WorkflowRunState>;
    suspendedSteps?: Record<string, string>;
}
type WorkflowResumeResult<TTriggerSchema extends z.ZodObject<any>> = {
    triggerData?: z.infer<TTriggerSchema>;
    results: Record<string, StepResult<any>>;
};

declare class Step<TStepId extends string = any, TSchemaIn extends z.ZodSchema | undefined = undefined, TSchemaOut extends z.ZodSchema | undefined = undefined, TContext extends StepExecutionContext<TSchemaIn> = StepExecutionContext<TSchemaIn>> implements StepAction<TStepId, TSchemaIn, TSchemaOut, TContext> {
    id: TStepId;
    description?: string;
    inputSchema?: TSchemaIn;
    outputSchema?: TSchemaOut;
    payload?: TSchemaIn extends z.ZodSchema ? Partial<z.infer<TSchemaIn>> : unknown;
    execute: (context: TContext) => Promise<TSchemaOut extends z.ZodSchema ? z.infer<TSchemaOut> : unknown>;
    retryConfig?: RetryConfig;
    mastra?: Mastra;
    constructor({ id, description, execute, payload, outputSchema, inputSchema, retryConfig, }: StepAction<TStepId, TSchemaIn, TSchemaOut, TContext>);
}
declare function createStep<TId extends string, TSchemaIn extends z.ZodSchema | undefined, TSchemaOut extends z.ZodSchema | undefined, TContext extends StepExecutionContext<TSchemaIn>>(opts: StepAction<TId, TSchemaIn, TSchemaOut, TContext>): Step<TId, TSchemaIn, TSchemaOut, TContext>;

declare class Machine<TSteps extends Step<any, any, any>[] = any, TTriggerSchema extends z.ZodObject<any> = any, TResultSchema extends z.ZodObject<any> = any> extends EventEmitter {
    #private;
    logger: Logger;
    name: string;
    constructor({ logger, mastra, workflowInstance, executionSpan, name, runId, steps, stepGraph, retryConfig, startStepId, }: {
        logger: Logger;
        mastra?: Mastra;
        workflowInstance: WorkflowInstance;
        executionSpan?: Span;
        name: string;
        runId: string;
        steps: Record<string, TSteps[0]>;
        stepGraph: StepGraph;
        retryConfig?: RetryConfig;
        startStepId: string;
    });
    get startStepId(): string;
    execute({ stepId, input, snapshot, resumeData, }?: {
        stepId?: string;
        input?: any;
        snapshot?: Snapshot<any>;
        resumeData?: any;
    }): Promise<Pick<WorkflowRunResult<TTriggerSchema, TSteps, TResultSchema>, 'results' | 'activePaths'>>;
    private initializeMachine;
    getSnapshot(): xstate.MachineSnapshot<Omit<WorkflowContext<any, Step<string, any, any, any>[], Record<string, any>>, "getStepResult">, {
        type: "RESET_TO_PENDING";
        stepId: string;
    } | {
        type: "CONDITIONS_MET";
        stepId: string;
    } | {
        type: "CONDITION_FAILED";
        stepId: string;
        error: string;
    } | {
        type: "SUSPENDED";
        stepId: string;
        suspendPayload?: any;
        softSuspend?: any;
    } | {
        type: "WAITING";
        stepId: string;
    } | {
        type: `xstate.error.actor.${string}`;
        error: Error;
    } | {
        type: `xstate.done.actor.${string}`;
        output: ResolverFunctionOutput;
    }, {
        [x: string]: xstate.ActorRefFromLogic<xstate.PromiseActorLogic<{
            type: "CONDITIONS_MET";
            error?: undefined;
        } | {
            type: "CONDITIONS_SKIP_TO_COMPLETED";
            error?: undefined;
        } | {
            type: "CONDITIONS_LIMBO";
            error?: undefined;
        } | {
            type: "CONDITIONS_SKIPPED";
            error?: undefined;
        } | {
            type: "CONDITION_FAILED";
            error: string;
        }, {
            context: WorkflowContext;
            stepNode: StepNode;
        }, xstate.EventObject>> | xstate.ActorRefFromLogic<xstate.PromiseActorLogic<{
            type: "STEP_FAILED";
            error: string;
            stepId: any;
            result?: undefined;
        } | {
            type: "STEP_WAITING";
            stepId: any;
            error?: undefined;
            result?: undefined;
        } | {
            type: "STEP_SUCCESS";
            result: any;
            stepId: any;
            error?: undefined;
        }, ResolverFunctionInput, xstate.EventObject>> | xstate.ActorRefFromLogic<xstate.PromiseActorLogic<{
            steps: {};
        }, {
            parentStepId: string;
            context: WorkflowContext;
        }, xstate.EventObject>> | undefined;
    }, {
        [x: string]: {} | {
            [x: string]: {} | /*elided*/ any | {
                [x: string]: {} | /*elided*/ any | /*elided*/ any;
            };
        } | {
            [x: string]: {} | {
                [x: string]: {} | /*elided*/ any | /*elided*/ any;
            } | /*elided*/ any;
        };
    }, string, xstate.NonReducibleUnknown, xstate.MetaObject, {
        readonly id: string;
        readonly type: "parallel";
        readonly context: ({ input }: {
            spawn: {
                <TSrc extends "conditionCheck" | "resolverFunction" | "spawnSubscriberFunction">(logic: TSrc, ...[options]: ({
                    src: "conditionCheck";
                    logic: xstate.PromiseActorLogic<{
                        type: "CONDITIONS_MET";
                        error?: undefined;
                    } | {
                        type: "CONDITIONS_SKIP_TO_COMPLETED";
                        error?: undefined;
                    } | {
                        type: "CONDITIONS_LIMBO";
                        error?: undefined;
                    } | {
                        type: "CONDITIONS_SKIPPED";
                        error?: undefined;
                    } | {
                        type: "CONDITION_FAILED";
                        error: string;
                    }, {
                        context: WorkflowContext;
                        stepNode: StepNode;
                    }, xstate.EventObject>;
                    id: string | undefined;
                } extends infer T ? T extends {
                    src: "conditionCheck";
                    logic: xstate.PromiseActorLogic<{
                        type: "CONDITIONS_MET";
                        error?: undefined;
                    } | {
                        type: "CONDITIONS_SKIP_TO_COMPLETED";
                        error?: undefined;
                    } | {
                        type: "CONDITIONS_LIMBO";
                        error?: undefined;
                    } | {
                        type: "CONDITIONS_SKIPPED";
                        error?: undefined;
                    } | {
                        type: "CONDITION_FAILED";
                        error: string;
                    }, {
                        context: WorkflowContext;
                        stepNode: StepNode;
                    }, xstate.EventObject>;
                    id: string | undefined;
                } ? T extends {
                    src: TSrc;
                } ? xstate.ConditionalRequired<[options?: ({
                    id?: T["id"] | undefined;
                    systemId?: string;
                    input?: xstate.InputFrom<T["logic"]> | undefined;
                    syncSnapshot?: boolean;
                } & { [K in xstate.RequiredActorOptions<T>]: unknown; }) | undefined], xstate.IsNotNever<xstate.RequiredActorOptions<T>>> : never : never : never) | ({
                    src: "resolverFunction";
                    logic: xstate.PromiseActorLogic<{
                        type: "STEP_FAILED";
                        error: string;
                        stepId: any;
                        result?: undefined;
                    } | {
                        type: "STEP_WAITING";
                        stepId: any;
                        error?: undefined;
                        result?: undefined;
                    } | {
                        type: "STEP_SUCCESS";
                        result: any;
                        stepId: any;
                        error?: undefined;
                    }, ResolverFunctionInput, xstate.EventObject>;
                    id: string | undefined;
                } extends infer T_1 ? T_1 extends {
                    src: "resolverFunction";
                    logic: xstate.PromiseActorLogic<{
                        type: "STEP_FAILED";
                        error: string;
                        stepId: any;
                        result?: undefined;
                    } | {
                        type: "STEP_WAITING";
                        stepId: any;
                        error?: undefined;
                        result?: undefined;
                    } | {
                        type: "STEP_SUCCESS";
                        result: any;
                        stepId: any;
                        error?: undefined;
                    }, ResolverFunctionInput, xstate.EventObject>;
                    id: string | undefined;
                } ? T_1 extends {
                    src: TSrc;
                } ? xstate.ConditionalRequired<[options?: ({
                    id?: T_1["id"] | undefined;
                    systemId?: string;
                    input?: xstate.InputFrom<T_1["logic"]> | undefined;
                    syncSnapshot?: boolean;
                } & { [K_1 in xstate.RequiredActorOptions<T_1>]: unknown; }) | undefined], xstate.IsNotNever<xstate.RequiredActorOptions<T_1>>> : never : never : never) | ({
                    src: "spawnSubscriberFunction";
                    logic: xstate.PromiseActorLogic<{
                        steps: {};
                    }, {
                        parentStepId: string;
                        context: WorkflowContext;
                    }, xstate.EventObject>;
                    id: string | undefined;
                } extends infer T_2 ? T_2 extends {
                    src: "spawnSubscriberFunction";
                    logic: xstate.PromiseActorLogic<{
                        steps: {};
                    }, {
                        parentStepId: string;
                        context: WorkflowContext;
                    }, xstate.EventObject>;
                    id: string | undefined;
                } ? T_2 extends {
                    src: TSrc;
                } ? xstate.ConditionalRequired<[options?: ({
                    id?: T_2["id"] | undefined;
                    systemId?: string;
                    input?: xstate.InputFrom<T_2["logic"]> | undefined;
                    syncSnapshot?: boolean;
                } & { [K_2 in xstate.RequiredActorOptions<T_2>]: unknown; }) | undefined], xstate.IsNotNever<xstate.RequiredActorOptions<T_2>>> : never : never : never)): xstate.ActorRefFromLogic<xstate.GetConcreteByKey<xstate.Values<{
                    conditionCheck: {
                        src: "conditionCheck";
                        logic: xstate.PromiseActorLogic<{
                            type: "CONDITIONS_MET";
                            error?: undefined;
                        } | {
                            type: "CONDITIONS_SKIP_TO_COMPLETED";
                            error?: undefined;
                        } | {
                            type: "CONDITIONS_LIMBO";
                            error?: undefined;
                        } | {
                            type: "CONDITIONS_SKIPPED";
                            error?: undefined;
                        } | {
                            type: "CONDITION_FAILED";
                            error: string;
                        }, {
                            context: WorkflowContext;
                            stepNode: StepNode;
                        }, xstate.EventObject>;
                        id: string | undefined;
                    };
                    resolverFunction: {
                        src: "resolverFunction";
                        logic: xstate.PromiseActorLogic<{
                            type: "STEP_FAILED";
                            error: string;
                            stepId: any;
                            result?: undefined;
                        } | {
                            type: "STEP_WAITING";
                            stepId: any;
                            error?: undefined;
                            result?: undefined;
                        } | {
                            type: "STEP_SUCCESS";
                            result: any;
                            stepId: any;
                            error?: undefined;
                        }, ResolverFunctionInput, xstate.EventObject>;
                        id: string | undefined;
                    };
                    spawnSubscriberFunction: {
                        src: "spawnSubscriberFunction";
                        logic: xstate.PromiseActorLogic<{
                            steps: {};
                        }, {
                            parentStepId: string;
                            context: WorkflowContext;
                        }, xstate.EventObject>;
                        id: string | undefined;
                    };
                }>, "src", TSrc>["logic"]>;
                <TLogic extends xstate.AnyActorLogic>(src: TLogic, ...[options]: xstate.ConditionalRequired<[options?: ({
                    id?: never;
                    systemId?: string;
                    input?: xstate.InputFrom<TLogic> | undefined;
                    syncSnapshot?: boolean;
                } & { [K in xstate.RequiredLogicInput<TLogic>]: unknown; }) | undefined], xstate.IsNotNever<xstate.RequiredLogicInput<TLogic>>>): xstate.ActorRefFromLogic<TLogic>;
            };
            input: Omit<WorkflowContext<any, Step<string, any, any, any>[], Record<string, any>>, "getStepResult">;
            self: xstate.ActorRef<xstate.MachineSnapshot<Omit<WorkflowContext<any, Step<string, any, any, any>[], Record<string, any>>, "getStepResult">, {
                type: "RESET_TO_PENDING";
                stepId: string;
            } | {
                type: "CONDITIONS_MET";
                stepId: string;
            } | {
                type: "CONDITION_FAILED";
                stepId: string;
                error: string;
            } | {
                type: "SUSPENDED";
                stepId: string;
                suspendPayload?: any;
                softSuspend?: any;
            } | {
                type: "WAITING";
                stepId: string;
            } | {
                type: `xstate.error.actor.${string}`;
                error: Error;
            } | {
                type: `xstate.done.actor.${string}`;
                output: ResolverFunctionOutput;
            }, Record<string, xstate.AnyActorRef | undefined>, xstate.StateValue, string, unknown, any, any>, {
                type: "RESET_TO_PENDING";
                stepId: string;
            } | {
                type: "CONDITIONS_MET";
                stepId: string;
            } | {
                type: "CONDITION_FAILED";
                stepId: string;
                error: string;
            } | {
                type: "SUSPENDED";
                stepId: string;
                suspendPayload?: any;
                softSuspend?: any;
            } | {
                type: "WAITING";
                stepId: string;
            } | {
                type: `xstate.error.actor.${string}`;
                error: Error;
            } | {
                type: `xstate.done.actor.${string}`;
                output: ResolverFunctionOutput;
            }, xstate.AnyEventObject>;
        }) => {
            mastra?: MastraUnion | undefined;
            isResume?: {
                runId: string;
                stepId: string;
            } | undefined;
            steps: {
                [x: string]: {
                    status: "failed";
                    error: string;
                } | {
                    status: "waiting";
                } | {
                    status: "skipped";
                } | {
                    status: "success";
                    output: unknown;
                } | {
                    status: "suspended";
                    suspendPayload?: any;
                    output?: unknown;
                } | {
                    status: "success";
                    output: any;
                } | {
                    status: "suspended";
                    suspendPayload?: any;
                    output?: any;
                };
            };
            triggerData: any;
            inputData: Record<string, any>;
            attempts: Record<string, number>;
        };
        readonly states: any;
    }> | undefined;
}

interface WorkflowResultReturn<TResult extends z.ZodObject<any>, T extends z.ZodObject<any>, TSteps extends Step<any, any, any>[]> {
    runId: string;
    start: (props?: {
        triggerData?: z.infer<T>;
    } | undefined) => Promise<WorkflowRunResult<T, TSteps, TResult>>;
    watch: (onTransition: (state: WorkflowRunState) => void) => () => void;
    resume: (props: {
        stepId: string;
        context?: Record<string, any>;
    }) => Promise<Omit<WorkflowRunResult<T, TSteps, TResult>, 'runId'> | undefined>;
    resumeWithEvent: (eventName: string, data: any) => Promise<Omit<WorkflowRunResult<T, TSteps, TResult>, 'runId'> | undefined>;
}
declare class WorkflowInstance<TSteps extends Step<any, any, any>[] = any, TTriggerSchema extends z.ZodObject<any> = any, TResult extends z.ZodObject<any> = any> implements WorkflowResultReturn<TResult, TTriggerSchema, TSteps> {
    #private;
    name: string;
    logger: Logger;
    events?: Record<string, {
        schema: z.ZodObject<any>;
    }>;
    constructor({ name, logger, steps, runId, retryConfig, mastra, stepGraph, stepSubscriberGraph, onFinish, onStepTransition, resultMapping, events, }: {
        name: string;
        logger: Logger;
        steps: Record<string, StepAction<any, any, any, any>>;
        mastra?: Mastra;
        retryConfig?: RetryConfig;
        runId?: string;
        stepGraph: StepGraph;
        stepSubscriberGraph: Record<string, StepGraph>;
        onFinish?: () => void;
        onStepTransition?: Set<(state: WorkflowRunState) => void | Promise<void>>;
        resultMapping?: Record<string, {
            step: StepAction<any, any, any, any>;
            path: string;
        }>;
        events?: Record<string, {
            schema: z.ZodObject<any>;
        }>;
    });
    setState(state: any): void;
    get runId(): string;
    get executionSpan(): Span | undefined;
    watch(onTransition: (state: WorkflowRunState) => void): () => void;
    start({ triggerData }?: {
        triggerData?: z.infer<TTriggerSchema>;
    }): Promise<{
        runId: string;
        result?: z.TypeOf<TResult> | undefined;
        results: { [K in keyof StepsRecord<TSteps>]: StepsRecord<TSteps>[K]["outputSchema"] extends undefined ? StepResult<unknown> : StepResult<z.TypeOf<NonNullable<StepsRecord<TSteps>[K]["outputSchema"]>>>; };
        triggerData?: z.TypeOf<TTriggerSchema> | undefined;
        activePaths: Map<TSteps[number]["id"], {
            status: string;
            suspendPayload?: any;
        }>;
    }>;
    private isCompoundDependencyMet;
    execute({ triggerData, snapshot, stepId, resumeData, }?: {
        stepId?: string;
        triggerData?: z.infer<TTriggerSchema>;
        snapshot?: Snapshot<any>;
        resumeData?: any;
    }): Promise<Omit<WorkflowRunResult<TTriggerSchema, TSteps, TResult>, 'runId'>>;
    hasSubscribers(stepId: string): boolean;
    runMachine(parentStepId: string, input: any): Promise<(Pick<WorkflowRunResult<any, any, any>, "results" | "activePaths"> | undefined)[]>;
    suspend(stepId: string, machine: Machine<TSteps, TTriggerSchema>): Promise<void>;
    /**
     * Persists the workflow state to the database
     */
    persistWorkflowSnapshot(): Promise<void>;
    getState(): Promise<WorkflowRunState | null>;
    resumeWithEvent(eventName: string, data: any): Promise<Omit<WorkflowRunResult<TTriggerSchema, TSteps, TResult>, "runId"> | undefined>;
    resume({ stepId, context: resumeContext }: {
        stepId: string;
        context?: Record<string, any>;
    }): Promise<Omit<WorkflowRunResult<TTriggerSchema, TSteps, TResult>, "runId"> | undefined>;
    _resume({ stepId, context: resumeContext }: {
        stepId: string;
        context?: Record<string, any>;
    }): Promise<Omit<WorkflowRunResult<TTriggerSchema, TSteps, TResult>, "runId"> | undefined>;
}

declare class Workflow<TSteps extends Step<string, any, any>[] = Step<string, any, any>[], TStepId extends string = string, TTriggerSchema extends z.ZodObject<any> = any, TResultSchema extends z.ZodObject<any> = any> extends MastraBase {
    #private;
    name: TStepId;
    triggerSchema?: TTriggerSchema;
    resultSchema?: TResultSchema;
    resultMapping?: Record<string, {
        step: StepAction<string, any, any, any>;
        path: string;
    }>;
    events?: Record<string, {
        schema: z.ZodObject<any>;
    }>;
    /**
     * Creates a new Workflow instance
     * @param name - Identifier for the workflow (not necessarily unique)
     * @param logger - Optional logger instance
     */
    constructor({ name, triggerSchema, result, retryConfig, mastra, events, }: WorkflowOptions<TStepId, TSteps, TTriggerSchema, TResultSchema>);
    step<TWorkflow extends Workflow<any, any, any, any>, CondStep extends StepVariableType<any, any, any, any>, VarStep extends StepVariableType<any, any, any, any>, Steps extends StepAction<any, any, any, any>[] = TSteps>(next: TWorkflow, config?: StepConfig<ReturnType<TWorkflow['toStep']>, CondStep, VarStep, TTriggerSchema, Steps>): this;
    step<TStep extends StepAction<any, any, any, any>, CondStep extends StepVariableType<any, any, any, any>, VarStep extends StepVariableType<any, any, any, any>, Steps extends StepAction<any, any, any, any>[] = TSteps>(step: TStep, config?: StepConfig<TStep, CondStep, VarStep, TTriggerSchema, Steps>): this;
    then<TStep extends StepAction<string, any, any, any>, CondStep extends StepVariableType<any, any, any, any>, VarStep extends StepVariableType<any, any, any, any>>(next: TStep | TStep[], config?: StepConfig<TStep, CondStep, VarStep, TTriggerSchema>): this;
    then<TWorkflow extends Workflow<any, any, any, any>, CondStep extends StepVariableType<any, any, any, any>, VarStep extends StepVariableType<any, any, any, any>>(next: TWorkflow | TWorkflow[], config?: StepConfig<StepAction<string, any, any, any>, CondStep, VarStep, TTriggerSchema>): this;
    private loop;
    while<FallbackStep extends StepAction<string, any, any, any>, CondStep extends StepVariableType<any, any, any, any>, VarStep extends StepVariableType<any, any, any, any>>(condition: StepConfig<FallbackStep, CondStep, VarStep, TTriggerSchema>['when'], fallbackStep: FallbackStep): this;
    until<FallbackStep extends StepAction<string, any, any, any>, CondStep extends StepVariableType<any, any, any, any>, VarStep extends StepVariableType<any, any, any, any>>(condition: StepConfig<FallbackStep, CondStep, VarStep, TTriggerSchema, TSteps>['when'], fallbackStep: FallbackStep): this;
    if<TStep extends StepAction<string, any, any, any>>(condition: StepConfig<TStep, any, any, TTriggerSchema>['when'], ifStep?: TStep | Workflow, elseStep?: TStep | Workflow): this;
    else(): this;
    after<TStep extends StepAction<string, any, any, any>>(steps: TStep | TStep[]): Omit<typeof this, 'then' | 'after'>;
    after<TWorkflow extends Workflow<any, any, any, any>>(steps: TWorkflow | TWorkflow[]): Omit<typeof this, 'then' | 'after'>;
    afterEvent(eventName: string): this;
    /**
     * Executes the workflow with the given trigger data
     * @param triggerData - Initial data to start the workflow with
     * @returns Promise resolving to workflow results or rejecting with error
     * @throws Error if trigger schema validation fails
     */
    createRun({ runId, events, }?: {
        runId?: string;
        events?: Record<string, {
            schema: z.ZodObject<any>;
        }>;
    }): WorkflowResultReturn<TResultSchema, TTriggerSchema, TSteps>;
    /**
     * Gets a workflow run instance by ID
     * @param runId - ID of the run to retrieve
     * @returns The workflow run instance if found, undefined otherwise
     */
    getRun(runId: string): WorkflowInstance<TSteps, TTriggerSchema, any> | undefined;
    /**
     * Rebuilds the machine with the current steps configuration and validates the workflow
     *
     * This is the last step of a workflow builder method chain
     * @throws Error if validation fails
     *
     * @returns this instance for method chaining
     */
    commit(): this;
    getExecutionSpan(runId: string): Span | undefined;
    getState(runId: string): Promise<WorkflowRunState | null>;
    resume({ runId, stepId, context: resumeContext, }: {
        runId: string;
        stepId: string;
        context?: Record<string, any>;
    }): Promise<Omit<WorkflowRunResult<TTriggerSchema, TSteps, any>, "runId"> | undefined>;
    watch(onTransition: (state: WorkflowRunState) => void): () => void;
    resumeWithEvent(runId: string, eventName: string, data: any): Promise<Omit<WorkflowRunResult<TTriggerSchema, TSteps, any>, "runId"> | undefined>;
    __registerMastra(mastra: Mastra): void;
    __registerPrimitives(p: MastraPrimitives): void;
    get stepGraph(): StepGraph;
    get stepSubscriberGraph(): Record<string, StepGraph>;
    get serializedStepGraph(): StepGraph;
    get serializedStepSubscriberGraph(): Record<string, StepGraph>;
    get steps(): Record<string, StepAction<string, any, any, any>>;
    setNested(isNested: boolean): void;
    get isNested(): boolean;
    toStep(): Step<TStepId, TTriggerSchema, z.ZodType<WorkflowRunResult<TTriggerSchema, TSteps, TResultSchema>>, any>;
}

type AgentNetworkConfig = {
    name: string;
    agents: Agent[];
    model: LanguageModelV1;
    instructions: string;
};

declare class AgentNetwork extends MastraBase {
    #private;
    constructor(config: AgentNetworkConfig);
    formatAgentId(name: string): string;
    getTools(): {
        transmit: Tool<z.ZodObject<{
            actions: z.ZodArray<z.ZodObject<{
                agent: z.ZodString;
                input: z.ZodString;
                includeHistory: z.ZodOptional<z.ZodBoolean>;
            }, "strip", z.ZodTypeAny, {
                input: string;
                agent: string;
                includeHistory?: boolean | undefined;
            }, {
                input: string;
                agent: string;
                includeHistory?: boolean | undefined;
            }>, "many">;
        }, "strip", z.ZodTypeAny, {
            actions: {
                input: string;
                agent: string;
                includeHistory?: boolean | undefined;
            }[];
        }, {
            actions: {
                input: string;
                agent: string;
                includeHistory?: boolean | undefined;
            }[];
        }>, undefined, ToolExecutionContext<z.ZodObject<{
            actions: z.ZodArray<z.ZodObject<{
                agent: z.ZodString;
                input: z.ZodString;
                includeHistory: z.ZodOptional<z.ZodBoolean>;
            }, "strip", z.ZodTypeAny, {
                input: string;
                agent: string;
                includeHistory?: boolean | undefined;
            }, {
                input: string;
                agent: string;
                includeHistory?: boolean | undefined;
            }>, "many">;
        }, "strip", z.ZodTypeAny, {
            actions: {
                input: string;
                agent: string;
                includeHistory?: boolean | undefined;
            }[];
        }, {
            actions: {
                input: string;
                agent: string;
                includeHistory?: boolean | undefined;
            }[];
        }>>>;
    };
    getAgentHistory(agentId: string): {
        input: string;
        output: string;
        timestamp: string;
    }[];
    /**
     * Get the history of all agent interactions that have occurred in this network
     * @returns A record of agent interactions, keyed by agent ID
     */
    getAgentInteractionHistory(): {
        [x: string]: {
            input: string;
            output: string;
            timestamp: string;
        }[];
    };
    /**
     * Get a summary of agent interactions in a more readable format, displayed chronologically
     * @returns A formatted string with all agent interactions in chronological order
     */
    getAgentInteractionSummary(): string;
    executeAgent(agentId: string, input: CoreMessage$1[], includeHistory?: boolean): Promise<string>;
    getInstructions(): string;
    getRoutingAgent(): Agent<ToolsInput, Record<string, Metric>>;
    getAgents(): Agent<ToolsInput, Record<string, Metric>>[];
    generate<Z extends ZodSchema | JSONSchema7 | undefined = undefined>(messages: string | string[] | CoreMessage$1[], args?: AgentGenerateOptions<Z> & {
        output?: never;
        experimental_output?: never;
    }): Promise<GenerateTextResult<any, Z extends ZodSchema ? z.infer<Z> : unknown>>;
    generate<Z extends ZodSchema | JSONSchema7 | undefined = undefined>(messages: string | string[] | CoreMessage$1[], args?: AgentGenerateOptions<Z> & ({
        output: Z;
        experimental_output?: never;
    } | {
        experimental_output: Z;
        output?: never;
    })): Promise<GenerateObjectResult<Z extends ZodSchema ? z.infer<Z> : unknown>>;
    stream<Z extends ZodSchema | JSONSchema7 | undefined = undefined>(messages: string | string[] | CoreMessage$1[], args?: AgentStreamOptions<Z> & {
        output?: never;
        experimental_output?: never;
    }): Promise<StreamTextResult<any, Z extends ZodSchema ? z.infer<Z> : unknown>>;
    stream<Z extends ZodSchema | JSONSchema7 | undefined = undefined>(messages: string | string[] | CoreMessage$1[], args?: AgentStreamOptions<Z> & ({
        output: Z;
        experimental_output?: never;
    } | {
        experimental_output: Z;
        output?: never;
    })): Promise<StreamObjectResult<any, Z extends ZodSchema ? z.infer<Z> : unknown, any>>;
    __registerMastra(p: Mastra): void;
}

interface Config<TAgents extends Record<string, Agent<any>> = Record<string, Agent<any>>, TWorkflows extends Record<string, Workflow> = Record<string, Workflow>, TVectors extends Record<string, MastraVector> = Record<string, MastraVector>, TTTS extends Record<string, MastraTTS> = Record<string, MastraTTS>, TLogger extends Logger = Logger, TNetworks extends Record<string, AgentNetwork> = Record<string, AgentNetwork>> {
    agents?: TAgents;
    networks?: TNetworks;
    storage?: MastraStorage;
    vectors?: TVectors;
    logger?: TLogger | false;
    workflows?: TWorkflows;
    tts?: TTTS;
    telemetry?: OtelConfig;
    deployer?: MastraDeployer;
    /**
     * Server middleware functions to be applied to API routes
     * Each middleware can specify a path pattern (defaults to '/api/*')
     */
    serverMiddleware?: Array<{
        handler: (c: any, next: () => Promise<void>) => Promise<Response | void>;
        path?: string;
    }>;
    memory?: MastraMemory;
}
declare class Mastra<TAgents extends Record<string, Agent<any>> = Record<string, Agent<any>>, TWorkflows extends Record<string, Workflow> = Record<string, Workflow>, TVectors extends Record<string, MastraVector> = Record<string, MastraVector>, TTTS extends Record<string, MastraTTS> = Record<string, MastraTTS>, TLogger extends Logger = Logger, TNetworks extends Record<string, AgentNetwork> = Record<string, AgentNetwork>> {
    #private;
    /**
     * @deprecated use getTelemetry() instead
     */
    get telemetry(): Telemetry | undefined;
    /**
     * @deprecated use getStorage() instead
     */
    get storage(): MastraStorage | undefined;
    /**
     * @deprecated use getMemory() instead
     */
    get memory(): MastraMemory | undefined;
    constructor(config?: Config<TAgents, TWorkflows, TVectors, TTTS, TLogger>);
    getAgent<TAgentName extends keyof TAgents>(name: TAgentName): TAgents[TAgentName];
    getAgents(): TAgents;
    getVector<TVectorName extends keyof TVectors>(name: TVectorName): TVectors[TVectorName];
    getVectors(): TVectors | undefined;
    getDeployer(): MastraDeployer | undefined;
    getWorkflow<TWorkflowId extends keyof TWorkflows>(id: TWorkflowId, { serialized }?: {
        serialized?: boolean;
    }): TWorkflows[TWorkflowId];
    getWorkflows(props?: {
        serialized?: boolean;
    }): Record<string, Workflow>;
    setStorage(storage: MastraStorage): void;
    setLogger({ logger }: {
        logger: TLogger;
    }): void;
    setTelemetry(telemetry: OtelConfig): void;
    getTTS(): TTTS | undefined;
    getLogger(): TLogger;
    getTelemetry(): Telemetry | undefined;
    getMemory(): MastraMemory | undefined;
    getStorage(): MastraStorage | undefined;
    getServerMiddleware(): {
        handler: (c: any, next: () => Promise<void>) => Promise<Response | void>;
        path: string;
    }[];
    getNetworks(): AgentNetwork[];
    /**
     * Get a specific network by ID
     * @param networkId - The ID of the network to retrieve
     * @returns The network with the specified ID, or undefined if not found
     */
    getNetwork(networkId: string): AgentNetwork | undefined;
    getLogsByRunId({ runId, transportId }: {
        runId: string;
        transportId: string;
    }): Promise<BaseLogMessage[] | undefined>;
    getLogs(transportId: string): Promise<BaseLogMessage[]>;
}

type MastraPrimitives = {
    logger?: Logger;
    telemetry?: Telemetry;
    storage?: MastraStorage;
    agents?: Record<string, Agent>;
    tts?: Record<string, MastraTTS>;
    vectors?: Record<string, MastraVector>;
    memory?: MastraMemory;
};
type MastraUnion = {
    [K in keyof Mastra]: Mastra[K];
} & MastraPrimitives;
interface IExecutionContext<TSchemaIn extends z.ZodSchema | undefined = undefined> {
    context: TSchemaIn extends z.ZodSchema ? z.infer<TSchemaIn> : {};
    runId?: string;
    threadId?: string;
    resourceId?: string;
}
interface IAction<TId extends string, TSchemaIn extends z.ZodSchema | undefined, TSchemaOut extends z.ZodSchema | undefined, TContext extends IExecutionContext<TSchemaIn>, TOptions extends unknown = unknown> {
    id: TId;
    description?: string;
    inputSchema?: TSchemaIn;
    outputSchema?: TSchemaOut;
    execute?: (context: TContext, options?: TOptions) => Promise<TSchemaOut extends z.ZodSchema ? z.infer<TSchemaOut> : unknown>;
}

declare class MastraLLMBase extends MastraBase {
    #private;
    constructor({ name, model }: {
        name: string;
        model: LanguageModel$1;
    });
    getProvider(): string;
    getModelId(): string;
    getModel(): ai.LanguageModelV1;
    convertToMessages(messages: string | string[] | CoreMessage$1[]): CoreMessage$1[];
    __registerPrimitives(p: MastraPrimitives): void;
    __registerMastra(p: Mastra): void;
    __text<Z extends ZodSchema | JSONSchema7 | undefined>(input: LLMTextOptions<Z>): Promise<GenerateTextResult<any, any>>;
    __textObject<T extends ZodSchema | JSONSchema7 | undefined>(input: LLMTextObjectOptions<T>): Promise<GenerateObjectResult<T>>;
    generate<Z extends ZodSchema | JSONSchema7 | undefined = undefined>(messages: string | string[] | CoreMessage$1[], options?: LLMStreamOptions<Z>): Promise<GenerateReturn<Z>>;
    __stream<Z extends ZodSchema | JSONSchema7 | undefined = undefined>(input: LLMInnerStreamOptions<Z>): Promise<StreamTextResult<any, any>>;
    __streamObject<T extends ZodSchema | JSONSchema7 | undefined>(input: LLMStreamObjectOptions<T>): Promise<StreamObjectResult<DeepPartial<T>, T, never>>;
    stream<Z extends ZodSchema | JSONSchema7 | undefined = undefined>(messages: string | string[] | CoreMessage$1[], options?: LLMStreamOptions<Z>): Promise<StreamReturn<Z>>;
}

declare class Agent<TTools extends ToolsInput = ToolsInput, TMetrics extends Record<string, Metric> = Record<string, Metric>> extends MastraBase {
    #private;
    name: string;
    readonly llm: MastraLLMBase;
    instructions: string;
    readonly model?: MastraLanguageModel;
    tools: TTools;
    /** @deprecated This property is deprecated. Use evals instead. */
    metrics: TMetrics;
    evals: TMetrics;
    voice?: CompositeVoice;
    constructor(config: AgentConfig<TTools, TMetrics>);
    hasOwnMemory(): boolean;
    getMemory(): MastraMemory | undefined;
    __updateInstructions(newInstructions: string): void;
    __registerPrimitives(p: MastraPrimitives): void;
    __registerMastra(mastra: Mastra): void;
    /**
     * Set the concrete tools for the agent
     * @param tools
     */
    __setTools(tools: TTools): void;
    generateTitleFromUserMessage({ message }: {
        message: CoreUserMessage$1;
    }): Promise<string>;
    getMostRecentUserMessage(messages: Array<CoreMessage$1>): CoreUserMessage$1 | undefined;
    genTitle(userMessage: CoreUserMessage$1 | undefined): Promise<string>;
    fetchMemory({ threadId, memoryConfig, resourceId, userMessages, runId, }: {
        resourceId: string;
        threadId: string;
        memoryConfig?: MemoryConfig;
        userMessages: CoreMessage$1[];
        time?: Date;
        keyword?: string;
        runId?: string;
    }): Promise<{
        threadId: string;
        messages: CoreMessage$1[];
    }>;
    saveResponse({ result, threadId, resourceId, runId, memoryConfig, }: {
        runId: string;
        resourceId: string;
        result: Record<string, any>;
        threadId: string;
        memoryConfig: MemoryConfig | undefined;
    }): Promise<void>;
    sanitizeResponseMessages(messages: Array<CoreMessage$1>): Array<CoreMessage$1>;
    convertTools({ toolsets, threadId, resourceId, runId, }: {
        toolsets?: ToolsetsInput;
        threadId?: string;
        resourceId?: string;
        runId?: string;
    }): Record<string, CoreTool>;
    preExecute({ resourceId, runId, threadId, memoryConfig, messages, }: {
        runId?: string;
        threadId: string;
        memoryConfig?: MemoryConfig;
        messages: CoreMessage$1[];
        resourceId: string;
    }): Promise<{
        coreMessages: CoreMessage$1[];
        threadIdToUse: string;
    }>;
    __primitive({ instructions, messages, context, threadId, memoryConfig, resourceId, runId, toolsets, }: {
        instructions?: string;
        toolsets?: ToolsetsInput;
        resourceId?: string;
        threadId?: string;
        memoryConfig?: MemoryConfig;
        context?: CoreMessage$1[];
        runId?: string;
        messages: CoreMessage$1[];
    }): {
        before: () => Promise<{
            messageObjects: CoreMessage$1[];
            convertedTools: Record<string, CoreTool> | undefined;
            threadId: string;
        }>;
        after: ({ result, threadId, memoryConfig, outputText, runId, }: {
            runId: string;
            result: Record<string, any>;
            threadId: string;
            memoryConfig: MemoryConfig | undefined;
            outputText: string;
        }) => Promise<void>;
    };
    generate<Z extends ZodSchema | JSONSchema7 | undefined = undefined>(messages: string | string[] | CoreMessage$1[] | Message[], args?: AgentGenerateOptions<Z> & {
        output?: never;
        experimental_output?: never;
    }): Promise<GenerateTextResult<any, Z extends ZodSchema ? z.infer<Z> : unknown>>;
    generate<Z extends ZodSchema | JSONSchema7 | undefined = undefined>(messages: string | string[] | CoreMessage$1[] | Message[], args?: AgentGenerateOptions<Z> & {
        output?: Z;
        experimental_output?: never;
    }): Promise<GenerateObjectResult<Z extends ZodSchema ? z.infer<Z> : unknown>>;
    generate<Z extends ZodSchema | JSONSchema7 | undefined = undefined>(messages: string | string[] | CoreMessage$1[] | Message[], args?: AgentGenerateOptions<Z> & {
        output?: never;
        experimental_output?: Z;
    }): Promise<GenerateTextResult<any, Z extends ZodSchema ? z.infer<Z> : unknown> & {
        object: Z extends ZodSchema ? z.infer<Z> : unknown;
    }>;
    stream<Z extends ZodSchema | JSONSchema7 | undefined = undefined>(messages: string | string[] | CoreMessage$1[] | Message[], args?: AgentStreamOptions<Z> & {
        output?: never;
        experimental_output?: never;
    }): Promise<StreamTextResult<any, Z extends ZodSchema ? z.infer<Z> : unknown>>;
    stream<Z extends ZodSchema | JSONSchema7 | undefined = undefined>(messages: string | string[] | CoreMessage$1[] | Message[], args?: AgentStreamOptions<Z> & {
        output?: Z;
        experimental_output?: never;
    }): Promise<StreamObjectResult<any, Z extends ZodSchema ? z.infer<Z> : unknown, any>>;
    stream<Z extends ZodSchema | JSONSchema7 | undefined = undefined>(messages: string | string[] | CoreMessage$1[] | Message[], args?: AgentStreamOptions<Z> & {
        output?: never;
        experimental_output?: Z;
    }): Promise<StreamTextResult<any, Z extends ZodSchema ? z.infer<Z> : unknown> & {
        partialObjectStream: StreamTextResult<any, Z extends ZodSchema ? z.infer<Z> : unknown>['experimental_partialOutputStream'];
    }>;
    /**
     * Convert text to speech using the configured voice provider
     * @param input Text or text stream to convert to speech
     * @param options Speech options including speaker and provider-specific options
     * @returns Audio stream
     * @deprecated Use agent.voice.speak() instead
     */
    speak(input: string | NodeJS.ReadableStream, options?: {
        speaker?: string;
        [key: string]: any;
    }): Promise<NodeJS.ReadableStream | void>;
    /**
     * Convert speech to text using the configured voice provider
     * @param audioStream Audio stream to transcribe
     * @param options Provider-specific transcription options
     * @returns Text or text stream
     * @deprecated Use agent.voice.listen() instead
     */
    listen(audioStream: NodeJS.ReadableStream, options?: {
        [key: string]: any;
    }): Promise<string | NodeJS.ReadableStream | void>;
    /**
     * Get a list of available speakers from the configured voice provider
     * @throws {Error} If no voice provider is configured
     * @returns {Promise<Array<{voiceId: string}>>} List of available speakers
     * @deprecated Use agent.voice.getSpeakers() instead
     */
    getSpeakers(): Promise<{
        voiceId: string;
    }[]>;
}

interface StorageColumn {
    type: 'text' | 'timestamp' | 'uuid' | 'jsonb' | 'integer' | 'bigint';
    primaryKey?: boolean;
    nullable?: boolean;
    references?: {
        table: string;
        column: string;
    };
}
interface WorkflowRow {
    workflow_name: string;
    run_id: string;
    snapshot: WorkflowRunState;
    created_at: Date;
    updated_at: Date;
}
type StorageGetMessagesArg = {
    threadId: string;
    resourceId?: string;
    selectBy?: {
        vectorSearchString?: string;
        last?: number | false;
        include?: {
            id: string;
            withPreviousMessages?: number;
            withNextMessages?: number;
        }[];
    };
    threadConfig?: MemoryConfig;
};
type EvalRow = {
    input: string;
    output: string;
    result: MetricResult;
    agentName: string;
    createdAt: string;
    metricName: string;
    instructions: string;
    runId: string;
    globalRunId: string;
    testInfo?: TestInfo;
};

declare const TABLE_WORKFLOW_SNAPSHOT = "mastra_workflow_snapshot";
declare const TABLE_EVALS = "mastra_evals";
declare const TABLE_MESSAGES = "mastra_messages";
declare const TABLE_THREADS = "mastra_threads";
declare const TABLE_TRACES = "mastra_traces";
type TABLE_NAMES = typeof TABLE_WORKFLOW_SNAPSHOT | typeof TABLE_EVALS | typeof TABLE_MESSAGES | typeof TABLE_THREADS | typeof TABLE_TRACES;

type MessageType = {
    id: string;
    content: UserContent | AssistantContent | ToolContent;
    role: 'system' | 'user' | 'assistant' | 'tool';
    createdAt: Date;
    threadId: string;
    toolCallIds?: string[];
    toolCallArgs?: Record<string, unknown>[];
    toolNames?: string[];
    type: 'text' | 'tool-call' | 'tool-result';
};
type StorageThreadType = {
    id: string;
    title?: string;
    resourceId: string;
    createdAt: Date;
    updatedAt: Date;
    metadata?: Record<string, unknown>;
};
type MessageResponse<T extends 'raw' | 'core_message'> = {
    raw: MessageType[];
    core_message: CoreMessage$1[];
}[T];
type MemoryConfig = {
    lastMessages?: number | false;
    semanticRecall?: boolean | {
        topK: number;
        messageRange: number | {
            before: number;
            after: number;
        };
    };
    workingMemory?: {
        enabled: boolean;
        template?: string;
        use?: 'text-stream' | 'tool-call';
    };
    threads?: {
        generateTitle?: boolean;
    };
};
type SharedMemoryConfig = {
    storage?: MastraStorage;
    options?: MemoryConfig;
    vector?: MastraVector;
    embedder?: EmbeddingModel<string>;
};

declare abstract class MastraStorage extends MastraBase {
    /** @deprecated import from { TABLE_WORKFLOW_SNAPSHOT } '@mastra/core/storage' instead */
    static readonly TABLE_WORKFLOW_SNAPSHOT = "mastra_workflow_snapshot";
    /** @deprecated import from { TABLE_EVALS } '@mastra/core/storage' instead */
    static readonly TABLE_EVALS = "mastra_evals";
    /** @deprecated import from { TABLE_MESSAGES } '@mastra/core/storage' instead */
    static readonly TABLE_MESSAGES = "mastra_messages";
    /** @deprecated import from { TABLE_THREADS } '@mastra/core/storage' instead */
    static readonly TABLE_THREADS = "mastra_threads";
    /** @deprecated import { TABLE_TRACES } from '@mastra/core/storage' instead */
    static readonly TABLE_TRACES = "mastra_traces";
    protected hasInitialized: null | Promise<boolean>;
    protected shouldCacheInit: boolean;
    constructor({ name }: {
        name: string;
    });
    abstract createTable({ tableName }: {
        tableName: TABLE_NAMES;
        schema: Record<string, StorageColumn>;
    }): Promise<void>;
    abstract clearTable({ tableName }: {
        tableName: TABLE_NAMES;
    }): Promise<void>;
    abstract insert({ tableName, record }: {
        tableName: TABLE_NAMES;
        record: Record<string, any>;
    }): Promise<void>;
    abstract batchInsert({ tableName, records, }: {
        tableName: TABLE_NAMES;
        records: Record<string, any>[];
    }): Promise<void>;
    __batchInsert({ tableName, records, }: {
        tableName: TABLE_NAMES;
        records: Record<string, any>[];
    }): Promise<void>;
    abstract load<R>({ tableName, keys }: {
        tableName: TABLE_NAMES;
        keys: Record<string, string>;
    }): Promise<R | null>;
    abstract getThreadById({ threadId }: {
        threadId: string;
    }): Promise<StorageThreadType | null>;
    __getThreadById({ threadId }: {
        threadId: string;
    }): Promise<StorageThreadType | null>;
    abstract getThreadsByResourceId({ resourceId }: {
        resourceId: string;
    }): Promise<StorageThreadType[]>;
    __getThreadsByResourceId({ resourceId }: {
        resourceId: string;
    }): Promise<StorageThreadType[]>;
    abstract saveThread({ thread }: {
        thread: StorageThreadType;
    }): Promise<StorageThreadType>;
    __saveThread({ thread }: {
        thread: StorageThreadType;
    }): Promise<StorageThreadType>;
    abstract updateThread({ id, title, metadata, }: {
        id: string;
        title: string;
        metadata: Record<string, unknown>;
    }): Promise<StorageThreadType>;
    __updateThread({ id, title, metadata, }: {
        id: string;
        title: string;
        metadata: Record<string, unknown>;
    }): Promise<StorageThreadType>;
    abstract deleteThread({ threadId }: {
        threadId: string;
    }): Promise<void>;
    __deleteThread({ threadId }: {
        threadId: string;
    }): Promise<void>;
    abstract getMessages({ threadId, selectBy, threadConfig }: StorageGetMessagesArg): Promise<MessageType[]>;
    __getMessages({ threadId, selectBy, threadConfig }: StorageGetMessagesArg): Promise<MessageType[]>;
    abstract saveMessages({ messages }: {
        messages: MessageType[];
    }): Promise<MessageType[]>;
    __saveMessages({ messages }: {
        messages: MessageType[];
    }): Promise<MessageType[]>;
    abstract getTraces({ name, scope, page, perPage, attributes, }: {
        name?: string;
        scope?: string;
        page: number;
        perPage: number;
        attributes?: Record<string, string>;
    }): Promise<any[]>;
    __getTraces({ scope, page, perPage, attributes, }: {
        scope?: string;
        page: number;
        perPage: number;
        attributes?: Record<string, string>;
    }): Promise<any[]>;
    init(): Promise<void>;
    persistWorkflowSnapshot({ workflowName, runId, snapshot, }: {
        workflowName: string;
        runId: string;
        snapshot: WorkflowRunState;
    }): Promise<void>;
    loadWorkflowSnapshot({ workflowName, runId, }: {
        workflowName: string;
        runId: string;
    }): Promise<WorkflowRunState | null>;
    abstract getEvalsByAgentName(agentName: string, type?: 'test' | 'live'): Promise<EvalRow[]>;
    __getEvalsByAgentName(agentName: string, type?: 'test' | 'live'): Promise<EvalRow[]>;
}

export { createTool as $, Agent as A, type BaseStructuredOutputType as B, type CoreTool as C, type StructuredOutput as D, type EvalRow as E, type StreamReturn as F, type GenerateReturn as G, type DefaultLLMTextOptions as H, type DefaultLLMTextObjectOptions as I, type DefaultLLMStreamOptions as J, type DefaultLLMStreamObjectOptions as K, type LanguageModel as L, Mastra as M, type LLMTextOptions as N, type OutputType as O, type LLMTextObjectOptions as P, type LLMStreamOptions as Q, type LLMInnerStreamOptions as R, Step as S, type ToolAction as T, type LLMStreamObjectOptions as U, type VercelTool as V, Workflow as W, type Config as X, type MessageResponse as Y, type MemoryConfig as Z, type SharedMemoryConfig as _, type ToolsInput as a, type StepAction as a0, type StepVariableType as a1, type StepNode as a2, type StepGraph as a3, type RetryConfig as a4, type VariableReference as a5, type BaseCondition as a6, type ActionContext as a7, WhenConditionReturnValue as a8, type StepDef as a9, type VoiceEventType as aA, type VoiceEventMap as aB, type VoiceConfig as aC, MastraVoice as aD, CompositeVoice as aE, type AgentNetworkConfig as aF, type ToolsetsInput as aG, type AgentGenerateOptions as aH, type AgentStreamOptions as aI, TABLE_WORKFLOW_SNAPSHOT as aJ, TABLE_EVALS as aK, TABLE_MESSAGES as aL, TABLE_THREADS as aM, TABLE_TRACES as aN, type StepCondition as aa, type StepConfig as ab, type StepResult as ac, type StepsRecord as ad, type WorkflowRunResult as ae, type WorkflowLogMessage as af, type WorkflowEvent as ag, type ResolverFunctionInput as ah, type ResolverFunctionOutput as ai, type SubscriberFunctionOutput as aj, type DependencyCheckOutput as ak, type StepResolverOutput as al, type WorkflowActors as am, type WorkflowActionParams as an, type WorkflowActions as ao, type WorkflowState as ap, type StepId as aq, type ExtractSchemaFromStep as ar, type ExtractStepResult as as, type StepInputType as at, type ExtractSchemaType as au, type PathsToStringProps as av, type WorkflowRunState as aw, type WorkflowResumeResult as ax, createStep as ay, type MastraLanguageModel as az, type MastraPrimitives as b, MastraMemory as c, type StepExecutionContext as d, type WorkflowContext as e, AgentNetwork as f, MastraStorage as g, type TABLE_NAMES as h, type StorageColumn as i, type StorageThreadType as j, type MessageType as k, type StorageGetMessagesArg as l, type AgentConfig as m, type ToolExecutionContext as n, Tool as o, type WorkflowOptions as p, type WorkflowRow as q, type CoreMessage as r, type CoreSystemMessage as s, type CoreAssistantMessage as t, type CoreUserMessage as u, type CoreToolMessage as v, type EmbedResult as w, type EmbedManyResult as x, type StructuredOutputType as y, type StructuredOutputArrayItem as z };
