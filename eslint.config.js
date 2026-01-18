import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist', 'node_modules', '**/*.d.ts']),
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parser: tseslint.parser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    rules: {
      '@typescript-eslint/no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]', argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'warn',
      'no-unused-vars': 'off', // Use TypeScript version instead

      // Import restrictions for monorepo package boundaries
      'no-restricted-imports': ['error', {
        patterns: [
          // Features cannot import from other features
          {
            group: ['@pulwave/features-*'],
            message: 'Features should not import from other features. Use shared foundation or UI packages instead.'
          },
          // Experience packages cannot import from other experience packages
          {
            group: ['@pulwave/experience-*'],
            message: 'Experience packages should not import from other experience packages.'
          },
          // Prevent direct src imports in packages
          {
            group: ['../../../src/*', '../../src/*'],
            message: 'Use package imports instead of relative src paths.'
          },
        ],
      }],
    },
  },
  // Foundation package - no restrictions on what it can import
  {
    files: ['packages/foundation/**/*.{js,jsx,ts,tsx}'],
    rules: {
      'no-restricted-imports': 'off',
    },
  },
  // UI package - can import from foundation only
  {
    files: ['packages/ui/**/*.{js,jsx,ts,tsx}'],
    rules: {
      'no-restricted-imports': ['error', {
        patterns: [
          {
            group: ['@pulwave/features-*', '@pulwave/experience-*'],
            message: 'UI packages should only import from @pulwave/foundation.'
          },
        ],
      }],
    },
  },
])
