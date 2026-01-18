import React, { useState, useRef, useLayoutEffect } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@pulwave/utils';
import { tooltipVariants, type TooltipProps, type TooltipDirection } from './types';
import './styles/_index.scss';

const directionArrowMap: Record<TooltipDirection, string> = {
    top: 'tooltip__arrow--top',
    'top-left': 'tooltip__arrow--top-left',
    'top-right': 'tooltip__arrow--top-right',
    bottom: 'tooltip__arrow--bottom',
    'bottom-left': 'tooltip__arrow--bottom-left',
    'bottom-right': 'tooltip__arrow--bottom-right',
    left: 'tooltip__arrow--left',
    right: 'tooltip__arrow--right',
};

const TooltipRoot = ({
    children,
    content,
    direction = 'top',
    wrapperClassName,
    size = 'm',
}: TooltipProps) => {
    const [isVisible, setIsVisible] = useState(false);
    const [position, setPosition] = useState({ top: 0, left: 0 });
    const [arrowLeft, setArrowLeft] = useState<number | undefined>(undefined);
    const [positionReady, setPositionReady] = useState(false);
    const [actualDirection, setActualDirection] = useState<TooltipDirection>(direction);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const tooltipRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        if (!isVisible) {
            setPositionReady(false);
            return;
        }

        if (!wrapperRef.current || !tooltipRef.current) return;

        const triggerRect = wrapperRef.current.getBoundingClientRect();
        const tooltipRect = tooltipRef.current.getBoundingClientRect();
        const tooltipOffset = 8;
        const viewportPadding = 16;
        const viewport = { width: window.innerWidth, height: window.innerHeight };

        let effectiveDirection = direction;
        let top: number;
        let left: number;

        const spaceAbove = triggerRect.top;
        const spaceBelow = viewport.height - triggerRect.bottom;

        if (direction.startsWith('bottom') && spaceBelow < tooltipRect.height + tooltipOffset + viewportPadding) {
            effectiveDirection = direction.replace('bottom', 'top') as TooltipDirection;
        } else if (direction.startsWith('top') && spaceAbove < tooltipRect.height + tooltipOffset + viewportPadding) {
            effectiveDirection = direction.replace('top', 'bottom') as TooltipDirection;
        }

        const triggerCenterX = triggerRect.left + triggerRect.width / 2;

        switch (effectiveDirection) {
            case 'top':
                top = triggerRect.top - tooltipOffset - tooltipRect.height;
                left = triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2;
                break;
            case 'top-left':
                top = triggerRect.top - tooltipOffset - tooltipRect.height;
                left = Math.max(viewportPadding, triggerRect.left + triggerRect.width / 2 - 32);
                break;
            case 'top-right':
                top = triggerRect.top - tooltipOffset - tooltipRect.height;
                left = triggerRect.right - tooltipRect.width;
                break;
            case 'bottom':
                top = triggerRect.bottom + tooltipOffset;
                left = triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2;
                break;
            case 'bottom-left':
                top = triggerRect.bottom + tooltipOffset;
                left = Math.max(viewportPadding, triggerRect.left + triggerRect.width / 2 - 32);
                break;
            case 'bottom-right':
                top = triggerRect.bottom + tooltipOffset;
                left = triggerRect.right - tooltipRect.width;
                break;
            case 'left':
                top = triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2;
                left = triggerRect.left - tooltipOffset - tooltipRect.width;
                break;
            case 'right':
                top = triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2;
                left = triggerRect.right + tooltipOffset;
                break;
            default:
                top = triggerRect.top - tooltipOffset - tooltipRect.height;
                left = triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2;
        }

        const clampedLeft = Math.max(viewportPadding, Math.min(left, viewport.width - viewportPadding - tooltipRect.width));
        top = Math.max(viewportPadding, Math.min(top, viewport.height - viewportPadding - tooltipRect.height));

        const arrowPosition = triggerCenterX - clampedLeft;

        setActualDirection(effectiveDirection);
        setPosition({ top, left: clampedLeft });
        setArrowLeft(arrowPosition);
        setPositionReady(true);
    }, [isVisible, direction]);

    const tooltipId = `tooltip-${React.useId()}`;

    return (
        <div
            ref={wrapperRef}
            className={cn('tooltip-wrapper', wrapperClassName)}
            onMouseEnter={() => setIsVisible(true)}
            onMouseLeave={() => setIsVisible(false)}
            onFocus={() => setIsVisible(true)}
            onBlur={() => setIsVisible(false)}
            aria-describedby={isVisible && content ? tooltipId : undefined}
        >
            {children}
            {isVisible &&
                content &&
                createPortal(
                    <div
                        ref={tooltipRef}
                        id={tooltipId}
                        role="tooltip"
                        className={cn(tooltipVariants({ size }), 'tooltip--fixed')}
                        style={{
                            top: `${position.top}px`,
                            left: `${position.left}px`,
                            visibility: positionReady ? 'visible' : 'hidden',
                        }}
                    >
                        {content}
                        <span
                            className={cn('tooltip__arrow', directionArrowMap[actualDirection])}
                            style={arrowLeft !== undefined ? { left: `${arrowLeft}px`, transform: 'translateX(-50%)' } : undefined}
                            aria-hidden="true"
                        />
                    </div>,
                    document.body
                )}
        </div>
    );
};
TooltipRoot.displayName = 'Tooltip';

// Compound Sub-components
const TooltipContent = ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <div className={className}>{children}</div>
);
TooltipContent.displayName = 'Tooltip.Content';

export const Tooltip = Object.assign(TooltipRoot, {
    Content: TooltipContent,
});
