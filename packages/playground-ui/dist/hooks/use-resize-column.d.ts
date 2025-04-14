import { MouseEvent as ReactMouseEvent } from '../../node_modules/@types/react';

export declare const useResizeColumn: ({ defaultWidth, minimumWidth, maximumWidth, setCurrentWidth, }: {
    defaultWidth: number;
    minimumWidth: number;
    maximumWidth: number;
    setCurrentWidth?: (width: number) => void;
}) => {
    sidebarWidth: number;
    isDragging: boolean;
    handleMouseDown: (e: ReactMouseEvent) => void;
    containerRef: import('../../node_modules/@types/react').RefObject<HTMLDivElement | null>;
};
