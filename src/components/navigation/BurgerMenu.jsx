// src/components/ui/BurgerMenu.jsx
import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';

/**
 * BurgerMenu Component
 * Animated hamburger menu button for mobile navigation
 * Transforms into an X when active
 * 
 * @param {boolean} isOpen - Whether the menu is open
 * @param {function} onClick - Click handler
 * @param {string} className - Additional CSS classes
 */
const BurgerMenu = ({ isOpen, onClick, className }) => {
  return (
    <button
      className={clsx(
        'burger-menu',
        isOpen && 'burger-menu--active',
        className
      )}
      onClick={onClick}
      aria-label={isOpen ? 'Close menu' : 'Open menu'}
      aria-expanded={isOpen}
      type="button"
    >
      <span className="burger-menu__line burger-menu__line--top"></span>
      <span className="burger-menu__line burger-menu__line--middle"></span>
      <span className="burger-menu__line burger-menu__line--bottom"></span>
    </button>
  );
};

BurgerMenu.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
  className: PropTypes.string,
};

export default BurgerMenu;