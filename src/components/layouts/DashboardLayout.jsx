// src/components/layouts/DashboardLayout.jsx
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from '../ui/Header';
import BurgerMenu from '../ui/BurgerMenu';
import clsx from 'clsx';
import PropTypes from 'prop-types';

/**
 * DashboardLayout
 * Main layout wrapper for authenticated pages
 * Provides sidebar navigation, header with user info, and mobile support
 * 
 * Features:
 * - Desktop: Toggle sidebar expand/collapse, header with user profile
 * - Mobile: BurgerMenu to show/hide sidebar with overlay
 */
const DashboardLayout = ({ children }) => {
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleBurgerClick = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleSidebarToggle = () => {
    setSidebarExpanded(!sidebarExpanded);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <div className="dashboard-layout">
      {/* Sidebar with mobile support */}
      <Sidebar 
        expanded={sidebarExpanded}
        onToggle={handleSidebarToggle}
        mobileOpen={mobileMenuOpen}
        onMobileClose={closeMobileMenu}
      />
      
      {/* Mobile overlay */}
      {mobileMenuOpen && (
        <div 
          className="sidebar-overlay sidebar-overlay--active"
          onClick={closeMobileMenu}
          aria-hidden="true"
        />
      )}
      
      {/* Main content area */}
      <div className={clsx(
        'dashboard-layout__main',
        sidebarExpanded && 'dashboard-layout__main--shifted'
      )}>
        {/* Mobile Header with Burger Menu */}
        <div className="dashboard-layout__mobile-header">
          <BurgerMenu 
            isOpen={mobileMenuOpen}
            onClick={handleBurgerClick}
          />
          <div className="dashboard-layout__logo">
            <span className="dashboard-layout__logo-text">Pulwave</span>
          </div>
        </div>

        {/* Desktop Header with User Info */}
        <Header className="dashboard-layout__header" />
        
        {/* Page Content */}
        <div className="dashboard-layout__content">
          {children || <Outlet />}
        </div>
      </div>
    </div>
  );
};

DashboardLayout.propTypes = {
  children: PropTypes.node,
};

export default DashboardLayout;