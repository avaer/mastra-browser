import { NodeProps, Node } from '@xyflow/react';

export type AfterNode = Node<{
    steps: string[];
}, 'after-node'>;
export declare function WorkflowAfterNode({ data }: NodeProps<AfterNode>): import("react/jsx-runtime").JSX.Element;
