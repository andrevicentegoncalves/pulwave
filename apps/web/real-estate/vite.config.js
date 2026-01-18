import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'

// Root of the monorepo
const rootDir = path.resolve(__dirname, '../../..')

export default defineConfig(({ mode }) => {
    // Load env from ROOT with 'VITE_' prefix
    const env = loadEnv(mode, rootDir, 'VITE_')

    // Validate required env vars at build time
    if (!env.VITE_SUPABASE_URL || !env.VITE_SUPABASE_ANON_KEY) {
        console.error('❌ Missing required environment variables in root .env.local:');
        if (!env.VITE_SUPABASE_URL) console.error('  - VITE_SUPABASE_URL');
        if (!env.VITE_SUPABASE_ANON_KEY) console.error('  - VITE_SUPABASE_ANON_KEY');
        console.error('\nChecked in:', path.join(rootDir, '.env.local'));
        console.error('\nMake sure the file exists and variables are NOT commented out.\n');
        process.exit(1);
    }

    return {
    // Load .env files from monorepo root ONLY
    envDir: rootDir,

    // Ensure all VITE_ prefixed vars are exposed to client
    envPrefix: 'VITE_',

    // CRITICAL FIX: Explicitly define env vars for browser
    // envDir alone doesn't always inject into import.meta.env in dev mode
    define: {
        'import.meta.env.VITE_SUPABASE_URL': JSON.stringify(env.VITE_SUPABASE_URL),
        'import.meta.env.VITE_SUPABASE_ANON_KEY': JSON.stringify(env.VITE_SUPABASE_ANON_KEY),
        'import.meta.env.VITE_SKIP_ONBOARDING': JSON.stringify(env.VITE_SKIP_ONBOARDING || 'false'),
        'import.meta.env.VITE_APP_ENV': JSON.stringify(env.VITE_APP_ENV || 'development'),
    },

    plugins: [
        // SWC is 20x faster than Babel for React transforms
        react(),
    ],
    // Build optimizations
    build: {
        target: 'esnext',
        minify: 'esbuild',
        cssCodeSplit: true,
        chunkSizeWarningLimit: 1000,
        rollupOptions: {
            output: {
                // Manual chunk splitting for better caching
                manualChunks: (id) => {
                    // Admin features in separate chunk (lazy-loaded)
                    if (id.includes('packages/features/admin') ||
                        id.includes('packages/pages/admin')) {
                        return 'admin';
                    }
                    // Style guide in separate chunk (lazy-loaded)
                    if (id.includes('packages/features/style-guide') ||
                        id.includes('packages/pages/style-guide')) {
                        return 'style-guide';
                    }
                    // Vendor chunks - rarely change
                    if (id.includes('node_modules/react') ||
                        id.includes('node_modules/react-dom') ||
                        id.includes('node_modules/react-router-dom')) {
                        return 'vendor-react';
                    }
                    if (id.includes('node_modules/@tanstack/react-query')) {
                        return 'vendor-query';
                    }
                    if (id.includes('node_modules/lucide-react')) {
                        return 'vendor-icons';
                    }
                    if (id.includes('node_modules/date-fns') ||
                        id.includes('node_modules/clsx')) {
                        return 'vendor-utils';
                    }
                },
            },
        },
        // Enable source maps for debugging (hidden in production)
        sourcemap: 'hidden',
    },
    // Faster server startup
    server: {
        warmup: {
            clientFiles: [
                './src/main.tsx',
                './src/App.tsx',
            ],
        },
    },
    resolve: {
        alias: {
            // Short aliases (preferred - future-proof)
            '@ui': path.resolve(rootDir, './packages/shared/ui'),
            '@tokens': path.resolve(rootDir, './packages/shared/tokens'),

            // @pulwave/* aliases
            '@pulwave/ui': path.resolve(rootDir, './packages/shared/ui'),
            '@pulwave/tokens': path.resolve(rootDir, './packages/shared/tokens'),
            '@pulwave/utils': path.resolve(rootDir, './packages/shared/utils'),
            '@pulwave/widgets': path.resolve(rootDir, './packages/widgets'),
            '@pulwave/features-settings': path.resolve(rootDir, './packages/features/settings'),
            '@pulwave/features-admin': path.resolve(rootDir, './packages/features/admin'),
            '@pulwave/features-shared': path.resolve(rootDir, './packages/features/shared'),
            '@pulwave/features-auth': path.resolve(rootDir, './packages/features/auth'),
            '@pulwave/features-user': path.resolve(rootDir, './packages/features/user'),
            '@pulwave/features-dashboard': path.resolve(rootDir, './packages/features/dashboard'),
            '@pulwave/features-layout': path.resolve(rootDir, './packages/features/layout'),
            '@pulwave/features-subscriptions': path.resolve(rootDir, './packages/features/subscriptions'),
            '@pulwave/pages-admin': path.resolve(rootDir, './packages/pages/admin'),
            '@pulwave/pages-auth': path.resolve(rootDir, './packages/pages/auth'),
            '@pulwave/pages-dashboard': path.resolve(rootDir, './packages/pages/dashboard'),
            '@pulwave/pages-shell': path.resolve(rootDir, './packages/pages/shell'),
            '@pulwave/pages-style-guide': path.resolve(rootDir, './packages/pages/style-guide'),

            // V2 Packages
            '@pulwave/entities': path.resolve(rootDir, './packages/entities'),

            // Internal packages
            '@pulwave/internal-env': path.resolve(rootDir, './packages/internal/env'),

            // Force single React instance
            react: path.resolve(rootDir, './node_modules/react'),
            'react-dom': path.resolve(rootDir, './node_modules/react-dom'),
        },
    },
    css: {
        preprocessorOptions: {
            scss: {
                includePaths: [
                    path.resolve(rootDir, './packages'),
                    path.resolve(rootDir, './packages/shared/tokens/styles/scss'),
                ],
            },
        },
    },
    optimizeDeps: {
        // Pre-bundle dependencies for faster dev server startup
        include: [
            // Core React
            'react',
            'react-dom',
            'react-router-dom',
            '@tanstack/react-query',
            // UI libraries
            'lucide-react',
            'clsx',
            'class-variance-authority',
        ],
        // Exclude internal packages from pre-bundling so HMR works
        exclude: [
            '@pulwave/ui',
            '@pulwave/tokens',
            '@pulwave/widgets',
            '@pulwave/pages-shell',
            '@pulwave/internal-env',
        ],
    },
    // Enable caching
    cacheDir: 'node_modules/.vite',
    }
})
