import { ReactNode } from '../../../../../node_modules/@types/react';
import { ModelSettings } from '../../../../types';

type AgentContextType = {
    modelSettings: ModelSettings;
    setModelSettings: React.Dispatch<React.SetStateAction<ModelSettings>>;
    resetModelSettings: () => void;
};
export declare const AgentContext: import('../../../../../node_modules/@types/react').Context<AgentContextType>;
export declare function AgentProvider({ children }: {
    children: ReactNode;
}): import("react/jsx-runtime").JSX.Element;
export {};
