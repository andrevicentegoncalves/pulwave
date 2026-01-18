import React, { useState, useRef, useEffect, useCallback } from 'react';
import { cn } from '@pulwave/utils';
import { popoverVariants, type PopoverProps } from './types';
import './styles/_index.scss';
import {
    useFloating,
    autoUpdate,
    offset,
    flip,
    shift,
    arrow,
    useDismiss,
    useClick,
    useHover,
    useFocus,
    useInteractions,
    useRole,
} from '@floating-ui/react';

const PopoverRoot = ({
    isOpen: controlledIsOpen,
    defaultOpen = false,
    onOpenChange,
    trigger,
    children,
    placement = 'bottom',
    triggerType = 'click',
    showArrow = true,
    offset: offsetValue = 8,
    closeOnClickOutside = true,
    closeOnEscape = true,
    openDelay = 0,
    closeDelay = 150,
    className,
    triggerClassName,
    anchorRef: externalAnchorRef,
}: PopoverProps) => {
    const [internalIsOpen, setInternalIsOpen] = useState(defaultOpen);
    const arrowRef = useRef(null);

    const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;

    const setIsOpen = useCallback((open: boolean) => {
        if (controlledIsOpen === undefined) {
            setInternalIsOpen(open);
        }
        onOpenChange?.(open);
    }, [controlledIsOpen, onOpenChange]);

    const { refs, floatingStyles, context, middlewareData } = useFloating({
        open: isOpen,
        onOpenChange: setIsOpen,
        placement,
        whileElementsMounted: autoUpdate,
        middleware: [
            offset(offsetValue),
            flip(),
            shift(),
            showArrow && arrow({ element: arrowRef }),
        ],
        strategy: 'fixed',
    });

    const click = useClick(context, { enabled: triggerType === 'click' });
    const hover = useHover(context, {
        enabled: triggerType === 'hover',
        delay: { open: openDelay, close: closeDelay },
        handleClose: null,
    });
    const focus = useFocus(context, { enabled: triggerType === 'focus' });
    const dismiss = useDismiss(context, { enabled: closeOnClickOutside, escapeKey: closeOnEscape });
    const role = useRole(context);

    const { getReferenceProps, getFloatingProps } = useInteractions([click, hover, focus, dismiss, role]);

    useEffect(() => {
        if (externalAnchorRef?.current) {
            refs.setReference(externalAnchorRef.current);
        }
    }, [externalAnchorRef, refs]);

    const arrowX = middlewareData.arrow?.x ?? 0;
    const arrowY = middlewareData.arrow?.y ?? 0;
    const staticSide = {
        top: 'bottom',
        right: 'left',
        bottom: 'top',
        left: 'right',
    }[placement.split('-')[0]] as string;

    const arrowStyle: React.CSSProperties = {
        left: arrowX != null ? `${arrowX}px` : '',
        top: arrowY != null ? `${arrowY}px` : '',
        [staticSide]: '-4px',
        position: 'absolute',
    };

    return (
        <>
            <div
                ref={externalAnchorRef ? undefined : refs.setReference}
                className={cn('popover__trigger', triggerClassName)}
                {...getReferenceProps()}
            >
                {trigger}
            </div>
            {isOpen && (
                <div
                    ref={refs.setFloating}
                    className={cn(popoverVariants({ placement, withArrow: showArrow }), className)}
                    style={floatingStyles}
                    {...getFloatingProps()}
                >
                    {showArrow && <div ref={arrowRef} className="popover__arrow" style={arrowStyle} />}
                    <div className="popover__content">{children}</div>
                </div>
            )}
        </>
    );
};
PopoverRoot.displayName = 'Popover';

// Compound Sub-components
const PopoverContent = ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <div className={cn('popover__content', className)}>{children}</div>
);
PopoverContent.displayName = 'Popover.Content';

const PopoverTrigger = ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <div className={cn('popover__trigger', className)}>{children}</div>
);
PopoverTrigger.displayName = 'Popover.Trigger';

export const Popover = Object.assign(PopoverRoot, {
    Content: PopoverContent,
    Trigger: PopoverTrigger,
});
