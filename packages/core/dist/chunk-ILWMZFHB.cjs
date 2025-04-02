'use strict';

var chunkZZSLONUU_cjs = require('./chunk-ZZSLONUU.cjs');
var chunkSUWCCDLE_cjs = require('./chunk-SUWCCDLE.cjs');
var chunk7D636BPD_cjs = require('./chunk-7D636BPD.cjs');
var api = require('@opentelemetry/api');
var zod = require('zod');
var radash = require('radash');
var EventEmitter = require('events');
var sift = require('sift');
var xstate = require('xstate');

function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

var EventEmitter__default = /*#__PURE__*/_interopDefault(EventEmitter);
var sift__default = /*#__PURE__*/_interopDefault(sift);

// src/workflows/step.ts
var _Step = class _Step {
  constructor({
    id,
    description,
    execute,
    payload,
    outputSchema,
    inputSchema,
    retryConfig
  }) {
    chunk7D636BPD_cjs.__publicField(this, "id");
    chunk7D636BPD_cjs.__publicField(this, "description");
    chunk7D636BPD_cjs.__publicField(this, "inputSchema");
    chunk7D636BPD_cjs.__publicField(this, "outputSchema");
    chunk7D636BPD_cjs.__publicField(this, "payload");
    chunk7D636BPD_cjs.__publicField(this, "execute");
    chunk7D636BPD_cjs.__publicField(this, "retryConfig");
    chunk7D636BPD_cjs.__publicField(this, "mastra");
    this.id = id;
    this.description = description ?? "";
    this.inputSchema = inputSchema;
    this.payload = payload;
    this.outputSchema = outputSchema;
    this.execute = execute;
    this.retryConfig = retryConfig;
  }
};
chunk7D636BPD_cjs.__name(_Step, "Step");
var Step = _Step;
function createStep(opts) {
  return new Step(opts);
}
chunk7D636BPD_cjs.__name(createStep, "createStep");

// src/workflows/types.ts
var WhenConditionReturnValue = /* @__PURE__ */ ((WhenConditionReturnValue2) => {
  WhenConditionReturnValue2["CONTINUE"] = "continue";
  WhenConditionReturnValue2["CONTINUE_FAILED"] = "continue_failed";
  WhenConditionReturnValue2["ABORT"] = "abort";
  WhenConditionReturnValue2["LIMBO"] = "limbo";
  return WhenConditionReturnValue2;
})(WhenConditionReturnValue || {});
function isErrorEvent(stateEvent) {
  return stateEvent.type.startsWith("xstate.error.actor.");
}
chunk7D636BPD_cjs.__name(isErrorEvent, "isErrorEvent");
function isTransitionEvent(stateEvent) {
  return stateEvent.type.startsWith("xstate.done.actor.");
}
chunk7D636BPD_cjs.__name(isTransitionEvent, "isTransitionEvent");
function isVariableReference(value) {
  return typeof value === "object" && "step" in value && "path" in value;
}
chunk7D636BPD_cjs.__name(isVariableReference, "isVariableReference");
function getStepResult(result) {
  if (result?.status === "success") return result.output;
  return void 0;
}
chunk7D636BPD_cjs.__name(getStepResult, "getStepResult");
function getSuspendedPaths({
  value,
  path,
  suspendedPaths
}) {
  if (typeof value === "string") {
    if (value === "suspended") {
      suspendedPaths.add(path);
    }
  } else {
    Object.keys(value).forEach(
      (key) => getSuspendedPaths({ value: value[key], path: path ? `${path}.${key}` : key, suspendedPaths })
    );
  }
}
chunk7D636BPD_cjs.__name(getSuspendedPaths, "getSuspendedPaths");
function isFinalState(status) {
  return ["completed", "failed"].includes(status);
}
chunk7D636BPD_cjs.__name(isFinalState, "isFinalState");
function isLimboState(status) {
  return status === "limbo";
}
chunk7D636BPD_cjs.__name(isLimboState, "isLimboState");
function recursivelyCheckForFinalState({
  value,
  suspendedPaths,
  path
}) {
  if (typeof value === "string") {
    return isFinalState(value) || isLimboState(value) || suspendedPaths.has(path);
  }
  return Object.keys(value).every(
    (key) => recursivelyCheckForFinalState({ value: value[key], suspendedPaths, path: path ? `${path}.${key}` : key })
  );
}
chunk7D636BPD_cjs.__name(recursivelyCheckForFinalState, "recursivelyCheckForFinalState");
function getActivePathsAndStatus(value) {
  const paths = [];
  const traverse = /* @__PURE__ */ chunk7D636BPD_cjs.__name((current, path = []) => {
    for (const [key, value2] of Object.entries(current)) {
      const currentPath = [...path, key];
      if (typeof value2 === "string") {
        paths.push({
          stepPath: currentPath,
          stepId: key,
          status: value2
        });
      } else if (typeof value2 === "object" && value2 !== null) {
        traverse(value2, currentPath);
      }
    }
  }, "traverse");
  traverse(value);
  return paths;
}
chunk7D636BPD_cjs.__name(getActivePathsAndStatus, "getActivePathsAndStatus");
function mergeChildValue(startStepId, parent, child) {
  const traverse = /* @__PURE__ */ chunk7D636BPD_cjs.__name((current) => {
    const obj = {};
    for (const [key, value] of Object.entries(current)) {
      if (key === startStepId) {
        obj[key] = { ...child };
      } else if (typeof value === "string") {
        obj[key] = value;
      } else if (typeof value === "object" && value !== null) {
        obj[key] = traverse(value);
      }
    }
    return obj;
  }, "traverse");
  return traverse(parent);
}
chunk7D636BPD_cjs.__name(mergeChildValue, "mergeChildValue");
var updateStepInHierarchy = /* @__PURE__ */ chunk7D636BPD_cjs.__name((value, targetStepId) => {
  const result = {};
  for (const key of Object.keys(value)) {
    const currentValue = value[key];
    if (key === targetStepId) {
      result[key] = "pending";
    } else if (typeof currentValue === "object" && currentValue !== null) {
      result[key] = updateStepInHierarchy(currentValue, targetStepId);
    } else {
      result[key] = currentValue;
    }
  }
  return result;
}, "updateStepInHierarchy");
function getResultActivePaths(state) {
  return getActivePathsAndStatus(state.value).reduce((acc, curr) => {
    const entry = { status: curr.status };
    if (curr.status === "suspended") {
      entry.suspendPayload = state.context.steps[curr.stepId].suspendPayload;
    }
    acc.set(curr.stepId, entry);
    return acc;
  }, /* @__PURE__ */ new Map());
}
chunk7D636BPD_cjs.__name(getResultActivePaths, "getResultActivePaths");
function isWorkflow(step) {
  return !!step?.name;
}
chunk7D636BPD_cjs.__name(isWorkflow, "isWorkflow");
function resolveVariables({
  runId,
  logger,
  variables,
  context
}) {
  const resolvedData = {};
  for (const [key, variable] of Object.entries(variables)) {
    const sourceData = variable.step === "trigger" ? context.triggerData : getStepResult(context.steps[variable.step.id ?? variable.step.name]);
    logger.debug(
      `Got source data for ${key} variable from ${variable.step === "trigger" ? "trigger" : variable.step.id ?? variable.step.name}`,
      {
        sourceData,
        path: variable.path,
        runId
      }
    );
    if (!sourceData && variable.step !== "trigger") {
      resolvedData[key] = void 0;
      continue;
    }
    const value = variable.path === "" || variable.path === "." ? sourceData : radash.get(sourceData, variable.path);
    logger.debug(`Resolved variable ${key}`, {
      value,
      runId
    });
    resolvedData[key] = value;
  }
  return resolvedData;
}
chunk7D636BPD_cjs.__name(resolveVariables, "resolveVariables");
function workflowToStep(workflow, { mastra }) {
  workflow.setNested(true);
  return {
    id: workflow.name,
    workflow,
    execute: /* @__PURE__ */ chunk7D636BPD_cjs.__name(async ({ context, suspend, emit, runId, mastra: mastra2 }) => {
      if (mastra2) {
        workflow.__registerMastra(mastra2);
        workflow.__registerPrimitives({
          logger: mastra2.getLogger(),
          telemetry: mastra2.getTelemetry()
        });
      }
      const run = context.isResume ? workflow.createRun({ runId: context.isResume.runId }) : workflow.createRun();
      const unwatch = run.watch((state) => {
        emit("state-update", workflow.name, state.value, { ...context, ...{ [workflow.name]: state.context } });
      });
      const awaitedResult = context.isResume && context.isResume.stepId.includes(".") ? await run.resume({
        stepId: context.isResume.stepId.split(".").slice(1).join("."),
        context: context.inputData
      }) : await run.start({
        triggerData: context.inputData
      });
      unwatch();
      if (!awaitedResult) {
        throw new Error("Workflow run failed");
      }
      if (awaitedResult.activePaths?.size > 0) {
        const suspendedStep = [...awaitedResult.activePaths.entries()].find(([stepId, { status }]) => {
          return status === "suspended";
        });
        if (suspendedStep) {
          await suspend(suspendedStep[1].suspendPayload, { ...awaitedResult, runId: run.runId });
        }
      }
      return { ...awaitedResult, runId: run.runId };
    }, "execute")
  };
}
chunk7D636BPD_cjs.__name(workflowToStep, "workflowToStep");
var _mastra, _workflowInstance, _executionSpan, _stepGraph, _machine, _runId, _startStepId, _actor, _steps, _retryConfig, _Machine_instances, cleanup_fn, makeDelayMap_fn, getDefaultActions_fn, getDefaultActors_fn, resolveVariables_fn, buildStateHierarchy_fn, buildBaseState_fn, evaluateCondition_fn;
var _Machine = class _Machine extends EventEmitter__default.default {
  constructor({
    logger,
    mastra,
    workflowInstance,
    executionSpan,
    name,
    runId,
    steps,
    stepGraph,
    retryConfig,
    startStepId
  }) {
    super();
    chunk7D636BPD_cjs.__privateAdd(this, _Machine_instances);
    chunk7D636BPD_cjs.__publicField(this, "logger");
    chunk7D636BPD_cjs.__privateAdd(this, _mastra);
    chunk7D636BPD_cjs.__privateAdd(this, _workflowInstance);
    chunk7D636BPD_cjs.__privateAdd(this, _executionSpan);
    chunk7D636BPD_cjs.__privateAdd(this, _stepGraph);
    chunk7D636BPD_cjs.__privateAdd(this, _machine);
    chunk7D636BPD_cjs.__privateAdd(this, _runId);
    chunk7D636BPD_cjs.__privateAdd(this, _startStepId);
    chunk7D636BPD_cjs.__publicField(this, "name");
    chunk7D636BPD_cjs.__privateAdd(this, _actor, null);
    chunk7D636BPD_cjs.__privateAdd(this, _steps, {});
    chunk7D636BPD_cjs.__privateAdd(this, _retryConfig);
    chunk7D636BPD_cjs.__privateSet(this, _mastra, mastra);
    chunk7D636BPD_cjs.__privateSet(this, _workflowInstance, workflowInstance);
    chunk7D636BPD_cjs.__privateSet(this, _executionSpan, executionSpan);
    this.logger = logger;
    chunk7D636BPD_cjs.__privateSet(this, _runId, runId);
    chunk7D636BPD_cjs.__privateSet(this, _startStepId, startStepId);
    this.name = name;
    chunk7D636BPD_cjs.__privateSet(this, _stepGraph, stepGraph);
    chunk7D636BPD_cjs.__privateSet(this, _steps, steps);
    chunk7D636BPD_cjs.__privateSet(this, _retryConfig, retryConfig);
    this.initializeMachine();
  }
  get startStepId() {
    return chunk7D636BPD_cjs.__privateGet(this, _startStepId);
  }
  async execute({
    stepId,
    input,
    snapshot,
    resumeData
  } = {}) {
    if (snapshot) {
      this.logger.debug(`Workflow snapshot received`, { runId: chunk7D636BPD_cjs.__privateGet(this, _runId), snapshot });
    }
    const origSteps = input.steps;
    const isResumedInitialStep = chunk7D636BPD_cjs.__privateGet(this, _stepGraph)?.initial[0]?.step?.id === stepId;
    if (isResumedInitialStep) {
      snapshot = void 0;
      input.steps = {};
    }
    this.logger.debug(`Machine input prepared`, { runId: chunk7D636BPD_cjs.__privateGet(this, _runId), input });
    const actorSnapshot = snapshot ? {
      ...snapshot,
      context: {
        ...input,
        inputData: { ...snapshot?.context?.inputData || {}, ...resumeData },
        // ts-ignore is needed here because our snapshot types don't really match xstate snapshot types right now. We should fix this in general.
        // @ts-ignore
        isResume: { runId: snapshot?.context?.steps[stepId.split(".")?.[0]]?.output?.runId || chunk7D636BPD_cjs.__privateGet(this, _runId), stepId }
      }
    } : void 0;
    this.logger.debug(`Creating actor with configuration`, {
      input,
      actorSnapshot,
      runId: chunk7D636BPD_cjs.__privateGet(this, _runId),
      machineStates: chunk7D636BPD_cjs.__privateGet(this, _machine).config.states
    });
    chunk7D636BPD_cjs.__privateSet(this, _actor, xstate.createActor(chunk7D636BPD_cjs.__privateGet(this, _machine), {
      inspect: /* @__PURE__ */ chunk7D636BPD_cjs.__name((inspectionEvent) => {
        this.logger.debug("XState inspection event", {
          type: inspectionEvent.type,
          event: inspectionEvent.event,
          runId: chunk7D636BPD_cjs.__privateGet(this, _runId)
        });
      }, "inspect"),
      input: {
        ...input,
        inputData: { ...snapshot?.context?.inputData || {}, ...resumeData }
      },
      snapshot: actorSnapshot
    }));
    chunk7D636BPD_cjs.__privateGet(this, _actor).start();
    if (stepId) {
      chunk7D636BPD_cjs.__privateGet(this, _actor).send({ type: "RESET_TO_PENDING", stepId });
    }
    this.logger.debug("Actor started", { runId: chunk7D636BPD_cjs.__privateGet(this, _runId) });
    return new Promise((resolve, reject) => {
      if (!chunk7D636BPD_cjs.__privateGet(this, _actor)) {
        this.logger.error("Actor not initialized", { runId: chunk7D636BPD_cjs.__privateGet(this, _runId) });
        const e = new Error("Actor not initialized");
        chunk7D636BPD_cjs.__privateGet(this, _executionSpan)?.recordException(e);
        chunk7D636BPD_cjs.__privateGet(this, _executionSpan)?.end();
        reject(e);
        return;
      }
      const suspendedPaths = /* @__PURE__ */ new Set();
      chunk7D636BPD_cjs.__privateGet(this, _actor).subscribe(async (state) => {
        this.emit("state-update", chunk7D636BPD_cjs.__privateGet(this, _startStepId), state.value, state.context);
        getSuspendedPaths({
          value: state.value,
          path: "",
          suspendedPaths
        });
        const allStatesValue = state.value;
        const allStatesComplete = recursivelyCheckForFinalState({
          value: allStatesValue,
          suspendedPaths,
          path: ""
        });
        this.logger.debug("State completion check", {
          allStatesComplete,
          suspendedPaths: Array.from(suspendedPaths),
          runId: chunk7D636BPD_cjs.__privateGet(this, _runId)
        });
        if (!allStatesComplete) {
          this.logger.debug("Not all states complete", {
            allStatesComplete,
            suspendedPaths: Array.from(suspendedPaths),
            runId: chunk7D636BPD_cjs.__privateGet(this, _runId)
          });
          return;
        }
        try {
          this.logger.debug("All states complete", { runId: chunk7D636BPD_cjs.__privateGet(this, _runId) });
          await chunk7D636BPD_cjs.__privateGet(this, _workflowInstance).persistWorkflowSnapshot();
          chunk7D636BPD_cjs.__privateMethod(this, _Machine_instances, cleanup_fn).call(this);
          chunk7D636BPD_cjs.__privateGet(this, _executionSpan)?.end();
          resolve({
            results: isResumedInitialStep ? { ...origSteps, ...state.context.steps } : state.context.steps,
            activePaths: getResultActivePaths(
              state
            )
          });
        } catch (error) {
          this.logger.debug("Failed to persist final snapshot", { error });
          chunk7D636BPD_cjs.__privateMethod(this, _Machine_instances, cleanup_fn).call(this);
          chunk7D636BPD_cjs.__privateGet(this, _executionSpan)?.end();
          resolve({
            results: isResumedInitialStep ? { ...origSteps, ...state.context.steps } : state.context.steps,
            activePaths: getResultActivePaths(
              state
            )
          });
        }
      });
    });
  }
  initializeMachine() {
    const machine = xstate.setup({
      types: {},
      delays: chunk7D636BPD_cjs.__privateMethod(this, _Machine_instances, makeDelayMap_fn).call(this),
      actions: chunk7D636BPD_cjs.__privateMethod(this, _Machine_instances, getDefaultActions_fn).call(this),
      actors: chunk7D636BPD_cjs.__privateMethod(this, _Machine_instances, getDefaultActors_fn).call(this)
    }).createMachine({
      id: this.name,
      type: "parallel",
      context: /* @__PURE__ */ chunk7D636BPD_cjs.__name(({ input }) => ({
        ...input
      }), "context"),
      states: chunk7D636BPD_cjs.__privateMethod(this, _Machine_instances, buildStateHierarchy_fn).call(this, chunk7D636BPD_cjs.__privateGet(this, _stepGraph))
    });
    chunk7D636BPD_cjs.__privateSet(this, _machine, machine);
    return machine;
  }
  getSnapshot() {
    const snapshot = chunk7D636BPD_cjs.__privateGet(this, _actor)?.getSnapshot();
    return snapshot;
  }
};
_mastra = new WeakMap();
_workflowInstance = new WeakMap();
_executionSpan = new WeakMap();
_stepGraph = new WeakMap();
_machine = new WeakMap();
_runId = new WeakMap();
_startStepId = new WeakMap();
_actor = new WeakMap();
_steps = new WeakMap();
_retryConfig = new WeakMap();
_Machine_instances = new WeakSet();
cleanup_fn = /* @__PURE__ */ chunk7D636BPD_cjs.__name(function() {
  if (chunk7D636BPD_cjs.__privateGet(this, _actor)) {
    chunk7D636BPD_cjs.__privateGet(this, _actor).stop();
    chunk7D636BPD_cjs.__privateSet(this, _actor, null);
  }
  this.removeAllListeners();
}, "#cleanup");
makeDelayMap_fn = /* @__PURE__ */ chunk7D636BPD_cjs.__name(function() {
  const delayMap = {};
  Object.keys(chunk7D636BPD_cjs.__privateGet(this, _steps)).forEach((stepId) => {
    delayMap[stepId] = chunk7D636BPD_cjs.__privateGet(this, _steps)[stepId]?.retryConfig?.delay || chunk7D636BPD_cjs.__privateGet(this, _retryConfig)?.delay || 1e3;
  });
  return delayMap;
}, "#makeDelayMap");
getDefaultActions_fn = /* @__PURE__ */ chunk7D636BPD_cjs.__name(function() {
  return {
    updateStepResult: xstate.assign({
      steps: /* @__PURE__ */ chunk7D636BPD_cjs.__name(({ context, event }) => {
        if (!isTransitionEvent(event)) return context.steps;
        const { stepId, result } = event.output;
        return {
          ...context.steps,
          [stepId]: {
            status: "success",
            output: result
          }
        };
      }, "steps")
    }),
    setStepError: xstate.assign({
      steps: /* @__PURE__ */ chunk7D636BPD_cjs.__name(({ context, event }, params) => {
        if (!isErrorEvent(event)) return context.steps;
        const { stepId } = params;
        if (!stepId) return context.steps;
        return {
          ...context.steps,
          [stepId]: {
            status: "failed",
            error: event.error.message
          }
        };
      }, "steps")
    }),
    notifyStepCompletion: /* @__PURE__ */ chunk7D636BPD_cjs.__name(async (_, params) => {
      const { stepId } = params;
      this.logger.debug(`Step ${stepId} completed`);
    }, "notifyStepCompletion"),
    snapshotStep: xstate.assign({
      _snapshot: /* @__PURE__ */ chunk7D636BPD_cjs.__name(({}, params) => {
        const { stepId } = params;
        return { stepId };
      }, "_snapshot")
    }),
    persistSnapshot: /* @__PURE__ */ chunk7D636BPD_cjs.__name(async ({ context }) => {
      if (context._snapshot) {
        await chunk7D636BPD_cjs.__privateGet(this, _workflowInstance).persistWorkflowSnapshot();
      }
      return;
    }, "persistSnapshot"),
    decrementAttemptCount: xstate.assign({
      attempts: /* @__PURE__ */ chunk7D636BPD_cjs.__name(({ context, event }, params) => {
        if (!isTransitionEvent(event)) return context.attempts;
        const { stepId } = params;
        const attemptCount = context.attempts[stepId];
        if (attemptCount === void 0) return context.attempts;
        return { ...context.attempts, [stepId]: attemptCount - 1 };
      }, "attempts")
    })
  };
}, "#getDefaultActions");
getDefaultActors_fn = /* @__PURE__ */ chunk7D636BPD_cjs.__name(function() {
  return {
    resolverFunction: xstate.fromPromise(async ({ input }) => {
      const { stepNode, context } = input;
      const attemptCount = context.attempts[stepNode.step.id];
      const resolvedData = chunk7D636BPD_cjs.__privateMethod(this, _Machine_instances, resolveVariables_fn).call(this, {
        stepConfig: stepNode.config,
        context,
        stepId: stepNode.step.id
      });
      this.logger.debug(`Resolved variables for ${stepNode.step.id}`, {
        resolvedData,
        runId: chunk7D636BPD_cjs.__privateGet(this, _runId)
      });
      const logger = this.logger;
      let mastraProxy = void 0;
      if (chunk7D636BPD_cjs.__privateGet(this, _mastra)) {
        mastraProxy = chunkZZSLONUU_cjs.createMastraProxy({ mastra: chunk7D636BPD_cjs.__privateGet(this, _mastra), logger });
      }
      let result = void 0;
      try {
        result = await stepNode.config.handler({
          context: {
            ...context,
            inputData: { ...context?.inputData || {}, ...resolvedData },
            getStepResult: /* @__PURE__ */ chunk7D636BPD_cjs.__name((stepId) => {
              const resolvedStepId = typeof stepId === "string" ? stepId : stepId.id;
              if (resolvedStepId === "trigger") {
                return context.triggerData;
              }
              const result2 = context.steps[resolvedStepId];
              if (result2 && result2.status === "success") {
                return result2.output;
              }
              return void 0;
            }, "getStepResult")
          },
          emit: /* @__PURE__ */ chunk7D636BPD_cjs.__name((event, ...args) => {
            this.emit(event, ...args);
          }, "emit"),
          suspend: /* @__PURE__ */ chunk7D636BPD_cjs.__name(async (payload, softSuspend) => {
            await chunk7D636BPD_cjs.__privateGet(this, _workflowInstance).suspend(stepNode.step.id, this);
            if (chunk7D636BPD_cjs.__privateGet(this, _actor)) {
              context.steps[stepNode.step.id] = {
                status: "suspended",
                suspendPayload: payload,
                output: softSuspend
              };
              this.logger.debug(`Sending SUSPENDED event for step ${stepNode.step.id}`);
              chunk7D636BPD_cjs.__privateGet(this, _actor)?.send({
                type: "SUSPENDED",
                suspendPayload: payload,
                stepId: stepNode.step.id,
                softSuspend
              });
            } else {
              this.logger.debug(`Actor not available for step ${stepNode.step.id}`);
            }
          }, "suspend"),
          runId: chunk7D636BPD_cjs.__privateGet(this, _runId),
          mastra: mastraProxy
        });
      } catch (error) {
        this.logger.debug(`Step ${stepNode.step.id} failed`, {
          stepId: stepNode.step.id,
          error,
          runId: chunk7D636BPD_cjs.__privateGet(this, _runId)
        });
        this.logger.debug(`Attempt count for step ${stepNode.step.id}`, {
          attemptCount,
          attempts: context.attempts,
          runId: chunk7D636BPD_cjs.__privateGet(this, _runId),
          stepId: stepNode.step.id
        });
        if (!attemptCount || attemptCount < 0) {
          return {
            type: "STEP_FAILED",
            error: error instanceof Error ? error.message : `Step:${stepNode.step.id} failed with error: ${error}`,
            stepId: stepNode.step.id
          };
        }
        return { type: "STEP_WAITING", stepId: stepNode.step.id };
      }
      this.logger.debug(`Step ${stepNode.step.id} result`, {
        stepId: stepNode.step.id,
        result,
        runId: chunk7D636BPD_cjs.__privateGet(this, _runId)
      });
      return {
        type: "STEP_SUCCESS",
        result,
        stepId: stepNode.step.id
      };
    }),
    conditionCheck: xstate.fromPromise(async ({ input }) => {
      const { context, stepNode } = input;
      const stepConfig = stepNode.config;
      this.logger.debug(`Checking conditions for step ${stepNode.step.id}`, {
        stepId: stepNode.step.id,
        runId: chunk7D636BPD_cjs.__privateGet(this, _runId)
      });
      if (!stepConfig?.when) {
        return { type: "CONDITIONS_MET" };
      }
      this.logger.debug(`Checking conditions for step ${stepNode.step.id}`, {
        stepId: stepNode.step.id,
        runId: chunk7D636BPD_cjs.__privateGet(this, _runId)
      });
      if (typeof stepConfig?.when === "function") {
        let conditionMet = await stepConfig.when({
          context: {
            ...context,
            getStepResult: /* @__PURE__ */ chunk7D636BPD_cjs.__name((stepId) => {
              const resolvedStepId = typeof stepId === "string" ? stepId : stepId.id;
              if (resolvedStepId === "trigger") {
                return context.triggerData;
              }
              const result = context.steps[resolvedStepId];
              if (result && result.status === "success") {
                return result.output;
              }
              return void 0;
            }, "getStepResult")
          },
          mastra: chunk7D636BPD_cjs.__privateGet(this, _mastra)
        });
        if (conditionMet === "abort" /* ABORT */) {
          conditionMet = false;
        } else if (conditionMet === "continue_failed" /* CONTINUE_FAILED */) {
          return { type: "CONDITIONS_SKIP_TO_COMPLETED" };
        } else if (conditionMet === "limbo" /* LIMBO */) {
          return { type: "CONDITIONS_LIMBO" };
        } else if (conditionMet) {
          this.logger.debug(`Condition met for step ${stepNode.step.id}`, {
            stepId: stepNode.step.id,
            runId: chunk7D636BPD_cjs.__privateGet(this, _runId)
          });
          return { type: "CONDITIONS_MET" };
        }
        return chunk7D636BPD_cjs.__privateGet(this, _workflowInstance).hasSubscribers(stepNode.step.id) ? { type: "CONDITIONS_SKIPPED" } : { type: "CONDITIONS_LIMBO" };
      } else {
        const conditionMet = chunk7D636BPD_cjs.__privateMethod(this, _Machine_instances, evaluateCondition_fn).call(this, stepConfig.when, context);
        if (!conditionMet) {
          return {
            type: "CONDITION_FAILED",
            error: `Step:${stepNode.step.id} condition check failed`
          };
        }
      }
      return { type: "CONDITIONS_MET" };
    }),
    spawnSubscriberFunction: xstate.fromPromise(
      async ({
        input
      }) => {
        const { parentStepId, context } = input;
        const result = await chunk7D636BPD_cjs.__privateGet(this, _workflowInstance).runMachine(parentStepId, context);
        return Promise.resolve({
          steps: result.reduce((acc, r) => {
            return { ...acc, ...r?.results };
          }, {})
        });
      }
    )
  };
}, "#getDefaultActors");
resolveVariables_fn = /* @__PURE__ */ chunk7D636BPD_cjs.__name(function({
  stepConfig,
  context,
  stepId
}) {
  this.logger.debug(`Resolving variables for step ${stepId}`, {
    stepId,
    runId: chunk7D636BPD_cjs.__privateGet(this, _runId)
  });
  const resolvedData = {};
  for (const [key, variable] of Object.entries(stepConfig.data)) {
    const sourceData = variable.step === "trigger" ? context.triggerData : getStepResult(context.steps[variable.step.id]);
    this.logger.debug(
      `Got source data for ${key} variable from ${variable.step === "trigger" ? "trigger" : variable.step.id}`,
      {
        sourceData,
        path: variable.path,
        runId: chunk7D636BPD_cjs.__privateGet(this, _runId)
      }
    );
    if (!sourceData && variable.step !== "trigger") {
      resolvedData[key] = void 0;
      continue;
    }
    const value = variable.path === "" || variable.path === "." ? sourceData : radash.get(sourceData, variable.path);
    this.logger.debug(`Resolved variable ${key}`, {
      value,
      runId: chunk7D636BPD_cjs.__privateGet(this, _runId)
    });
    resolvedData[key] = value;
  }
  return resolvedData;
}, "#resolveVariables");
buildStateHierarchy_fn = /* @__PURE__ */ chunk7D636BPD_cjs.__name(function(stepGraph) {
  const states = {};
  stepGraph.initial.forEach((stepNode) => {
    const nextSteps = [...stepGraph[stepNode.step.id] || []];
    states[stepNode.step.id] = {
      ...chunk7D636BPD_cjs.__privateMethod(this, _Machine_instances, buildBaseState_fn).call(this, stepNode, nextSteps)
    };
  });
  return states;
}, "#buildStateHierarchy");
buildBaseState_fn = /* @__PURE__ */ chunk7D636BPD_cjs.__name(function(stepNode, nextSteps = []) {
  const nextStep = nextSteps.shift();
  return {
    initial: "pending",
    on: {
      RESET_TO_PENDING: {
        target: ".pending"
        // Note the dot to target child state
      }
    },
    states: {
      pending: {
        entry: /* @__PURE__ */ chunk7D636BPD_cjs.__name(() => {
          this.logger.debug(`Step ${stepNode.step.id} pending`, {
            stepId: stepNode.step.id,
            runId: chunk7D636BPD_cjs.__privateGet(this, _runId)
          });
        }, "entry"),
        exit: /* @__PURE__ */ chunk7D636BPD_cjs.__name(() => {
          this.logger.debug(`Step ${stepNode.step.id} finished pending`, {
            stepId: stepNode.step.id,
            runId: chunk7D636BPD_cjs.__privateGet(this, _runId)
          });
        }, "exit"),
        invoke: {
          src: "conditionCheck",
          input: /* @__PURE__ */ chunk7D636BPD_cjs.__name(({ context }) => {
            return {
              context,
              stepNode
            };
          }, "input"),
          onDone: [
            {
              guard: /* @__PURE__ */ chunk7D636BPD_cjs.__name(({ event }) => {
                return event.output.type === "SUSPENDED";
              }, "guard"),
              target: "suspended",
              actions: [
                xstate.assign({
                  steps: /* @__PURE__ */ chunk7D636BPD_cjs.__name(({ context, event }) => {
                    if (event.output.type !== "SUSPENDED") return context.steps;
                    if (event.output.softSuspend) {
                      return {
                        ...context.steps,
                        [stepNode.step.id]: {
                          status: "suspended",
                          ...context.steps?.[stepNode.step.id] || {},
                          output: event.output.softSuspend
                        }
                      };
                    }
                    return {
                      ...context.steps,
                      [stepNode.step.id]: {
                        status: "suspended",
                        ...context.steps?.[stepNode.step.id] || {}
                      }
                    };
                  }, "steps"),
                  attempts: /* @__PURE__ */ chunk7D636BPD_cjs.__name(({ context, event }) => {
                    if (event.output.type !== "SUSPENDED") return context.attempts;
                    return { ...context.attempts, [stepNode.step.id]: stepNode.step.retryConfig?.attempts || 0 };
                  }, "attempts")
                })
              ]
            },
            {
              guard: /* @__PURE__ */ chunk7D636BPD_cjs.__name(({ event }) => {
                return event.output.type === "WAITING";
              }, "guard"),
              target: "waiting",
              actions: [
                { type: "decrementAttemptCount", params: { stepId: stepNode.step.id } },
                xstate.assign({
                  steps: /* @__PURE__ */ chunk7D636BPD_cjs.__name(({ context, event }) => {
                    if (event.output.type !== "WAITING") return context.steps;
                    return {
                      ...context.steps,
                      [stepNode.step.id]: {
                        status: "waiting"
                      }
                    };
                  }, "steps")
                })
              ]
            },
            {
              guard: /* @__PURE__ */ chunk7D636BPD_cjs.__name(({ event }) => {
                return event.output.type === "CONDITIONS_MET";
              }, "guard"),
              target: "executing"
            },
            {
              guard: /* @__PURE__ */ chunk7D636BPD_cjs.__name(({ event }) => {
                return event.output.type === "CONDITIONS_SKIP_TO_COMPLETED";
              }, "guard"),
              target: "completed"
            },
            {
              guard: /* @__PURE__ */ chunk7D636BPD_cjs.__name(({ event }) => {
                return event.output.type === "CONDITIONS_SKIPPED";
              }, "guard"),
              actions: xstate.assign({
                steps: /* @__PURE__ */ chunk7D636BPD_cjs.__name(({ context }) => {
                  const newStep = {
                    ...context.steps,
                    [stepNode.step.id]: {
                      status: "skipped"
                    }
                  };
                  this.logger.debug(`Step ${stepNode.step.id} skipped`, {
                    stepId: stepNode.step.id,
                    runId: chunk7D636BPD_cjs.__privateGet(this, _runId)
                  });
                  return newStep;
                }, "steps")
              }),
              target: "runningSubscribers"
            },
            {
              guard: /* @__PURE__ */ chunk7D636BPD_cjs.__name(({ event }) => {
                return event.output.type === "CONDITIONS_LIMBO";
              }, "guard"),
              target: "limbo",
              actions: xstate.assign({
                steps: /* @__PURE__ */ chunk7D636BPD_cjs.__name(({ context }) => {
                  const newStep = {
                    ...context.steps,
                    [stepNode.step.id]: {
                      status: "skipped"
                    }
                  };
                  this.logger.debug(`Step ${stepNode.step.id} skipped`, {
                    stepId: stepNode.step.id,
                    runId: chunk7D636BPD_cjs.__privateGet(this, _runId)
                  });
                  return newStep;
                }, "steps")
              })
            },
            {
              guard: /* @__PURE__ */ chunk7D636BPD_cjs.__name(({ event }) => {
                return event.output.type === "CONDITION_FAILED";
              }, "guard"),
              target: "failed",
              actions: xstate.assign({
                steps: /* @__PURE__ */ chunk7D636BPD_cjs.__name(({ context, event }) => {
                  if (event.output.type !== "CONDITION_FAILED") return context.steps;
                  this.logger.debug(`Workflow condition check failed`, {
                    error: event.output.error,
                    stepId: stepNode.step.id
                  });
                  return {
                    ...context.steps,
                    [stepNode.step.id]: {
                      status: "failed",
                      error: event.output.error
                    }
                  };
                }, "steps")
              })
            }
          ]
        }
      },
      waiting: {
        entry: /* @__PURE__ */ chunk7D636BPD_cjs.__name(() => {
          this.logger.debug(`Step ${stepNode.step.id} waiting`, {
            stepId: stepNode.step.id,
            timestamp: (/* @__PURE__ */ new Date()).toISOString(),
            runId: chunk7D636BPD_cjs.__privateGet(this, _runId)
          });
        }, "entry"),
        exit: /* @__PURE__ */ chunk7D636BPD_cjs.__name(() => {
          this.logger.debug(`Step ${stepNode.step.id} finished waiting`, {
            stepId: stepNode.step.id,
            timestamp: (/* @__PURE__ */ new Date()).toISOString(),
            runId: chunk7D636BPD_cjs.__privateGet(this, _runId)
          });
        }, "exit"),
        after: {
          [stepNode.step.id]: {
            target: "pending"
          }
        }
      },
      limbo: {
        // no target, will stay in limbo indefinitely
        entry: /* @__PURE__ */ chunk7D636BPD_cjs.__name(() => {
          this.logger.debug(`Step ${stepNode.step.id} limbo`, {
            stepId: stepNode.step.id,
            timestamp: (/* @__PURE__ */ new Date()).toISOString(),
            runId: chunk7D636BPD_cjs.__privateGet(this, _runId)
          });
        }, "entry"),
        exit: /* @__PURE__ */ chunk7D636BPD_cjs.__name(() => {
          this.logger.debug(`Step ${stepNode.step.id} finished limbo`, {
            stepId: stepNode.step.id,
            timestamp: (/* @__PURE__ */ new Date()).toISOString(),
            runId: chunk7D636BPD_cjs.__privateGet(this, _runId)
          });
        }, "exit")
      },
      suspended: {
        type: "final",
        entry: [
          () => {
            this.logger.debug(`Step ${stepNode.step.id} suspended`, {
              stepId: stepNode.step.id,
              runId: chunk7D636BPD_cjs.__privateGet(this, _runId)
            });
          },
          xstate.assign({
            steps: /* @__PURE__ */ chunk7D636BPD_cjs.__name(({ context, event }) => {
              return {
                ...context.steps,
                [stepNode.step.id]: {
                  ...context?.steps?.[stepNode.step.id] || {},
                  status: "suspended",
                  suspendPayload: event.type === "SUSPENDED" ? event.suspendPayload : void 0,
                  output: event.type === "SUSPENDED" ? event.softSuspend : void 0
                }
              };
            }, "steps")
          })
        ]
      },
      executing: {
        entry: /* @__PURE__ */ chunk7D636BPD_cjs.__name(() => {
          this.logger.debug(`Step ${stepNode.step.id} executing`, {
            stepId: stepNode.step.id,
            runId: chunk7D636BPD_cjs.__privateGet(this, _runId)
          });
        }, "entry"),
        on: {
          SUSPENDED: {
            target: "suspended",
            actions: [
              xstate.assign({
                steps: /* @__PURE__ */ chunk7D636BPD_cjs.__name(({ context, event }) => {
                  return {
                    ...context.steps,
                    [stepNode.step.id]: {
                      status: "suspended",
                      suspendPayload: event.type === "SUSPENDED" ? event.suspendPayload : void 0,
                      output: event.type === "SUSPENDED" ? event.softSuspend : void 0
                    }
                  };
                }, "steps")
              })
            ]
          }
        },
        invoke: {
          src: "resolverFunction",
          input: /* @__PURE__ */ chunk7D636BPD_cjs.__name(({ context }) => ({
            context,
            stepNode
          }), "input"),
          onDone: [
            {
              guard: /* @__PURE__ */ chunk7D636BPD_cjs.__name(({ event }) => {
                return event.output.type === "STEP_FAILED";
              }, "guard"),
              target: "failed",
              actions: xstate.assign({
                steps: /* @__PURE__ */ chunk7D636BPD_cjs.__name(({ context, event }) => {
                  if (event.output.type !== "STEP_FAILED") return context.steps;
                  const newStep = {
                    ...context.steps,
                    [stepNode.step.id]: {
                      status: "failed",
                      error: event.output.error
                    }
                  };
                  this.logger.debug(`Step ${stepNode.step.id} failed`, {
                    error: event.output.error,
                    stepId: stepNode.step.id
                  });
                  return newStep;
                }, "steps")
              })
            },
            {
              guard: /* @__PURE__ */ chunk7D636BPD_cjs.__name(({ event }) => {
                return event.output.type === "STEP_SUCCESS";
              }, "guard"),
              actions: [
                ({ event }) => {
                  this.logger.debug(`Step ${stepNode.step.id} finished executing`, {
                    stepId: stepNode.step.id,
                    output: event.output,
                    runId: chunk7D636BPD_cjs.__privateGet(this, _runId)
                  });
                },
                { type: "updateStepResult", params: { stepId: stepNode.step.id } },
                { type: "spawnSubscribers", params: { stepId: stepNode.step.id } }
              ],
              target: "runningSubscribers"
            },
            {
              guard: /* @__PURE__ */ chunk7D636BPD_cjs.__name(({ event }) => {
                return event.output.type === "STEP_WAITING";
              }, "guard"),
              target: "waiting",
              actions: [
                { type: "decrementAttemptCount", params: { stepId: stepNode.step.id } },
                xstate.assign({
                  steps: /* @__PURE__ */ chunk7D636BPD_cjs.__name(({ context, event }) => {
                    if (event.output.type !== "STEP_WAITING") return context.steps;
                    return {
                      ...context.steps,
                      [stepNode.step.id]: {
                        status: "waiting"
                      }
                    };
                  }, "steps")
                })
              ]
            }
          ],
          onError: {
            target: "failed",
            actions: [{ type: "setStepError", params: { stepId: stepNode.step.id } }]
          }
        }
      },
      runningSubscribers: {
        entry: /* @__PURE__ */ chunk7D636BPD_cjs.__name(() => {
          this.logger.debug(`Step ${stepNode.step.id} running subscribers`, {
            stepId: stepNode.step.id,
            runId: chunk7D636BPD_cjs.__privateGet(this, _runId)
          });
        }, "entry"),
        exit: /* @__PURE__ */ chunk7D636BPD_cjs.__name(() => {
          this.logger.debug(`Step ${stepNode.step.id} finished running subscribers`, {
            stepId: stepNode.step.id,
            runId: chunk7D636BPD_cjs.__privateGet(this, _runId)
          });
        }, "exit"),
        invoke: {
          src: "spawnSubscriberFunction",
          input: /* @__PURE__ */ chunk7D636BPD_cjs.__name(({ context }) => ({
            parentStepId: stepNode.step.id,
            context
          }), "input"),
          onDone: {
            target: nextStep ? nextStep.step.id : "completed",
            actions: [
              xstate.assign({
                steps: /* @__PURE__ */ chunk7D636BPD_cjs.__name(({ context, event }) => ({
                  ...context.steps,
                  ...event.output.steps
                }), "steps")
              }),
              () => this.logger.debug(`Subscriber execution completed`, { stepId: stepNode.step.id })
            ]
          },
          onError: {
            target: nextStep ? nextStep.step.id : "completed",
            actions: /* @__PURE__ */ chunk7D636BPD_cjs.__name(({ event }) => {
              this.logger.debug(`Subscriber execution failed`, {
                error: event.error,
                stepId: stepNode.step.id
              });
            }, "actions")
          }
        }
      },
      completed: {
        type: "final",
        entry: [
          { type: "notifyStepCompletion", params: { stepId: stepNode.step.id } },
          { type: "snapshotStep", params: { stepId: stepNode.step.id } },
          { type: "persistSnapshot" }
        ]
      },
      failed: {
        type: "final",
        entry: [
          { type: "notifyStepCompletion", params: { stepId: stepNode.step.id } },
          { type: "snapshotStep", params: { stepId: stepNode.step.id } },
          { type: "persistSnapshot" }
        ]
      },
      // build chain of next steps recursively
      ...nextStep ? { [nextStep.step.id]: { ...chunk7D636BPD_cjs.__privateMethod(this, _Machine_instances, buildBaseState_fn).call(this, nextStep, nextSteps) } } : {}
    }
  };
}, "#buildBaseState");
evaluateCondition_fn = /* @__PURE__ */ chunk7D636BPD_cjs.__name(function(condition, context) {
  let andBranchResult = true;
  let baseResult = true;
  let orBranchResult = true;
  const simpleCondition = Object.entries(condition).find(([key]) => key.includes("."));
  if (simpleCondition) {
    const [key, queryValue] = simpleCondition;
    const [stepId, ...pathParts] = key.split(".");
    const path = pathParts.join(".");
    const sourceData = stepId === "trigger" ? context.triggerData : getStepResult(context.steps[stepId]);
    this.logger.debug(`Got condition data from step ${stepId}`, {
      stepId,
      sourceData,
      runId: chunk7D636BPD_cjs.__privateGet(this, _runId)
    });
    if (!sourceData) {
      return false;
    }
    let value = radash.get(sourceData, path);
    if (stepId !== "trigger" && path === "status" && !value) {
      value = "success";
    }
    if (typeof queryValue === "object" && queryValue !== null) {
      baseResult = sift__default.default(queryValue)(value);
    } else {
      baseResult = value === queryValue;
    }
  }
  if ("ref" in condition) {
    const { ref, query } = condition;
    const sourceData = ref.step === "trigger" ? context.triggerData : getStepResult(context.steps[ref.step.id]);
    this.logger.debug(`Got condition data from ${ref.step === "trigger" ? "trigger" : ref.step.id}`, {
      sourceData,
      runId: chunk7D636BPD_cjs.__privateGet(this, _runId)
    });
    if (!sourceData) {
      return false;
    }
    let value = radash.get(sourceData, ref.path);
    if (ref.step !== "trigger" && ref.path === "status" && !value) {
      value = "success";
    }
    baseResult = sift__default.default(query)(value);
  }
  if ("and" in condition) {
    andBranchResult = condition.and.every((cond) => chunk7D636BPD_cjs.__privateMethod(this, _Machine_instances, evaluateCondition_fn).call(this, cond, context));
    this.logger.debug(`Evaluated AND condition`, {
      andBranchResult,
      runId: chunk7D636BPD_cjs.__privateGet(this, _runId)
    });
  }
  if ("or" in condition) {
    orBranchResult = condition.or.some((cond) => chunk7D636BPD_cjs.__privateMethod(this, _Machine_instances, evaluateCondition_fn).call(this, cond, context));
    this.logger.debug(`Evaluated OR condition`, {
      orBranchResult,
      runId: chunk7D636BPD_cjs.__privateGet(this, _runId)
    });
  }
  if ("not" in condition) {
    baseResult = !chunk7D636BPD_cjs.__privateMethod(this, _Machine_instances, evaluateCondition_fn).call(this, condition.not, context);
    this.logger.debug(`Evaluated NOT condition`, {
      baseResult,
      runId: chunk7D636BPD_cjs.__privateGet(this, _runId)
    });
  }
  const finalResult = baseResult && andBranchResult && orBranchResult;
  this.logger.debug(`Evaluated condition`, {
    finalResult,
    runId: chunk7D636BPD_cjs.__privateGet(this, _runId)
  });
  return finalResult;
}, "#evaluateCondition");
chunk7D636BPD_cjs.__name(_Machine, "Machine");
var Machine = _Machine;

// src/workflows/workflow-instance.ts
var _mastra2, _machines, _steps2, _stepGraph2, _stepSubscriberGraph, _retryConfig2, _runId2, _state, _executionSpan2, _onStepTransition, _onFinish, _resultMapping, _suspendedMachines, _compoundDependencies, _WorkflowInstance_instances, loadWorkflowSnapshot_fn, initializeCompoundDependencies_fn, makeStepDef_fn, isCompoundKey_fn;
var _WorkflowInstance = class _WorkflowInstance {
  constructor({
    name,
    logger,
    steps,
    runId,
    retryConfig,
    mastra,
    stepGraph,
    stepSubscriberGraph,
    onFinish,
    onStepTransition,
    resultMapping,
    events
  }) {
    chunk7D636BPD_cjs.__privateAdd(this, _WorkflowInstance_instances);
    chunk7D636BPD_cjs.__publicField(this, "name");
    chunk7D636BPD_cjs.__privateAdd(this, _mastra2);
    chunk7D636BPD_cjs.__privateAdd(this, _machines, {});
    chunk7D636BPD_cjs.__publicField(this, "logger");
    chunk7D636BPD_cjs.__privateAdd(this, _steps2, {});
    chunk7D636BPD_cjs.__privateAdd(this, _stepGraph2);
    chunk7D636BPD_cjs.__privateAdd(this, _stepSubscriberGraph, {});
    chunk7D636BPD_cjs.__privateAdd(this, _retryConfig2);
    chunk7D636BPD_cjs.__publicField(this, "events");
    chunk7D636BPD_cjs.__privateAdd(this, _runId2);
    chunk7D636BPD_cjs.__privateAdd(this, _state, null);
    chunk7D636BPD_cjs.__privateAdd(this, _executionSpan2);
    chunk7D636BPD_cjs.__privateAdd(this, _onStepTransition, /* @__PURE__ */ new Set());
    chunk7D636BPD_cjs.__privateAdd(this, _onFinish);
    chunk7D636BPD_cjs.__privateAdd(this, _resultMapping);
    // indexed by stepId
    chunk7D636BPD_cjs.__privateAdd(this, _suspendedMachines, {});
    // {step1&&step2: {step1: true, step2: true}}
    chunk7D636BPD_cjs.__privateAdd(this, _compoundDependencies, {});
    this.name = name;
    this.logger = logger;
    chunk7D636BPD_cjs.__privateSet(this, _steps2, steps);
    chunk7D636BPD_cjs.__privateSet(this, _stepGraph2, stepGraph);
    chunk7D636BPD_cjs.__privateSet(this, _stepSubscriberGraph, stepSubscriberGraph);
    chunk7D636BPD_cjs.__privateSet(this, _retryConfig2, retryConfig);
    chunk7D636BPD_cjs.__privateSet(this, _mastra2, mastra);
    chunk7D636BPD_cjs.__privateSet(this, _runId2, runId ?? crypto.randomUUID());
    chunk7D636BPD_cjs.__privateSet(this, _onFinish, onFinish);
    chunk7D636BPD_cjs.__privateSet(this, _resultMapping, resultMapping);
    this.events = events;
    onStepTransition?.forEach((handler) => chunk7D636BPD_cjs.__privateGet(this, _onStepTransition).add(handler));
    chunk7D636BPD_cjs.__privateMethod(this, _WorkflowInstance_instances, initializeCompoundDependencies_fn).call(this);
  }
  setState(state) {
    chunk7D636BPD_cjs.__privateSet(this, _state, state);
  }
  get runId() {
    return chunk7D636BPD_cjs.__privateGet(this, _runId2);
  }
  get executionSpan() {
    return chunk7D636BPD_cjs.__privateGet(this, _executionSpan2);
  }
  watch(onTransition) {
    chunk7D636BPD_cjs.__privateGet(this, _onStepTransition).add(onTransition);
    return () => {
      chunk7D636BPD_cjs.__privateGet(this, _onStepTransition).delete(onTransition);
    };
  }
  async start({ triggerData } = {}) {
    const results = await this.execute({ triggerData });
    if (chunk7D636BPD_cjs.__privateGet(this, _onFinish)) {
      chunk7D636BPD_cjs.__privateGet(this, _onFinish).call(this);
    }
    return {
      ...results,
      runId: this.runId
    };
  }
  isCompoundDependencyMet(stepKey) {
    if (!chunk7D636BPD_cjs.__privateMethod(this, _WorkflowInstance_instances, isCompoundKey_fn).call(this, stepKey)) return true;
    const dependencies = chunk7D636BPD_cjs.__privateGet(this, _compoundDependencies)[stepKey];
    return dependencies ? Object.values(dependencies).every((status) => status === true) : true;
  }
  async execute({
    triggerData,
    snapshot,
    stepId,
    resumeData
  } = {}) {
    chunk7D636BPD_cjs.__privateSet(this, _executionSpan2, chunk7D636BPD_cjs.__privateGet(this, _mastra2)?.getTelemetry()?.tracer.startSpan(`workflow.${this.name}.execute`, {
      attributes: { componentName: this.name, runId: this.runId }
    }));
    let machineInput = {
      // Maintain the original step results and their output
      steps: {},
      triggerData: triggerData || {},
      attempts: Object.keys(chunk7D636BPD_cjs.__privateGet(this, _steps2)).reduce(
        (acc, stepKey) => {
          acc[stepKey] = chunk7D636BPD_cjs.__privateGet(this, _steps2)[stepKey]?.retryConfig?.attempts || chunk7D636BPD_cjs.__privateGet(this, _retryConfig2)?.attempts || 0;
          return acc;
        },
        {}
      )
    };
    let stepGraph = chunk7D636BPD_cjs.__privateGet(this, _stepGraph2);
    let startStepId = "trigger";
    if (snapshot) {
      const runState = snapshot;
      if (stepId && runState?.suspendedSteps?.[stepId]) {
        startStepId = runState.suspendedSteps[stepId];
        stepGraph = chunk7D636BPD_cjs.__privateGet(this, _stepSubscriberGraph)[startStepId] ?? chunk7D636BPD_cjs.__privateGet(this, _stepGraph2);
        machineInput = runState.context;
      }
    }
    const defaultMachine = new Machine({
      logger: this.logger,
      mastra: chunk7D636BPD_cjs.__privateGet(this, _mastra2),
      workflowInstance: this,
      name: this.name,
      runId: this.runId,
      steps: chunk7D636BPD_cjs.__privateGet(this, _steps2),
      stepGraph,
      executionSpan: chunk7D636BPD_cjs.__privateGet(this, _executionSpan2),
      startStepId,
      retryConfig: chunk7D636BPD_cjs.__privateGet(this, _retryConfig2)
    });
    chunk7D636BPD_cjs.__privateGet(this, _machines)[startStepId] = defaultMachine;
    const stateUpdateHandler = /* @__PURE__ */ chunk7D636BPD_cjs.__name((startStepId2, state, context) => {
      if (startStepId2 === "trigger") {
        chunk7D636BPD_cjs.__privateSet(this, _state, state);
      } else {
        chunk7D636BPD_cjs.__privateSet(this, _state, mergeChildValue(startStepId2, chunk7D636BPD_cjs.__privateGet(this, _state), state));
      }
      const now = Date.now();
      if (chunk7D636BPD_cjs.__privateGet(this, _onStepTransition)) {
        chunk7D636BPD_cjs.__privateGet(this, _onStepTransition).forEach((onTransition) => {
          void onTransition({
            runId: chunk7D636BPD_cjs.__privateGet(this, _runId2),
            value: chunk7D636BPD_cjs.__privateGet(this, _state),
            context,
            activePaths: getActivePathsAndStatus(chunk7D636BPD_cjs.__privateGet(this, _state)),
            timestamp: now
          });
        });
      }
    }, "stateUpdateHandler");
    defaultMachine.on("state-update", stateUpdateHandler);
    const { results, activePaths } = await defaultMachine.execute({
      snapshot,
      stepId,
      input: machineInput,
      resumeData
    });
    await this.persistWorkflowSnapshot();
    const result = { results, activePaths };
    if (chunk7D636BPD_cjs.__privateGet(this, _resultMapping)) {
      result.result = resolveVariables({
        runId: chunk7D636BPD_cjs.__privateGet(this, _runId2),
        logger: this.logger,
        variables: chunk7D636BPD_cjs.__privateGet(this, _resultMapping),
        context: {
          steps: results,
          triggerData}
      });
    }
    return result;
  }
  hasSubscribers(stepId) {
    return Object.keys(chunk7D636BPD_cjs.__privateGet(this, _stepSubscriberGraph)).some((key) => key.split("&&").includes(stepId));
  }
  async runMachine(parentStepId, input) {
    const stepStatus = input.steps[parentStepId]?.status;
    const subscriberKeys = Object.keys(chunk7D636BPD_cjs.__privateGet(this, _stepSubscriberGraph)).filter((key) => key.split("&&").includes(parentStepId));
    subscriberKeys.forEach((key) => {
      if (["success", "failure", "skipped"].includes(stepStatus) && chunk7D636BPD_cjs.__privateMethod(this, _WorkflowInstance_instances, isCompoundKey_fn).call(this, key)) {
        chunk7D636BPD_cjs.__privateGet(this, _compoundDependencies)[key][parentStepId] = true;
      }
    });
    const stateUpdateHandler = /* @__PURE__ */ chunk7D636BPD_cjs.__name((startStepId, state, context) => {
      if (startStepId === "trigger") {
        chunk7D636BPD_cjs.__privateSet(this, _state, state);
      } else {
        chunk7D636BPD_cjs.__privateSet(this, _state, mergeChildValue(startStepId, chunk7D636BPD_cjs.__privateGet(this, _state), state));
      }
      const now = Date.now();
      if (chunk7D636BPD_cjs.__privateGet(this, _onStepTransition)) {
        chunk7D636BPD_cjs.__privateGet(this, _onStepTransition).forEach((onTransition) => {
          void onTransition({
            runId: chunk7D636BPD_cjs.__privateGet(this, _runId2),
            value: chunk7D636BPD_cjs.__privateGet(this, _state),
            context,
            activePaths: getActivePathsAndStatus(chunk7D636BPD_cjs.__privateGet(this, _state)),
            timestamp: now
          });
        });
      }
    }, "stateUpdateHandler");
    const results = await Promise.all(
      subscriberKeys.map(async (key) => {
        if (!chunk7D636BPD_cjs.__privateGet(this, _stepSubscriberGraph)[key] || !this.isCompoundDependencyMet(key)) {
          return;
        }
        chunk7D636BPD_cjs.__privateMethod(this, _WorkflowInstance_instances, initializeCompoundDependencies_fn).call(this);
        const machine = new Machine({
          logger: this.logger,
          mastra: chunk7D636BPD_cjs.__privateGet(this, _mastra2),
          workflowInstance: this,
          name: parentStepId === "trigger" ? this.name : `${this.name}-${parentStepId}`,
          runId: this.runId,
          steps: chunk7D636BPD_cjs.__privateGet(this, _steps2),
          stepGraph: chunk7D636BPD_cjs.__privateGet(this, _stepSubscriberGraph)[key],
          executionSpan: chunk7D636BPD_cjs.__privateGet(this, _executionSpan2),
          startStepId: parentStepId
        });
        machine.on("state-update", stateUpdateHandler);
        chunk7D636BPD_cjs.__privateGet(this, _machines)[parentStepId] = machine;
        return machine.execute({ input });
      })
    );
    return results;
  }
  async suspend(stepId, machine) {
    chunk7D636BPD_cjs.__privateGet(this, _suspendedMachines)[stepId] = machine;
  }
  /**
   * Persists the workflow state to the database
   */
  async persistWorkflowSnapshot() {
    const existingSnapshot = await chunk7D636BPD_cjs.__privateGet(this, _mastra2)?.storage?.loadWorkflowSnapshot({
      workflowName: this.name,
      runId: chunk7D636BPD_cjs.__privateGet(this, _runId2)
    });
    const machineSnapshots = {};
    for (const [stepId, machine] of Object.entries(chunk7D636BPD_cjs.__privateGet(this, _machines))) {
      const machineSnapshot = machine?.getSnapshot();
      if (machineSnapshot) {
        machineSnapshots[stepId] = { ...machineSnapshot };
      }
    }
    let snapshot = machineSnapshots["trigger"];
    delete machineSnapshots["trigger"];
    const suspendedSteps = Object.entries(chunk7D636BPD_cjs.__privateGet(this, _suspendedMachines)).reduce(
      (acc, [stepId, machine]) => {
        acc[stepId] = machine.startStepId;
        return acc;
      },
      {}
    );
    if (!snapshot && existingSnapshot) {
      existingSnapshot.childStates = { ...existingSnapshot.childStates, ...machineSnapshots };
      existingSnapshot.suspendedSteps = { ...existingSnapshot.suspendedSteps, ...suspendedSteps };
      await chunk7D636BPD_cjs.__privateGet(this, _mastra2)?.storage?.persistWorkflowSnapshot({
        workflowName: this.name,
        runId: chunk7D636BPD_cjs.__privateGet(this, _runId2),
        snapshot: existingSnapshot
      });
      return;
    } else if (snapshot && !existingSnapshot) {
      snapshot.suspendedSteps = suspendedSteps;
      snapshot.childStates = { ...machineSnapshots };
      await chunk7D636BPD_cjs.__privateGet(this, _mastra2)?.storage?.persistWorkflowSnapshot({
        workflowName: this.name,
        runId: chunk7D636BPD_cjs.__privateGet(this, _runId2),
        snapshot
      });
      return;
    } else if (!snapshot) {
      this.logger.debug("Snapshot cannot be persisted. No snapshot received.", { runId: chunk7D636BPD_cjs.__privateGet(this, _runId2) });
      return;
    }
    snapshot.suspendedSteps = { ...existingSnapshot.suspendedSteps, ...suspendedSteps };
    if (!existingSnapshot || snapshot === existingSnapshot) {
      await chunk7D636BPD_cjs.__privateGet(this, _mastra2)?.storage?.persistWorkflowSnapshot({
        workflowName: this.name,
        runId: chunk7D636BPD_cjs.__privateGet(this, _runId2),
        snapshot
      });
      return;
    }
    if (existingSnapshot?.childStates) {
      snapshot.childStates = { ...existingSnapshot.childStates, ...machineSnapshots };
    } else {
      snapshot.childStates = machineSnapshots;
    }
    await chunk7D636BPD_cjs.__privateGet(this, _mastra2)?.storage?.persistWorkflowSnapshot({
      workflowName: this.name,
      runId: chunk7D636BPD_cjs.__privateGet(this, _runId2),
      snapshot
    });
  }
  async getState() {
    const storedSnapshot = await chunk7D636BPD_cjs.__privateGet(this, _mastra2)?.storage?.loadWorkflowSnapshot({
      workflowName: this.name,
      runId: this.runId
    });
    const prevSnapshot = storedSnapshot ? {
      trigger: storedSnapshot,
      ...Object.entries(storedSnapshot?.childStates ?? {}).reduce(
        (acc, [stepId, snapshot2]) => ({ ...acc, [stepId]: snapshot2 }),
        {}
      )
    } : {};
    const currentSnapshot = Object.entries(chunk7D636BPD_cjs.__privateGet(this, _machines)).reduce(
      (acc, [stepId, machine]) => {
        const snapshot2 = machine.getSnapshot();
        if (!snapshot2) {
          return acc;
        }
        return {
          ...acc,
          [stepId]: snapshot2
        };
      },
      {}
    );
    Object.assign(prevSnapshot, currentSnapshot);
    const trigger = prevSnapshot.trigger;
    delete prevSnapshot.trigger;
    const snapshot = { ...trigger};
    const m = getActivePathsAndStatus(prevSnapshot.value);
    return {
      runId: this.runId,
      value: snapshot.value,
      context: snapshot.context,
      activePaths: m,
      timestamp: Date.now()
    };
  }
  async resumeWithEvent(eventName, data) {
    const event = this.events?.[eventName];
    if (!event) {
      throw new Error(`Event ${eventName} not found`);
    }
    const results = await this.resume({ stepId: `__${eventName}_event`, context: { resumedEvent: data } });
    return results;
  }
  async resume({ stepId, context: resumeContext }) {
    await new Promise((resolve) => setTimeout(resolve, 0));
    return this._resume({ stepId, context: resumeContext });
  }
  async _resume({ stepId, context: resumeContext }) {
    const snapshot = await chunk7D636BPD_cjs.__privateMethod(this, _WorkflowInstance_instances, loadWorkflowSnapshot_fn).call(this, this.runId);
    if (!snapshot) {
      throw new Error(`No snapshot found for workflow run ${this.runId}`);
    }
    const stepParts = stepId.split(".");
    const stepPath = stepParts.join(".");
    if (stepParts.length > 1) {
      stepId = stepParts[0] ?? stepId;
    }
    let parsedSnapshot;
    try {
      parsedSnapshot = typeof snapshot === "string" ? JSON.parse(snapshot) : snapshot;
    } catch (error) {
      this.logger.debug("Failed to parse workflow snapshot for resume", { error, runId: this.runId });
      throw new Error("Failed to parse workflow snapshot");
    }
    const startStepId = parsedSnapshot.suspendedSteps?.[stepId];
    if (!startStepId) {
      return;
    }
    parsedSnapshot = startStepId === "trigger" ? parsedSnapshot : { ...parsedSnapshot?.childStates?.[startStepId], ...{ suspendedSteps: parsedSnapshot.suspendedSteps } };
    if (!parsedSnapshot) {
      throw new Error(`No snapshot found for step: ${stepId} starting at ${startStepId}`);
    }
    if (resumeContext) {
      parsedSnapshot.context.steps[stepId] = {
        status: "success",
        output: {
          ...parsedSnapshot?.context?.steps?.[stepId]?.output || {},
          ...resumeContext
        }
      };
    }
    if (parsedSnapshot.children) {
      Object.entries(parsedSnapshot.children).forEach(([_childId, child]) => {
        if (child.snapshot?.input?.stepNode) {
          const stepDef = chunk7D636BPD_cjs.__privateMethod(this, _WorkflowInstance_instances, makeStepDef_fn).call(this, child.snapshot.input.stepNode.step.id);
          child.snapshot.input.stepNode.config = {
            ...child.snapshot.input.stepNode.config,
            ...stepDef
          };
          child.snapshot.input.context = parsedSnapshot.context;
        }
      });
    }
    parsedSnapshot.value = updateStepInHierarchy(parsedSnapshot.value, stepId);
    if (parsedSnapshot.context?.attempts) {
      parsedSnapshot.context.attempts[stepId] = chunk7D636BPD_cjs.__privateGet(this, _steps2)[stepId]?.retryConfig?.attempts || chunk7D636BPD_cjs.__privateGet(this, _retryConfig2)?.attempts || 0;
    }
    this.logger.debug("Resuming workflow with updated snapshot", {
      updatedSnapshot: parsedSnapshot,
      runId: this.runId,
      stepId
    });
    return this.execute({
      snapshot: parsedSnapshot,
      stepId: stepPath,
      resumeData: resumeContext
    });
  }
};
_mastra2 = new WeakMap();
_machines = new WeakMap();
_steps2 = new WeakMap();
_stepGraph2 = new WeakMap();
_stepSubscriberGraph = new WeakMap();
_retryConfig2 = new WeakMap();
_runId2 = new WeakMap();
_state = new WeakMap();
_executionSpan2 = new WeakMap();
_onStepTransition = new WeakMap();
_onFinish = new WeakMap();
_resultMapping = new WeakMap();
_suspendedMachines = new WeakMap();
_compoundDependencies = new WeakMap();
_WorkflowInstance_instances = new WeakSet();
loadWorkflowSnapshot_fn = /* @__PURE__ */ chunk7D636BPD_cjs.__name(async function(runId) {
  if (!chunk7D636BPD_cjs.__privateGet(this, _mastra2)?.storage) {
    this.logger.debug("Snapshot cannot be loaded. Mastra engine is not initialized", { runId });
    return;
  }
  await this.persistWorkflowSnapshot();
  return chunk7D636BPD_cjs.__privateGet(this, _mastra2).getStorage()?.loadWorkflowSnapshot({ runId, workflowName: this.name });
}, "#loadWorkflowSnapshot");
initializeCompoundDependencies_fn = /* @__PURE__ */ chunk7D636BPD_cjs.__name(function() {
  Object.keys(chunk7D636BPD_cjs.__privateGet(this, _stepSubscriberGraph)).forEach((stepKey) => {
    if (chunk7D636BPD_cjs.__privateMethod(this, _WorkflowInstance_instances, isCompoundKey_fn).call(this, stepKey)) {
      const requiredSteps = stepKey.split("&&");
      chunk7D636BPD_cjs.__privateGet(this, _compoundDependencies)[stepKey] = requiredSteps.reduce(
        (acc, step) => {
          acc[step] = false;
          return acc;
        },
        {}
      );
    }
  });
}, "#initializeCompoundDependencies");
makeStepDef_fn = /* @__PURE__ */ chunk7D636BPD_cjs.__name(function(stepId) {
  const executeStep = /* @__PURE__ */ chunk7D636BPD_cjs.__name((handler2, spanName, attributes) => {
    return async (data) => {
      return await api.context.with(api.trace.setSpan(api.context.active(), chunk7D636BPD_cjs.__privateGet(this, _executionSpan2)), async () => {
        if (chunk7D636BPD_cjs.__privateGet(this, _mastra2)?.getTelemetry()) {
          return chunk7D636BPD_cjs.__privateGet(this, _mastra2).getTelemetry()?.traceMethod(handler2, {
            spanName,
            attributes
          })(data);
        } else {
          return handler2(data);
        }
      });
    };
  }, "executeStep");
  const handler = /* @__PURE__ */ chunk7D636BPD_cjs.__name(async ({ context, ...rest }) => {
    const targetStep = chunk7D636BPD_cjs.__privateGet(this, _steps2)[stepId];
    if (!targetStep) throw new Error(`Step not found`);
    const { payload = {}, execute = /* @__PURE__ */ chunk7D636BPD_cjs.__name(async () => {
    }, "execute") } = targetStep;
    const mergedData = {
      ...payload,
      ...context
    };
    const finalAction = chunk7D636BPD_cjs.__privateGet(this, _mastra2)?.getTelemetry() ? executeStep(execute, `workflow.${this.name}.action.${stepId}`, {
      componentName: this.name,
      runId: rest.runId
    }) : execute;
    return finalAction ? await finalAction({ context: mergedData, ...rest }) : {};
  }, "handler");
  const finalHandler = /* @__PURE__ */ chunk7D636BPD_cjs.__name(({ context, ...rest }) => {
    if (chunk7D636BPD_cjs.__privateGet(this, _executionSpan2)) {
      return executeStep(handler, `workflow.${this.name}.step.${stepId}`, {
        componentName: this.name,
        runId: rest?.runId
      })({ context, ...rest });
    }
    return handler({ context, ...rest });
  }, "finalHandler");
  return {
    handler: finalHandler,
    data: {}
  };
}, "#makeStepDef");
isCompoundKey_fn = /* @__PURE__ */ chunk7D636BPD_cjs.__name(function(key) {
  return key.includes("&&");
}, "#isCompoundKey");
chunk7D636BPD_cjs.__name(_WorkflowInstance, "WorkflowInstance");
var WorkflowInstance = _WorkflowInstance;

// src/workflows/workflow.ts
var _retryConfig3, _mastra3, _runs, _isNested, _onStepTransition2, _afterStepStack, _lastStepStack, _ifStack, _stepGraph3, _serializedStepGraph, _stepSubscriberGraph2, _serializedStepSubscriberGraph, _steps3, _Workflow_instances, makeStepKey_fn, makeStepDef_fn2, getActivePathsAndStatus_fn;
var _Workflow = class _Workflow extends chunkSUWCCDLE_cjs.MastraBase {
  /**
   * Creates a new Workflow instance
   * @param name - Identifier for the workflow (not necessarily unique)
   * @param logger - Optional logger instance
   */
  constructor({
    name,
    triggerSchema,
    result,
    retryConfig,
    mastra,
    events
  }) {
    super({ component: "WORKFLOW", name });
    chunk7D636BPD_cjs.__privateAdd(this, _Workflow_instances);
    chunk7D636BPD_cjs.__publicField(this, "name");
    chunk7D636BPD_cjs.__publicField(this, "triggerSchema");
    chunk7D636BPD_cjs.__publicField(this, "resultSchema");
    chunk7D636BPD_cjs.__publicField(this, "resultMapping");
    chunk7D636BPD_cjs.__publicField(this, "events");
    chunk7D636BPD_cjs.__privateAdd(this, _retryConfig3);
    chunk7D636BPD_cjs.__privateAdd(this, _mastra3);
    chunk7D636BPD_cjs.__privateAdd(this, _runs, /* @__PURE__ */ new Map());
    chunk7D636BPD_cjs.__privateAdd(this, _isNested, false);
    chunk7D636BPD_cjs.__privateAdd(this, _onStepTransition2, /* @__PURE__ */ new Set());
    // registers stepIds on `after` calls
    chunk7D636BPD_cjs.__privateAdd(this, _afterStepStack, []);
    chunk7D636BPD_cjs.__privateAdd(this, _lastStepStack, []);
    chunk7D636BPD_cjs.__privateAdd(this, _ifStack, []);
    chunk7D636BPD_cjs.__privateAdd(this, _stepGraph3, { initial: [] });
    chunk7D636BPD_cjs.__privateAdd(this, _serializedStepGraph, { initial: [] });
    chunk7D636BPD_cjs.__privateAdd(this, _stepSubscriberGraph2, {});
    chunk7D636BPD_cjs.__privateAdd(this, _serializedStepSubscriberGraph, {});
    chunk7D636BPD_cjs.__privateAdd(this, _steps3, {});
    this.name = name;
    chunk7D636BPD_cjs.__privateSet(this, _retryConfig3, retryConfig);
    this.triggerSchema = triggerSchema;
    this.resultSchema = result?.schema;
    this.resultMapping = result?.mapping;
    this.events = events;
    if (mastra) {
      this.__registerPrimitives({
        telemetry: mastra.getTelemetry(),
        logger: mastra.getLogger()
      });
      chunk7D636BPD_cjs.__privateSet(this, _mastra3, mastra);
    }
  }
  step(next, config) {
    if (Array.isArray(next)) {
      const nextSteps = next.map((step2) => {
        if (isWorkflow(step2)) {
          const asStep = step2.toStep();
          return asStep;
        } else {
          return step2;
        }
      });
      nextSteps.forEach((step2) => this.step(step2, config));
      this.after(nextSteps);
      this.step(
        new Step({
          id: `__after_${next.map((step2) => step2?.id ?? step2?.name).join("_")}`,
          execute: /* @__PURE__ */ chunk7D636BPD_cjs.__name(async ({ context }) => {
            return { success: true };
          }, "execute")
        })
      );
      return this;
    }
    const { variables = {} } = config || {};
    const requiredData = {};
    for (const [key, variable] of Object.entries(variables)) {
      if (variable && isVariableReference(variable)) {
        requiredData[key] = variable;
      }
    }
    const step = isWorkflow(next) ? (
      // @ts-ignore
      workflowToStep(next, { mastra: chunk7D636BPD_cjs.__privateGet(this, _mastra3) })
    ) : next;
    const stepKey = chunk7D636BPD_cjs.__privateMethod(this, _Workflow_instances, makeStepKey_fn).call(this, step);
    const when = config?.["#internal"]?.when || config?.when;
    const graphEntry = {
      step,
      config: {
        ...chunk7D636BPD_cjs.__privateMethod(this, _Workflow_instances, makeStepDef_fn2).call(this, stepKey),
        ...config,
        loopLabel: config?.["#internal"]?.loopLabel,
        loopType: config?.["#internal"]?.loopType,
        serializedWhen: typeof when === "function" ? when.toString() : when,
        data: requiredData
      }
    };
    chunk7D636BPD_cjs.__privateGet(this, _steps3)[stepKey] = step;
    const parentStepKey = chunk7D636BPD_cjs.__privateGet(this, _afterStepStack)[chunk7D636BPD_cjs.__privateGet(this, _afterStepStack).length - 1];
    const stepGraph = chunk7D636BPD_cjs.__privateGet(this, _stepSubscriberGraph2)[parentStepKey || ""];
    const serializedStepGraph = chunk7D636BPD_cjs.__privateGet(this, _serializedStepSubscriberGraph)[parentStepKey || ""];
    if (parentStepKey && stepGraph) {
      if (!stepGraph.initial.some((step2) => step2.step.id === stepKey)) {
        stepGraph.initial.push(graphEntry);
        if (serializedStepGraph) serializedStepGraph.initial.push(graphEntry);
      }
      stepGraph[stepKey] = [];
      if (serializedStepGraph) serializedStepGraph[stepKey] = [];
    } else {
      if (!chunk7D636BPD_cjs.__privateGet(this, _stepGraph3)[stepKey]) chunk7D636BPD_cjs.__privateGet(this, _stepGraph3)[stepKey] = [];
      chunk7D636BPD_cjs.__privateGet(this, _stepGraph3).initial.push(graphEntry);
      chunk7D636BPD_cjs.__privateGet(this, _serializedStepGraph).initial.push(graphEntry);
    }
    chunk7D636BPD_cjs.__privateGet(this, _lastStepStack).push(stepKey);
    return this;
  }
  then(next, config) {
    if (Array.isArray(next)) {
      const lastStep = chunk7D636BPD_cjs.__privateGet(this, _steps3)[chunk7D636BPD_cjs.__privateGet(this, _lastStepStack)[chunk7D636BPD_cjs.__privateGet(this, _lastStepStack).length - 1] ?? ""];
      if (!lastStep) {
        throw new Error("Condition requires a step to be executed after");
      }
      this.after(lastStep);
      const nextSteps = next.map((step2) => {
        if (isWorkflow(step2)) {
          return workflowToStep(step2, { mastra: chunk7D636BPD_cjs.__privateGet(this, _mastra3) });
        }
        return step2;
      });
      nextSteps.forEach((step2) => this.step(step2, config));
      this.step(
        new Step({
          // @ts-ignore
          id: `__after_${next.map((step2) => step2?.id ?? step2?.name).join("_")}`,
          execute: /* @__PURE__ */ chunk7D636BPD_cjs.__name(async () => {
            return { success: true };
          }, "execute")
        })
      );
      return this;
    }
    const { variables = {} } = config || {};
    const requiredData = {};
    for (const [key, variable] of Object.entries(variables)) {
      if (variable && isVariableReference(variable)) {
        requiredData[key] = variable;
      }
    }
    const lastStepKey = chunk7D636BPD_cjs.__privateGet(this, _lastStepStack)[chunk7D636BPD_cjs.__privateGet(this, _lastStepStack).length - 1];
    const step = isWorkflow(next) ? workflowToStep(next, { mastra: chunk7D636BPD_cjs.__privateGet(this, _mastra3) }) : next;
    const stepKey = chunk7D636BPD_cjs.__privateMethod(this, _Workflow_instances, makeStepKey_fn).call(this, step);
    const when = config?.["#internal"]?.when || config?.when;
    const graphEntry = {
      step,
      config: {
        ...chunk7D636BPD_cjs.__privateMethod(this, _Workflow_instances, makeStepDef_fn2).call(this, stepKey),
        ...config,
        loopLabel: config?.["#internal"]?.loopLabel,
        loopType: config?.["#internal"]?.loopType,
        serializedWhen: typeof when === "function" ? when.toString() : when,
        data: requiredData
      }
    };
    chunk7D636BPD_cjs.__privateGet(this, _steps3)[stepKey] = step;
    if (!lastStepKey) return this;
    const parentStepKey = chunk7D636BPD_cjs.__privateGet(this, _afterStepStack)[chunk7D636BPD_cjs.__privateGet(this, _afterStepStack).length - 1];
    const stepGraph = chunk7D636BPD_cjs.__privateGet(this, _stepSubscriberGraph2)[parentStepKey || ""];
    const serializedStepGraph = chunk7D636BPD_cjs.__privateGet(this, _serializedStepSubscriberGraph)[parentStepKey || ""];
    if (parentStepKey && stepGraph && stepGraph[lastStepKey]) {
      stepGraph[lastStepKey].push(graphEntry);
      if (serializedStepGraph && serializedStepGraph[lastStepKey]) serializedStepGraph[lastStepKey].push(graphEntry);
    } else {
      if (!chunk7D636BPD_cjs.__privateGet(this, _stepGraph3)[lastStepKey]) chunk7D636BPD_cjs.__privateGet(this, _stepGraph3)[lastStepKey] = [];
      if (!chunk7D636BPD_cjs.__privateGet(this, _serializedStepGraph)[lastStepKey]) chunk7D636BPD_cjs.__privateGet(this, _serializedStepGraph)[lastStepKey] = [];
      chunk7D636BPD_cjs.__privateGet(this, _stepGraph3)[lastStepKey].push(graphEntry);
      chunk7D636BPD_cjs.__privateGet(this, _serializedStepGraph)[lastStepKey].push(graphEntry);
    }
    return this;
  }
  loop(applyOperator, condition, fallbackStep, loopType) {
    const lastStepKey = chunk7D636BPD_cjs.__privateGet(this, _lastStepStack)[chunk7D636BPD_cjs.__privateGet(this, _lastStepStack).length - 1];
    if (!lastStepKey) return this;
    const fallbackStepKey = chunk7D636BPD_cjs.__privateMethod(this, _Workflow_instances, makeStepKey_fn).call(this, fallbackStep);
    chunk7D636BPD_cjs.__privateGet(this, _steps3)[fallbackStepKey] = fallbackStep;
    const checkStepKey = `__${fallbackStepKey}_${loopType}_loop_check`;
    const checkStep = {
      id: checkStepKey,
      execute: /* @__PURE__ */ chunk7D636BPD_cjs.__name(async ({ context }) => {
        if (typeof condition === "function") {
          const result = await condition({ context });
          if (loopType === "while") {
            return { status: result ? "continue" : "complete" };
          } else {
            return { status: result ? "complete" : "continue" };
          }
        }
        if (condition && "ref" in condition) {
          const { ref, query } = condition;
          const stepId = typeof ref.step === "string" ? ref.step : "id" in ref.step ? ref.step.id : null;
          if (!stepId) {
            return { status: "continue" };
          }
          const stepOutput = context.steps?.[stepId]?.output;
          if (!stepOutput) {
            return { status: "continue" };
          }
          const value = ref.path.split(".").reduce((obj, key) => obj?.[key], stepOutput);
          const operator = Object.keys(query)[0];
          const target = query[operator];
          return applyOperator(operator, value, target);
        }
        return { status: "continue" };
      }, "execute"),
      outputSchema: zod.z.object({
        status: zod.z.enum(["continue", "complete"])
      })
    };
    chunk7D636BPD_cjs.__privateGet(this, _steps3)[checkStepKey] = checkStep;
    const loopFinishedStepKey = `__${fallbackStepKey}_${loopType}_loop_finished`;
    const loopFinishedStep = {
      id: loopFinishedStepKey,
      execute: /* @__PURE__ */ chunk7D636BPD_cjs.__name(async ({ context }) => {
        return { success: true };
      }, "execute")
    };
    chunk7D636BPD_cjs.__privateGet(this, _steps3)[checkStepKey] = checkStep;
    this.then(checkStep, {
      "#internal": {
        loopLabel: `${fallbackStepKey} ${loopType} loop check`
      }
    });
    this.after(checkStep).step(fallbackStep, {
      when: /* @__PURE__ */ chunk7D636BPD_cjs.__name(async ({ context }) => {
        const checkStepResult = context.steps?.[checkStepKey];
        if (checkStepResult?.status !== "success") {
          return "abort" /* ABORT */;
        }
        const status = checkStepResult?.output?.status;
        return status === "continue" ? "continue" /* CONTINUE */ : "continue_failed" /* CONTINUE_FAILED */;
      }, "when"),
      "#internal": {
        // @ts-ignore
        when: condition,
        loopType
      }
    }).then(checkStep, {
      "#internal": {
        loopLabel: `${fallbackStepKey} ${loopType} loop check`
      }
    }).step(loopFinishedStep, {
      when: /* @__PURE__ */ chunk7D636BPD_cjs.__name(async ({ context }) => {
        const checkStepResult = context.steps?.[checkStepKey];
        if (checkStepResult?.status !== "success") {
          return "continue_failed" /* CONTINUE_FAILED */;
        }
        const status = checkStepResult?.output?.status;
        return status === "complete" ? "continue" /* CONTINUE */ : "continue_failed" /* CONTINUE_FAILED */;
      }, "when"),
      "#internal": {
        loopLabel: `${fallbackStepKey} ${loopType} loop finished`,
        //@ts-ignore
        loopType
      }
    });
    return this;
  }
  while(condition, fallbackStep) {
    const applyOperator = /* @__PURE__ */ chunk7D636BPD_cjs.__name((operator, value, target) => {
      switch (operator) {
        case "$eq":
          return { status: value !== target ? "complete" : "continue" };
        case "$ne":
          return { status: value === target ? "complete" : "continue" };
        case "$gt":
          return { status: value <= target ? "complete" : "continue" };
        case "$gte":
          return { status: value < target ? "complete" : "continue" };
        case "$lt":
          return { status: value >= target ? "complete" : "continue" };
        case "$lte":
          return { status: value > target ? "complete" : "continue" };
        default:
          return { status: "continue" };
      }
    }, "applyOperator");
    return this.loop(applyOperator, condition, fallbackStep, "while");
  }
  until(condition, fallbackStep) {
    const applyOperator = /* @__PURE__ */ chunk7D636BPD_cjs.__name((operator, value, target) => {
      switch (operator) {
        case "$eq":
          return { status: value === target ? "complete" : "continue" };
        case "$ne":
          return { status: value !== target ? "complete" : "continue" };
        case "$gt":
          return { status: value > target ? "complete" : "continue" };
        case "$gte":
          return { status: value >= target ? "complete" : "continue" };
        case "$lt":
          return { status: value < target ? "complete" : "continue" };
        case "$lte":
          return { status: value <= target ? "complete" : "continue" };
        default:
          return { status: "continue" };
      }
    }, "applyOperator");
    return this.loop(applyOperator, condition, fallbackStep, "until");
  }
  if(condition, ifStep, elseStep) {
    const lastStep = chunk7D636BPD_cjs.__privateGet(this, _steps3)[chunk7D636BPD_cjs.__privateGet(this, _lastStepStack)[chunk7D636BPD_cjs.__privateGet(this, _lastStepStack).length - 1] ?? ""];
    if (!lastStep) {
      throw new Error("Condition requires a step to be executed after");
    }
    this.after(lastStep);
    if (ifStep) {
      const _ifStep = isWorkflow(ifStep) ? workflowToStep(ifStep, { mastra: chunk7D636BPD_cjs.__privateGet(this, _mastra3) }) : ifStep;
      this.step(_ifStep, {
        when: condition
      });
      if (elseStep) {
        const _elseStep = isWorkflow(elseStep) ? workflowToStep(elseStep, { mastra: chunk7D636BPD_cjs.__privateGet(this, _mastra3) }) : elseStep;
        this.step(_elseStep, {
          when: typeof condition === "function" ? async (payload) => {
            const result = await condition(payload);
            return !result;
          } : { not: condition }
        });
        this.after([_ifStep, _elseStep]);
      } else {
        this.after(_ifStep);
      }
      this.step(
        new Step({
          id: `${lastStep.id}_if_else`,
          execute: /* @__PURE__ */ chunk7D636BPD_cjs.__name(async () => {
            return { executed: true };
          }, "execute")
        })
      );
      return this;
    }
    const ifStepKey = `__${lastStep.id}_if`;
    this.step(
      {
        id: ifStepKey,
        execute: /* @__PURE__ */ chunk7D636BPD_cjs.__name(async () => {
          return { executed: true };
        }, "execute")
      },
      {
        when: condition
      }
    );
    const elseStepKey = `__${lastStep.id}_else`;
    chunk7D636BPD_cjs.__privateGet(this, _ifStack).push({ condition, elseStepKey, condStep: lastStep });
    return this;
  }
  else() {
    const activeCondition = chunk7D636BPD_cjs.__privateGet(this, _ifStack).pop();
    if (!activeCondition) {
      throw new Error("No active condition found");
    }
    this.after(activeCondition.condStep).step(
      {
        id: activeCondition.elseStepKey,
        execute: /* @__PURE__ */ chunk7D636BPD_cjs.__name(async () => {
          return { executed: true };
        }, "execute")
      },
      {
        when: typeof activeCondition.condition === "function" ? async (payload) => {
          const result = await activeCondition.condition(payload);
          return !result;
        } : { not: activeCondition.condition }
      }
    );
    return this;
  }
  after(steps) {
    const stepsArray = Array.isArray(steps) ? steps : [steps];
    const stepKeys = stepsArray.map((step) => chunk7D636BPD_cjs.__privateMethod(this, _Workflow_instances, makeStepKey_fn).call(this, step));
    const compoundKey = stepKeys.join("&&");
    chunk7D636BPD_cjs.__privateGet(this, _afterStepStack).push(compoundKey);
    if (!chunk7D636BPD_cjs.__privateGet(this, _stepSubscriberGraph2)[compoundKey]) {
      chunk7D636BPD_cjs.__privateGet(this, _stepSubscriberGraph2)[compoundKey] = { initial: [] };
      chunk7D636BPD_cjs.__privateGet(this, _serializedStepSubscriberGraph)[compoundKey] = { initial: [] };
    }
    return this;
  }
  afterEvent(eventName) {
    const event = this.events?.[eventName];
    if (!event) {
      throw new Error(`Event ${eventName} not found`);
    }
    const lastStep = chunk7D636BPD_cjs.__privateGet(this, _steps3)[chunk7D636BPD_cjs.__privateGet(this, _lastStepStack)[chunk7D636BPD_cjs.__privateGet(this, _lastStepStack).length - 1] ?? ""];
    if (!lastStep) {
      throw new Error("Condition requires a step to be executed after");
    }
    const eventStepKey = `__${eventName}_event`;
    const eventStep = new Step({
      id: eventStepKey,
      execute: /* @__PURE__ */ chunk7D636BPD_cjs.__name(async ({ context, suspend }) => {
        if (context.inputData?.resumedEvent) {
          return { executed: true, resumedEvent: context.inputData?.resumedEvent };
        }
        await suspend();
        return { executed: false };
      }, "execute")
    });
    this.after(lastStep).step(eventStep).after(eventStep);
    return this;
  }
  /**
   * Executes the workflow with the given trigger data
   * @param triggerData - Initial data to start the workflow with
   * @returns Promise resolving to workflow results or rejecting with error
   * @throws Error if trigger schema validation fails
   */
  createRun({
    runId,
    events
  } = {}) {
    const run = new WorkflowInstance({
      logger: this.logger,
      name: this.name,
      mastra: chunk7D636BPD_cjs.__privateGet(this, _mastra3),
      retryConfig: chunk7D636BPD_cjs.__privateGet(this, _retryConfig3),
      steps: chunk7D636BPD_cjs.__privateGet(this, _steps3),
      runId,
      stepGraph: chunk7D636BPD_cjs.__privateGet(this, _stepGraph3),
      stepSubscriberGraph: chunk7D636BPD_cjs.__privateGet(this, _stepSubscriberGraph2),
      onStepTransition: chunk7D636BPD_cjs.__privateGet(this, _onStepTransition2),
      resultMapping: this.resultMapping,
      onFinish: /* @__PURE__ */ chunk7D636BPD_cjs.__name(() => {
        chunk7D636BPD_cjs.__privateGet(this, _runs).delete(run.runId);
      }, "onFinish"),
      events
    });
    chunk7D636BPD_cjs.__privateGet(this, _runs).set(run.runId, run);
    return {
      start: run.start.bind(run),
      runId: run.runId,
      watch: run.watch.bind(run),
      resume: run.resume.bind(run),
      resumeWithEvent: run.resumeWithEvent.bind(run)
    };
  }
  /**
   * Gets a workflow run instance by ID
   * @param runId - ID of the run to retrieve
   * @returns The workflow run instance if found, undefined otherwise
   */
  getRun(runId) {
    return chunk7D636BPD_cjs.__privateGet(this, _runs).get(runId);
  }
  /**
   * Rebuilds the machine with the current steps configuration and validates the workflow
   *
   * This is the last step of a workflow builder method chain
   * @throws Error if validation fails
   *
   * @returns this instance for method chaining
   */
  commit() {
    return this;
  }
  getExecutionSpan(runId) {
    return chunk7D636BPD_cjs.__privateGet(this, _runs).get(runId)?.executionSpan;
  }
  async getState(runId) {
    const run = chunk7D636BPD_cjs.__privateGet(this, _runs).get(runId);
    if (run) {
      return run.getState();
    }
    const storedSnapshot = await chunk7D636BPD_cjs.__privateGet(this, _mastra3)?.storage?.loadWorkflowSnapshot({
      runId,
      workflowName: this.name
    });
    if (storedSnapshot) {
      const parsed = storedSnapshot;
      const m = chunk7D636BPD_cjs.__privateMethod(this, _Workflow_instances, getActivePathsAndStatus_fn).call(this, parsed.value);
      return {
        runId,
        value: parsed.value,
        context: parsed.context,
        activePaths: m,
        timestamp: Date.now()
      };
    }
    return null;
  }
  async resume({
    runId,
    stepId,
    context: resumeContext
  }) {
    this.logger.warn(`Please use 'resume' on the 'createRun' call instead, resume is deprecated`);
    const activeRun = chunk7D636BPD_cjs.__privateGet(this, _runs).get(runId);
    if (activeRun) {
      return activeRun.resume({ stepId, context: resumeContext });
    }
    const run = this.createRun({ runId });
    return run.resume({ stepId, context: resumeContext });
  }
  watch(onTransition) {
    this.logger.warn(`Please use 'watch' on the 'createRun' call instead, watch is deprecated`);
    chunk7D636BPD_cjs.__privateGet(this, _onStepTransition2).add(onTransition);
    return () => {
      chunk7D636BPD_cjs.__privateGet(this, _onStepTransition2).delete(onTransition);
    };
  }
  async resumeWithEvent(runId, eventName, data) {
    this.logger.warn(`Please use 'resumeWithEvent' on the 'createRun' call instead, resumeWithEvent is deprecated`);
    const event = this.events?.[eventName];
    if (!event) {
      throw new Error(`Event ${eventName} not found`);
    }
    const results = await this.resume({ runId, stepId: `__${eventName}_event`, context: { resumedEvent: data } });
    return results;
  }
  __registerMastra(mastra) {
    chunk7D636BPD_cjs.__privateSet(this, _mastra3, mastra);
  }
  __registerPrimitives(p) {
    if (p.telemetry) {
      this.__setTelemetry(p.telemetry);
    }
    if (p.logger) {
      this.__setLogger(p.logger);
    }
  }
  get stepGraph() {
    return chunk7D636BPD_cjs.__privateGet(this, _stepGraph3);
  }
  get stepSubscriberGraph() {
    return chunk7D636BPD_cjs.__privateGet(this, _stepSubscriberGraph2);
  }
  get serializedStepGraph() {
    return chunk7D636BPD_cjs.__privateGet(this, _serializedStepGraph);
  }
  get serializedStepSubscriberGraph() {
    return chunk7D636BPD_cjs.__privateGet(this, _serializedStepSubscriberGraph);
  }
  get steps() {
    return chunk7D636BPD_cjs.__privateGet(this, _steps3);
  }
  setNested(isNested) {
    chunk7D636BPD_cjs.__privateSet(this, _isNested, isNested);
  }
  get isNested() {
    return chunk7D636BPD_cjs.__privateGet(this, _isNested);
  }
  toStep() {
    const x = workflowToStep(this, { mastra: chunk7D636BPD_cjs.__privateGet(this, _mastra3) });
    return new Step(x);
  }
};
_retryConfig3 = new WeakMap();
_mastra3 = new WeakMap();
_runs = new WeakMap();
_isNested = new WeakMap();
_onStepTransition2 = new WeakMap();
_afterStepStack = new WeakMap();
_lastStepStack = new WeakMap();
_ifStack = new WeakMap();
_stepGraph3 = new WeakMap();
_serializedStepGraph = new WeakMap();
_stepSubscriberGraph2 = new WeakMap();
_serializedStepSubscriberGraph = new WeakMap();
_steps3 = new WeakMap();
_Workflow_instances = new WeakSet();
makeStepKey_fn = /* @__PURE__ */ chunk7D636BPD_cjs.__name(function(step) {
  return `${step.id ?? step.name}`;
}, "#makeStepKey");
makeStepDef_fn2 = /* @__PURE__ */ chunk7D636BPD_cjs.__name(function(stepId) {
  const executeStep = /* @__PURE__ */ chunk7D636BPD_cjs.__name((handler2, spanName, attributes) => {
    return async (data) => {
      return await api.context.with(
        api.trace.setSpan(api.context.active(), this.getExecutionSpan(attributes?.runId ?? data?.runId)),
        async () => {
          if (this?.telemetry) {
            return this.telemetry.traceMethod(handler2, {
              spanName,
              attributes
            })(data);
          } else {
            return handler2(data);
          }
        }
      );
    };
  }, "executeStep");
  const handler = /* @__PURE__ */ chunk7D636BPD_cjs.__name(async ({ context, ...rest }) => {
    const targetStep = chunk7D636BPD_cjs.__privateGet(this, _steps3)[stepId];
    if (!targetStep) throw new Error(`Step not found`);
    const { payload = {}, execute = /* @__PURE__ */ chunk7D636BPD_cjs.__name(async () => {
    }, "execute") } = targetStep;
    const finalAction = this.telemetry ? executeStep(execute, `workflow.${this.name}.action.${stepId}`, {
      componentName: this.name,
      runId: rest.runId
    }) : execute;
    return finalAction ? await finalAction({
      context: { ...context, inputData: { ...context?.inputData || {}, ...payload } },
      ...rest
    }) : {};
  }, "handler");
  const finalHandler = /* @__PURE__ */ chunk7D636BPD_cjs.__name(({ context, ...rest }) => {
    if (this.getExecutionSpan(rest?.runId)) {
      return executeStep(handler, `workflow.${this.name}.step.${stepId}`, {
        componentName: this.name,
        runId: rest?.runId
      })({ context, ...rest });
    }
    return handler({ context, ...rest });
  }, "finalHandler");
  return {
    handler: finalHandler,
    data: {}
  };
}, "#makeStepDef");
getActivePathsAndStatus_fn = /* @__PURE__ */ chunk7D636BPD_cjs.__name(function(value) {
  const paths = [];
  const traverse = /* @__PURE__ */ chunk7D636BPD_cjs.__name((current, path = []) => {
    for (const [key, value2] of Object.entries(current)) {
      const currentPath = [...path, key];
      if (typeof value2 === "string") {
        paths.push({
          stepPath: currentPath,
          stepId: key,
          status: value2
        });
      } else if (typeof value2 === "object" && value2 !== null) {
        traverse(value2, currentPath);
      }
    }
  }, "traverse");
  traverse(value);
  return paths;
}, "#getActivePathsAndStatus");
chunk7D636BPD_cjs.__name(_Workflow, "Workflow");
var Workflow = _Workflow;

exports.Step = Step;
exports.WhenConditionReturnValue = WhenConditionReturnValue;
exports.Workflow = Workflow;
exports.createStep = createStep;
exports.getActivePathsAndStatus = getActivePathsAndStatus;
exports.getResultActivePaths = getResultActivePaths;
exports.getStepResult = getStepResult;
exports.getSuspendedPaths = getSuspendedPaths;
exports.isErrorEvent = isErrorEvent;
exports.isFinalState = isFinalState;
exports.isLimboState = isLimboState;
exports.isTransitionEvent = isTransitionEvent;
exports.isVariableReference = isVariableReference;
exports.isWorkflow = isWorkflow;
exports.mergeChildValue = mergeChildValue;
exports.recursivelyCheckForFinalState = recursivelyCheckForFinalState;
exports.resolveVariables = resolveVariables;
exports.updateStepInHierarchy = updateStepInHierarchy;
exports.workflowToStep = workflowToStep;
//# sourceMappingURL=chunk-ILWMZFHB.cjs.map
//# sourceMappingURL=chunk-ILWMZFHB.cjs.map