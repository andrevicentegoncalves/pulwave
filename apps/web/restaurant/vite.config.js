import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'

const rootDir = path.resolve(__dirname, '../../..')

export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            '@pulwave/foundation': path.resolve(rootDir, './packages/foundation'),
            '@pulwave/ui': path.resolve(rootDir, './packages/ui'),
            '@pulwave/patterns': path.resolve(rootDir, './packages/patterns'),
            react: path.resolve(rootDir, './node_modules/react'),
            'react-dom': path.resolve(rootDir, './node_modules/react-dom'),
        },
    },
    css: {
        preprocessorOptions: {
            scss: {
                api: 'modern-compiler',
                silenceDeprecations: ['global-builtin', 'import', 'legacy-js-api'],
                includePaths: [
                    path.resolve(rootDir, './packages/foundation/styles'),
                ],
            },
        },
    },
    optimizeDeps: {
        include: ['react', 'react-dom', 'react-router-dom', 'lucide-react'],
    },
})
