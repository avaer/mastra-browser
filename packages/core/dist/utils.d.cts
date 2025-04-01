import { V as VercelTool, T as ToolAction, a as ToolsInput, M as Mastra, b as MastraPrimitives, c as MastraMemory, C as CoreTool, A as Agent, W as Workflow, S as Step, d as StepExecutionContext, e as WorkflowContext, f as AgentNetwork } from './base-DxVp6eaF.cjs';
import { CoreMessage, Message } from 'ai';
import { MastraTTS } from './tts/index.cjs';
import { MastraVector } from './vector/index.cjs';
import { z, ZodObject } from 'zod';
import { L as Logger } from './index-BXwGr3N7.cjs';
import { M as Metric } from './types-CwTG2XyQ.cjs';
import './base-D_N8PfP5.cjs';
import '@opentelemetry/api';
import '@opentelemetry/sdk-trace-base';
import 'sift';
import 'json-schema';
import 'xstate';
import 'events';
import './deployer/index.cjs';
import './bundler/index.cjs';
import './vector/filter/index.cjs';
import 'stream';

declare const delay: (ms: number) => Promise<unknown>;
declare function jsonSchemaPropertiesToTSTypes(value: any): z.ZodTypeAny;
declare function jsonSchemaToModel(jsonSchema: Record<string, any>): ZodObject<any>;
/**
 * Deep merges two objects, recursively merging nested objects and arrays
 */
declare function deepMerge<T extends object = object>(target: T, source: Partial<T>): T;
interface TagMaskOptions {
    /** Called when masking begins */
    onStart?: () => void;
    /** Called when masking ends */
    onEnd?: () => void;
    /** Called for each chunk that is masked */
    onMask?: (chunk: string) => void;
}
/**
 * Transforms a stream by masking content between XML tags.
 * @param stream Input stream to transform
 * @param tag Tag name to mask between (e.g. for <foo>...</foo>, use 'foo')
 * @param options Optional configuration for masking behavior
 */
declare function maskStreamTags(stream: AsyncIterable<string>, tag: string, options?: TagMaskOptions): AsyncIterable<string>;
/**
 * Resolve serialized zod output - This function takes the string output ot the `jsonSchemaToZod` function
 * and instantiates the zod object correctly.
 *
 * @param schema - serialized zod object
 * @returns resolved zod object
 */
declare function resolveSerializedZodOutput(schema: string): z.ZodType;
/**
 * Checks if a tool is a Vercel Tool
 * @param tool - The tool to check
 * @returns True if the tool is a Vercel Tool, false otherwise
 */
declare function isVercelTool(tool?: ToolToConvert): tool is VercelTool;
interface ToolOptions {
    name: string;
    runId?: string;
    threadId?: string;
    resourceId?: string;
    logger: Logger;
    description?: string;
    mastra?: (Mastra & MastraPrimitives) | MastraPrimitives;
    memory?: MastraMemory;
    agentName?: string;
}
type ToolToConvert = VercelTool | ToolAction<any, any, any>;
/**
 * Ensures a tool has an ID and inputSchema by generating one if not present
 * @param tool - The tool to ensure has an ID and inputSchema
 * @returns The tool with an ID and inputSchema
 */
declare function ensureToolProperties(tools: ToolsInput): ToolsInput;
/**
 * Converts a Vercel Tool or Mastra Tool into a CoreTool format
 * @param tool - The tool to convert (either VercelTool or ToolAction)
 * @param options - Tool options including Mastra-specific settings
 * @param logType - Type of tool to log (tool or toolset)
 * @returns A CoreTool that can be used by the system
 */
declare function makeCoreTool(tool: ToolToConvert, options: ToolOptions, logType?: 'tool' | 'toolset'): CoreTool;
/**
 * Creates a proxy for a Mastra instance to handle deprecated properties
 * @param mastra - The Mastra instance to proxy
 * @param logger - The logger to use for warnings
 * @returns A proxy for the Mastra instance
 */
declare function createMastraProxy({ mastra, logger }: {
    mastra: Mastra;
    logger: Logger;
}): Mastra<Record<string, Agent<any, Record<string, Metric>>>, Record<string, Workflow<Step<string, any, any, StepExecutionContext<any, WorkflowContext<any, Step<string, any, any, any>[], Record<string, any>>>>[], string, any, any>>, Record<string, MastraVector>, Record<string, MastraTTS>, Logger, Record<string, AgentNetwork>>;
declare function checkEvalStorageFields(traceObject: any, logger?: Logger): boolean;
declare function ensureAllMessagesAreCoreMessages(messages: (CoreMessage | Message)[]): CoreMessage[];

export { type TagMaskOptions, checkEvalStorageFields, createMastraProxy, deepMerge, delay, ensureAllMessagesAreCoreMessages, ensureToolProperties, isVercelTool, jsonSchemaPropertiesToTSTypes, jsonSchemaToModel, makeCoreTool, maskStreamTags, resolveSerializedZodOutput };
