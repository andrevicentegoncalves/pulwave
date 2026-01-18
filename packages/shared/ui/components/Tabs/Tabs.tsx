import React from 'react';
import { useState, useCallback, useEffect, useRef, Children, isValidElement } from 'react';
import { cn } from '@pulwave/utils';
import type { TabsProps, TabPanelProps } from './types';
import { tabsVariants, tabVariants } from './types';
import './styles/_index.scss';

const TabsRoot = ({
    children,
    defaultTab = 0,
    onChange,
    variant = 'line',
    orientation = 'horizontal',
    size = 'm',
    fullWidth = false,
    colorScheme = 'primary',
    showBorder = true,
    className,
}: TabsProps) => {
    const [activeTab, setActiveTab] = useState(defaultTab);
    const [hasScroll, setHasScroll] = useState(false);
    const headerRef = useRef<HTMLDivElement>(null);

    // Get array of valid TabPanel children
    const tabs = Children.toArray(children).filter(
        (child): child is React.ReactElement<TabPanelProps> =>
            isValidElement(child)
    );

    // Handle tab change
    const handleTabChange = useCallback(
        (index: number) => {
            setActiveTab(index);
            onChange?.(index);
        },
        [onChange]
    );

    // Check if tabs header has horizontal scroll
    const updateScrollState = useCallback(() => {
        if (headerRef.current && orientation === 'horizontal') {
            setHasScroll(headerRef.current.scrollWidth > headerRef.current.clientWidth);
        }
    }, [orientation]);

    // Run on mount and window resize
    useEffect(() => {
        updateScrollState();
        window.addEventListener('resize', updateScrollState);
        return () => window.removeEventListener('resize', updateScrollState);
    }, [updateScrollState, tabs.length]);

    // Determine if colorScheme applies to this variant
    const supportsColorScheme = ['line', 'pills', 'slider', 'slider-soft', 'slider-soft-full', 'icon', 'contained', 'contained-full'].includes(variant);

    const tabsClasses = cn(
        tabsVariants({
            variant,
            orientation,
            size,
            fullWidth,
            colorScheme: supportsColorScheme ? colorScheme : undefined,
            showBorder,
        }),
        className
    );

    const headerClasses = cn('tabs__header', hasScroll && 'has-scroll');

    return (
        <div className={tabsClasses} aria-orientation={orientation || undefined}>
            <div className={headerClasses} role="tablist" ref={headerRef}>
                {tabs.map((tab, index) => (
                    <button
                        key={tab.key || index}
                        className={tabVariants({ active: activeTab === index })}
                        onClick={() => handleTabChange(index)}
                        type="button"
                        role="tab"
                        aria-selected={activeTab === index}
                        aria-controls={`tabpanel-${index}`}
                        id={`tab-${index}`}
                    >
                        {tab.props.icon && <span className="tabs__tab-icon" aria-hidden="true">{tab.props.icon}</span>}
                        <span className="tabs__tab-label">{tab.props.label}</span>
                    </button>
                ))}
            </div>

            <div className="tabs__content">
                {tabs.map((tab, index) => (
                    <div
                        key={tab.props.label || `tab-${index}`}
                        role="tabpanel"
                        id={`tabpanel-${index}`}
                        aria-labelledby={`tab-${index}`}
                        hidden={activeTab !== index}
                    >
                        {activeTab === index && tab}
                    </div>
                ))}
            </div>
        </div>
    );
};

TabsRoot.displayName = 'Tabs';

/**
 * TabPanel component for individual tab content
 */
export const TabPanel = ({ children }: TabPanelProps) => {
    return <div className="tabs__panel">{children}</div>;
};

TabPanel.displayName = 'Tabs.TabPanel';

export const Tabs = Object.assign(TabsRoot, {
    TabPanel,
});
