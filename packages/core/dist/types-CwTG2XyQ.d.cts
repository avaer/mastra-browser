interface MetricResult {
    score: number;
    info?: Record<string, any>;
}
declare abstract class Metric {
    abstract measure(input: string, output: string): Promise<MetricResult>;
}

interface TestInfo {
    testName?: string;
    testPath?: string;
}

export { Metric as M, type TestInfo as T, type MetricResult as a };
