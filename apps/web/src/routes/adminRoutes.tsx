import React, { lazy, Suspense } from 'react';
/**
 * Admin Routes
 *
 * Routes for the admin dashboard
 */

import { Route } from 'react-router-dom';
import { PageLoader } from '@pulwave/ui';

// Lazy-loaded admin pages
const DashboardPage = lazy(() => import('@pulwave/experience-admin-dashboard').then(m => ({ default: m.DashboardPage })));
const UsersPage = lazy(() => import('@pulwave/experience-admin-dashboard').then(m => ({ default: m.UsersPage })));
const TranslationsPage = lazy(() => import('@pulwave/experience-admin-dashboard').then(m => ({ default: m.TranslationsPage })));

export const adminRoutes = (
    <>
        <Route index element={
            <Suspense fallback={<PageLoader />}>
                <DashboardPage />
            </Suspense>
        } />
        <Route path="users" element={
            <Suspense fallback={<PageLoader />}>
                <UsersPage />
            </Suspense>
        } />
        <Route path="translations" element={
            <Suspense fallback={<PageLoader />}>
                <TranslationsPage />
            </Suspense>
        } />
    </>
);
