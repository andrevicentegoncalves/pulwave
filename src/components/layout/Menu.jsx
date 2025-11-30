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
    /**
     * Handle keyboard navigation
     */
    const handleKeyDown = (event, itemId) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            onItemClick(itemId);
        }
    };

    return (
        <nav className="menu" aria-label="Main navigation">
            {items.map((item) => {
                const isActive = activeItem === item.id;
                const Icon = item.icon;
                
                return (
                    <div
                        key={item.id}
                        className={`menu__item ${isActive ? 'menu__item--active' : ''} ${isCollapsed ? 'menu__item--collapsed' : ''}`}
                        onClick={() => onItemClick(item.id)}
                        onKeyDown={(e) => handleKeyDown(e, item.id)}
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
            id: PropTypes.string.isRequired,
            icon: PropTypes.elementType.isRequired,
            label: PropTypes.string.isRequired,
        })
    ).isRequired,
    activeItem: PropTypes.string.isRequired,
    onItemClick: PropTypes.func.isRequired,
    isCollapsed: PropTypes.bool,
};

export default Menu;