import { default as React } from '../../../../node_modules/@types/react';

export interface TableProps {
    className?: string;
    children: React.ReactNode;
    size?: 'default' | 'small';
}
export declare const Table: ({ className, children, size }: TableProps) => import("react/jsx-runtime").JSX.Element;
export interface TheadProps {
    className?: string;
    children: React.ReactNode;
}
export declare const Thead: ({ className, children }: TheadProps) => import("react/jsx-runtime").JSX.Element;
export interface ThProps {
    className?: string;
    children: React.ReactNode;
}
export declare const Th: ({ className, children }: ThProps) => import("react/jsx-runtime").JSX.Element;
export interface TbodyProps {
    className?: string;
    children: React.ReactNode;
}
export declare const Tbody: ({ className, children }: TbodyProps) => import("react/jsx-runtime").JSX.Element;
export interface RowProps {
    className?: string;
    children: React.ReactNode;
    selected?: boolean;
}
export declare const Row: ({ className, children, selected }: RowProps) => import("react/jsx-runtime").JSX.Element;
