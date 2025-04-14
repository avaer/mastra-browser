import { ColumnDef } from '@tanstack/react-table';
import { PaginationResult } from '../../lib/pagination/types';

interface DataTableProps<TData, TValue> {
    /**
     * table title
     */
    title?: string | React.ReactNode;
    /**
     * table icon
     */
    icon?: React.ReactNode;
    /**
     * disable table border
     * @default false
     */
    withoutBorder?: boolean;
    /**
     * table columns
     */
    columns: ColumnDef<TData, TValue>[];
    /**
     * table data
     */
    data: TData[];
    /**
     * custom className for the table parent container
     */
    className?: string;
    pagination?: PaginationResult;
    /**
     * goto next page
     */
    gotoNextPage?: () => void;
    /**
     * goto previous page
     */
    gotoPreviousPage?: () => void;
    /**
     * table max height
     */
    maxHeight?: string;
    /**
     * disable table container radius
     * @default false
     */
    withoutRadius?: boolean;
    /**
     * disable flex container
     * @default false
     */
    disabledFlex?: boolean;
    /**
     * height of the table row when there are no results
     * @default '96px'
     */
    emptyStateHeight?: string;
    /**
     * get the row id
     */
    getRowId?: (row: TData) => string;
    /**
     * selected row id to use for row selection
     */
    selectedRowId?: string;
    /**
     * loading state
     */
    isLoading?: boolean;
    /**
     * text to display when there are no results
     */
    emptyText?: string;
}
export declare const DataTable: <TData, TValue>({ title, icon, withoutBorder, columns, data, className, pagination, gotoNextPage, gotoPreviousPage, maxHeight, withoutRadius, disabledFlex, emptyStateHeight, getRowId, selectedRowId, isLoading, emptyText, }: DataTableProps<TData, TValue>) => import("react/jsx-runtime").JSX.Element;
export {};
