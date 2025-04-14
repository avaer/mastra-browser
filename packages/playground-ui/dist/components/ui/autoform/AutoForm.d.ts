import { default as React } from '../../../../node_modules/@types/react';
import { AutoFormProps } from './types';

export declare const ShadcnAutoFormFieldComponents: {
    readonly string: React.FC<import('@autoform/react').AutoFormFieldProps>;
    readonly number: React.FC<import('@autoform/react').AutoFormFieldProps>;
    readonly boolean: React.FC<import('@autoform/react').AutoFormFieldProps>;
    readonly date: React.FC<import('@autoform/react').AutoFormFieldProps>;
    readonly select: React.FC<import('@autoform/react').AutoFormFieldProps>;
    readonly record: React.FC<import('@autoform/react').AutoFormFieldProps>;
};
export type FieldTypes = keyof typeof ShadcnAutoFormFieldComponents;
export declare function AutoForm<T extends Record<string, any>>({ uiComponents, formComponents, ...props }: AutoFormProps<T>): import("react/jsx-runtime").JSX.Element;
