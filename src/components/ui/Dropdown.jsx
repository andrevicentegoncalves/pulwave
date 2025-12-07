import React, { useState, useRef, useEffect, useCallback } from 'react';

export const DropdownContext = React.createContext({
  isOpen: false,
  onClose: () => { },
  onToggle: () => { }
});

export const useDropdown = () => React.useContext(DropdownContext);

export const Dropdown = ({ trigger, children, align = 'left', disabled = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleToggle = useCallback(() => {
    if (disabled) return;
    setIsOpen(prev => !prev);
  }, [disabled]);

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

  // Clone trigger with dropdown props
  const triggerElement = React.cloneElement(trigger, {
    onClick: handleToggle,
    'aria-haspopup': 'true',
    'aria-expanded': isOpen,
    className: `${trigger.props.className || ''} dropdown__trigger`,
  });

  const contextValue = React.useMemo(() => ({
    isOpen,
    onClose: handleClose,
    onToggle: handleToggle
  }), [isOpen, handleClose, handleToggle]);

  return (
    <DropdownContext.Provider value={contextValue}>
      <div className="dropdown" ref={dropdownRef}>
        {triggerElement}

        {isOpen && (
          <div className={`dropdown__menu dropdown__menu--${align}`} role="menu">
            {React.Children.map(children, child =>
              React.isValidElement(child) ? React.cloneElement(child, { onClose: handleClose }) : child
            )}
          </div>
        )}
      </div>
    </DropdownContext.Provider>
  );
};

export const DropdownItem = ({ children, icon, onClick, danger = false, disabled = false, onClose }) => {
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
      {icon && <span className="dropdown__item-icon">{icon}</span>}
      <span className="dropdown__item-text">{children}</span>
    </button>
  );
};

export const DropdownDivider = ({ variant = 'solid' }) => {
  return <div className={`dropdown__divider dropdown__divider--${variant}`} role="separator" />;
};

export const DropdownLabel = ({ children }) => {
  return <div className="dropdown__label" role="presentation">{children}</div>;
};