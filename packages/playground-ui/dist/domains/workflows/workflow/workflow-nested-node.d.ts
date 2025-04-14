import { NodeProps, Node } from '@xyflow/react';

export type NestedNode = Node<{
    label: string;
    description?: string;
    withoutTopHandle?: boolean;
    withoutBottomHandle?: boolean;
    stepGraph: any;
    stepSubscriberGraph: any;
}, 'nested-node'>;
export declare function WorkflowNestedNode({ data }: NodeProps<NestedNode>): import("react/jsx-runtime").JSX.Element;
