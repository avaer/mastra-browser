import * as ScrollAreaPrimitive from '@radix-ui/react-scroll-area';
import * as React from 'react';
interface ScrollAreaProps extends React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root> {
    viewPortClassName?: string;
    maxHeight?: string;
    autoScroll?: boolean;
}
declare const ScrollArea: React.ForwardRefExoticComponent<ScrollAreaProps & React.RefAttributes<HTMLDivElement>>;
declare const ScrollBar: React.ForwardRefExoticComponent<Omit<ScrollAreaPrimitive.ScrollAreaScrollbarProps & React.RefAttributes<HTMLDivElement>, "ref"> & React.RefAttributes<HTMLDivElement>>;
export { ScrollArea, ScrollBar };
