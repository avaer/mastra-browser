import { default as React } from '../../node_modules/@types/react';

export interface UseAutoscrollOptions {
    enabled?: boolean;
}
export declare const useAutoscroll: (ref: React.RefObject<HTMLElement | null>, { enabled }: UseAutoscrollOptions) => void;
