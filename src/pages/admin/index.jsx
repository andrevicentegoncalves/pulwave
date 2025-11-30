// TODO: Implement Admin Dashboard
// This is the main entry point for the admin backoffice
// It should include:
// - Admin authentication check
// - Admin layout wrapper
// - Admin routing

import React from 'react';
import { Navigate } from 'react-router-dom';

const Admin = () => {
    // TODO: Check if user has admin role
    // const { user } = useAuth();
    // if (!user || user.app_role !== 'admin') {
    //   return <Navigate to="/" replace />;
    // }

    return (
        <div className="admin">
            <h1>Admin Dashboard</h1>
            <p>Coming soon...</p>
        </div>
    );
};

export default Admin;
