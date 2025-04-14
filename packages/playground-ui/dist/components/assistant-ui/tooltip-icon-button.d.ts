import { ButtonProps } from '../ui/button';

export type TooltipIconButtonProps = ButtonProps & {
    tooltip: string;
    side?: 'top' | 'bottom' | 'left' | 'right';
};
export declare const TooltipIconButton: import('../../../node_modules/@types/react').ForwardRefExoticComponent<ButtonProps & {
    tooltip: string;
    side?: "top" | "bottom" | "left" | "right";
} & import('../../../node_modules/@types/react').RefAttributes<HTMLButtonElement>>;
