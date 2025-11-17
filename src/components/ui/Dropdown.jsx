import React, { useState, useRef, useEffect, useCallback } from 'react';

export const Dropdown = ({ trigger, children, align = 'left' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleToggle = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        handleClose();
      }
    };

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
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
  }, [isOpen, handleClose]);

  return (
    <div className="dropdown" ref={dropdownRef}>
      <button 
        className="dropdown__trigger"
        onClick={handleToggle}
        type="button"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        {trigger}
        <svg 
          className={`dropdown__arrow ${isOpen ? 'dropdown__arrow--open' : ''}`}
          width="12" 
          height="12" 
          viewBox="0 0 12 12"
          aria-hidden="true"
        >
          <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      
      {isOpen && (
        <div className={`dropdown__menu dropdown__menu--${align}`} role="menu">
          {React.Children.map(children, child => 
            React.cloneElement(child, { onClose: handleClose })
          )}
        </div>
      )}
    </div>
  );
};

export const DropdownItem = ({ children, onClick, danger = false, disabled = false, onClose }) => {
  const handleClick = useCallback(() => {
    if (disabled) return;
    if (onClick) onClick();
    if (onClose) onClose();
  }, [onClick, onClose, disabled]);

  return (
    <button
      className={`dropdown__item ${danger ? 'dropdown__item--danger' : ''} ${disabled ? 'dropdown__item--disabled' : ''}`}
      onClick={handleClick}
      type="button"
      role="menuitem"
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export const DropdownDivider = ({ variant = 'solid' }) => {
  return <div className={`dropdown__divider dropdown__divider--${variant}`} role="separator" />;
};

export const DropdownLabel = ({ children }) => {
  return <div className="dropdown__label" role="presentation">{children}</div>;
};