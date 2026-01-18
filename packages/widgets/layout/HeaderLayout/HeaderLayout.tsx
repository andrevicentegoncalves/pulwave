/**
 * HeaderLayout
 * 
 * Page header with title, subtitle, breadcrumbs, and actions.
 * 
 * @package @ui
 */
import React from 'react';
import './styles/_index.scss';

import { Text, type BreadcrumbItem } from '@pulwave/ui';

export interface HeaderLayoutProps {
    /** Page title (h1) */
    title?: string;
    /** Subtitle or description */
    subtitle?: string;
    /** Breadcrumb navigation items */
    breadcrumbs?: BreadcrumbItem[];
    /** Action buttons/elements */
    actions?: React.ReactNode;
    /** Additional CSS classes */
    className?: string;
}

/**
 * HeaderLayout - Page header with title and actions
 */
export const HeaderLayout = ({
    title,
    subtitle,
    breadcrumbs,
    actions,
    className = ''
}: HeaderLayoutProps) => {
    const hasBreadcrumbs = breadcrumbs && breadcrumbs.length > 0;
    const hasContent = title || subtitle || actions || hasBreadcrumbs;

    if (!hasContent) return null;

    return (
        <header className={`header-layout ${className}`}>
            {/* Breadcrumbs */}
            {hasBreadcrumbs && (
                <nav className="header-layout__breadcrumbs" aria-label="Breadcrumb">
                    <ol className="header-layout__breadcrumb-list">
                        {breadcrumbs.map((crumb, index) => (
                            <li key={crumb.href || crumb.label || `breadcrumb-${index}`} className="header-layout__breadcrumb-item">
                                {crumb.href ? (
                                    <a href={crumb.href} className="header-layout__breadcrumb-link">
                                        {crumb.label}
                                    </a>
                                ) : (
                                    <span className="header-layout__breadcrumb-current" aria-current="page">
                                        {crumb.label}
                                    </span>
                                )}
                                {index < breadcrumbs.length - 1 && (
                                    <span className="header-layout__breadcrumb-separator" aria-hidden="true">/</span>
                                )}
                            </li>
                        ))}
                    </ol>
                </nav>
            )}

            {/* Title Row */}
            <div className="header-layout__row">
                <div className="header-layout__title-group">
                    {title && (
                        <Text
                            as="h1"
                            category="title"
                            size="l"
                            weight="bold"
                            className="header-layout__title"
                        >
                            {title}
                        </Text>
                    )}
                    {subtitle && (
                        <Text
                            as="p"
                            category="body"
                            size="l"
                            color="muted"
                            className="header-layout__subtitle"
                        >
                            {subtitle}
                        </Text>
                    )}
                </div>

                {actions && (
                    <div className="header-layout__actions">
                        {actions}
                    </div>
                )}
            </div>
        </header>
    );
};

HeaderLayout.displayName = 'HeaderLayout';

export default HeaderLayout;
