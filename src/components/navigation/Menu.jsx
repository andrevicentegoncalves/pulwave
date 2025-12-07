import React from 'react';
import PropTypes from 'prop-types';

/**
 * Menu - Navigation menu component
 * 
 * Renders a list of navigation items with active state highlighting,
 * keyboard navigation, and responsive behavior.
 * 
 * Features:
 * - Active route highlighting
 * - Keyboard navigation (Enter/Space)
 * - Icon and label support
 * - Collapsed/expanded states
 * - WCAG AA compliant
 * 
 * @example
 * <Menu 
 *   items={menuItems}
 *   activeItem="/dashboard"
 *   onItemClick={handleClick}
 *   isCollapsed={false}
 * />
 */
const Menu = ({ items, activeItem, onItemClick, isCollapsed = false }) => {
    const [expandedCategories, setExpandedCategories] = React.useState({});

    const toggleCategory = (label) => {
        if (isCollapsed) return; // Disable toggling when sidebar is collapsed
        setExpandedCategories(prev => ({
            ...prev,
            [label]: !prev[label]
        }));
    };

    /**
     * Handle keyboard navigation
     */
    const handleKeyDown = (event, item) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            if (item.items) {
                toggleCategory(item.label);
            } else {
                onItemClick(item.id);
            }
        }
    };

    return (
        <nav className="menu" aria-label="Main navigation">
            {items.map((item, index) => {
                // Check if it's a category
                if (item.items) {
                    const isExpanded = expandedCategories[item.label];
                    const CategoryIcon = item.icon;
                    const isActiveChild = item.items.some(subItem => subItem.id === activeItem);

                    return (
                        <div key={index} className={`menu__category-group ${isCollapsed ? 'collapsed' : ''}`}>
                            <div
                                className={`menu__category-header ${isActiveChild ? 'active-parent' : ''}`}
                                onClick={() => toggleCategory(item.label)}
                                onKeyDown={(e) => handleKeyDown(e, item)}
                                role="button"
                                tabIndex={0}
                                aria-expanded={isExpanded}
                            >
                                <div className="menu__category-content">
                                    {CategoryIcon && (
                                        <div className="menu__icon">
                                            <CategoryIcon />
                                        </div>
                                    )}
                                    <span className="menu__label">{item.label}</span>
                                </div>
                                {!isCollapsed && (
                                    <span className={`menu__chevron ${isExpanded ? 'expanded' : ''}`}>
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="6 9 12 15 18 9"></polyline>
                                        </svg>
                                    </span>
                                )}
                            </div>

                            <div className={`menu__submenu ${isExpanded && !isCollapsed ? 'expanded' : ''}`}>
                                {item.items.map(subItem => {
                                    const isSubActive = activeItem === subItem.id;
                                    const SubIcon = subItem.icon;
                                    return (
                                        <div
                                            key={subItem.id}
                                            className={`menu__item menu__item--sub ${isSubActive ? 'menu__item--active' : ''}`}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onItemClick(subItem.id);
                                            }}
                                            onKeyDown={(e) => handleKeyDown(e, subItem)}
                                            role="button"
                                            tabIndex={0}
                                            aria-current={isSubActive ? 'page' : undefined}
                                        >
                                            <div className="menu__icon" aria-hidden="true">
                                                {SubIcon && <SubIcon />}
                                            </div>
                                            <span className="menu__label">
                                                {subItem.label}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    );
                }

                // Regular Item
                const isActive = activeItem === item.id;
                const Icon = item.icon;

                return (
                    <div
                        key={item.id}
                        className={`menu__item ${isActive ? 'menu__item--active' : ''} ${isCollapsed ? 'menu__item--collapsed' : ''}`}
                        onClick={() => onItemClick(item.id)}
                        onKeyDown={(e) => handleKeyDown(e, item)}
                        role="button"
                        tabIndex={0}
                        aria-current={isActive ? 'page' : undefined}
                        title={isCollapsed ? item.label : undefined}
                    >
                        <div className="menu__icon" aria-hidden="true">
                            <Icon />
                        </div>
                        <span className="menu__label">
                            {item.label}
                        </span>
                    </div>
                );
            })}
        </nav>
    );
};

Menu.propTypes = {
    items: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string, // Optional for categories
            icon: PropTypes.elementType,
            label: PropTypes.string.isRequired,
            items: PropTypes.array, // For nested items
        })
    ).isRequired,
    activeItem: PropTypes.string.isRequired,
    onItemClick: PropTypes.func.isRequired,
    isCollapsed: PropTypes.bool,
};

export default Menu;