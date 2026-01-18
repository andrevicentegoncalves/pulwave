import { useState, useCallback, useMemo, useEffect, type ElementType } from 'react';
import { SearchInput, SidebarToggle, Search, X, ChevronDown, ChevronRight } from '@pulwave/ui';
import './styles/_index.scss';

/**
 * Navigation data structure for NestedMenu.
 *
 * For flat items (no nesting), use the full route path as `id`:
 * ```typescript
 * { id: '/admin', icon: LayoutDashboard, label: 'Dashboard' }
 * ```
 *
 * For nested items with categories:
 * ```typescript
 * {
 *     id: '/admin/master-data',
 *     icon: Database,
 *     label: 'Master Data',
 *     categories: [
 *         { id: 'geography', label: 'Geography', icon: Globe, items: ['countries', 'localities'] }
 *     ]
 * }
 * ```
 *
 * Item IDs in `items` array are auto-formatted to labels (snake_case/kebab-case -> Title Case).
 */
export interface NavigationItem {
    /** Unique identifier. For flat items, use full route path (e.g., '/admin'). */
    id: string;
    /** Display label shown in the menu */
    label: string;
    /** Icon component (lucide-react style: accepts size and className props) */
    icon?: ElementType;
    /** Optional nested categories for hierarchical navigation */
    categories?: {
        /** Category identifier (e.g., 'geography') */
        id: string;
        /** Category display label */
        label: string;
        /** Category icon */
        icon?: ElementType;
        /** Array of item IDs (will be auto-formatted to labels) */
        items?: string[];
    }[];
}

export interface NestedMenuProps {
    sections: NavigationItem[];
    activeItem?: string;
    activeCategory?: string;
    activeSection?: string;
    onSelect?: (itemId: string, categoryId: string, sectionId: string) => void;
    className?: string;
    /** Whether menu is collapsed (icon-only mode) */
    isCollapsed?: boolean;
    /** Called when user clicks on collapsed menu to expand */
    onExpand?: () => void;
    /** Toggle menu collapse state */
    onToggle?: () => void;
    /** Visual variant for the toggle button */
    variant?: 'primary' | 'neutral' | 'white';
    /** Icon size - defaults to 'sm' (18px) */
    size?: 'sm' | 'md' | 'lg';
    /** Spacing between items - defaults to 'tight' (scale-1) */
    spacing?: 'tight' | 'normal' | 'relaxed';
}

export const NestedMenu = ({
    sections = [],
    activeItem = '',
    activeCategory = '',
    activeSection = '',
    onSelect,
    className = '',
    isCollapsed = false,
    onExpand,
    onToggle,
    variant = 'neutral',
    size = 'sm',
    spacing = 'tight',
}: NestedMenuProps) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearchExpanded, setIsSearchExpanded] = useState(false);

    // Mobile detection
    const [isMobile, setIsMobile] = useState(() =>
        typeof window !== 'undefined' ? window.innerWidth <= 768 : false
    );

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Filter logic
    const filteredSections = useMemo(() => {
        if (!searchQuery.trim()) return sections;

        const lowerQuery = searchQuery.toLowerCase();

        return sections.reduce<NavigationItem[]>((acc, section) => {
            const matchesSection = section.label.toLowerCase().includes(lowerQuery);

            // Filter categories
            const matchingCategories = section.categories?.reduce<NonNullable<NavigationItem['categories']>[number][]>((catAcc, category) => {
                const matchesCategory = category.label.toLowerCase().includes(lowerQuery);
                const matchingItems = category.items?.filter(item =>
                    item.toLowerCase().includes(lowerQuery) || item.replace(/-/g, ' ').toLowerCase().includes(lowerQuery)
                );

                if (matchesSection || matchesCategory || (matchingItems && matchingItems.length > 0)) {
                    catAcc.push({
                        ...category,
                        items: matchesSection || matchesCategory ? category.items : matchingItems
                    });
                }
                return catAcc;
            }, []);

            if (matchesSection || (matchingCategories && matchingCategories.length > 0)) {
                acc.push({
                    ...section,
                    categories: matchingCategories
                });
            }

            return acc;
        }, []);
    }, [sections, searchQuery]);

    // Auto-expand on search
    const [expandedSections, setExpandedSections] = useState<string[]>([]);
    const [expandedCategories, setExpandedCategories] = useState<string[]>([]);

    // Initialize/Update expansion based on active props or search
    useEffect(() => {
        if (searchQuery.trim()) {
            // Expand all matching sections and categories when searching
            const newExpandedSections: string[] = [];
            const newExpandedCategories: string[] = [];

            filteredSections.forEach(section => {
                newExpandedSections.push(section.id);
                section.categories?.forEach(category => {
                    newExpandedCategories.push(category.id);
                });
            });

            setExpandedSections(newExpandedSections);
            setExpandedCategories(newExpandedCategories);
        } else if (isMobile) {
            // On mobile, start with all collapsed unless there's an active item
            if (activeSection) {
                setExpandedSections([activeSection]);
            } else {
                setExpandedSections([]);
            }
            if (activeCategory) {
                setExpandedCategories([activeCategory]);
            } else {
                setExpandedCategories([]);
            }
        } else {
            // Desktop: Prioritize explicit activeSection/activeCategory props
            if (activeSection) {
                setExpandedSections([activeSection]);
            }
            if (activeCategory) {
                setExpandedCategories([activeCategory]);
            }

            // Fallback: If no active section, try to derive from items (existing logic) or default
            if (!activeSection && !activeCategory) {
                const section = sections.find(s =>
                    s.categories?.some(c => c.items?.includes(activeItem))
                );
                if (section) {
                    setExpandedSections([section.id]);
                    const category = section.categories?.find(c => c.items?.includes(activeItem));
                    if (category) setExpandedCategories([category.id]);
                } else if (sections.length > 0) {
                    // Default to first section expanded if nothing active
                    setExpandedSections([sections[0].id]);
                }
            }
        }
    }, [searchQuery, filteredSections, activeItem, activeSection, activeCategory, sections, isMobile]);


    const toggleSection = useCallback((section: NavigationItem) => {
        setExpandedSections(prev => {
            const isExpanded = prev.includes(section.id);
            if (isExpanded) {
                return prev.filter(id => id !== section.id);
            } else {
                // Determine what to select: first category's first item
                if (onSelect) {
                    const firstCategory = section.categories?.[0];
                    const firstItem = firstCategory?.items?.[0];
                    if (firstCategory && firstItem) {
                        queueMicrotask(() => {
                            onSelect(firstItem, firstCategory.id, section.id);
                        });
                    }
                }
                return [...prev, section.id];
            }
        });
    }, [onSelect]);

    const toggleCategory = useCallback((category: { id: string; items?: string[] }, sectionId: string) => {
        setExpandedCategories(prev => {
            const isExpanded = prev.includes(category.id);
            if (isExpanded) {
                return prev.filter(id => id !== category.id);
            } else {
                // Defer onSelect to next microtask to avoid setState during render
                if (category.items && category.items.length > 0 && onSelect) {
                    queueMicrotask(() => {
                        onSelect(category.items![0], category.id, sectionId);
                    });
                }
                return [...prev, category.id];
            }
        });
    }, [onSelect]);

    const handleItemClick = useCallback((itemId: string, categoryId: string, sectionId: string) => {
        if (onSelect) {
            onSelect(itemId, categoryId, sectionId);
        }
    }, [onSelect]);

    const formatLabel = useCallback((id: string) => {
        return id
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    }, []);

    return (
        <nav
            className={`nested-menu ${isCollapsed ? 'nested-menu--collapsed' : ''} nested-menu--size-${size} nested-menu--spacing-${spacing} ${className}`}
            aria-label="Navigation menu"
        >
            {/* Header / Toggle - always visible at top */}
            {onToggle && (
                <SidebarToggle
                    isExpanded={!isCollapsed}
                    toggleSidebar={onToggle}
                    className="nested-menu__toggle"
                    variant={variant}
                />
            )}

            {/* Search - collapsed/mobile shows icon only */}
            {isMobile ? (
                // Mobile: Show search icon inline with sections, or expanded input
                isSearchExpanded ? (
                    <div className="nested-menu__search nested-menu__search--mobile-expanded">
                        <SearchInput
                            placeholder="Search…"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onClear={() => {
                                setSearchQuery('');
                                setIsSearchExpanded(false);
                            }}
                            fullWidth
                            size="s"
                            autoFocus
                        />
                        <button
                            className="nested-menu__icon-btn"
                            onClick={() => {
                                setSearchQuery('');
                                setIsSearchExpanded(false);
                            }}
                            title="Close search"
                            aria-label="Close search"
                        >
                            <X size={18} aria-hidden="true" />
                        </button>
                    </div>
                ) : null
            ) : (
                // Desktop: Always show search input or icon when collapsed
                <div className={`nested-menu__search ${isCollapsed ? 'nested-menu__search--collapsed' : ''}`}>
                    {isCollapsed ? (
                        <button
                            className="nested-menu__icon-btn"
                            onClick={onExpand}
                            title="Search components"
                            aria-label="Search components"
                        >
                            <Search size={18} aria-hidden="true" />
                        </button>
                    ) : (
                        <SearchInput
                            placeholder="Search components…"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onClear={() => setSearchQuery('')}
                            fullWidth
                            size="s"
                            autoFocus
                        />
                    )}
                </div>
            )}

            <div className={`nested-menu__scroll ${isCollapsed ? 'nested-menu__scroll--collapsed hidden-scrollbar' : ''}`}>
                <div className="nested-menu__content">
                    {!isCollapsed && filteredSections.length === 0 && (
                        <div className="nested-menu__empty-state">
                            No results found
                        </div>
                    )}
                    {filteredSections.map((section, index) => {
                        const isSectionExpanded = expandedSections.includes(section.id);
                        const SectionIcon = section.icon;
                        const isFirstSection = index === 0;
                        const hasCategories = section.categories && section.categories.length > 0;

                        // Flat list mode: section with no categories is a direct item
                        if (!hasCategories) {
                            const iconSize = size === 'lg' ? 24 : size === 'md' ? 20 : 18;
                            return (
                                <div key={section.id} className={`nested-menu__section nested-menu__section--flat ${isMobile && isFirstSection ? 'nested-menu__section--with-search' : ''}`}>
                                    {/* Mobile: Show search icon on first section row */}
                                    {isMobile && isFirstSection && !isSearchExpanded && (
                                        <button
                                            className="nested-menu__search-toggle"
                                            onClick={() => setIsSearchExpanded(true)}
                                            title="Search components"
                                            aria-label="Search components"
                                        >
                                            <Search size={18} aria-hidden="true" />
                                        </button>
                                    )}
                                    <button
                                        className={`nested-menu__section-header nested-menu__section-header--flat ${activeSection === section.id || activeItem === section.id ? 'nested-menu__section-header--active' : ''}`}
                                        onClick={() => isCollapsed ? onExpand?.() : handleItemClick(section.id, section.id, section.id)}
                                        title={isCollapsed ? section.label : undefined}
                                    >
                                        {SectionIcon && <span aria-hidden="true"><SectionIcon size={iconSize} className="nested-menu__icon" /></span>}
                                        {!isCollapsed && <span className="nested-menu__label">{section.label}</span>}
                                    </button>
                                </div>
                            );
                        }

                        // Nested mode: section with categories
                        const iconSize = size === 'lg' ? 24 : size === 'md' ? 20 : 18;
                        const categoryIconSize = size === 'lg' ? 20 : size === 'md' ? 18 : 16;

                        return (
                            <div key={section.id} className={`nested-menu__section ${isMobile && isFirstSection ? 'nested-menu__section--with-search' : ''}`}>
                                {/* Mobile: Show search icon on first section row */}
                                {isMobile && isFirstSection && !isSearchExpanded && (
                                    <button
                                        className="nested-menu__search-toggle"
                                        onClick={() => setIsSearchExpanded(true)}
                                        title="Search components"
                                        aria-label="Search components"
                                    >
                                        <Search size={18} aria-hidden="true" />
                                    </button>
                                )}
                                <button
                                    className={`nested-menu__section-header ${activeSection === section.id ? 'nested-menu__section-header--active' : ''}`}
                                    onClick={() => isCollapsed ? onExpand?.() : toggleSection(section)}
                                    aria-expanded={isCollapsed ? undefined : isSectionExpanded}
                                    title={isCollapsed ? section.label : undefined}
                                >
                                    {SectionIcon && <span aria-hidden="true"><SectionIcon size={iconSize} className="nested-menu__icon" /></span>}
                                    {!isCollapsed && (
                                        <>
                                            <span className="nested-menu__label">{section.label}</span>
                                            <span className="nested-menu__chevron" aria-hidden="true">
                                                {isSectionExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                                            </span>
                                        </>
                                    )}
                                </button>

                                {/* Categories - hidden when collapsed */}
                                {!isCollapsed && isSectionExpanded && section.categories && (
                                    <div className="nested-menu__categories">
                                        {section.categories.map((category) => {
                                            const isCategoryExpanded = expandedCategories.includes(category.id);
                                            const CategoryIcon = category.icon;

                                            return (
                                                <div key={category.id} className="nested-menu__category">
                                                    <button
                                                        className={`nested-menu__category-header ${activeCategory === category.id && activeSection === section.id ? 'nested-menu__category-header--active' : ''}`}
                                                        onClick={() => toggleCategory(category, section.id)}
                                                        aria-expanded={isCategoryExpanded}
                                                    >
                                                        {CategoryIcon && <span aria-hidden="true"><CategoryIcon size={categoryIconSize} className="nested-menu__icon" /></span>}
                                                        <span className="nested-menu__label">{category.label}</span>
                                                        {category.items && category.items.length > 0 && (
                                                            <span className="nested-menu__chevron" aria-hidden="true">
                                                                {isCategoryExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                                                            </span>
                                                        )}
                                                    </button>

                                                    {isCategoryExpanded && category.items && (
                                                        <ul className="nested-menu__items">
                                                            {category.items.map((itemId) => (
                                                                <li key={itemId}>
                                                                    <button
                                                                        className={`nested-menu__item ${activeItem === itemId && activeCategory === category.id && activeSection === section.id ? 'nested-menu__item--active' : ''}`}
                                                                        onClick={() => handleItemClick(itemId, category.id, section.id)}
                                                                    >
                                                                        {formatLabel(itemId)}
                                                                    </button>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </nav>
    );
};
