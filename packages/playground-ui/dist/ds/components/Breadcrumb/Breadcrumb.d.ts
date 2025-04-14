import { default as React } from '../../../../node_modules/@types/react';

export interface BreadcrumbProps {
    children?: React.ReactNode;
    label?: string;
}
export declare const Breadcrumb: ({ children, label }: BreadcrumbProps) => import("react/jsx-runtime").JSX.Element;
export interface CrumbProps {
    isCurrent?: boolean;
    as: React.ElementType;
    className?: string;
    href: string;
    prefetch?: boolean | null;
    children: React.ReactNode;
}
export declare const Crumb: ({ className, as, isCurrent, ...props }: CrumbProps) => import("react/jsx-runtime").JSX.Element;
