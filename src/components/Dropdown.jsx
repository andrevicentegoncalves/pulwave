// src/components/Dropdown.jsx
import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';

const Dropdown = ({
  trigger,
  children,
  align = 'left',
  disabled = false,
  closeOnSelect = true,
  className,
  onOpen,
  onClose,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        handleClose();
      }
    };

    const handleEscape = (event) => {
      if (event.key === 'Escape' && isOpen) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  const handleToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (disabled) return;
    
    if (!isOpen) {
      setIsOpen(true);
      onOpen?.();
    } else {
      handleClose();
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    onClose?.();
  };

  const handleItemClick = (itemCallback) => {
    return (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      if (itemCallback) {
        itemCallback(e);
      }
      
      if (closeOnSelect) {
        handleClose();
      }
    };
  };

  return (
    <div 
      ref={dropdownRef}
      className={clsx(
        'dropdown',
        isOpen && 'dropdown--open',
        disabled && 'dropdown--disabled',
        className
      )}
    >
      {/* Dropdown Trigger */}
      <div
        className="dropdown__trigger"
        onClick={handleToggle}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleToggle(e);
          }
        }}
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        {trigger}
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div 
          className={clsx(
            'dropdown__menu',
            `dropdown__menu--${align}`
          )}
          role="menu"
        >
          {React.Children.map(children, (child) => {
            if (React.isValidElement(child) && child.type === DropdownItem) {
              return React.cloneElement(child, {
                onClick: handleItemClick(child.props.onClick),
              });
            }
            return child;
          })}
        </div>
      )}
    </div>
  );
};

Dropdown.propTypes = {
  trigger: PropTypes.node.isRequired,
  children: PropTypes.node.isRequired,
  align: PropTypes.oneOf(['left', 'right', 'center']),
  disabled: PropTypes.bool,
  closeOnSelect: PropTypes.bool,
  className: PropTypes.string,
  onOpen: PropTypes.func,
  onClose: PropTypes.func,
};

// Dropdown Item Component
export const DropdownItem = ({
  children,
  onClick,
  disabled = false,
  icon,
  danger = false,
  className,
}) => {
  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!disabled && onClick) {
      onClick(e);
    }
  };

  return (
    <button
      type="button"
      className={clsx(
        'dropdown__item',
        disabled && 'dropdown__item--disabled',
        danger && 'dropdown__item--danger',
        className
      )}
      onClick={handleClick}
      disabled={disabled}
      role="menuitem"
    >
      {icon && <span className="dropdown__item-icon">{icon}</span>}
      <span className="dropdown__item-text">{children}</span>
    </button>
  );
};

DropdownItem.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
  icon: PropTypes.node,
  danger: PropTypes.bool,
  className: PropTypes.string,
};

// Dropdown Divider Component
export const DropdownDivider = () => {
  return <div className="dropdown__divider" role="separator" />;
};

export default Dropdown;