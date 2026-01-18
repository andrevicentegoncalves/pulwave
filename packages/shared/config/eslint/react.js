/**
 * React ESLint configuration for Pulwave monorepo
 * Use this for React packages and apps
 */
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import globals from 'globals';
import { boundariesConfig } from './boundaries.js';

/** @type {import('eslint').Linter.FlatConfig[]} */
export const reactConfig = [
    {
        ignores: ['dist', 'node_modules', '**/*.d.ts', 'build', 'coverage'],
    },
    {
        files: ['**/*.{js,jsx,ts,tsx}'],
        extends: [
            js.configs.recommended,
            ...tseslint.configs.recommended,
        ],
        languageOptions: {
            ecmaVersion: 2022,
            globals: {
                ...globals.browser,
            },
            parser: tseslint.parser,
            parserOptions: {
                ecmaVersion: 'latest',
                ecmaFeatures: { jsx: true },
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

/**
 * Import boundary rules for monorepo package architecture
 */
export const importBoundaryRules = {
    'no-restricted-imports': ['error', {
        patterns: [
            {
                group: ['@pulwave/features-*'],
                message: 'Features should not import from other features. Use shared foundation or UI packages instead.'
            },
            {
                group: ['@pulwave/experience-*'],
                message: 'Experience packages should not import from other experience packages.'
            },
            {
                group: ['../../../src/*', '../../src/*'],
                message: 'Use package imports instead of relative src paths.'
            },
        ],
    }],
};

export default reactConfig;
