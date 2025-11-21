import React from 'react';
import PropTypes from 'prop-types';

/**
 * ContentLayout - Generic layout for page content
 * 
 * Standardizes the layout structure for pages, including a header section
 * with title, subtitle, and optional actions, followed by the main content.
 * 
 * @param {string} title - Page title
 * @param {string} subtitle - Page subtitle or description
 * @param {React.ReactNode} actions - Optional action buttons/elements for the header
 * @param {boolean} showHeader - Force show/hide header (default: auto based on content)
 * @param {React.ReactNode} children - Main content
 * @param {string} className - Optional additional classes
 */
const ContentLayout = ({
    title,
    subtitle,
    actions,
    showHeader,
    children,
    className = ''
}) => {
    // Determine if header should be shown
    const hasHeaderContent = title || subtitle || actions;
    const shouldShowHeader = showHeader !== undefined ? showHeader : hasHeaderContent;

    return (
        <div className={`content-layout ${className}`}>
            {shouldShowHeader && (
                <div className="content-layout__header">
                    <div className="content-layout__title-group">
                        {title && <h1 className="content-layout__title">{title}</h1>}
                        {subtitle && <p className="content-layout__subtitle">{subtitle}</p>}
                    </div>

                    {actions && (
                        <div className="content-layout__actions">
                            {actions}
                        </div>
                    )}
                </div>
            )}

            <div className="content-layout__content">
                {children}
            </div>
        </div>
    );
};

ContentLayout.propTypes = {
    title: PropTypes.string,
    subtitle: PropTypes.string,
    actions: PropTypes.node,
    showHeader: PropTypes.bool,
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
};

export default ContentLayout;
