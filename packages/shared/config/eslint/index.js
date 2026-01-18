/**
 * Base ESLint configuration for Pulwave monorepo
 * Use this for Node.js packages and scripts
 */
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import globals from 'globals';
import { boundariesConfig } from './boundaries.js';

/** @type {import('eslint').Linter.FlatConfig[]} */
export const baseConfig = [
    {
        ignores: ['dist', 'node_modules', '**/*.d.ts', 'build', 'coverage'],
    },
    {
        files: ['**/*.{js,ts}'],
        extends: [
            js.configs.recommended,
            ...tseslint.configs.recommended,
        ],
        languageOptions: {
            ecmaVersion: 2022,
            globals: {
                ...globals.node,
            },
            parser: tseslint.parser,
            parserOptions: {
                sourceType: 'module',
            },
        },
        rules: {
            '@typescript-eslint/no-unused-vars': [
                'error',
                { varsIgnorePattern: '^[A-Z_]', argsIgnorePattern: '^_' }
            ],
            '@typescript-eslint/no-explicit-any': 'warn',
            'no-unused-vars': 'off',
        },
    },
    // Architecture boundaries enforcement
    boundariesConfig,
];

// Re-export boundaries config for direct usage
export { boundariesConfig } from './boundaries.js';

export default baseConfig;
