import { default as React } from '../../../../node_modules/@types/react';

export interface BadgeProps {
    icon?: React.ReactNode;
    variant?: 'default' | 'success' | 'error' | 'info';
    className?: string;
    children?: React.ReactNode;
}
export declare const Badge: ({ icon, variant, className, children, ...props }: BadgeProps) => import("react/jsx-runtime").JSX.Element;
