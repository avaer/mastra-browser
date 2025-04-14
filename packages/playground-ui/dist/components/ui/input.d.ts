import { VariantProps } from 'class-variance-authority';

import * as React from 'react';
declare const inputVariants: (props?: ({
    variant?: "default" | "filled" | "unstyled" | null | undefined;
    customSize?: "default" | "sm" | "lg" | null | undefined;
} & import('class-variance-authority/types').ClassProp) | undefined) => string;
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement>, VariantProps<typeof inputVariants> {
    testId?: string;
}
declare const Input: React.ForwardRefExoticComponent<InputProps & React.RefAttributes<HTMLInputElement>>;
export { Input, inputVariants };
