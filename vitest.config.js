import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./packages/foundation/tests/setup.js'],
    include: [
      'src/**/*.{test,spec}.{js,jsx,ts,tsx}',
      'packages/**/*.{test,spec}.{js,jsx,ts,tsx}',
      'apps/**/*.{test,spec}.{js,jsx,ts,tsx}',
    ],
    exclude: ['node_modules', 'dist'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: [
        'packages/foundation/shared/**/*.{ts,tsx}',
        'packages/ui/components/**/*.{ts,tsx}',
        'packages/features/**/*.{ts,tsx}',
        'packages/experience/**/*.{ts,tsx}',
        'apps/**/*.{ts,tsx,js,jsx}',
      ],
      exclude: [
        '**/*.d.ts',
        '**/index.ts',
        '**/*.test.{ts,tsx}',
        '**/*.spec.{ts,tsx}',
      ],
      thresholds: {
        statements: 60,
        branches: 50,
        functions: 60,
        lines: 60,
      },
    },
  },
  resolve: {
    alias: {
      '@pulwave/foundation': path.resolve(__dirname, 'packages/foundation'),
      '@pulwave/ui': path.resolve(__dirname, 'packages/ui'),
      '@pulwave/feature-settings': path.resolve(__dirname, 'packages/features/settings'),
      '@pulwave/experience-admin-dashboard': path.resolve(__dirname, 'packages/experience/admin-dashboard'),
      '@pulwave/experience-style-guide': path.resolve(__dirname, 'packages/experience/style-guide'),
      '@pulwave/experience-subscription': path.resolve(__dirname, 'packages/experience/subscription'),
    },
  },
});
