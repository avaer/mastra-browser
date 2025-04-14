import { ExtendedWorkflowRunResult } from '../../../hooks/use-workflows';

type WorkflowRunContextType = {
    result: ExtendedWorkflowRunResult | null;
    setResult: React.Dispatch<React.SetStateAction<any>>;
    payload: any;
    setPayload: React.Dispatch<React.SetStateAction<any>>;
    clearData: () => void;
};
export declare const WorkflowRunContext: import('../../../../node_modules/@types/react').Context<WorkflowRunContextType>;
export declare function WorkflowRunProvider({ children }: {
    children: React.ReactNode;
}): import("react/jsx-runtime").JSX.Element;
export {};
