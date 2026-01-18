import { useState, type ReactNode, type KeyboardEvent } from 'react';
import { cn } from '@pulwave/utils';
import { ChevronDown } from '../../icon-library';
import { menuVariants, type MenuProps, type MenuItem } from './types';
import './styles/_index.scss';

export const Menu = ({
    items,
    activeItem,
    onItemClick,
    isCollapsed = false,
    className
}: MenuProps) => {
    const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});

    const toggleCategory = (label: string, categoryItems?: MenuItem[]) => {
        if (isCollapsed && categoryItems && categoryItems.length > 0) {
            onItemClick(categoryItems[0].id || '');
            return;
        }
        setExpandedCategories(prev => ({
            ...prev,
            [label]: !prev[label]
        }));
    };

    const handleKeyDown = (event: KeyboardEvent, item: MenuItem) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            if (item.items) {
                toggleCategory(item.label, item.items);
            } else if (item.id) {
                onItemClick(item.id);
            }
        }
    };

    return (
        <nav className={cn(menuVariants({ collapsed: isCollapsed }), className)} aria-label="Main navigation">
            {items.map((item, index) => {
                if (item.items) {
                    const isExpanded = expandedCategories[item.label];
                    const CategoryIcon = item.icon;
                    const isActiveChild = item.items.some(subItem => subItem.id === activeItem);

                    return (
                        <div key={item.label || item.id || `category-${index}`} className={cn('menu__category-group', isCollapsed && 'collapsed')}>
                            <button
                                type="button"
                                className={cn('menu__category-header', isActiveChild && 'active-parent')}
                                onClick={() => toggleCategory(item.label, item.items)}
                                aria-expanded={isExpanded}
                            >
                                <span className="menu__category-content">
                                    {CategoryIcon && (
                                        <span className="menu__icon" aria-hidden="true">
                                            <CategoryIcon />
                                        </span>
                                    )}
                                    <span className="menu__label">{item.label}</span>
                                </span>
                                {!isCollapsed && (
                                    <span className={cn('menu__chevron', isExpanded && 'expanded')} aria-hidden="true">
                                        <ChevronDown size={16} />
                                    </span>
                                )}
                            </button>

                            <div className={cn('menu__submenu', isExpanded && !isCollapsed && 'expanded')}>
                                {item.items.map(subItem => {
                                    const isSubActive = activeItem === subItem.id;
                                    const SubIcon = subItem.icon;
                                    return (
                                        <button
                                            type="button"
                                            key={subItem.id}
                                            className={cn(
                                                'menu__item menu__item--sub',
                                                isSubActive && 'menu__item--active'
                                            )}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                if (subItem.id) onItemClick(subItem.id);
                                            }}
                                            aria-current={isSubActive ? 'page' : undefined}
                                        >
                                            <span className="menu__icon" aria-hidden="true">
                                                {SubIcon && <SubIcon />}
                                            </span>
                                            <span className="menu__label">{subItem.label}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    );
                }

                const isActive = activeItem === item.id;
                const Icon = item.icon;

                return (
                    <button
                        type="button"
                        key={item.id}
                        className={cn(
                            'menu__item',
                            isActive && 'menu__item--active',
                            isCollapsed && 'menu__item--collapsed'
                        )}
                        onClick={() => item.id && onItemClick(item.id)}
                        aria-current={isActive ? 'page' : undefined}
                        title={isCollapsed ? item.label : undefined}
                    >
                        <span className="menu__icon" aria-hidden="true">
                            {Icon && <Icon />}
                        </span>
                        <span className="menu__label">{item.label}</span>
                    </button>
                );
            })}
        </nav>
    );
};
Menu.displayName = 'Menu';
