import React from 'react';
/**
 * Main App Routes
 * 
 * Routes for the main application (non-admin, non-style-guide)
 */

import { Route } from 'react-router-dom';

// These would import from feature/experience packages
// For now, placeholder components
const HomePage = () => <div>Home Page</div>;
const SettingsPage = () => <div>Settings Page</div>;
const AssetsPage = () => <div>Assets Page</div>;

export const appRoutes = (
    <>
        <Route path="/" element={<HomePage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/assets" element={<AssetsPage />} />
    </>
);
