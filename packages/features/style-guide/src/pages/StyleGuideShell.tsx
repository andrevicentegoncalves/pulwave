/**
 * Style Guide Shell - Layout and Navigation Logic
 */
import React, { useState, useEffect, useMemo } from 'react';
import { AppShell, BaseSidebarLayout, HeaderShell, SidebarShell, NestedSidebarShell, MobileShell, type UserData, type MobileBottomNavItem } from '@pulwave/pages-shell';
import { Text, Breadcrumbs, ThemeToggle, ToastProvider, LayoutDashboard, Shield } from '@pulwave/ui';
import { SectionLayout } from '@pulwave/widgets';
import { NestedMenu, Sidebar } from '@pulwave/features-layout';
import {
    ComponentDocPage,
    FoundationDocPage,
    RegistryContext,
    DemoCard,
    useStyleGuideNavigation,
    LibraryToggle,
    type ComponentRegistry,
    type ComponentRegistration,
    type ChartLibraryType,
    type ComponentDocProps,
    type FoundationDocProps
} from '../index';

export interface StyleGuideShellProps {
    navigationData: any[];
    componentRegistry: ComponentRegistry;
    getComponentByPath: (path: string) => ComponentRegistration | undefined;
    filterDemos: (demos: any) => React.ElementType[];
    sections: Record<string, any>;
    user?: UserData | null;
    onLogout?: () => void;
}

export const StyleGuideShell = ({
    navigationData,
    componentRegistry,
    getComponentByPath,
    filterDemos,
    sections,
    user,
    onLogout
}: StyleGuideShellProps) => {
    // UI Layout State
    const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
    const [isSecondarySidebarExpanded, setIsSecondarySidebarExpanded] = useState(true);
    const [isDark, setIsDark] = useState(false);
    const [chartLibrary, setChartLibrary] = useState<ChartLibraryType>('visx');

    // Core Logic extracted to hook
    const {
        activeSection,
        activeCategory,
        activeItem,
        handleSelect,
        handleMobileSectionChange
    } = useStyleGuideNavigation(navigationData);

    // Mobile detection
    const [isMobile, setIsMobile] = useState(() =>
        typeof window !== 'undefined' ? window.innerWidth <= 768 : false
    );

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Theme Toggle
    useEffect(() => {
        document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    }, [isDark]);

    // UI Configuration
    const mobileBottomNavItems: MobileBottomNavItem[] = useMemo(() =>
        Object.values(sections).map(section => ({
            id: section.id,
            icon: section.icon,
            label: section.label
        })), [sections]);

    // Resolve current content
    const currentPath = `${activeSection}/${activeCategory}/${activeItem}`;
    const componentRegistration = getComponentByPath(currentPath);
    const docData = componentRegistration?.doc;
    const rawDemos = componentRegistration?.demos;
    const DemoComponents = useMemo(() => rawDemos ? filterDemos(rawDemos) : [], [rawDemos, filterDemos]);

    const title = componentRegistration?.title ||
        (docData && 'name' in docData ? docData.name : undefined) ||
        (activeItem.charAt(0).toUpperCase() + activeItem.slice(1).replace(/-/g, ' '));

    // Get icon from current category or section
    const currentCategoryData = useMemo(() => {
        const section = navigationData.find(s => s.id === activeSection);
        return section?.categories?.find((c: { id: string; icon?: React.ElementType }) => c.id === activeCategory);
    }, [navigationData, activeSection, activeCategory]);

    const currentSectionData = useMemo(() => {
        return navigationData.find(s => s.id === activeSection);
    }, [navigationData, activeSection]);

    const titleIcon = currentCategoryData?.icon || currentSectionData?.icon;

    const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

    // Create icon elements for breadcrumbs
    const SectionIcon = currentSectionData?.icon;
    const CategoryIcon = currentCategoryData?.icon;

    const breadcrumbItems = [
        {
            id: 'section',
            label: capitalize(activeSection.replace(/-/g, ' ')),
            href: `#/${activeSection}`,
            icon: SectionIcon ? <SectionIcon size={14} /> : null
        },
        {
            id: 'category',
            label: capitalize(activeCategory.replace(/-/g, ' ')),
            href: `#/${activeSection}/${activeCategory}`,
            icon: CategoryIcon ? <CategoryIcon size={14} /> : null
        },
        {
            id: 'item',
            label: capitalize(activeItem.replace(/-/g, ' ')),
            href: `#/${activeSection}/${activeCategory}/${activeItem}`,
            active: true
            // No icon on last breadcrumb item
        }
    ];

    const renderContent = () => (
        <>
            {(() => {
                if (componentRegistration?.component) {
                    const DirectComponent = componentRegistration.component;
                    return <DirectComponent />;
                }

                if (docData) {
                    return activeSection === 'foundation' ? (
                        <FoundationDocPage doc={docData as FoundationDocProps['doc']} demos={rawDemos} />
                    ) : (
                        <>
                            <ComponentDocPage docs={docData as ComponentDocProps['docs']} />
                            {DemoComponents.length > 0 && (
                                <div className="component-doc__demos">
                                    <Text as="h2" category="title" size="2xl" weight="bold" className="component-doc__section-title">
                                        Demos
                                    </Text>
                                    <div className="component-doc__demos-grid">
                                        {DemoComponents.map((Demo, idx) => <Demo key={idx} />)}
                                    </div>
                                </div>
                            )}
                        </>
                    );
                }

                return (
                    <div className="style-guide-content__empty">
                        <Text as="h1" category="title" size="3xl" weight="bold">{title}</Text>
                        <DemoCard title="Work in Progress" description="Documentation for this component is coming soon.">
                            <div className="style-guide-empty">
                                <Text color="muted">
                                    No documentation found for path: <code>{currentPath}</code>
                                </Text>
                            </div>
                        </DemoCard>
                    </div>
                );
            })()}
        </>
    );


    if (isMobile) {
        return (
            <RegistryContext.Provider value={useMemo(() => ({ registry: componentRegistry }), [componentRegistry])}>
                <AppShell>
                    <ToastProvider>
                        <MobileShell
                            header={{ title: 'Style Guide', showHamburger: true, avatarUrl: user?.avatarUrl, onLogout: onLogout }}
                            drawer={
                                <Sidebar
                                    variant="primary"
                                    position="static"
                                    isExpanded={true}
                                    toggleSidebar={() => { }}
                                    items={[{ id: '/', icon: LayoutDashboard, label: 'Back to App' }, { id: '/admin', icon: Shield, label: 'Admin Dashboard' }]}
                                    user={user || undefined}
                                    onLogout={onLogout}
                                    showUserInfo={true}
                                />
                            }
                            bottomNav={{ items: mobileBottomNavItems, activeId: activeSection, onSelect: handleMobileSectionChange }}
                        >
                            <div className="style-guide-mobile">
                                <div className="style-guide-mobile__nav">
                                    <NestedMenu
                                        sections={navigationData.filter(s => s.id === activeSection)}
                                        activeItem={activeItem}
                                        activeCategory={activeCategory}
                                        activeSection={activeSection}
                                        onSelect={handleSelect}
                                        size="sm"
                                        spacing="tight"
                                        isCollapsed={false}
                                        variant="white"
                                    />
                                </div>
                                <div className="style-guide-mobile__content">{renderContent()}</div>
                            </div>
                        </MobileShell>
                    </ToastProvider>
                </AppShell>
            </RegistryContext.Provider>
        );
    }

    const sidebarContainerStyle = {
        '--sidebar-width': '20rem',
        '--sidebar-collapsed-width': '7.5rem',
        height: '100%'
    } as React.CSSProperties;

    return (
        <RegistryContext.Provider value={useMemo(() => ({ registry: componentRegistry }), [componentRegistry])}>
            <AppShell>
                <ToastProvider>
                    <div style={sidebarContainerStyle}>
                        <BaseSidebarLayout
                            variant="structural"
                            sidebarCollapsed={!isSidebarExpanded}
                            fixedMain={true}
                            sidebar={
                                <SidebarShell isCollapsed={!isSidebarExpanded} className="sidebar-shell--floating">
                                    <Sidebar
                                        variant="primary"
                                        position="static"
                                        isExpanded={isSidebarExpanded}
                                        toggleSidebar={() => setIsSidebarExpanded(!isSidebarExpanded)}
                                        items={[{ id: '/', icon: LayoutDashboard, label: 'Back to App' }, { id: '/admin', icon: Shield, label: 'Admin Dashboard' }]}
                                        user={user || undefined}
                                        onLogout={onLogout}
                                        showUserInfo={true}
                                    />
                                </SidebarShell>
                            }
                        >
                            <HeaderShell
                                title={title}
                                icon={titleIcon}
                                breadcrumbs={<Breadcrumbs items={breadcrumbItems} />}
                                actions={<ThemeToggle isDark={isDark} onToggle={() => setIsDark(!isDark)} />}
                            />
                            <SectionLayout
                                stickySidebar
                                sidebarVariant="white"
                                isExpanded={isSecondarySidebarExpanded}
                                onExpandedChange={setIsSecondarySidebarExpanded}
                                notch={
                                    <LibraryToggle
                                        value={chartLibrary}
                                        onChange={setChartLibrary}
                                    />
                                }
                                sidebar={
                                    <NestedSidebarShell
                                        variant="white"
                                        isExpanded={isSecondarySidebarExpanded}
                                        onExpandedChange={setIsSecondarySidebarExpanded}
                                    >
                                        <NestedMenu
                                            sections={navigationData}
                                            activeItem={activeItem}
                                            activeCategory={activeCategory}
                                            activeSection={activeSection}
                                            onSelect={handleSelect}
                                            size="sm"
                                            spacing="tight"
                                            isCollapsed={!isSecondarySidebarExpanded}
                                            variant="white"
                                        />
                                    </NestedSidebarShell>
                                }
                            >
                                {renderContent()}
                            </SectionLayout>
                        </BaseSidebarLayout>
                    </div>
                </ToastProvider>
            </AppShell>
        </RegistryContext.Provider>
    );
};

