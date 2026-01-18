import React from 'react';
import { createPortal } from 'react-dom';
import type { SVGTooltipState } from '../../hooks/useSVGTooltip';
import './styles/_index.scss';

export interface SVGTooltipProps {
    tooltip: SVGTooltipState;
}

/**
 * SVGTooltip Component
 *
 * Renders a floating tooltip for SVG elements
 * Should be rendered at root level and controlled by useSVGTooltip hook
 */
export const SVGTooltip = ({ tooltip }: SVGTooltipProps) => {
    if (!tooltip.visible || !tooltip.content) return null;

    const tooltipElement = (
        <div
            className="svg-tooltip"
            style={{
                position: 'fixed',
                top: `${tooltip.y - 10}px`,
                left: `${tooltip.x}px`,
                transform: 'translate(-50%, -100%)',
                pointerEvents: 'none',
                zIndex: 'var(--z-index-tooltip, 9999)',
            }}
        >
            <div className="svg-tooltip__content">
                {tooltip.content}
            </div>
            <div className="svg-tooltip__arrow" />
        </div>
    );

    return createPortal(tooltipElement, document.body);
};
