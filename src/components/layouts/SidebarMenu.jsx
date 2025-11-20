import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';

/**
 * SidebarMenu - Navigation menu with route items
 * 
 * Features:
 * - Active route highlighting with curved design
 * - Keyboard navigation support
 * - Collapsed/expanded states
 * - Smooth transitions
 * 
 * @example
 * <SidebarMenu 
 *   items={menuItems}
 *   activeItem="/dashboard"
 *   onItemClick={handleClick}
 *   isExpanded={true}
 * />
 */
const SidebarMenu = ({ items, activeItem, onItemClick, isExpanded }) => {
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
        <nav className="menu-items" aria-label="Main navigation">
            {items.map((item) => {
                const isActive = activeItem === item.id;
                
                return (
                    <div
                        key={item.id}
                        className={clsx(
                            'menu-item',
                            isActive && 'active',
                            !isExpanded && 'collapsed'
                        )}
                        onClick={() => onItemClick(item.id)}
                        onKeyDown={(e) => handleKeyDown(e, item.id)}
                        role="button"
                        tabIndex={0}
                        aria-current={isActive ? 'page' : undefined}
                        title={!isExpanded ? item.label : undefined}
                    >
                        <div className="menu-item__icon" aria-hidden="true">
                            <item.icon />
                        </div>
                        <span className="menu-item__label">
                            {item.label}
                        </span>
                    </div>
                );
            })}
        </nav>
    );
};

SidebarMenu.propTypes = {
    items: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string.isRequired,
            icon: PropTypes.elementType.isRequired,
            label: PropTypes.string.isRequired,
        })
    ).isRequired,
    activeItem: PropTypes.string.isRequired,
    onItemClick: PropTypes.func.isRequired,
    isExpanded: PropTypes.bool.isRequired,
};

export default SidebarMenu;