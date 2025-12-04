import React, { useState } from 'react';
import PropTypes from 'prop-types';

const Tooltip = ({ children, content, direction = 'top' }) => {
    const [isVisible, setIsVisible] = useState(false);

    return (
        <div
            className="tooltip-wrapper"
            onMouseEnter={() => setIsVisible(true)}
            onMouseLeave={() => setIsVisible(false)}
        >
            {children}
            {isVisible && content && (
                <div className={`tooltip tooltip--${direction}`}>
                    {content}
                </div>
            )}
        </div>
    );
};

Tooltip.propTypes = {
    children: PropTypes.node.isRequired,
    content: PropTypes.string.isRequired,
    direction: PropTypes.oneOf(['top', 'bottom', 'left', 'right']),
};

export default Tooltip;
