import { TestInfo, MetricResult } from '@mastra/core/eval';

export type Evals = {
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
export declare const useEvalsByAgentId: (agentId: string, type: "ci" | "live", baseUrl?: string) => {
    evals: Evals[];
    isLoading: boolean;
    refetchEvals: (_agentId?: string) => Promise<void>;
};
