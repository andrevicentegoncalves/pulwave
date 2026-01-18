import React, { lazy, Suspense } from 'react';
/**
 * App Component - Thin Shell
 *
 * Composes providers and routes.
 * Imports experience shells for each major section.
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProviders } from './providers';
import { PageLoader } from '@pulwave/ui';

// Lazy-loaded experience shells for code splitting
const AdminShell = lazy(() => import('@pulwave/experience-admin-dashboard').then(m => ({ default: m.AdminShell })));
const StyleGuideApp = lazy(() => import('@pulwave/experience-style-guide').then(m => ({ default: m.StyleGuideApp })));
const SubscriptionShell = lazy(() => import('@pulwave/features-subscriptions').then(m => ({ default: m.SubscriptionShell })));

// App-specific routes and components
import { appRoutes } from './routes/appRoutes';
import { adminRoutes } from './routes/adminRoutes';

export const App = () => {
    return (
        <AppProviders>
            <BrowserRouter>
                <Routes>
                    {/* Admin Dashboard Experience */}
                    <Route path="/admin/*" element={
                        <Suspense fallback={<PageLoader />}>
                            <AdminShell />
                        </Suspense>
                    }>
                        {adminRoutes}
                    </Route>

                    {/* Style Guide Experience */}
                    <Route path="/style-guide/*" element={
                        <Suspense fallback={<PageLoader />}>
                            <StyleGuideApp />
                        </Suspense>
                    } />

                    {/* Subscription Experience */}
                    <Route path="/pricing/*" element={
                        <Suspense fallback={<PageLoader />}>
                            <SubscriptionShell />
                        </Suspense>
                    } />
                    <Route path="/checkout/*" element={
                        <Suspense fallback={<PageLoader />}>
                            <SubscriptionShell />
                        </Suspense>
                    } />
                    <Route path="/billing/*" element={
                        <Suspense fallback={<PageLoader />}>
                            <SubscriptionShell />
                        </Suspense>
                    } />

                    {/* Main App Routes */}
                    {appRoutes}

                    {/* Fallback */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </BrowserRouter>
        </AppProviders>
    );
};
