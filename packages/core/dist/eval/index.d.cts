import { M as Metric, T as TestInfo, a as MetricResult } from '../types-CwTG2XyQ.cjs';
import { A as Agent } from '../base-DXu3GGXw.cjs';
import 'ai';
import '../base-D_N8PfP5.cjs';
import '@opentelemetry/api';
import '../index-BXwGr3N7.cjs';
import 'stream';
import '@opentelemetry/sdk-trace-base';
import 'sift';
import 'zod';
import 'json-schema';
import 'xstate';
import 'events';
import '../vector/index.cjs';
import '../vector/filter/index.cjs';
import '../tts/index.cjs';

declare function evaluate<T extends Agent>({ agentName, input, metric, output, runId, globalRunId, testInfo, instructions, }: {
    agentName: string;
    input: Parameters<T['generate']>[0];
    metric: Metric;
    output: string;
    globalRunId: string;
    runId?: string;
    testInfo?: TestInfo;
    instructions: string;
}): Promise<MetricResult>;

export { Metric, MetricResult, TestInfo, evaluate };
