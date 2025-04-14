import { default as React } from '../../../../node_modules/@types/react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    as?: React.ElementType;
    className?: string;
    href?: string;
    prefetch?: boolean | null;
    children: React.ReactNode;
}
export declare const Button: ({ className, as, ...props }: ButtonProps) => import("react/jsx-runtime").JSX.Element;
