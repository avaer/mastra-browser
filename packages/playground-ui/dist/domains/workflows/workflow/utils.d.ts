import { StepCondition } from '@mastra/core/workflows';
import { Node, Edge } from '@xyflow/react';

export type ConditionConditionType = 'if' | 'else' | 'when' | 'until' | 'while';
export type Condition = {
    type: ConditionConditionType;
    ref: {
        step: {
            id: string;
        } | 'trigger';
        path: string;
    };
    query: Record<string, any>;
    conj?: 'and' | 'or' | 'not';
    fnString?: never;
} | {
    type: ConditionConditionType;
    fnString: string;
    ref?: never;
    query?: never;
    conj?: never;
};
export declare const pathAlphabet: string[];
export declare function extractConditions(group: StepCondition<any, any>, type: ConditionConditionType): Condition[];
export type WStep = {
    [key: string]: {
        id: string;
        description: string;
        workflowId?: string;
        stepGraph?: any;
        stepSubscriberGraph?: any;
    };
};
export declare const contructNodesAndEdges: ({ stepGraph, stepSubscriberGraph, steps: mainSteps, }: {
    stepGraph: any;
    stepSubscriberGraph: any;
    steps?: WStep;
}) => {
    nodes: Node[];
    edges: Edge[];
};
