import { default as React } from '../../../node_modules/@types/react';

export interface IconProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    size?: 'default' | 'lg';
}
export declare const Icon: ({ children, className, size, ...props }: IconProps) => import("react/jsx-runtime").JSX.Element;
