import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { App } from './App';

// Import all providers and services
import { authContextService } from '@pulwave/entity-auth';
import { translationService } from '@pulwave/entity-translation';

// Shared contexts - split into atomic features
import { AuthProvider } from '@pulwave/features-auth';
import { ThemeProvider } from '@pulwave/features-shared';
import { ToastProvider } from '@pulwave/features-feedback';
import { TranslationProvider, translationUtils } from '@pulwave/features-i18n';

// Import tokens (CSS Variables) - Explicit import to ensure availability
import '@pulwave/tokens/styles/tokens/generated/tokens.css';
// Import styles from tokens package
import '@pulwave/tokens/styles/scss/_index.scss';
// Import layouts from ui package
// import '@pulwave/ui/styles/_index.scss';
// Import country flags CSS
// import '../../../../src/assets/css/country-flags.css';

// Suppress React DevTools warning
if (import.meta.env.DEV) {
    const originalInfo = console.info;
    const originalLog = console.log;
    const devToolsFilter = (args: unknown[]) => {
        const msg = args.join(' ');
        return typeof msg === 'string' && (
            msg.includes("Download the React DevTools") ||
            msg.includes("React DevTools")
        );
    };

    console.info = (...args) => {
        if (devToolsFilter(args)) return;
        originalInfo.apply(console, args);
    };
    console.log = (...args) => {
        if (devToolsFilter(args)) return;
        originalLog.apply(console, args);
    };
    console.warn = (...args) => {
        if (devToolsFilter(args)) return;
        // console.warn suppression is tricky as many legit warnings exist, 
        // but DevTools message usually comes as info or log.
        // We'll leave originalWarn alone unless confirmed it's a warn.
    };
}

// Create query client
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60 * 5,
            retry: 0, // Disabled retries to prevent infinite loops on 404s
        },
    },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            <AuthProvider authService={authContextService}>
                {/* <TranslationProvider
                    translationService={translationService}
                    cacheUtils={translationUtils}
                > */}
                <ThemeProvider>
                    <ToastProvider>
                        <BrowserRouter>
                            <App />
                            {/* <div>App commented out for debugging</div> */}
                        </BrowserRouter>
                    </ToastProvider>
                </ThemeProvider>
                {/* </TranslationProvider> */}
            </AuthProvider>
        </QueryClientProvider>
    </React.StrictMode>
);
