import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';

/**
 * ScrollArea Component
 * Provides a scrollable container with branded scrollbar styling.
 * 
 * @component
 * @example
 * <ScrollArea maxHeight="400px">
 *   <div>Long content...</div>
 * </ScrollArea>
 */
const ScrollArea = ({
    children,
    className,
    maxHeight,
    height,
    orientation = 'vertical',
    hideScrollbar = false,
    ...props
}) => {
    return (
        <div
            className={clsx(
                'scroll-area',
                `scroll-area--${orientation}`,
                hideScrollbar && 'scroll-area--hide-scrollbar',
                className
            )}
            style={{
                maxHeight,
                height,
                ...props.style // Allow other styles override
            }}
            {...props}
        >
            {children}
        </div>
    );
};

ScrollArea.propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    /** Maximum height of the scroll area (CSS value) */
    maxHeight: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    /** Fixed height of the scroll area (CSS value) */
    height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    /** Scroll orientation */
    orientation: PropTypes.oneOf(['vertical', 'horizontal', 'both']),
    /** Whether to hide the scrollbar visually but allow scrolling */
    hideScrollbar: PropTypes.bool,
};

export default ScrollArea;
