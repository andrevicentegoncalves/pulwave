import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Root of the monorepo
const rootDir = path.resolve(__dirname, '../..');

export default defineConfig({
    plugins: [react()],
    optimizeDeps: {
        include: ['lucide-react'],
    },
    resolve: {
        alias: {
            // =================================================================
            // SHARED PACKAGES (packages/shared/*)
            // =================================================================
            '@pulwave/tokens': path.resolve(rootDir, './packages/shared/tokens'),
            '@pulwave/ui': path.resolve(rootDir, './packages/shared/ui'),
            '@pulwave/config': path.resolve(rootDir, './packages/shared/config'),
            '@pulwave/hooks': path.resolve(rootDir, './packages/shared/hooks'),
            '@pulwave/utils': path.resolve(rootDir, './packages/shared/utils'),
            '@pulwave/types': path.resolve(rootDir, './packages/shared/types'),

            // =================================================================
            // PAGES (packages/pages/*) - Experience layer
            // =================================================================
            '@pulwave/experience-admin-dashboard': path.resolve(rootDir, './packages/pages/backoffice'),
            '@pulwave/experience-style-guide': path.resolve(rootDir, './packages/pages/style-guide'),
            '@pulwave/pages-shell': path.resolve(rootDir, './packages/pages/shell'),
            '@pulwave/pages-auth': path.resolve(rootDir, './packages/pages/auth'),
            '@pulwave/pages-dashboard': path.resolve(rootDir, './packages/pages/dashboard'),
            '@pulwave/pages-onboarding': path.resolve(rootDir, './packages/pages/onboarding'),
            '@pulwave/pages-payments': path.resolve(rootDir, './packages/pages/payments'),

            // =================================================================
            // FEATURES (packages/features/*)
            // =================================================================
            '@pulwave/features-admin': path.resolve(rootDir, './packages/features/admin'),
            '@pulwave/features-auth': path.resolve(rootDir, './packages/features/auth'),
            '@pulwave/features-dashboard': path.resolve(rootDir, './packages/features/dashboard'),
            '@pulwave/features-feedback': path.resolve(rootDir, './packages/features/feedback'),
            '@pulwave/features-i18n': path.resolve(rootDir, './packages/features/i18n'),
            '@pulwave/features-layout': path.resolve(rootDir, './packages/features/layout'),
            '@pulwave/features-legal': path.resolve(rootDir, './packages/features/legal'),
            '@pulwave/features-payments': path.resolve(rootDir, './packages/features/payments'),
            '@pulwave/features-properties': path.resolve(rootDir, './packages/features/properties'),
            '@pulwave/features-settings': path.resolve(rootDir, './packages/features/settings'),
            '@pulwave/features-shared': path.resolve(rootDir, './packages/features/shared'),
            '@pulwave/features-social': path.resolve(rootDir, './packages/features/social'),
            '@pulwave/features-style-guide': path.resolve(rootDir, './packages/features/style-guide'),
            '@pulwave/features-subscriptions': path.resolve(rootDir, './packages/features/subscriptions'),
            '@pulwave/features-user': path.resolve(rootDir, './packages/features/user'),

            // =================================================================
            // WIDGETS (packages/widgets)
            // =================================================================
            '@pulwave/widgets': path.resolve(rootDir, './packages/widgets'),

            // =================================================================
            // ENTITIES (packages/entities/*)
            // =================================================================
            '@pulwave/entity-infrastructure': path.resolve(rootDir, './packages/entities/_infrastructure'),
            '@pulwave/entity-address': path.resolve(rootDir, './packages/entities/address'),
            '@pulwave/entity-admin': path.resolve(rootDir, './packages/entities/admin'),
            '@pulwave/entity-auth': path.resolve(rootDir, './packages/entities/auth'),
            '@pulwave/entity-billing': path.resolve(rootDir, './packages/entities/billing'),
            '@pulwave/entity-feature-flags': path.resolve(rootDir, './packages/entities/feature-flags'),
            '@pulwave/entity-payment': path.resolve(rootDir, './packages/entities/payment'),
            '@pulwave/entity-profile': path.resolve(rootDir, './packages/entities/profile'),
            '@pulwave/entity-property': path.resolve(rootDir, './packages/entities/property'),
            '@pulwave/entity-storage': path.resolve(rootDir, './packages/entities/storage'),
            '@pulwave/entity-subscription': path.resolve(rootDir, './packages/entities/subscription'),
            '@pulwave/entity-system': path.resolve(rootDir, './packages/entities/system'),
            '@pulwave/entity-translation': path.resolve(rootDir, './packages/entities/translation'),

            // =================================================================
            // SHORT ALIASES (preferred)
            // =================================================================
            '@ui': path.resolve(rootDir, './packages/shared/ui'),
            '@tokens': path.resolve(rootDir, './packages/shared/tokens'),

            // =================================================================
            // REACT (force single instance)
            // =================================================================
            react: path.resolve(rootDir, './node_modules/react'),
            'react-dom': path.resolve(rootDir, './node_modules/react-dom'),
        }
    }
});