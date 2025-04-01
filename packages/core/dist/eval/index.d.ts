import { M as Metric, T as TestInfo, a as MetricResult } from '../types-CwTG2XyQ.js';
import { A as Agent } from '../base-Cr6-Bega.js';
import 'ai';
import '../base-Dq_cxikD.js';
import '@opentelemetry/api';
import '../index-BXwGr3N7.js';
import 'stream';
import '@opentelemetry/sdk-trace-base';
import 'sift';
import 'zod';
import 'json-schema';
import 'xstate';
import 'events';
import '../vector/index.js';
import '../vector/filter/index.js';
import '../tts/index.js';
import '../deployer/index.js';
import '../bundler/index.js';

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
