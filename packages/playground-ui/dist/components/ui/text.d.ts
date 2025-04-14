import { VariantProps } from 'class-variance-authority';
import { default as React } from '../../../node_modules/@types/react';

declare const textVariants: (props?: ({
    variant?: "secondary" | "primary" | null | undefined;
    size?: "default" | "sm" | "lg" | "md" | "xs" | "xl" | "2xl" | null | undefined;
    weight?: "bold" | "medium" | "normal" | "semibold" | null | undefined;
} & import('class-variance-authority/types').ClassProp) | undefined) => string;
export interface TextProps extends React.HTMLAttributes<HTMLParagraphElement | HTMLSpanElement | HTMLDivElement>, VariantProps<typeof textVariants> {
    as?: 'p' | 'span' | 'div';
}
export declare const Text: ({ className, weight, variant, as: Tag, size, ...props }: TextProps) => import("react/jsx-runtime").JSX.Element;
export {};
