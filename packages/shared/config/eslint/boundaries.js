/**
 * ESLint Boundaries Configuration
 * Enforces Pulwave monorepo architecture rules
 *
 * Layer hierarchy (top to bottom):
 * - apps: Application entry points
 * - experience: Page assemblies and flows
 * - features: Domain-specific features
 * - patterns: Reusable layout compositions
 * - ui: Pure presentational components
 * - data: Provider-agnostic data layer
 * - foundation: Design tokens and utilities
 *
 * Rule: Higher layers can import from lower layers, never the reverse
 */

import boundaries from 'eslint-plugin-boundaries';

/**
 * Define architecture layers
 */
const elements = [
    {
        type: 'app',
        pattern: 'apps/**/src/**/*',
        mode: 'folder',
    },
    {
        type: 'experience',
        pattern: 'packages/experience/**/src/**/*',
        mode: 'folder',
    },
    {
        type: 'pages',
        pattern: 'packages/pages/**/src/**/*',
        mode: 'folder',
    },
    {
        type: 'features',
        pattern: 'packages/features/**/src/**/*',
        mode: 'folder',
    },
    {
        type: 'widgets',
        pattern: 'packages/widgets/**/*',
        mode: 'folder',
    },
    {
        type: 'patterns',
        pattern: 'packages/patterns/**/*',
        mode: 'folder',
    },
    {
        type: 'ui',
        pattern: 'packages/shared/ui/**/*',
        mode: 'folder',
    },
    {
        type: 'data',
        pattern: 'packages/entities/**/*',
        mode: 'folder',
    },
    {
        type: 'foundation',
        pattern: 'packages/shared/{hooks,utils,types,tokens,security,analytics}/**/*',
        mode: 'folder',
    },
    {
        type: 'config',
        pattern: 'packages/shared/config/**/*',
        mode: 'folder',
    },
    {
        type: 'integrations',
        pattern: 'packages/integrations/**/*',
        mode: 'folder',
    },
];

/**
 * Boundary rules configuration
 */
export const boundariesConfig = {
    plugins: {
        boundaries,
    },
    settings: {
        'boundaries/elements': elements,
        'boundaries/ignore': [
            '**/*.test.{ts,tsx}',
            '**/*.spec.{ts,tsx}',
            '**/__tests__/**',
            '**/__mocks__/**',
            '**/test-utils/**',
            '**/*.stories.{ts,tsx}',
        ],
    },
    rules: {
        // Prevent imports from higher layers (enforces downward dependency flow)
        'boundaries/element-types': [
            'error',
            {
                default: 'disallow',
                rules: [
                    // Apps can import from everything except other apps
                    {
                        from: 'app',
                        allow: [
                            'experience',
                            'pages',
                            'features',
                            'widgets',
                            'patterns',
                            'ui',
                            'data',
                            'foundation',
                            'integrations',
                        ],
                    },
                    // Experience can import from features and below
                    {
                        from: 'experience',
                        allow: ['features', 'widgets', 'patterns', 'ui', 'data', 'foundation'],
                    },
                    // Pages can import from features and below
                    {
                        from: 'pages',
                        allow: ['features', 'widgets', 'patterns', 'ui', 'data', 'foundation'],
                    },
                    // Features can import from widgets, patterns, ui, data, foundation
                    {
                        from: 'features',
                        allow: ['widgets', 'patterns', 'ui', 'data', 'foundation'],
                    },
                    // Widgets can import from patterns, ui, foundation
                    {
                        from: 'widgets',
                        allow: ['patterns', 'ui', 'foundation'],
                    },
                    // Patterns can import from ui and foundation
                    {
                        from: 'patterns',
                        allow: ['ui', 'foundation'],
                    },
                    // UI can only import from foundation
                    {
                        from: 'ui',
                        allow: ['foundation'],
                    },
                    // Data can only import from foundation
                    {
                        from: 'data',
                        allow: ['foundation', 'integrations'],
                    },
                    // Foundation is the base - imports nothing from app layers
                    {
                        from: 'foundation',
                        allow: [],
                    },
                    // Config can import nothing (build configs)
                    {
                        from: 'config',
                        allow: [],
                    },
                    // Integrations can import foundation
                    {
                        from: 'integrations',
                        allow: ['foundation'],
                    },
                ],
            },
        ],

        // Prevent deep relative imports (enforce package aliases)
        'boundaries/no-private': [
            'error',
            {
                allowUncles: false, // Disallow ../../../
            },
        ],

        // Prevent imports from external packages' internals
        'boundaries/external': [
            'error',
            {
                default: 'disallow',
            },
        ],
    },
};

export default boundariesConfig;
