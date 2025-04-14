import { DayPickerSingleProps } from 'react-day-picker';
import * as React from 'react';
type CommonProps = Omit<DayPickerSingleProps, 'mode' | 'selected' | 'onSelect'> & {
    value: Date | undefined | null;
    setValue: (date: Date | undefined | null) => void;
    clearable?: boolean;
};
export type DatePickerProps = (CommonProps & {
    children?: never;
    className?: string;
    placeholder?: string;
}) | (CommonProps & {
    children: React.ReactNode;
    className?: never;
    placeholder?: string;
});
export declare const DatePicker: React.FC<DatePickerProps>;
export declare const DatePickerOnly: ({ value, setValue, setOpenPopover, clearable, placeholder, className, ...props }: CommonProps & {
    setOpenPopover?: (open: boolean) => void;
    placeholder?: string;
    className?: string;
}) => import("react/jsx-runtime").JSX.Element;
export {};
