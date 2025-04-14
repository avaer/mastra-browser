import { RefinedTrace } from '../domains/traces/types';

export declare const useTraces: (componentName: string, baseUrl: string, isWorkflow?: boolean) => {
    traces: RefinedTrace[];
    firstCallLoading: boolean;
    error: {
        message: string;
    } | null;
};
