import { W as Workflow, T as ToolAction } from '../base-hRgvGkC2.js';
import 'ai';
import '../base-Dq_cxikD.js';
import '@opentelemetry/api';
import '../index-BXwGr3N7.js';
import 'stream';
import '@opentelemetry/sdk-trace-base';
import '../types-CwTG2XyQ.js';
import 'sift';
import 'zod';
import 'json-schema';
import 'xstate';
import 'events';
import '../vector/index.js';
import '../vector/filter/index.js';
import '../tts/index.js';

declare class Integration<ToolsParams = void, ApiClient = void> {
    name: string;
    private workflows;
    constructor();
    /**
     * Workflows
     */
    registerWorkflow(name: string, fn: Workflow): void;
    getWorkflows({ serialized }: {
        serialized?: boolean;
    }): Record<string, Workflow>;
    /**
     * TOOLS
     */
    getStaticTools(_params?: ToolsParams): Record<string, ToolAction<any, any, any>>;
    getTools(_params?: ToolsParams): Promise<Record<string, ToolAction<any, any, any>>>;
    getApiClient(): Promise<ApiClient>;
}

declare abstract class OpenAPIToolset {
    abstract readonly name: string;
    abstract readonly tools: Record<string, ToolAction<any, any, any>>;
    authType: string;
    constructor();
    protected get toolSchemas(): any;
    protected get toolDocumentations(): Record<string, {
        comment: string;
        doc?: string;
    }>;
    protected get baseClient(): any;
    getApiClient(): Promise<any>;
    protected _generateIntegrationTools<T>(): T;
}

export { Integration, OpenAPIToolset };
