import React from 'react';
import PropTypes from 'prop-types';

/**
 * AdminPageHeader - Consistent page header for admin pages
 * Reduces duplicate header markup across all admin pages
 */
const AdminPageHeader = ({ title, subtitle, children }) => (
    <div className="admin-header">
        <div>
            <h1 className="admin-header__title">{title}</h1>
            {subtitle && <p className="admin-header__subtitle">{subtitle}</p>}
        </div>
        {children && <div className="admin-header__actions">{children}</div>}
    </div>
);

AdminPageHeader.propTypes = {
    title: PropTypes.string.isRequired,
    subtitle: PropTypes.string,
    children: PropTypes.node,
};

export default AdminPageHeader;
