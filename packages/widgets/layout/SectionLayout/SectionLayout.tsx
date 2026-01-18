/**
 * SectionLayout
 * 
 * Layout with sidebar and content area for section-level pages.
 * Supports sticky sidebar, mobile overlay, and controlled/uncontrolled state.
 * 
 * @package @ui
 */
import React from 'react';
import { MenuIcon, X } from '@pulwave/ui';
import './styles/_index.scss';

export interface SectionLayoutProps {
    sidebar: React.ReactElement;
    children: React.ReactNode;
    breadcrumbs?: React.ReactNode;
    className?: string;
    stickySidebar?: boolean;
    /** Controlled expanded state - when provided, component becomes controlled */
    isExpanded?: boolean;
    /** Callback when expansion state changes */
    onExpandedChange?: (expanded: boolean) => void;
    /** Default expanded state for uncontrolled mode */
    defaultExpanded?: boolean;
    /** Sidebar variant - controls background color */
    sidebarVariant?: 'neutral' | 'white';
    /** Content for top-right notch (extends above content area) */
    notch?: React.ReactNode;
}

export const SectionLayout = ({
    sidebar,
    children,
    breadcrumbs,
    className = '',
    stickySidebar = false,
    isExpanded: isExpandedProp,
    onExpandedChange,
    defaultExpanded = true,
    sidebarVariant = 'neutral',
    notch
}: SectionLayoutProps) => {
    // Support both controlled and uncontrolled modes
    const [internalExpanded, setInternalExpanded] = React.useState(defaultExpanded);
    const isControlled = isExpandedProp !== undefined;
    const isExpanded = isControlled ? isExpandedProp : internalExpanded;

    const setIsExpanded = React.useCallback((value: boolean) => {
        if (!isControlled) {
            setInternalExpanded(value);
        }
        onExpandedChange?.(value);
    }, [isControlled, onExpandedChange]);

    const toggleSidebar = React.useCallback(() => {
        setIsExpanded(!isExpanded);
    }, [isExpanded, setIsExpanded]);

    const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

    return (
        <div className={`section-layout ${!isExpanded ? 'section-layout--collapsed' : ''} ${stickySidebar ? 'section-layout--fixed' : ''} ${className}`}>
            {/* Mobile Header - only visible on mobile via CSS usually or we need explicit mobile logic like BaseSidebarLayout? 
                Actually the original rich component had a Mobile Header placeholder comment. 
                Let's check the SCSS to see if it relies on a specific structure.
                The styles verified earlier had `_section-layout.mobile.scss`.
            */}
            <div className="section-layout__mobile-header">
                <button
                    className="section-layout__mobile-toggle"
                    onClick={() => setIsMobileMenuOpen(true)}
                    type="button"
                    aria-label="Open sidebar"
                >
                    <MenuIcon size={20} aria-hidden="true" />
                </button>
                {breadcrumbs && (
                    <div className="section-layout__mobile-breadcrumbs">
                        {breadcrumbs}
                    </div>
                )}
            </div>

            {/* Sidebar */}
            <div className={`section-layout__sidebar section-layout__sidebar--${sidebarVariant} ${isMobileMenuOpen ? 'section-layout__sidebar--open' : ''}`}>
                <button
                    className="section-layout__mobile-close"
                    onClick={() => setIsMobileMenuOpen(false)}
                    type="button"
                    aria-label="Close sidebar"
                >
                    <X size={20} aria-hidden="true" />
                </button>

                {React.isValidElement(sidebar) ? React.cloneElement(sidebar as React.ReactElement<any>, {
                    isExpanded: isExpanded,
                    isCollapsed: !isExpanded,
                    toggleSidebar,
                    onExpand: () => setIsExpanded(true),
                    position: 'static' // Override position prop for this layout
                }) : sidebar}
            </div>

            {/* Backdrop for mobile */}
            {isMobileMenuOpen && (
                <div
                    className="section-layout__backdrop"
                    onClick={() => setIsMobileMenuOpen(false)}
                    aria-hidden="true"
                />
            )}

            {/* Main Content */}
            <div className="section-layout__content-wrapper">
                {notch && (
                    <div className="section-layout__notch">
                        {notch}
                    </div>
                )}
                <div className="section-layout__content">
                    {breadcrumbs && (
                        <div className="section-layout__breadcrumbs">
                            {breadcrumbs}
                        </div>
                    )}
                    <div className="section-layout__content-inner">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
};

SectionLayout.displayName = 'SectionLayout';

export default SectionLayout;
