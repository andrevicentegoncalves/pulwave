import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { createPortal } from 'react-dom';
import Input from './Input';
import Icon from './Icon';
import { Search } from './iconLibrary';

export const DropdownContext = React.createContext({
  isOpen: false,
  onClose: () => { },
  onToggle: () => { }
});

export const useDropdown = () => React.useContext(DropdownContext);

export const Dropdown = ({ trigger, children, align = 'left', disabled = false, usePortal = true }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const triggerRef = useRef(null);
  const menuRef = useRef(null);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0, width: 0 });

  const handleToggle = useCallback(() => {
    if (disabled) return;
    setIsOpen(prev => !prev);
  }, [disabled]);

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  // Calculate menu position when opening
  useEffect(() => {
    if (isOpen && triggerRef.current && usePortal) {
      const rect = triggerRef.current.getBoundingClientRect();
      setMenuPosition({
        top: rect.bottom + window.scrollY,
        left: align === 'right' ? rect.right - 200 + window.scrollX : rect.left + window.scrollX,
        width: rect.width
      });
    }
  }, [isOpen, align, usePortal]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Check if click is outside both the trigger and the menu
      const isOutsideTrigger = dropdownRef.current && !dropdownRef.current.contains(event.target);
      const isOutsideMenu = menuRef.current && !menuRef.current.contains(event.target);

      if (isOutsideTrigger && isOutsideMenu) {
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

  const menuContent = isOpen && (
    <div
      ref={menuRef}
      className={`dropdown__menu dropdown__menu--${align} ${usePortal ? 'dropdown__menu--portal' : ''}`}
      role="menu"
      style={usePortal ? {
        position: 'absolute',
        top: `${menuPosition.top}px`,
        left: `${menuPosition.left}px`,
        minWidth: `${menuPosition.width}px`,
        zIndex: 9999
      } : undefined}
    >
      {React.Children.map(children, child =>
        React.isValidElement(child) ? React.cloneElement(child, { onClose: handleClose }) : child
      )}
    </div>
  );

  return (
    <DropdownContext.Provider value={contextValue}>
      <div className="dropdown" ref={dropdownRef}>
        <div ref={triggerRef}>
          {triggerElement}
        </div>

        {usePortal && isOpen ? createPortal(menuContent, document.body) : menuContent}
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

/**
 * DropdownSelect - A dropdown with built-in search and grouped options support
 * Use this when you need a searchable/grouped dropdown menu
 */
export const DropdownSelect = ({
  options = [],
  onSelect,
  searchable = false,
  searchPlaceholder = "Search...",
  grouped = false,
  groupKey = 'group',
  emptyMessage = "No results found",
  onClose
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Filter options based on search
  const filteredOptions = useMemo(() => {
    if (!searchable || !searchQuery.trim()) return options;
    const query = searchQuery.toLowerCase();
    return options.filter(opt =>
      opt.label?.toLowerCase().includes(query) ||
      opt[groupKey]?.toLowerCase().includes(query) ||
      (opt.searchTerms && opt.searchTerms.some(term => term.toLowerCase().includes(query)))
    );
  }, [options, searchQuery, searchable, groupKey]);

  // Group options if grouped is enabled
  const groupedOptions = useMemo(() => {
    if (!grouped) return null;

    const groups = {};
    const noGroup = [];

    filteredOptions.forEach(opt => {
      const groupName = opt[groupKey];
      if (groupName) {
        if (!groups[groupName]) groups[groupName] = [];
        groups[groupName].push(opt);
      } else {
        noGroup.push(opt);
      }
    });

    // Sort groups: System first, then alphabetically
    const sortedGroupNames = Object.keys(groups).sort((a, b) => {
      if (a === 'System') return -1;
      if (b === 'System') return 1;
      return a.localeCompare(b);
    });

    return { groups, sortedGroupNames, noGroup };
  }, [filteredOptions, grouped, groupKey]);

  const handleSelect = (opt) => {
    onSelect?.(opt.value, opt);
    setSearchQuery('');
    onClose?.();
  };

  const renderItem = (opt) => (
    <DropdownItem
      key={opt.value}
      onClick={() => handleSelect(opt)}
      disabled={opt.disabled}
      icon={opt.icon}
    >
      {opt.label}
    </DropdownItem>
  );

  return (
    <div className="dropdown-select">
      {searchable && (
        <div className="dropdown-select__search-container">
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={searchPlaceholder}
            leftIcon={<Icon size="s"><Search /></Icon>}
            size="sm"
            fullWidth
            autoFocus
          />
        </div>
      )}
      <div className="dropdown-select__options-container">
        {filteredOptions.length === 0 ? (
          <div className="dropdown-select__empty-state">{emptyMessage}</div>
        ) : grouped && groupedOptions ? (
          <>
            {groupedOptions.noGroup.map(renderItem)}
            {groupedOptions.sortedGroupNames.map(groupName => (
              <div key={groupName} className="dropdown-select__group">
                <div className="dropdown-select__group-label">{groupName}</div>
                {groupedOptions.groups[groupName].map(renderItem)}
              </div>
            ))}
          </>
        ) : (
          filteredOptions.map(renderItem)
        )}
      </div>
    </div>
  );
};
