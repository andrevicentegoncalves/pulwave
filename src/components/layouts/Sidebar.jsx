// src/components/layouts/Sidebar.jsx
import React from 'react';
import PropTypes from 'prop-types';
import Menu from './Menu';
import Icon from '../ui/Icon';
import { Menu as MenuIcon, ChevronLeft, ChevronRight } from '../ui/iconLibrary';
import clsx from 'clsx';

/**
 * Sidebar Component
 * Collapsible navigation sidebar
 * Shows icons only when collapsed, icons + text when expanded
 */
const Sidebar = ({ expanded, onToggle }) => {
  return (
    <aside className={clsx(
      'sidebar',
      { 'sidebar--expanded': expanded }
    )}>
      <div className="sidebar__header">
        <button
          className="sidebar__toggle"
          onClick={onToggle}
          aria-label={expanded ? 'Collapse sidebar' : 'Expand sidebar'}
          aria-expanded={expanded}
        >
          <Icon size="m">
            {expanded ? <ChevronLeft /> : <ChevronRight />}
          </Icon>
        </button>
      </div>

      <nav className="sidebar__nav">
        <Menu expanded={expanded} />
      </nav>
    </aside>
  );
};

Sidebar.propTypes = {
  expanded: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
};

export default Sidebar;