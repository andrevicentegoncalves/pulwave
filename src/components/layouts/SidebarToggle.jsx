import React from 'react';
import PropTypes from 'prop-types';
import { ArrowLeft, ArrowRight, Menu } from 'lucide-react';

/**
 * SidebarToggle - Toggle button for expanding/collapsing sidebar
 * 
 * Only visible on desktop. Mobile uses hamburger menu instead.
 * 
 * @example
 * <SidebarToggle isExpanded={true} toggleSidebar={handleToggle} />
 */
const SidebarToggle = ({ isExpanded, toggleSidebar, isMobile }) => {
    return (
        <div className="sidebar-header">
            <button
                className="toggle-btn"
                onClick={toggleSidebar}
                aria-label={isExpanded ? 'Collapse sidebar' : 'Expand sidebar'}
                aria-expanded={isExpanded}
                type="button"
            >
                {isMobile ? (
                    <Menu size={24} aria-hidden="true" />
                ) : (
                    isExpanded ? (
                        <ArrowLeft size={20} aria-hidden="true" />
                    ) : (
                        <ArrowRight size={20} aria-hidden="true" />
                    )
                )}
            </button>
        </div>
    );
};

SidebarToggle.propTypes = {
    isExpanded: PropTypes.bool.isRequired,
    toggleSidebar: PropTypes.func.isRequired,
    isMobile: PropTypes.bool,
};

export default SidebarToggle;