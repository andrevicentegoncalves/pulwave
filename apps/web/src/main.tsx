import React from 'react';
/**
 * @pulwave/web - Thin App Shell
 * 
 * This is the main web application entry point.
 * It imports from experience packages and provides minimal routing/providers.
 * 
 * NO BUSINESS LOGIC should live here - only:
 * - Route definitions
 * - Provider composition
 * - App-level configuration
 * 
 * Team: App Team
 */

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';

// Import global styles from foundation
import "@pulwave/tokens/styles/scss/_index.scss";
// Import data visualization theme
import "@pulwave/ui/data-visualization/theme/styles/_index.scss";

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <App />
    </StrictMode>
);
