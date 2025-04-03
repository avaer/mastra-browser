import { a5 as VariableReference, ac as StepResult, S as Step, W as Workflow, e as WorkflowContext, M as Mastra, a0 as StepAction, ae as WorkflowRunResult } from '../base-N5q5S7z6.cjs';
export { a7 as ActionContext, a6 as BaseCondition, ak as DependencyCheckOutput, ar as ExtractSchemaFromStep, au as ExtractSchemaType, as as ExtractStepResult, av as PathsToStringProps, ah as ResolverFunctionInput, ai as ResolverFunctionOutput, a4 as RetryConfig, aa as StepCondition, ab as StepConfig, a9 as StepDef, d as StepExecutionContext, a3 as StepGraph, aq as StepId, at as StepInputType, a2 as StepNode, al as StepResolverOutput, a1 as StepVariableType, ad as StepsRecord, aj as SubscriberFunctionOutput, a8 as WhenConditionReturnValue, an as WorkflowActionParams, ao as WorkflowActions, am as WorkflowActors, ag as WorkflowEvent, af as WorkflowLogMessage, p as WorkflowOptions, ax as WorkflowResumeResult, aw as WorkflowRunState, ap as WorkflowState, ay as createStep } from '../base-N5q5S7z6.cjs';
import { z } from 'zod';
import { L as Logger } from '../index-BXwGr3N7.cjs';
import 'ai';
import '../base-D_N8PfP5.cjs';
import '@opentelemetry/api';
import '@opentelemetry/sdk-trace-base';
import '../types-CwTG2XyQ.cjs';
import 'sift';
import 'json-schema';
import 'xstate';
import 'events';
import '../vector/index.cjs';
import '../vector/filter/index.cjs';
import 'stream';
import '../tts/index.cjs';

declare function isErrorEvent(stateEvent: any): stateEvent is {
    type: `xstate.error.actor.${string}`;
    error: Error;
};
declare function isTransitionEvent(stateEvent: any): stateEvent is {
    type: `xstate.done.actor.${string}`;
    output?: unknown;
};
declare function isVariableReference(value: any): value is VariableReference<any, any>;
declare function getStepResult(result?: StepResult<any>): any;
declare function getSuspendedPaths({ value, path, suspendedPaths, }: {
    value: string | Record<string, string>;
    path: string;
    suspendedPaths: Set<string>;
}): void;
declare function isFinalState(status: string): boolean;
declare function isLimboState(status: string): boolean;
declare function recursivelyCheckForFinalState({ value, suspendedPaths, path, }: {
    value: string | Record<string, string>;
    suspendedPaths: Set<string>;
    path: string;
}): boolean;
declare function getActivePathsAndStatus(value: Record<string, any>): Array<{
    stepPath: string[];
    stepId: string;
    status: string;
}>;
declare function mergeChildValue(startStepId: string, parent: Record<string, any>, child: Record<string, any>): Record<string, any>;
declare const updateStepInHierarchy: (value: Record<string, any>, targetStepId: string) => Record<string, any>;
declare function getResultActivePaths(state: {
    value: Record<string, string>;
    context: {
        steps: Record<string, any>;
    };
}): Map<string, {
    status: string;
    suspendPayload?: any;
}>;
declare function isWorkflow(step: Step<any, any, any, any> | Workflow<any, any, any, any>): step is Workflow<any, any, any, any>;
declare function resolveVariables<TSteps extends Step<any, any, any>[]>({ runId, logger, variables, context, }: {
    runId: string;
    logger: Logger;
    variables: Record<string, VariableReference<any, any>>;
    context: WorkflowContext;
}): Record<string, any>;
declare function workflowToStep<TSteps extends Step<any, any, any, any>[], TStepId extends string = any, TTriggerSchema extends z.ZodObject<any> = any, TResultSchema extends z.ZodObject<any> = any>(workflow: Workflow<TSteps, TStepId, TTriggerSchema, TResultSchema>, { mastra }: {
    mastra?: Mastra;
}): StepAction<TStepId, TTriggerSchema, z.ZodType<WorkflowRunResult<TTriggerSchema, TSteps, TResultSchema>>, any>;

export { Step, StepAction, StepResult, VariableReference, Workflow, WorkflowContext, WorkflowRunResult, getActivePathsAndStatus, getResultActivePaths, getStepResult, getSuspendedPaths, isErrorEvent, isFinalState, isLimboState, isTransitionEvent, isVariableReference, isWorkflow, mergeChildValue, recursivelyCheckForFinalState, resolveVariables, updateStepInHierarchy, workflowToStep };
