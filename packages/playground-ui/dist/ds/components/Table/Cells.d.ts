import { default as React } from '../../../../node_modules/@types/react';

export interface CellProps {
    className?: string;
    children: React.ReactNode;
}
export declare const Cell: ({ className, children }: CellProps) => import("react/jsx-runtime").JSX.Element;
export declare const TxtCell: ({ className, children }: CellProps) => import("react/jsx-runtime").JSX.Element;
export declare const UnitCell: ({ className, children, unit }: CellProps & {
    unit: string;
}) => import("react/jsx-runtime").JSX.Element;
export interface DateTimeCellProps {
    className?: string;
    dateTime: Date;
}
export declare const DateTimeCell: ({ className, dateTime }: DateTimeCellProps) => import("react/jsx-runtime").JSX.Element;
export interface EntryCellProps {
    className?: string;
    name: React.ReactNode;
    description?: React.ReactNode;
    icon: React.ReactNode;
    meta?: React.ReactNode;
}
export declare const EntryCell: ({ className, name, description, icon, meta }: EntryCellProps) => import("react/jsx-runtime").JSX.Element;
