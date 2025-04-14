import { NodeProps, Node } from '@xyflow/react';

export type LoopResultNode = Node<{
    result: boolean;
}, 'loop-result-node'>;
export declare function WorkflowLoopResultNode({ data }: NodeProps<LoopResultNode>): import("react/jsx-runtime").JSX.Element;
