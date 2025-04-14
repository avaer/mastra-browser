import { ReactNode } from '../../node_modules/@types/react';

export declare const MastraResizablePanel: ({ children, defaultWidth, minimumWidth, maximumWidth, className, disabled, setCurrentWidth, dividerPosition, }: {
    children: ReactNode;
    defaultWidth: number;
    minimumWidth: number;
    maximumWidth: number;
    className?: string;
    disabled?: boolean;
    setCurrentWidth?: (width: number) => void;
    dividerPosition?: "left" | "right";
}) => import("react/jsx-runtime").JSX.Element;
