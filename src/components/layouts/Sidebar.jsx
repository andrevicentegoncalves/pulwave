// src/components/layouts/Sidebar.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import Menu from './Menu';
import Icon from '../ui/Icon';
import { ChevronLeft, ChevronRight, Settings } from '../ui/iconLibrary';
import clsx from 'clsx';

/**
 * Sidebar Component
 * Collapsible navigation sidebar with mobile support
 * 
 * Desktop: Shows toggle button, expands/collapses in place
 * Mobile: Slides in from left, overlay behind
 */
const Sidebar = ({ expanded, onToggle, mobileOpen, onMobileClose }) => {
  const navigate = useNavigate();

  const handleSettingsClick = () => {
    navigate('/settings');
    if (onMobileClose) {
      onMobileClose();
    }
  };

  return (
    <aside className={clsx(
      'sidebar',
      expanded && 'sidebar--expanded',
      mobileOpen && 'sidebar--mobile-open'
    )}>
      {/* Sidebar Header with Logo */}
      <div className="sidebar__header">
        <div className="sidebar__logo">
          <div className="sidebar__logo-icon">
            {/* Logo icon */}
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <rect width="32" height="32" rx="8" fill="currentColor" fillOpacity="0.1"/>
              <path d="M16 8L8 14V24H12V18H20V24H24V14L16 8Z" fill="currentColor"/>
            </svg>
          </div>
          {(expanded || mobileOpen) && (
            <span className="sidebar__logo-text">Pulwave</span>
          )}
        </div>
        
        {/* Desktop Toggle Button - NO BORDER */}
        <button
          className="sidebar__toggle"
          onClick={onToggle}
          aria-label={expanded ? 'Collapse sidebar' : 'Expand sidebar'}
          aria-expanded={expanded}
        >
          <Icon size="s">
            {expanded ? <ChevronLeft /> : <ChevronRight />}
          </Icon>
        </button>
      </div>

      {/* Navigation Menu */}
      <nav className="sidebar__content">
        <Menu expanded={expanded || mobileOpen} onItemClick={onMobileClose} />
      </nav>

      {/* Sidebar Footer with Settings */}
      <div className="sidebar__footer">
        <button
          className="sidebar__footer-link"
          onClick={handleSettingsClick}
          title={!(expanded || mobileOpen) ? 'Settings' : undefined}
        >
          <Icon size="m" className="sidebar__footer-icon">
            <Settings />
          </Icon>
          {(expanded || mobileOpen) && (
            <span className="sidebar__footer-label">Settings</span>
          )}
        </button>
      </div>
    </aside>
  );
};

Sidebar.propTypes = {
  expanded: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
  mobileOpen: PropTypes.bool,
  onMobileClose: PropTypes.func,
};

Sidebar.defaultProps = {
  mobileOpen: false,
  onMobileClose: () => {},
};

export default Sidebar;