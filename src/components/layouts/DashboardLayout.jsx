// src/components/layouts/DashboardLayout.jsx
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import UserInfo from './UserInfo';
import PropTypes from 'prop-types';
import clsx from 'clsx';

/**
 * DashboardLayout
 * Main layout wrapper for authenticated pages
 * Provides sidebar navigation and user info header
 * ✅ FIXED: Content now shifts when sidebar expands/collapses
 */
const DashboardLayout = ({ children }) => {
  const [sidebarExpanded, setSidebarExpanded] = useState(false);

  return (
    <div className="dashboard-layout">
      <Sidebar 
        expanded={sidebarExpanded}
        onToggle={() => setSidebarExpanded(!sidebarExpanded)}
      />
      
      {/* ✅ FIX: Apply dynamic class to main based on sidebar state */}
      <div className={clsx(
        'dashboard-layout__main',
        sidebarExpanded && 'dashboard-layout__main--shifted'
      )}>
        <div className="dashboard-layout__header">
          <UserInfo />
        </div>
        
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