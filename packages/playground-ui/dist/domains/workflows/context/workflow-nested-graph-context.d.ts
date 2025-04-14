type WorkflowNestedGraphContextType = {
    showNestedGraph: ({ label, stepGraph, stepSubscriberGraph, }: {
        label: string;
        stepGraph: any;
        stepSubscriberGraph: any;
    }) => void;
    closeNestedGraph: () => void;
};
export declare const WorkflowNestedGraphContext: import('../../../../node_modules/@types/react').Context<WorkflowNestedGraphContextType>;
export declare function WorkflowNestedGraphProvider({ children }: {
    children: React.ReactNode;
}): import("react/jsx-runtime").JSX.Element;
export {};
