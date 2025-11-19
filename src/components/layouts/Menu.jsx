// src/components/layouts/Menu.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import Icon from '../ui/Icon';
import { Home, Building, Settings } from '../ui/iconLibrary';
import clsx from 'clsx';

/**
 * Menu Component  
 * Navigation menu for sidebar
 * Adapts to show icon-only or icon+text based on sidebar state
 */
const Menu = ({ expanded }) => {
  const menuItems = [
    {
      id: 'home',
      label: 'Home',
      to: '/',
      icon: Home,
    },
    {
      id: 'properties',
      label: 'Properties',
      to: '/properties',
      icon: Building,
    },
    {
      id: 'styleguide',
      label: 'Style Guide',
      to: '/style-guide',
      icon: Settings,
    },
  ];

  return (
    <ul className="menu">
      {menuItems.map((item) => (
        <li key={item.id} className="menu__item">
          <NavLink
            to={item.to}
            className={({ isActive }) =>
              clsx('menu__link', { 'menu__link--active': isActive })
            }
            title={!expanded ? item.label : undefined}
          >
            <Icon size="m" className="menu__icon">
              <item.icon />
            </Icon>
            {expanded && (
              <span className="menu__label">{item.label}</span>
            )}
          </NavLink>
        </li>
      ))}
    </ul>
  );
};

Menu.propTypes = {
  expanded: PropTypes.bool.isRequired,
};

export default Menu;