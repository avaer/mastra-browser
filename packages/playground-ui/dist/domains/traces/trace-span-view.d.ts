import { Span, SpanNode } from './types';

export declare function TreeView({ tree }: {
    tree: SpanNode[];
}): import("react/jsx-runtime").JSX.Element;
export default function SpanView({ trace }: {
    trace: Span[];
}): import("react/jsx-runtime").JSX.Element;
