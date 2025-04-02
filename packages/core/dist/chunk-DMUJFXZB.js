import { executeHook } from './chunk-7J6WQGTU.js';
import { __name } from './chunk-WH5OY6PO.js';

// src/eval/metric.ts
var _Metric = class _Metric {
};
__name(_Metric, "Metric");
var Metric = _Metric;

// src/eval/evaluation.ts
async function evaluate({
  agentName,
  input,
  metric,
  output,
  runId,
  globalRunId,
  testInfo,
  instructions
}) {
  const runIdToUse = runId || crypto.randomUUID();
  const metricResult = await metric.measure(input.toString(), output);
  const traceObject = {
    input: input.toString(),
    output,
    result: metricResult,
    agentName,
    metricName: metric.constructor.name,
    instructions,
    globalRunId,
    runId: runIdToUse,
    testInfo
  };
  executeHook("onEvaluation" /* ON_EVALUATION */, traceObject);
  return metricResult;
}
__name(evaluate, "evaluate");

export { Metric, evaluate };
//# sourceMappingURL=chunk-DMUJFXZB.js.map
//# sourceMappingURL=chunk-DMUJFXZB.js.map