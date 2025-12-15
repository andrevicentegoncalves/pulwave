import React from 'react';
import PropTypes from 'prop-types';
import { Spinner } from '../ui';

/**
 * AdminLoadingState - Consistent loading spinner for admin pages
 * Replaces duplicate loading markup across all admin pages
 */
const AdminLoadingState = ({ size = 'lg' }) => (
    <div className="admin-loading">
        <Spinner size={size} />
    </div>
);

AdminLoadingState.propTypes = {
    size: PropTypes.oneOf(['sm', 'md', 'lg']),
};

export default AdminLoadingState;
