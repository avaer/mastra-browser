'use strict';

var chunk4FUCJCP2_cjs = require('./chunk-4FUCJCP2.cjs');
var chunk7D636BPD_cjs = require('./chunk-7D636BPD.cjs');

// src/eval/metric.ts
var _Metric = class _Metric {
};
chunk7D636BPD_cjs.__name(_Metric, "Metric");
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
  chunk4FUCJCP2_cjs.executeHook("onEvaluation" /* ON_EVALUATION */, traceObject);
  return metricResult;
}
chunk7D636BPD_cjs.__name(evaluate, "evaluate");

exports.Metric = Metric;
exports.evaluate = evaluate;
//# sourceMappingURL=chunk-MZW7EZIY.cjs.map
//# sourceMappingURL=chunk-MZW7EZIY.cjs.map