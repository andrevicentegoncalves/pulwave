// src/components/layouts/DashboardLayout.jsx
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import UserInfo from './UserInfo';
import PropTypes from 'prop-types';

/**
 * DashboardLayout
 * Main layout wrapper for authenticated pages
 * Provides sidebar navigation and user info header
 */
const DashboardLayout = ({ children }) => {
  const [sidebarExpanded, setSidebarExpanded] = useState(false);

  return (
    <div className="dashboard-layout">
      <Sidebar 
        expanded={sidebarExpanded}
        onToggle={() => setSidebarExpanded(!sidebarExpanded)}
      />
      
      <div className="dashboard-layout__main">
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