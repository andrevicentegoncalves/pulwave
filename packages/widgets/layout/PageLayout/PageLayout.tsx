/**
 * PageLayout
 * 
 * Composes HeaderLayout + ContentLayout for standard pages.
 * 
 * @package @ui
 */
import React from 'react';
import './styles/_index.scss';

import { HeaderLayout } from '../HeaderLayout';
import { type BreadcrumbItem } from '@pulwave/ui';
import { ContentLayout, type ContentVariant } from '../ContentLayout';

export interface PageLayoutProps {
    /** Page title */
    title?: string;
    /** Page subtitle */
    subtitle?: string;
    /** Breadcrumb navigation */
    breadcrumbs?: BreadcrumbItem[];
    /** Action buttons */
    actions?: React.ReactNode;
    /** Force show/hide header */
    showHeader?: boolean;
    /** Layout width variant */
    variant?: ContentVariant;
    /** Page content */
    children: React.ReactNode;
    /** Additional classes for page wrapper */
    className?: string;
    /** Additional classes for content area */
    contentClassName?: string;
}

/**
 * PageLayout - Page with header and content
 */
export const PageLayout = ({
    title,
    subtitle,
    breadcrumbs,
    actions,
    showHeader,
    variant,
    children,
    className = '',
    contentClassName = ''
}: PageLayoutProps) => {
    const hasHeaderContent = title || subtitle || actions || (breadcrumbs && breadcrumbs.length > 0);
    const shouldShowHeader = showHeader !== undefined ? showHeader : hasHeaderContent;
    const variantClass = variant && variant !== 'dashboard' ? `page-layout--${variant}` : '';

    return (
        <div className={`page-layout ${variantClass} ${className}`.trim()}>
            {shouldShowHeader && (
                <HeaderLayout
                    title={title}
                    subtitle={subtitle}
                    breadcrumbs={breadcrumbs}
                    actions={actions}
                />
            )}
            <ContentLayout className={contentClassName} variant={variant}>
                {children}
            </ContentLayout>
        </div>
    );
};

PageLayout.displayName = 'PageLayout';

export default PageLayout;
