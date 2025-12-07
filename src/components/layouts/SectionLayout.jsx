import React from 'react';
import PropTypes from 'prop-types';

const SectionLayout = ({ sidebar, children, className = '' }) => {
    const [isExpanded, setIsExpanded] = React.useState(true);

    const toggleSidebar = () => setIsExpanded(!isExpanded);

    return (
        <div className={`section-layout ${!isExpanded ? 'section-layout--collapsed' : ''} ${className}`}>
            <div className="section-layout__sidebar">
                {React.cloneElement(sidebar, { isExpanded, toggleSidebar })}
            </div>
            <div className="section-layout__content">
                {children}
            </div>
        </div>
    );
};

SectionLayout.propTypes = {
    sidebar: PropTypes.node.isRequired,
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
};

export default SectionLayout;
