import { NodeProps, Node } from '@xyflow/react';

export type DefaultNode = Node<{
    label: string;
    description?: string;
    withoutTopHandle?: boolean;
    withoutBottomHandle?: boolean;
}, 'default-node'>;
export declare function WorkflowDefaultNode({ data }: NodeProps<DefaultNode>): import("react/jsx-runtime").JSX.Element;
