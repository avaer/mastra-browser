import { Workflow } from '@mastra/core/workflows';
import { WorkflowRunResult as BaseWorkflowRunResult } from '@mastra/client-js';

export type ExtendedWorkflowRunResult = BaseWorkflowRunResult & {
    sanitizedOutput?: string | null;
    sanitizedError?: {
        message: string;
        stack?: string;
    } | null;
};
export declare const useWorkflow: (workflowId: string, baseUrl: string) => {
    workflow: Workflow<import('@mastra/core').Step<string, any, any, import('@mastra/core').StepExecutionContext<any, import('@mastra/core').WorkflowContext<any, import('@mastra/core').Step<string, any, any, any>[], Record<string, any>>>>[], string, any, any> | null;
    isLoading: boolean;
};
export declare const useExecuteWorkflow: (baseUrl: string) => {
    startWorkflowRun: ({ workflowId, runId, input }: {
        workflowId: string;
        runId: string;
        input: any;
    }) => Promise<void>;
    createWorkflowRun: ({ workflowId, prevRunId }: {
        workflowId: string;
        prevRunId?: string;
    }) => Promise<{
        runId: string;
    }>;
    isExecutingWorkflow: boolean;
};
export declare const useWatchWorkflow: (baseUrl: string) => {
    watchWorkflow: ({ workflowId, runId }: {
        workflowId: string;
        runId: string;
    }) => Promise<void>;
    isWatchingWorkflow: boolean;
    watchResult: ExtendedWorkflowRunResult | null;
};
export declare const useResumeWorkflow: (baseUrl: string) => {
    resumeWorkflow: ({ workflowId, stepId, runId, context, }: {
        workflowId: string;
        stepId: string;
        runId: string;
        context: any;
    }) => Promise<{
        message: string;
    }>;
    isResumingWorkflow: boolean;
};
