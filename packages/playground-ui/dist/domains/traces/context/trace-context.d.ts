import { Span, RefinedTrace } from '../types';

type TraceContextType = {
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    trace: Span[] | null;
    setTrace: React.Dispatch<React.SetStateAction<Span[] | null>>;
    traces: RefinedTrace[];
    setTraces: React.Dispatch<React.SetStateAction<RefinedTrace[]>>;
    currentTraceIndex: number;
    setCurrentTraceIndex: React.Dispatch<React.SetStateAction<number>>;
    nextTrace: () => void;
    prevTrace: () => void;
    span: Span | null;
    setSpan: React.Dispatch<React.SetStateAction<Span | null>>;
    openDetail: boolean;
    setOpenDetail: React.Dispatch<React.SetStateAction<boolean>>;
    clearData: () => void;
};
export declare const TraceContext: import('../../../../node_modules/@types/react').Context<TraceContextType>;
export declare function TraceProvider({ children }: {
    children: React.ReactNode;
}): import("react/jsx-runtime").JSX.Element;
export {};
