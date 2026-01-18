/**
 * Shared Prettier configuration for Pulwave monorepo
 *
 * Usage in package.json:
 * "prettier": "@pulwave/prettier-config"
 *
 * Or in .prettierrc.js:
 * export { default } from '@pulwave/prettier-config';
 */

/** @type {import('prettier').Config} */
const config = {
    semi: true,
    singleQuote: true,
    tabWidth: 4,
    useTabs: false,
    trailingComma: 'es5',
    printWidth: 100,
    bracketSpacing: true,
    bracketSameLine: false,
    arrowParens: 'always',
    endOfLine: 'lf',
    overrides: [
        {
            files: ['*.json', '*.md', '*.yml', '*.yaml'],
            options: {
                tabWidth: 2,
            },
        },
        {
            files: ['*.scss', '*.css'],
            options: {
                singleQuote: false,
            },
        },
    ],
};

export default config;
