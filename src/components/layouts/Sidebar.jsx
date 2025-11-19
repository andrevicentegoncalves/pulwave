// src/components/layouts/Sidebar.jsx
import React from 'react';
import PropTypes from 'prop-types';
import Menu from './Menu';
import Icon from '../ui/Icon';
import { ChevronLeft, ChevronRight } from '../ui/iconLibrary';
import clsx from 'clsx';

/**
 * Sidebar Component
 * Collapsible navigation sidebar with mobile support
 * 
 * Desktop: Shows toggle button, expands/collapses in place
 * Mobile: Slides in from left, overlay behind
 */
const Sidebar = ({ expanded, onToggle, mobileOpen, onMobileClose }) => {
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
            {/* You can add your logo icon here */}
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <rect width="32" height="32" rx="8" fill="currentColor" fillOpacity="0.1"/>
              <path d="M16 8L8 14V24H12V18H20V24H24V14L16 8Z" fill="currentColor"/>
            </svg>
          </div>
          {expanded && (
            <span className="sidebar__logo-text">Pulwave</span>
          )}
        </div>
        
        {/* Desktop Toggle Button */}
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

      {/* Sidebar Footer (for future use - settings, etc.) */}
      <div className="sidebar__footer">
        {/* You can add footer items like Settings link here */}
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