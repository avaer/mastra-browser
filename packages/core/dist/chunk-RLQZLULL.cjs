'use strict';

var chunk5FAJ6HUC_cjs = require('./chunk-5FAJ6HUC.cjs');
var chunkUV2QUUKW_cjs = require('./chunk-UV2QUUKW.cjs');
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
var Step = class {
  id;
  description;
  inputSchema;
  outputSchema;
  payload;
  execute;
  retryConfig;
  mastra;
  constructor({
    id,
    description,
    execute,
    payload,
    outputSchema,
    inputSchema,
    retryConfig
  }) {
    this.id = id;
    this.description = description ?? "";
    this.inputSchema = inputSchema;
    this.payload = payload;
    this.outputSchema = outputSchema;
    this.execute = execute;
    this.retryConfig = retryConfig;
  }
};
function createStep(opts) {
  return new Step(opts);
}

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
function isTransitionEvent(stateEvent) {
  return stateEvent.type.startsWith("xstate.done.actor.");
}
function isVariableReference(value) {
  return typeof value === "object" && "step" in value && "path" in value;
}
function getStepResult(result) {
  if (result?.status === "success") return result.output;
  return void 0;
}
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
function isFinalState(status) {
  return ["completed", "failed"].includes(status);
}
function isLimboState(status) {
  return status === "limbo";
}
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
function getActivePathsAndStatus(value) {
  const paths = [];
  const traverse = (current, path = []) => {
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
  };
  traverse(value);
  return paths;
}
function mergeChildValue(startStepId, parent, child) {
  const traverse = (current) => {
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
  };
  return traverse(parent);
}
var updateStepInHierarchy = (value, targetStepId) => {
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
};
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
function isWorkflow(step) {
  return !!step?.name;
}
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
function workflowToStep(workflow, { mastra }) {
  workflow.setNested(true);
  return {
    id: workflow.name,
    workflow,
    execute: async ({ context, suspend, emit, runId, mastra: mastra2 }) => {
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
    }
  };
}
var Machine = class extends EventEmitter__default.default {
  logger;
  #mastra;
  #workflowInstance;
  #executionSpan;
  #stepGraph;
  #machine;
  #runId;
  #startStepId;
  name;
  #actor = null;
  #steps = {};
  #retryConfig;
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
    this.#mastra = mastra;
    this.#workflowInstance = workflowInstance;
    this.#executionSpan = executionSpan;
    this.logger = logger;
    this.#runId = runId;
    this.#startStepId = startStepId;
    this.name = name;
    this.#stepGraph = stepGraph;
    this.#steps = steps;
    this.#retryConfig = retryConfig;
    this.initializeMachine();
  }
  get startStepId() {
    return this.#startStepId;
  }
  async execute({
    stepId,
    input,
    snapshot,
    resumeData
  } = {}) {
    if (snapshot) {
      this.logger.debug(`Workflow snapshot received`, { runId: this.#runId, snapshot });
    }
    const origSteps = input.steps;
    const isResumedInitialStep = this.#stepGraph?.initial[0]?.step?.id === stepId;
    if (isResumedInitialStep) {
      snapshot = void 0;
      input.steps = {};
    }
    this.logger.debug(`Machine input prepared`, { runId: this.#runId, input });
    const actorSnapshot = snapshot ? {
      ...snapshot,
      context: {
        ...input,
        inputData: { ...snapshot?.context?.inputData || {}, ...resumeData },
        // ts-ignore is needed here because our snapshot types don't really match xstate snapshot types right now. We should fix this in general.
        // @ts-ignore
        isResume: { runId: snapshot?.context?.steps[stepId.split(".")?.[0]]?.output?.runId || this.#runId, stepId }
      }
    } : void 0;
    this.logger.debug(`Creating actor with configuration`, {
      input,
      actorSnapshot,
      runId: this.#runId,
      machineStates: this.#machine.config.states
    });
    this.#actor = xstate.createActor(this.#machine, {
      inspect: (inspectionEvent) => {
        this.logger.debug("XState inspection event", {
          type: inspectionEvent.type,
          event: inspectionEvent.event,
          runId: this.#runId
        });
      },
      input: {
        ...input,
        inputData: { ...snapshot?.context?.inputData || {}, ...resumeData }
      },
      snapshot: actorSnapshot
    });
    this.#actor.start();
    if (stepId) {
      this.#actor.send({ type: "RESET_TO_PENDING", stepId });
    }
    this.logger.debug("Actor started", { runId: this.#runId });
    return new Promise((resolve, reject) => {
      if (!this.#actor) {
        this.logger.error("Actor not initialized", { runId: this.#runId });
        const e = new Error("Actor not initialized");
        this.#executionSpan?.recordException(e);
        this.#executionSpan?.end();
        reject(e);
        return;
      }
      const suspendedPaths = /* @__PURE__ */ new Set();
      this.#actor.subscribe(async (state) => {
        this.emit("state-update", this.#startStepId, state.value, state.context);
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
          runId: this.#runId
        });
        if (!allStatesComplete) {
          this.logger.debug("Not all states complete", {
            allStatesComplete,
            suspendedPaths: Array.from(suspendedPaths),
            runId: this.#runId
          });
          return;
        }
        try {
          this.logger.debug("All states complete", { runId: this.#runId });
          await this.#workflowInstance.persistWorkflowSnapshot();
          this.#cleanup();
          this.#executionSpan?.end();
          resolve({
            results: isResumedInitialStep ? { ...origSteps, ...state.context.steps } : state.context.steps,
            activePaths: getResultActivePaths(
              state
            )
          });
        } catch (error) {
          this.logger.debug("Failed to persist final snapshot", { error });
          this.#cleanup();
          this.#executionSpan?.end();
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
  #cleanup() {
    if (this.#actor) {
      this.#actor.stop();
      this.#actor = null;
    }
    this.removeAllListeners();
  }
  #makeDelayMap() {
    const delayMap = {};
    Object.keys(this.#steps).forEach((stepId) => {
      delayMap[stepId] = this.#steps[stepId]?.retryConfig?.delay || this.#retryConfig?.delay || 1e3;
    });
    return delayMap;
  }
  #getDefaultActions() {
    return {
      updateStepResult: xstate.assign({
        steps: ({ context, event }) => {
          if (!isTransitionEvent(event)) return context.steps;
          const { stepId, result } = event.output;
          return {
            ...context.steps,
            [stepId]: {
              status: "success",
              output: result
            }
          };
        }
      }),
      setStepError: xstate.assign({
        steps: ({ context, event }, params) => {
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
        }
      }),
      notifyStepCompletion: async (_, params) => {
        const { stepId } = params;
        this.logger.debug(`Step ${stepId} completed`);
      },
      snapshotStep: xstate.assign({
        _snapshot: ({}, params) => {
          const { stepId } = params;
          return { stepId };
        }
      }),
      persistSnapshot: async ({ context }) => {
        if (context._snapshot) {
          await this.#workflowInstance.persistWorkflowSnapshot();
        }
        return;
      },
      decrementAttemptCount: xstate.assign({
        attempts: ({ context, event }, params) => {
          if (!isTransitionEvent(event)) return context.attempts;
          const { stepId } = params;
          const attemptCount = context.attempts[stepId];
          if (attemptCount === void 0) return context.attempts;
          return { ...context.attempts, [stepId]: attemptCount - 1 };
        }
      })
    };
  }
  #getDefaultActors() {
    return {
      resolverFunction: xstate.fromPromise(async ({ input }) => {
        const { stepNode, context } = input;
        const attemptCount = context.attempts[stepNode.step.id];
        const resolvedData = this.#resolveVariables({
          stepConfig: stepNode.config,
          context,
          stepId: stepNode.step.id
        });
        this.logger.debug(`Resolved variables for ${stepNode.step.id}`, {
          resolvedData,
          runId: this.#runId
        });
        const logger = this.logger;
        let mastraProxy = void 0;
        if (this.#mastra) {
          mastraProxy = chunk5FAJ6HUC_cjs.createMastraProxy({ mastra: this.#mastra, logger });
        }
        let result = void 0;
        try {
          result = await stepNode.config.handler({
            context: {
              ...context,
              inputData: { ...context?.inputData || {}, ...resolvedData },
              getStepResult: (stepId) => {
                const resolvedStepId = typeof stepId === "string" ? stepId : stepId.id;
                if (resolvedStepId === "trigger") {
                  return context.triggerData;
                }
                const result2 = context.steps[resolvedStepId];
                if (result2 && result2.status === "success") {
                  return result2.output;
                }
                return void 0;
              }
            },
            emit: (event, ...args) => {
              this.emit(event, ...args);
            },
            suspend: async (payload, softSuspend) => {
              await this.#workflowInstance.suspend(stepNode.step.id, this);
              if (this.#actor) {
                context.steps[stepNode.step.id] = {
                  status: "suspended",
                  suspendPayload: payload,
                  output: softSuspend
                };
                this.logger.debug(`Sending SUSPENDED event for step ${stepNode.step.id}`);
                this.#actor?.send({
                  type: "SUSPENDED",
                  suspendPayload: payload,
                  stepId: stepNode.step.id,
                  softSuspend
                });
              } else {
                this.logger.debug(`Actor not available for step ${stepNode.step.id}`);
              }
            },
            runId: this.#runId,
            mastra: mastraProxy
          });
        } catch (error) {
          this.logger.debug(`Step ${stepNode.step.id} failed`, {
            stepId: stepNode.step.id,
            error,
            runId: this.#runId
          });
          this.logger.debug(`Attempt count for step ${stepNode.step.id}`, {
            attemptCount,
            attempts: context.attempts,
            runId: this.#runId,
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
          runId: this.#runId
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
          runId: this.#runId
        });
        if (!stepConfig?.when) {
          return { type: "CONDITIONS_MET" };
        }
        this.logger.debug(`Checking conditions for step ${stepNode.step.id}`, {
          stepId: stepNode.step.id,
          runId: this.#runId
        });
        if (typeof stepConfig?.when === "function") {
          let conditionMet = await stepConfig.when({
            context: {
              ...context,
              getStepResult: (stepId) => {
                const resolvedStepId = typeof stepId === "string" ? stepId : stepId.id;
                if (resolvedStepId === "trigger") {
                  return context.triggerData;
                }
                const result = context.steps[resolvedStepId];
                if (result && result.status === "success") {
                  return result.output;
                }
                return void 0;
              }
            },
            mastra: this.#mastra
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
              runId: this.#runId
            });
            return { type: "CONDITIONS_MET" };
          }
          return this.#workflowInstance.hasSubscribers(stepNode.step.id) ? { type: "CONDITIONS_SKIPPED" } : { type: "CONDITIONS_LIMBO" };
        } else {
          const conditionMet = this.#evaluateCondition(stepConfig.when, context);
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
          const result = await this.#workflowInstance.runMachine(parentStepId, context);
          return Promise.resolve({
            steps: result.reduce((acc, r) => {
              return { ...acc, ...r?.results };
            }, {})
          });
        }
      )
    };
  }
  #resolveVariables({
    stepConfig,
    context,
    stepId
  }) {
    this.logger.debug(`Resolving variables for step ${stepId}`, {
      stepId,
      runId: this.#runId
    });
    const resolvedData = {};
    for (const [key, variable] of Object.entries(stepConfig.data)) {
      const sourceData = variable.step === "trigger" ? context.triggerData : getStepResult(context.steps[variable.step.id]);
      this.logger.debug(
        `Got source data for ${key} variable from ${variable.step === "trigger" ? "trigger" : variable.step.id}`,
        {
          sourceData,
          path: variable.path,
          runId: this.#runId
        }
      );
      if (!sourceData && variable.step !== "trigger") {
        resolvedData[key] = void 0;
        continue;
      }
      const value = variable.path === "" || variable.path === "." ? sourceData : radash.get(sourceData, variable.path);
      this.logger.debug(`Resolved variable ${key}`, {
        value,
        runId: this.#runId
      });
      resolvedData[key] = value;
    }
    return resolvedData;
  }
  initializeMachine() {
    const machine = xstate.setup({
      types: {},
      delays: this.#makeDelayMap(),
      actions: this.#getDefaultActions(),
      actors: this.#getDefaultActors()
    }).createMachine({
      id: this.name,
      type: "parallel",
      context: ({ input }) => ({
        ...input
      }),
      states: this.#buildStateHierarchy(this.#stepGraph)
    });
    this.#machine = machine;
    return machine;
  }
  #buildStateHierarchy(stepGraph) {
    const states = {};
    stepGraph.initial.forEach((stepNode) => {
      const nextSteps = [...stepGraph[stepNode.step.id] || []];
      states[stepNode.step.id] = {
        ...this.#buildBaseState(stepNode, nextSteps)
      };
    });
    return states;
  }
  #buildBaseState(stepNode, nextSteps = []) {
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
          entry: () => {
            this.logger.debug(`Step ${stepNode.step.id} pending`, {
              stepId: stepNode.step.id,
              runId: this.#runId
            });
          },
          exit: () => {
            this.logger.debug(`Step ${stepNode.step.id} finished pending`, {
              stepId: stepNode.step.id,
              runId: this.#runId
            });
          },
          invoke: {
            src: "conditionCheck",
            input: ({ context }) => {
              return {
                context,
                stepNode
              };
            },
            onDone: [
              {
                guard: ({ event }) => {
                  return event.output.type === "SUSPENDED";
                },
                target: "suspended",
                actions: [
                  xstate.assign({
                    steps: ({ context, event }) => {
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
                    },
                    attempts: ({ context, event }) => {
                      if (event.output.type !== "SUSPENDED") return context.attempts;
                      return { ...context.attempts, [stepNode.step.id]: stepNode.step.retryConfig?.attempts || 0 };
                    }
                  })
                ]
              },
              {
                guard: ({ event }) => {
                  return event.output.type === "WAITING";
                },
                target: "waiting",
                actions: [
                  { type: "decrementAttemptCount", params: { stepId: stepNode.step.id } },
                  xstate.assign({
                    steps: ({ context, event }) => {
                      if (event.output.type !== "WAITING") return context.steps;
                      return {
                        ...context.steps,
                        [stepNode.step.id]: {
                          status: "waiting"
                        }
                      };
                    }
                  })
                ]
              },
              {
                guard: ({ event }) => {
                  return event.output.type === "CONDITIONS_MET";
                },
                target: "executing"
              },
              {
                guard: ({ event }) => {
                  return event.output.type === "CONDITIONS_SKIP_TO_COMPLETED";
                },
                target: "completed"
              },
              {
                guard: ({ event }) => {
                  return event.output.type === "CONDITIONS_SKIPPED";
                },
                actions: xstate.assign({
                  steps: ({ context }) => {
                    const newStep = {
                      ...context.steps,
                      [stepNode.step.id]: {
                        status: "skipped"
                      }
                    };
                    this.logger.debug(`Step ${stepNode.step.id} skipped`, {
                      stepId: stepNode.step.id,
                      runId: this.#runId
                    });
                    return newStep;
                  }
                }),
                target: "runningSubscribers"
              },
              {
                guard: ({ event }) => {
                  return event.output.type === "CONDITIONS_LIMBO";
                },
                target: "limbo",
                actions: xstate.assign({
                  steps: ({ context }) => {
                    const newStep = {
                      ...context.steps,
                      [stepNode.step.id]: {
                        status: "skipped"
                      }
                    };
                    this.logger.debug(`Step ${stepNode.step.id} skipped`, {
                      stepId: stepNode.step.id,
                      runId: this.#runId
                    });
                    return newStep;
                  }
                })
              },
              {
                guard: ({ event }) => {
                  return event.output.type === "CONDITION_FAILED";
                },
                target: "failed",
                actions: xstate.assign({
                  steps: ({ context, event }) => {
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
                  }
                })
              }
            ]
          }
        },
        waiting: {
          entry: () => {
            this.logger.debug(`Step ${stepNode.step.id} waiting`, {
              stepId: stepNode.step.id,
              timestamp: (/* @__PURE__ */ new Date()).toISOString(),
              runId: this.#runId
            });
          },
          exit: () => {
            this.logger.debug(`Step ${stepNode.step.id} finished waiting`, {
              stepId: stepNode.step.id,
              timestamp: (/* @__PURE__ */ new Date()).toISOString(),
              runId: this.#runId
            });
          },
          after: {
            [stepNode.step.id]: {
              target: "pending"
            }
          }
        },
        limbo: {
          // no target, will stay in limbo indefinitely
          entry: () => {
            this.logger.debug(`Step ${stepNode.step.id} limbo`, {
              stepId: stepNode.step.id,
              timestamp: (/* @__PURE__ */ new Date()).toISOString(),
              runId: this.#runId
            });
          },
          exit: () => {
            this.logger.debug(`Step ${stepNode.step.id} finished limbo`, {
              stepId: stepNode.step.id,
              timestamp: (/* @__PURE__ */ new Date()).toISOString(),
              runId: this.#runId
            });
          }
        },
        suspended: {
          type: "final",
          entry: [
            () => {
              this.logger.debug(`Step ${stepNode.step.id} suspended`, {
                stepId: stepNode.step.id,
                runId: this.#runId
              });
            },
            xstate.assign({
              steps: ({ context, event }) => {
                return {
                  ...context.steps,
                  [stepNode.step.id]: {
                    ...context?.steps?.[stepNode.step.id] || {},
                    status: "suspended",
                    suspendPayload: event.type === "SUSPENDED" ? event.suspendPayload : void 0,
                    output: event.type === "SUSPENDED" ? event.softSuspend : void 0
                  }
                };
              }
            })
          ]
        },
        executing: {
          entry: () => {
            this.logger.debug(`Step ${stepNode.step.id} executing`, {
              stepId: stepNode.step.id,
              runId: this.#runId
            });
          },
          on: {
            SUSPENDED: {
              target: "suspended",
              actions: [
                xstate.assign({
                  steps: ({ context, event }) => {
                    return {
                      ...context.steps,
                      [stepNode.step.id]: {
                        status: "suspended",
                        suspendPayload: event.type === "SUSPENDED" ? event.suspendPayload : void 0,
                        output: event.type === "SUSPENDED" ? event.softSuspend : void 0
                      }
                    };
                  }
                })
              ]
            }
          },
          invoke: {
            src: "resolverFunction",
            input: ({ context }) => ({
              context,
              stepNode
            }),
            onDone: [
              {
                guard: ({ event }) => {
                  return event.output.type === "STEP_FAILED";
                },
                target: "failed",
                actions: xstate.assign({
                  steps: ({ context, event }) => {
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
                  }
                })
              },
              {
                guard: ({ event }) => {
                  return event.output.type === "STEP_SUCCESS";
                },
                actions: [
                  ({ event }) => {
                    this.logger.debug(`Step ${stepNode.step.id} finished executing`, {
                      stepId: stepNode.step.id,
                      output: event.output,
                      runId: this.#runId
                    });
                  },
                  { type: "updateStepResult", params: { stepId: stepNode.step.id } },
                  { type: "spawnSubscribers", params: { stepId: stepNode.step.id } }
                ],
                target: "runningSubscribers"
              },
              {
                guard: ({ event }) => {
                  return event.output.type === "STEP_WAITING";
                },
                target: "waiting",
                actions: [
                  { type: "decrementAttemptCount", params: { stepId: stepNode.step.id } },
                  xstate.assign({
                    steps: ({ context, event }) => {
                      if (event.output.type !== "STEP_WAITING") return context.steps;
                      return {
                        ...context.steps,
                        [stepNode.step.id]: {
                          status: "waiting"
                        }
                      };
                    }
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
          entry: () => {
            this.logger.debug(`Step ${stepNode.step.id} running subscribers`, {
              stepId: stepNode.step.id,
              runId: this.#runId
            });
          },
          exit: () => {
            this.logger.debug(`Step ${stepNode.step.id} finished running subscribers`, {
              stepId: stepNode.step.id,
              runId: this.#runId
            });
          },
          invoke: {
            src: "spawnSubscriberFunction",
            input: ({ context }) => ({
              parentStepId: stepNode.step.id,
              context
            }),
            onDone: {
              target: nextStep ? nextStep.step.id : "completed",
              actions: [
                xstate.assign({
                  steps: ({ context, event }) => ({
                    ...context.steps,
                    ...event.output.steps
                  })
                }),
                () => this.logger.debug(`Subscriber execution completed`, { stepId: stepNode.step.id })
              ]
            },
            onError: {
              target: nextStep ? nextStep.step.id : "completed",
              actions: ({ event }) => {
                this.logger.debug(`Subscriber execution failed`, {
                  error: event.error,
                  stepId: stepNode.step.id
                });
              }
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
        ...nextStep ? { [nextStep.step.id]: { ...this.#buildBaseState(nextStep, nextSteps) } } : {}
      }
    };
  }
  #evaluateCondition(condition, context) {
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
        runId: this.#runId
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
        runId: this.#runId
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
      andBranchResult = condition.and.every((cond) => this.#evaluateCondition(cond, context));
      this.logger.debug(`Evaluated AND condition`, {
        andBranchResult,
        runId: this.#runId
      });
    }
    if ("or" in condition) {
      orBranchResult = condition.or.some((cond) => this.#evaluateCondition(cond, context));
      this.logger.debug(`Evaluated OR condition`, {
        orBranchResult,
        runId: this.#runId
      });
    }
    if ("not" in condition) {
      baseResult = !this.#evaluateCondition(condition.not, context);
      this.logger.debug(`Evaluated NOT condition`, {
        baseResult,
        runId: this.#runId
      });
    }
    const finalResult = baseResult && andBranchResult && orBranchResult;
    this.logger.debug(`Evaluated condition`, {
      finalResult,
      runId: this.#runId
    });
    return finalResult;
  }
  getSnapshot() {
    const snapshot = this.#actor?.getSnapshot();
    return snapshot;
  }
};

// src/workflows/workflow-instance.ts
var WorkflowInstance = class {
  name;
  #mastra;
  #machines = {};
  logger;
  #steps = {};
  #stepGraph;
  #stepSubscriberGraph = {};
  #retryConfig;
  events;
  #runId;
  #state = null;
  #executionSpan;
  #onStepTransition = /* @__PURE__ */ new Set();
  #onFinish;
  #resultMapping;
  // indexed by stepId
  #suspendedMachines = {};
  // {step1&&step2: {step1: true, step2: true}}
  #compoundDependencies = {};
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
    this.name = name;
    this.logger = logger;
    this.#steps = steps;
    this.#stepGraph = stepGraph;
    this.#stepSubscriberGraph = stepSubscriberGraph;
    this.#retryConfig = retryConfig;
    this.#mastra = mastra;
    this.#runId = runId ?? crypto.randomUUID();
    this.#onFinish = onFinish;
    this.#resultMapping = resultMapping;
    this.events = events;
    onStepTransition?.forEach((handler) => this.#onStepTransition.add(handler));
    this.#initializeCompoundDependencies();
  }
  setState(state) {
    this.#state = state;
  }
  get runId() {
    return this.#runId;
  }
  get executionSpan() {
    return this.#executionSpan;
  }
  watch(onTransition) {
    this.#onStepTransition.add(onTransition);
    return () => {
      this.#onStepTransition.delete(onTransition);
    };
  }
  async start({ triggerData } = {}) {
    const results = await this.execute({ triggerData });
    if (this.#onFinish) {
      this.#onFinish();
    }
    return {
      ...results,
      runId: this.runId
    };
  }
  isCompoundDependencyMet(stepKey) {
    if (!this.#isCompoundKey(stepKey)) return true;
    const dependencies = this.#compoundDependencies[stepKey];
    return dependencies ? Object.values(dependencies).every((status) => status === true) : true;
  }
  async execute({
    triggerData,
    snapshot,
    stepId,
    resumeData
  } = {}) {
    this.#executionSpan = this.#mastra?.getTelemetry()?.tracer.startSpan(`workflow.${this.name}.execute`, {
      attributes: { componentName: this.name, runId: this.runId }
    });
    let machineInput = {
      // Maintain the original step results and their output
      steps: {},
      triggerData: triggerData || {},
      attempts: Object.keys(this.#steps).reduce(
        (acc, stepKey) => {
          acc[stepKey] = this.#steps[stepKey]?.retryConfig?.attempts || this.#retryConfig?.attempts || 0;
          return acc;
        },
        {}
      )
    };
    let stepGraph = this.#stepGraph;
    let startStepId = "trigger";
    if (snapshot) {
      const runState = snapshot;
      if (stepId && runState?.suspendedSteps?.[stepId]) {
        startStepId = runState.suspendedSteps[stepId];
        stepGraph = this.#stepSubscriberGraph[startStepId] ?? this.#stepGraph;
        machineInput = runState.context;
      }
    }
    const defaultMachine = new Machine({
      logger: this.logger,
      mastra: this.#mastra,
      workflowInstance: this,
      name: this.name,
      runId: this.runId,
      steps: this.#steps,
      stepGraph,
      executionSpan: this.#executionSpan,
      startStepId,
      retryConfig: this.#retryConfig
    });
    this.#machines[startStepId] = defaultMachine;
    const stateUpdateHandler = (startStepId2, state, context) => {
      if (startStepId2 === "trigger") {
        this.#state = state;
      } else {
        this.#state = mergeChildValue(startStepId2, this.#state, state);
      }
      const now = Date.now();
      if (this.#onStepTransition) {
        this.#onStepTransition.forEach((onTransition) => {
          void onTransition({
            runId: this.#runId,
            value: this.#state,
            context,
            activePaths: getActivePathsAndStatus(this.#state),
            timestamp: now
          });
        });
      }
    };
    defaultMachine.on("state-update", stateUpdateHandler);
    const { results, activePaths } = await defaultMachine.execute({
      snapshot,
      stepId,
      input: machineInput,
      resumeData
    });
    await this.persistWorkflowSnapshot();
    const result = { results, activePaths };
    if (this.#resultMapping) {
      result.result = resolveVariables({
        runId: this.#runId,
        logger: this.logger,
        variables: this.#resultMapping,
        context: {
          steps: results,
          triggerData}
      });
    }
    return result;
  }
  hasSubscribers(stepId) {
    return Object.keys(this.#stepSubscriberGraph).some((key) => key.split("&&").includes(stepId));
  }
  async runMachine(parentStepId, input) {
    const stepStatus = input.steps[parentStepId]?.status;
    const subscriberKeys = Object.keys(this.#stepSubscriberGraph).filter((key) => key.split("&&").includes(parentStepId));
    subscriberKeys.forEach((key) => {
      if (["success", "failure", "skipped"].includes(stepStatus) && this.#isCompoundKey(key)) {
        this.#compoundDependencies[key][parentStepId] = true;
      }
    });
    const stateUpdateHandler = (startStepId, state, context) => {
      if (startStepId === "trigger") {
        this.#state = state;
      } else {
        this.#state = mergeChildValue(startStepId, this.#state, state);
      }
      const now = Date.now();
      if (this.#onStepTransition) {
        this.#onStepTransition.forEach((onTransition) => {
          void onTransition({
            runId: this.#runId,
            value: this.#state,
            context,
            activePaths: getActivePathsAndStatus(this.#state),
            timestamp: now
          });
        });
      }
    };
    const results = await Promise.all(
      subscriberKeys.map(async (key) => {
        if (!this.#stepSubscriberGraph[key] || !this.isCompoundDependencyMet(key)) {
          return;
        }
        this.#initializeCompoundDependencies();
        const machine = new Machine({
          logger: this.logger,
          mastra: this.#mastra,
          workflowInstance: this,
          name: parentStepId === "trigger" ? this.name : `${this.name}-${parentStepId}`,
          runId: this.runId,
          steps: this.#steps,
          stepGraph: this.#stepSubscriberGraph[key],
          executionSpan: this.#executionSpan,
          startStepId: parentStepId
        });
        machine.on("state-update", stateUpdateHandler);
        this.#machines[parentStepId] = machine;
        return machine.execute({ input });
      })
    );
    return results;
  }
  async suspend(stepId, machine) {
    this.#suspendedMachines[stepId] = machine;
  }
  /**
   * Persists the workflow state to the database
   */
  async persistWorkflowSnapshot() {
    const existingSnapshot = await this.#mastra?.storage?.loadWorkflowSnapshot({
      workflowName: this.name,
      runId: this.#runId
    });
    const machineSnapshots = {};
    for (const [stepId, machine] of Object.entries(this.#machines)) {
      const machineSnapshot = machine?.getSnapshot();
      if (machineSnapshot) {
        machineSnapshots[stepId] = { ...machineSnapshot };
      }
    }
    let snapshot = machineSnapshots["trigger"];
    delete machineSnapshots["trigger"];
    const suspendedSteps = Object.entries(this.#suspendedMachines).reduce(
      (acc, [stepId, machine]) => {
        acc[stepId] = machine.startStepId;
        return acc;
      },
      {}
    );
    if (!snapshot && existingSnapshot) {
      existingSnapshot.childStates = { ...existingSnapshot.childStates, ...machineSnapshots };
      existingSnapshot.suspendedSteps = { ...existingSnapshot.suspendedSteps, ...suspendedSteps };
      await this.#mastra?.storage?.persistWorkflowSnapshot({
        workflowName: this.name,
        runId: this.#runId,
        snapshot: existingSnapshot
      });
      return;
    } else if (snapshot && !existingSnapshot) {
      snapshot.suspendedSteps = suspendedSteps;
      snapshot.childStates = { ...machineSnapshots };
      await this.#mastra?.storage?.persistWorkflowSnapshot({
        workflowName: this.name,
        runId: this.#runId,
        snapshot
      });
      return;
    } else if (!snapshot) {
      this.logger.debug("Snapshot cannot be persisted. No snapshot received.", { runId: this.#runId });
      return;
    }
    snapshot.suspendedSteps = { ...existingSnapshot.suspendedSteps, ...suspendedSteps };
    if (!existingSnapshot || snapshot === existingSnapshot) {
      await this.#mastra?.storage?.persistWorkflowSnapshot({
        workflowName: this.name,
        runId: this.#runId,
        snapshot
      });
      return;
    }
    if (existingSnapshot?.childStates) {
      snapshot.childStates = { ...existingSnapshot.childStates, ...machineSnapshots };
    } else {
      snapshot.childStates = machineSnapshots;
    }
    await this.#mastra?.storage?.persistWorkflowSnapshot({
      workflowName: this.name,
      runId: this.#runId,
      snapshot
    });
  }
  async getState() {
    const storedSnapshot = await this.#mastra?.storage?.loadWorkflowSnapshot({
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
    const currentSnapshot = Object.entries(this.#machines).reduce(
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
  async #loadWorkflowSnapshot(runId) {
    if (!this.#mastra?.storage) {
      this.logger.debug("Snapshot cannot be loaded. Mastra engine is not initialized", { runId });
      return;
    }
    await this.persistWorkflowSnapshot();
    return this.#mastra.getStorage()?.loadWorkflowSnapshot({ runId, workflowName: this.name });
  }
  async _resume({ stepId, context: resumeContext }) {
    const snapshot = await this.#loadWorkflowSnapshot(this.runId);
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
          const stepDef = this.#makeStepDef(child.snapshot.input.stepNode.step.id);
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
      parsedSnapshot.context.attempts[stepId] = this.#steps[stepId]?.retryConfig?.attempts || this.#retryConfig?.attempts || 0;
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
  #initializeCompoundDependencies() {
    Object.keys(this.#stepSubscriberGraph).forEach((stepKey) => {
      if (this.#isCompoundKey(stepKey)) {
        const requiredSteps = stepKey.split("&&");
        this.#compoundDependencies[stepKey] = requiredSteps.reduce(
          (acc, step) => {
            acc[step] = false;
            return acc;
          },
          {}
        );
      }
    });
  }
  #makeStepDef(stepId) {
    const executeStep = (handler2, spanName, attributes) => {
      return async (data) => {
        return await api.context.with(api.trace.setSpan(api.context.active(), this.#executionSpan), async () => {
          if (this.#mastra?.getTelemetry()) {
            return this.#mastra.getTelemetry()?.traceMethod(handler2, {
              spanName,
              attributes
            })(data);
          } else {
            return handler2(data);
          }
        });
      };
    };
    const handler = async ({ context, ...rest }) => {
      const targetStep = this.#steps[stepId];
      if (!targetStep) throw new Error(`Step not found`);
      const { payload = {}, execute = async () => {
      } } = targetStep;
      const mergedData = {
        ...payload,
        ...context
      };
      const finalAction = this.#mastra?.getTelemetry() ? executeStep(execute, `workflow.${this.name}.action.${stepId}`, {
        componentName: this.name,
        runId: rest.runId
      }) : execute;
      return finalAction ? await finalAction({ context: mergedData, ...rest }) : {};
    };
    const finalHandler = ({ context, ...rest }) => {
      if (this.#executionSpan) {
        return executeStep(handler, `workflow.${this.name}.step.${stepId}`, {
          componentName: this.name,
          runId: rest?.runId
        })({ context, ...rest });
      }
      return handler({ context, ...rest });
    };
    return {
      handler: finalHandler,
      data: {}
    };
  }
  #isCompoundKey(key) {
    return key.includes("&&");
  }
};

// src/workflows/workflow.ts
var Workflow = class extends chunkUV2QUUKW_cjs.MastraBase {
  name;
  triggerSchema;
  resultSchema;
  resultMapping;
  events;
  #retryConfig;
  #mastra;
  #runs = /* @__PURE__ */ new Map();
  #isNested = false;
  #onStepTransition = /* @__PURE__ */ new Set();
  // registers stepIds on `after` calls
  #afterStepStack = [];
  #lastStepStack = [];
  #ifStack = [];
  #stepGraph = { initial: [] };
  #serializedStepGraph = { initial: [] };
  #stepSubscriberGraph = {};
  #serializedStepSubscriberGraph = {};
  #steps = {};
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
    this.name = name;
    this.#retryConfig = retryConfig;
    this.triggerSchema = triggerSchema;
    this.resultSchema = result?.schema;
    this.resultMapping = result?.mapping;
    this.events = events;
    if (mastra) {
      this.__registerPrimitives({
        telemetry: mastra.getTelemetry(),
        logger: mastra.getLogger()
      });
      this.#mastra = mastra;
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
          execute: async ({ context }) => {
            return { success: true };
          }
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
      workflowToStep(next, { mastra: this.#mastra })
    ) : next;
    const stepKey = this.#makeStepKey(step);
    const when = config?.["#internal"]?.when || config?.when;
    const graphEntry = {
      step,
      config: {
        ...this.#makeStepDef(stepKey),
        ...config,
        loopLabel: config?.["#internal"]?.loopLabel,
        loopType: config?.["#internal"]?.loopType,
        serializedWhen: typeof when === "function" ? when.toString() : when,
        data: requiredData
      }
    };
    this.#steps[stepKey] = step;
    const parentStepKey = this.#afterStepStack[this.#afterStepStack.length - 1];
    const stepGraph = this.#stepSubscriberGraph[parentStepKey || ""];
    const serializedStepGraph = this.#serializedStepSubscriberGraph[parentStepKey || ""];
    if (parentStepKey && stepGraph) {
      if (!stepGraph.initial.some((step2) => step2.step.id === stepKey)) {
        stepGraph.initial.push(graphEntry);
        if (serializedStepGraph) serializedStepGraph.initial.push(graphEntry);
      }
      stepGraph[stepKey] = [];
      if (serializedStepGraph) serializedStepGraph[stepKey] = [];
    } else {
      if (!this.#stepGraph[stepKey]) this.#stepGraph[stepKey] = [];
      this.#stepGraph.initial.push(graphEntry);
      this.#serializedStepGraph.initial.push(graphEntry);
    }
    this.#lastStepStack.push(stepKey);
    return this;
  }
  #makeStepKey(step) {
    return `${step.id ?? step.name}`;
  }
  then(next, config) {
    if (Array.isArray(next)) {
      const lastStep = this.#steps[this.#lastStepStack[this.#lastStepStack.length - 1] ?? ""];
      if (!lastStep) {
        throw new Error("Condition requires a step to be executed after");
      }
      this.after(lastStep);
      const nextSteps = next.map((step2) => {
        if (isWorkflow(step2)) {
          return workflowToStep(step2, { mastra: this.#mastra });
        }
        return step2;
      });
      nextSteps.forEach((step2) => this.step(step2, config));
      this.step(
        new Step({
          // @ts-ignore
          id: `__after_${next.map((step2) => step2?.id ?? step2?.name).join("_")}`,
          execute: async () => {
            return { success: true };
          }
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
    const lastStepKey = this.#lastStepStack[this.#lastStepStack.length - 1];
    const step = isWorkflow(next) ? workflowToStep(next, { mastra: this.#mastra }) : next;
    const stepKey = this.#makeStepKey(step);
    const when = config?.["#internal"]?.when || config?.when;
    const graphEntry = {
      step,
      config: {
        ...this.#makeStepDef(stepKey),
        ...config,
        loopLabel: config?.["#internal"]?.loopLabel,
        loopType: config?.["#internal"]?.loopType,
        serializedWhen: typeof when === "function" ? when.toString() : when,
        data: requiredData
      }
    };
    this.#steps[stepKey] = step;
    if (!lastStepKey) return this;
    const parentStepKey = this.#afterStepStack[this.#afterStepStack.length - 1];
    const stepGraph = this.#stepSubscriberGraph[parentStepKey || ""];
    const serializedStepGraph = this.#serializedStepSubscriberGraph[parentStepKey || ""];
    if (parentStepKey && stepGraph && stepGraph[lastStepKey]) {
      stepGraph[lastStepKey].push(graphEntry);
      if (serializedStepGraph && serializedStepGraph[lastStepKey]) serializedStepGraph[lastStepKey].push(graphEntry);
    } else {
      if (!this.#stepGraph[lastStepKey]) this.#stepGraph[lastStepKey] = [];
      if (!this.#serializedStepGraph[lastStepKey]) this.#serializedStepGraph[lastStepKey] = [];
      this.#stepGraph[lastStepKey].push(graphEntry);
      this.#serializedStepGraph[lastStepKey].push(graphEntry);
    }
    return this;
  }
  loop(applyOperator, condition, fallbackStep, loopType) {
    const lastStepKey = this.#lastStepStack[this.#lastStepStack.length - 1];
    if (!lastStepKey) return this;
    const fallbackStepKey = this.#makeStepKey(fallbackStep);
    this.#steps[fallbackStepKey] = fallbackStep;
    const checkStepKey = `__${fallbackStepKey}_${loopType}_loop_check`;
    const checkStep = {
      id: checkStepKey,
      execute: async ({ context }) => {
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
      },
      outputSchema: zod.z.object({
        status: zod.z.enum(["continue", "complete"])
      })
    };
    this.#steps[checkStepKey] = checkStep;
    const loopFinishedStepKey = `__${fallbackStepKey}_${loopType}_loop_finished`;
    const loopFinishedStep = {
      id: loopFinishedStepKey,
      execute: async ({ context }) => {
        return { success: true };
      }
    };
    this.#steps[checkStepKey] = checkStep;
    this.then(checkStep, {
      "#internal": {
        loopLabel: `${fallbackStepKey} ${loopType} loop check`
      }
    });
    this.after(checkStep).step(fallbackStep, {
      when: async ({ context }) => {
        const checkStepResult = context.steps?.[checkStepKey];
        if (checkStepResult?.status !== "success") {
          return "abort" /* ABORT */;
        }
        const status = checkStepResult?.output?.status;
        return status === "continue" ? "continue" /* CONTINUE */ : "continue_failed" /* CONTINUE_FAILED */;
      },
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
      when: async ({ context }) => {
        const checkStepResult = context.steps?.[checkStepKey];
        if (checkStepResult?.status !== "success") {
          return "continue_failed" /* CONTINUE_FAILED */;
        }
        const status = checkStepResult?.output?.status;
        return status === "complete" ? "continue" /* CONTINUE */ : "continue_failed" /* CONTINUE_FAILED */;
      },
      "#internal": {
        loopLabel: `${fallbackStepKey} ${loopType} loop finished`,
        //@ts-ignore
        loopType
      }
    });
    return this;
  }
  while(condition, fallbackStep) {
    const applyOperator = (operator, value, target) => {
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
    };
    return this.loop(applyOperator, condition, fallbackStep, "while");
  }
  until(condition, fallbackStep) {
    const applyOperator = (operator, value, target) => {
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
    };
    return this.loop(applyOperator, condition, fallbackStep, "until");
  }
  if(condition, ifStep, elseStep) {
    const lastStep = this.#steps[this.#lastStepStack[this.#lastStepStack.length - 1] ?? ""];
    if (!lastStep) {
      throw new Error("Condition requires a step to be executed after");
    }
    this.after(lastStep);
    if (ifStep) {
      const _ifStep = isWorkflow(ifStep) ? workflowToStep(ifStep, { mastra: this.#mastra }) : ifStep;
      this.step(_ifStep, {
        when: condition
      });
      if (elseStep) {
        const _elseStep = isWorkflow(elseStep) ? workflowToStep(elseStep, { mastra: this.#mastra }) : elseStep;
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
          execute: async () => {
            return { executed: true };
          }
        })
      );
      return this;
    }
    const ifStepKey = `__${lastStep.id}_if`;
    this.step(
      {
        id: ifStepKey,
        execute: async () => {
          return { executed: true };
        }
      },
      {
        when: condition
      }
    );
    const elseStepKey = `__${lastStep.id}_else`;
    this.#ifStack.push({ condition, elseStepKey, condStep: lastStep });
    return this;
  }
  else() {
    const activeCondition = this.#ifStack.pop();
    if (!activeCondition) {
      throw new Error("No active condition found");
    }
    this.after(activeCondition.condStep).step(
      {
        id: activeCondition.elseStepKey,
        execute: async () => {
          return { executed: true };
        }
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
    const stepKeys = stepsArray.map((step) => this.#makeStepKey(step));
    const compoundKey = stepKeys.join("&&");
    this.#afterStepStack.push(compoundKey);
    if (!this.#stepSubscriberGraph[compoundKey]) {
      this.#stepSubscriberGraph[compoundKey] = { initial: [] };
      this.#serializedStepSubscriberGraph[compoundKey] = { initial: [] };
    }
    return this;
  }
  afterEvent(eventName) {
    const event = this.events?.[eventName];
    if (!event) {
      throw new Error(`Event ${eventName} not found`);
    }
    const lastStep = this.#steps[this.#lastStepStack[this.#lastStepStack.length - 1] ?? ""];
    if (!lastStep) {
      throw new Error("Condition requires a step to be executed after");
    }
    const eventStepKey = `__${eventName}_event`;
    const eventStep = new Step({
      id: eventStepKey,
      execute: async ({ context, suspend }) => {
        if (context.inputData?.resumedEvent) {
          return { executed: true, resumedEvent: context.inputData?.resumedEvent };
        }
        await suspend();
        return { executed: false };
      }
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
      mastra: this.#mastra,
      retryConfig: this.#retryConfig,
      steps: this.#steps,
      runId,
      stepGraph: this.#stepGraph,
      stepSubscriberGraph: this.#stepSubscriberGraph,
      onStepTransition: this.#onStepTransition,
      resultMapping: this.resultMapping,
      onFinish: () => {
        this.#runs.delete(run.runId);
      },
      events
    });
    this.#runs.set(run.runId, run);
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
    return this.#runs.get(runId);
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
  // record all object paths that leads to a suspended state
  #getSuspendedPaths({
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
        (key) => this.#getSuspendedPaths({ value: value[key], path: path ? `${path}.${key}` : key, suspendedPaths })
      );
    }
  }
  async #loadWorkflowSnapshot(runId) {
    if (!this.#mastra?.storage) {
      this.logger.debug("Snapshot cannot be loaded. Mastra engine is not initialized", { runId });
      return;
    }
    const activeRun = this.#runs.get(runId);
    if (activeRun) {
      await activeRun.persistWorkflowSnapshot();
    }
    return this.#mastra.storage.loadWorkflowSnapshot({ runId, workflowName: this.name });
  }
  getExecutionSpan(runId) {
    return this.#runs.get(runId)?.executionSpan;
  }
  #makeStepDef(stepId) {
    const executeStep = (handler2, spanName, attributes) => {
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
    };
    const handler = async ({ context, ...rest }) => {
      const targetStep = this.#steps[stepId];
      if (!targetStep) throw new Error(`Step not found`);
      const { payload = {}, execute = async () => {
      } } = targetStep;
      const finalAction = this.telemetry ? executeStep(execute, `workflow.${this.name}.action.${stepId}`, {
        componentName: this.name,
        runId: rest.runId
      }) : execute;
      return finalAction ? await finalAction({
        context: { ...context, inputData: { ...context?.inputData || {}, ...payload } },
        ...rest
      }) : {};
    };
    const finalHandler = ({ context, ...rest }) => {
      if (this.getExecutionSpan(rest?.runId)) {
        return executeStep(handler, `workflow.${this.name}.step.${stepId}`, {
          componentName: this.name,
          runId: rest?.runId
        })({ context, ...rest });
      }
      return handler({ context, ...rest });
    };
    return {
      handler: finalHandler,
      data: {}
    };
  }
  #getActivePathsAndStatus(value) {
    const paths = [];
    const traverse = (current, path = []) => {
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
    };
    traverse(value);
    return paths;
  }
  async getState(runId) {
    const run = this.#runs.get(runId);
    if (run) {
      return run.getState();
    }
    const storedSnapshot = await this.#mastra?.storage?.loadWorkflowSnapshot({
      runId,
      workflowName: this.name
    });
    if (storedSnapshot) {
      const parsed = storedSnapshot;
      const m = this.#getActivePathsAndStatus(parsed.value);
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
    const activeRun = this.#runs.get(runId);
    if (activeRun) {
      return activeRun.resume({ stepId, context: resumeContext });
    }
    const run = this.createRun({ runId });
    return run.resume({ stepId, context: resumeContext });
  }
  watch(onTransition) {
    this.logger.warn(`Please use 'watch' on the 'createRun' call instead, watch is deprecated`);
    this.#onStepTransition.add(onTransition);
    return () => {
      this.#onStepTransition.delete(onTransition);
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
    this.#mastra = mastra;
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
    return this.#stepGraph;
  }
  get stepSubscriberGraph() {
    return this.#stepSubscriberGraph;
  }
  get serializedStepGraph() {
    return this.#serializedStepGraph;
  }
  get serializedStepSubscriberGraph() {
    return this.#serializedStepSubscriberGraph;
  }
  get steps() {
    return this.#steps;
  }
  setNested(isNested) {
    this.#isNested = isNested;
  }
  get isNested() {
    return this.#isNested;
  }
  toStep() {
    const x = workflowToStep(this, { mastra: this.#mastra });
    return new Step(x);
  }
};

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
