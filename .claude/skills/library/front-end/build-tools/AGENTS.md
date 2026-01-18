# Build Tools Guide - Complete Implementation Guide

> **Abstract**: This guide provides comprehensive patterns for configuring and optimizing modern JavaScript build tools. It covers Vite 7 configuration, bundle optimization, code splitting, tree shaking, path aliases, environment variables, and build performance. Each pattern includes incorrect vs correct examples with detailed explanations of why certain configurations fail and how to implement them properly. Special emphasis on Pulwave's Vite 7 + Turborepo setup with React 19 and TypeScript.

---

## Table of Contents

1. [Build Tools Fundamentals](#1-build-tools-fundamentals)
   - 1.1 [Vite vs Webpack](#11-vite-vs-webpack)
   - 1.2 [ESBuild Architecture](#12-esbuild-architecture)
   - 1.3 [Rollup for Production](#13-rollup-for-production)
   - 1.4 [Development vs Production Builds](#14-development-vs-production-builds)

2. [Vite Configuration](#2-vite-configuration)
   - 2.1 [Basic Configuration](#21-basic-configuration)
   - 2.2 [Path Aliases](#22-path-aliases)
   - 2.3 [Plugin System](#23-plugin-system)
   - 2.4 [Development Server](#24-development-server)

3. [Bundle Optimization](#3-bundle-optimization)
   - 3.1 [Code Splitting](#31-code-splitting)
   - 3.2 [Manual Chunks](#32-manual-chunks)
   - 3.3 [Dynamic Imports](#33-dynamic-imports)
   - 3.4 [Tree Shaking](#34-tree-shaking)

4. [Build Performance](#4-build-performance)
   - 4.1 [Build Speed Optimization](#41-build-speed-optimization)
   - 4.2 [Dependency Pre-Bundling](#42-dependency-pre-bundling)
   - 4.3 [Caching Strategies](#43-caching-strategies)
   - 4.4 [Parallel Processing](#44-parallel-processing)

5. [Asset Management](#5-asset-management)
   - 5.1 [Static Assets](#51-static-assets)
   - 5.2 [Image Optimization](#52-image-optimization)
   - 5.3 [CSS Processing](#53-css-processing)
   - 5.4 [Font Loading](#54-font-loading)

6. [Environment Variables](#6-environment-variables)
   - 6.1 [Vite Environment Variables](#61-vite-environment-variables)
   - 6.2 [Type Safety for Env](#62-type-safety-for-env)
   - 6.3 [Build-Time vs Runtime](#63-build-time-vs-runtime)
   - 6.4 [Environment-Specific Builds](#64-environment-specific-builds)

7. [Bundle Analysis](#7-bundle-analysis)
   - 7.1 [Bundle Size Visualization](#71-bundle-size-visualization)
   - 7.2 [Dependency Analysis](#72-dependency-analysis)
   - 7.3 [Performance Budgets](#73-performance-budgets)
   - 7.4 [Finding Bloat](#74-finding-bloat)

8. [Production Builds](#8-production-builds)
   - 8.1 [Production Optimization](#81-production-optimization)
   - 8.2 [Source Maps](#82-source-maps)
   - 8.3 [Minification](#83-minification)
   - 8.4 [Compression](#84-compression)

9. [Advanced Patterns](#9-advanced-patterns)
   - 9.1 [Multi-Entry Builds](#91-multi-entry-builds)
   - 9.2 [Library Mode](#92-library-mode)
   - 9.3 [SSR Configuration](#93-ssr-configuration)
   - 9.4 [Worker Builds](#94-worker-builds)

10. [Pulwave Integration](#10-pulwave-integration)
    - 10.1 [Pulwave Vite Configuration](#101-pulwave-vite-configuration)
    - 10.2 [Monorepo Build Setup](#102-monorepo-build-setup)
    - 10.3 [Package Bundling](#103-package-bundling)
    - 10.4 [Build Performance](#104-build-performance)

11. [Appendices](#11-appendices)
    - [Appendix A: Complete Build Optimization Checklist](#appendix-a-complete-build-optimization-checklist)
    - [Appendix B: Vite Configuration Reference](#appendix-b-vite-configuration-reference)
    - [Appendix C: Bundle Size Targets](#appendix-c-bundle-size-targets)
    - [Appendix D: Common Build Issues](#appendix-d-common-build-issues)

---

## 1. Build Tools Fundamentals

### 1.1 Vite vs Webpack

**Impact**: CRITICAL - Choosing the right build tool for your project

**Why**: Vite uses ESBuild for development (100x faster than Webpack) and Rollup for production (better tree shaking). Understanding trade-offs is essential.

**Comparison**:
```
Vite:
+ Lightning-fast HMR (<50ms)
+ Native ES modules in dev
+ Better DX (instant server start)
+ Simpler configuration
- Younger ecosystem
- Less plugins than Webpack

Webpack:
+ Mature ecosystem
+ More plugins
+ More configuration options
- Slow dev server (5-10s start)
- Slower HMR (500ms-2s)
+ Better legacy browser support
```

**Incorrect**:
```javascript
// ❌ Using Webpack for greenfield React project
module.exports = {
  mode: 'development',
  entry: './src/index.tsx',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      },
      {
        test: /\.scss$/,
        use: ['style-loader', 'css-loader', 'sass-loader']
      }
    ]
  },
  plugins: [new HtmlWebpackPlugin()],
  devServer: {
    port: 3000,
    hot: true
  }
};

// Problems:
// 1. Slow dev server start (5-10s)
// 2. Slow HMR (500ms-2s per change)
// 3. Complex configuration
// 4. Slower builds
```

**Correct**:
```typescript
// ✅ Using Vite for modern React project
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true
  },
  build: {
    target: 'es2020',
    sourcemap: true
  }
});

// Benefits:
// 1. Instant server start (<100ms)
// 2. Lightning-fast HMR (<50ms)
// 3. Simple configuration
// 4. Faster production builds
```

---

### 1.2 ESBuild Architecture

**Impact**: HIGH - Understanding Vite's development speed

**Why**: ESBuild is written in Go and compiles TypeScript/JSX 100x faster than tsc/Babel.

**How it works**:
```
Development Mode (Vite):
1. Serve unbundled ES modules
2. Transform TypeScript/JSX with ESBuild (instant)
3. On-demand compilation (only changed files)
4. Native browser ES modules (no bundling)

Production Mode (Vite):
1. Bundle with Rollup (better tree shaking)
2. Minify with ESBuild (fast)
3. Code splitting and optimization
4. Generate optimized chunks
```

**Incorrect**:
```typescript
// ❌ Manual ESBuild configuration (unnecessary with Vite)
import * as esbuild from 'esbuild';

await esbuild.build({
  entryPoints: ['src/index.tsx'],
  bundle: true,
  minify: true,
  sourcemap: true,
  target: ['es2020'],
  outfile: 'dist/bundle.js',
  loader: {
    '.tsx': 'tsx',
    '.ts': 'ts'
  }
});

// Problems:
// 1. Manual configuration
// 2. No HMR
// 3. No dev server
// 4. Missing optimizations
```

**Correct**:
```typescript
// ✅ Let Vite handle ESBuild integration
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  esbuild: {
    jsxInject: `import React from 'react'`, // Auto-import React
    logOverride: { 'this-is-undefined-in-esm': 'silent' }
  }
});

// Vite automatically uses ESBuild for:
// - TypeScript transpilation
// - JSX transformation
// - Minification
```

---

### 1.3 Rollup for Production

**Impact**: HIGH - Understanding production builds

**Why**: Rollup provides better tree shaking and code splitting than ESBuild for production.

**Rollup Advantages**:
- Better tree shaking (removes more dead code)
- Advanced code splitting
- More predictable output
- Plugin ecosystem

**Incorrect**:
```typescript
// ❌ Configuring Rollup manually (use Vite's integration)
import { rollup } from 'rollup';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

const bundle = await rollup({
  input: 'src/index.tsx',
  plugins: [resolve(), commonjs()]
});

await bundle.write({
  file: 'dist/bundle.js',
  format: 'es'
});

// Problems:
// 1. Manual configuration
// 2. No optimization
// 3. No code splitting
// 4. Missing dev server
```

**Correct**:
```typescript
// ✅ Configure Rollup through Vite
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          utils: ['lodash-es', 'date-fns']
        },
        // Consistent chunk naming for better caching
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    }
  }
});

// Vite automatically handles:
// - Tree shaking
// - Code splitting
// - Chunk optimization
```

---

### 1.4 Development vs Production Builds

**Impact**: CRITICAL - Different optimizations for each mode

**Why**: Development prioritizes speed. Production prioritizes size and performance.

**Trade-offs**:
```
Development:
+ Fast rebuilds (ESBuild)
+ Source maps (original code)
+ No minification (readable)
+ HMR (instant updates)
- Larger bundle size
- No tree shaking

Production:
+ Minified (ESBuild)
+ Tree shaking (Rollup)
+ Code splitting
+ Optimized assets
- Slower builds
- Less readable
```

**Incorrect**:
```typescript
// ❌ Same config for dev and production
export default defineConfig({
  build: {
    minify: false,  // No minification in production!
    sourcemap: 'inline'  // Huge bundle in production!
  }
});

// Problems:
// 1. Large production bundles
// 2. Slow load times
// 3. Exposed source code
```

**Correct**:
```typescript
// ✅ Different configs for dev and production
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  build: {
    // Production optimizations
    minify: mode === 'production' ? 'esbuild' : false,
    sourcemap: mode === 'production' ? 'hidden' : true,
    rollupOptions: {
      output: {
        manualChunks: mode === 'production' ? {
          vendor: ['react', 'react-dom']
        } : undefined
      }
    }
  },
  server: {
    // Development optimizations
    hmr: true,
    open: true
  }
}));

// Dev: Fast rebuilds, readable code
// Prod: Small bundles, minified
```

---

## 2. Vite Configuration

### 2.1 Basic Configuration

**Impact**: CRITICAL - Foundation of Vite setup

**Why**: Proper basic configuration ensures optimal development experience and production builds.

**Incorrect**:
```typescript
// ❌ Minimal configuration (missing optimizations)
export default {
  plugins: [react()]
};

// Problems:
// 1. No path aliases
// 2. No build optimization
// 3. No environment variables
// 4. No TypeScript configuration
```

**Correct**:
```typescript
// ✅ Comprehensive Vite configuration
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [
    react({
      // Fast Refresh configuration
      fastRefresh: true,
      // Babel plugins if needed
      babel: {
        plugins: []
      }
    })
  ],

  // Path aliases
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@utils': path.resolve(__dirname, './src/utils')
    }
  },

  // Development server
  server: {
    port: 3000,
    host: true,
    open: true,
    cors: true
  },

  // Build configuration
  build: {
    target: 'es2020',
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true,
    minify: 'esbuild',
    chunkSizeWarningLimit: 1000
  },

  // Optimizations
  optimizeDeps: {
    include: ['react', 'react-dom']
  }
});
```

---

### 2.2 Path Aliases

**Impact**: HIGH - Cleaner imports and better DX

**Why**: Path aliases eliminate ../../.. imports and make refactoring easier.

**Incorrect**:
```typescript
// ❌ Relative imports (hard to maintain)
import { Button } from '../../../components/ui/Button';
import { formatDate } from '../../../../utils/date';
import { API_URL } from '../../../../../config';

// Problems:
// 1. Hard to refactor
// 2. Easy to break when moving files
// 3. Difficult to read
```

**Correct**:
```typescript
// ✅ Path aliases for clean imports
// vite.config.ts
export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@config': path.resolve(__dirname, './src/config'),
      '@types': path.resolve(__dirname, './src/types')
    }
  }
});

// tsconfig.json (for TypeScript)
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@components/*": ["./src/components/*"],
      "@utils/*": ["./src/utils/*"],
      "@config/*": ["./src/config/*"],
      "@types/*": ["./src/types/*"]
    }
  }
}

// Usage
import { Button } from '@components/ui/Button';
import { formatDate } from '@utils/date';
import { API_URL } from '@config';

// Benefits:
// 1. Easy refactoring
// 2. Consistent imports
// 3. Better readability
```

---

### 2.3 Plugin System

**Impact**: HIGH - Extending Vite functionality

**Why**: Plugins add functionality (React, SCSS, SVG, etc.) without manual configuration.

**Common Plugins**:
```typescript
// ✅ Essential Vite plugins
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [
    // React plugin (Fast Refresh, JSX)
    react(),

    // SVG as React components
    svgr(),

    // Bundle size visualization
    visualizer({
      open: true,
      filename: 'dist/stats.html',
      gzipSize: true
    })
  ]
});

// Usage
import { ReactComponent as Logo } from './logo.svg';
import Icon from './icon.svg?react';
```

---

### 2.4 Development Server

**Impact**: HIGH - Developer experience optimization

**Why**: Proper dev server configuration improves development workflow.

**Incorrect**:
```typescript
// ❌ Default server config (suboptimal)
export default defineConfig({
  server: {}
});

// Problems:
// 1. Random port
// 2. Doesn't auto-open
// 3. No CORS handling
// 4. No proxy configuration
```

**Correct**:
```typescript
// ✅ Optimized dev server
export default defineConfig({
  server: {
    port: 3000,
    host: '0.0.0.0',  // Accessible from network
    open: true,        // Auto-open browser
    cors: true,
    strictPort: true,  // Exit if port is busy

    // Proxy API requests
    proxy: {
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    },

    // HMR configuration
    hmr: {
      overlay: true,  // Show errors as overlay
      clientPort: 3000
    },

    // Watch options
    watch: {
      usePolling: false,  // Better performance
      ignored: ['**/node_modules/**', '**/.git/**']
    }
  }
});
```

---

## 3. Bundle Optimization

### 3.1 Code Splitting

**Impact**: CRITICAL - Reducing initial bundle size

**Why**: Code splitting loads only necessary code, improving initial load time.

**Incorrect**:
```typescript
// ❌ No code splitting (single bundle)
import Dashboard from './Dashboard';
import Settings from './Settings';
import Profile from './Profile';

function App() {
  return (
    <Routes>
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/profile" element={<Profile />} />
    </Routes>
  );
}

// Problems:
// 1. All routes in initial bundle
// 2. Large bundle size
// 3. Slow initial load
```

**Correct**:
```typescript
// ✅ Route-based code splitting
import { lazy, Suspense } from 'react';

const Dashboard = lazy(() => import('./Dashboard'));
const Settings = lazy(() => import('./Settings'));
const Profile = lazy(() => import('./Profile'));

function App() {
  return (
    <Suspense fallback={<Spinner />}>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Suspense>
  );
}

// Benefits:
// 1. Smaller initial bundle
// 2. Routes loaded on-demand
// 3. Faster initial load
```

---

### 3.2 Manual Chunks

**Impact**: CRITICAL - Optimizing chunk strategy

**Why**: Manual chunks control how code is split, improving caching and load performance.

**Incorrect**:
```typescript
// ❌ Automatic chunking (suboptimal)
export default defineConfig({
  build: {
    // Default chunking - may create too many small chunks
  }
});

// Problems:
// 1. Too many HTTP requests
// 2. Suboptimal caching
// 3. Vendor code in app bundle
```

**Correct**:
```typescript
// ✅ Strategic manual chunks
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Vendor chunk (rarely changes)
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom')) {
              return 'react-vendor';
            }
            if (id.includes('@tanstack/react-query')) {
              return 'query-vendor';
            }
            return 'vendor';
          }

          // UI components chunk
          if (id.includes('/src/components/ui/')) {
            return 'ui-components';
          }

          // Utils chunk
          if (id.includes('/src/utils/')) {
            return 'utils';
          }
        }
      }
    }
  }
});

// Benefits:
// 1. Better caching (vendor rarely changes)
// 2. Parallel loading
// 3. Optimal chunk sizes
```

---

### 3.3 Dynamic Imports

**Impact**: HIGH - On-demand loading for better performance

**Why**: Dynamic imports defer loading until needed, reducing initial bundle size.

**Incorrect**:
```typescript
// ❌ Eager import of heavy components
import Chart from './Chart';  // 200KB
import Editor from './Editor';  // 300KB

function Dashboard() {
  const [showChart, setShowChart] = useState(false);

  return (
    <div>
      <button onClick={() => setShowChart(true)}>Show Chart</button>
      {showChart && <Chart />}
    </div>
  );
}

// Problems:
// 1. Chart loaded even if not shown
// 2. Increased initial bundle size
// 3. Slower page load
```

**Correct**:
```typescript
// ✅ Dynamic import for heavy components
import { lazy, Suspense, useState } from 'react';

const Chart = lazy(() => import('./Chart'));

function Dashboard() {
  const [showChart, setShowChart] = useState(false);

  return (
    <div>
      <button onClick={() => setShowChart(true)}>Show Chart</button>
      {showChart && (
        <Suspense fallback={<Spinner />}>
          <Chart />
        </Suspense>
      )}
    </div>
  );
}

// Benefits:
// 1. Chart loaded only when needed
// 2. Smaller initial bundle
// 3. Faster page load

// ✅ Preloading for anticipated navigation
const Chart = lazy(() => import(/* webpackPrefetch: true */ './Chart'));
```

---

### 3.4 Tree Shaking

**Impact**: CRITICAL - Removing dead code

**Why**: Tree shaking eliminates unused exports, reducing bundle size.

**Incorrect**:
```javascript
// ❌ CommonJS modules (no tree shaking)
const lodash = require('lodash');

const result = lodash.debounce(fn, 100);
// Entire lodash library bundled (70KB)!
```

**Correct**:
```typescript
// ✅ ES modules for tree shaking
import { debounce } from 'lodash-es';

const result = debounce(fn, 100);
// Only debounce function bundled (~2KB)

// ✅ Named imports (tree shakeable)
import { Button, Card } from '@components/ui';

// ✅ Side-effect-free modules
// package.json
{
  "sideEffects": false
}

// Or specific files
{
  "sideEffects": ["*.css", "*.scss"]
}
```

---

## 4. Build Performance

### 4.1 Build Speed Optimization

**Impact**: HIGH - Faster development feedback loop

**Why**: Fast builds improve developer productivity.

**Optimization Techniques**:
```typescript
// ✅ Build performance optimizations
export default defineConfig({
  build: {
    // Use ESBuild for faster minification
    minify: 'esbuild',

    // Disable source maps in dev
    sourcemap: process.env.NODE_ENV === 'production',

    // Reduce chunk size limit checks
    chunkSizeWarningLimit: 1000,

    // Terser is slower than ESBuild
    // Only use for better compression
    // minify: 'terser',
    // terserOptions: {
    //   compress: {
    //     drop_console: true
    //   }
    // }
  },

  // Optimize dependency pre-bundling
  optimizeDeps: {
    entries: ['src/main.tsx'],
    include: ['react', 'react-dom'],
    exclude: []
  }
});

// Benchmark results:
// ESBuild minify: 2.3s
// Terser minify: 12.5s (5x slower)
```

---

### 4.2 Dependency Pre-Bundling

**Impact**: HIGH - Faster dev server startup

**Why**: Pre-bundling converts CommonJS/UMD modules to ESM for faster imports.

**Incorrect**:
```typescript
// ❌ No pre-bundling configuration
export default defineConfig({
  // Vite will discover dependencies automatically
  // But may miss some or include unnecessary ones
});

// Problems:
// 1. Slow dependency discovery
// 2. Re-bundling on every dependency change
// 3. Inconsistent dev experience
```

**Correct**:
```typescript
// ✅ Explicit pre-bundling configuration
export default defineConfig({
  optimizeDeps: {
    // Explicitly include dependencies
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@tanstack/react-query',
      'date-fns'
    ],

    // Exclude packages that should not be pre-bundled
    exclude: [
      // Packages already in ESM format
      'lodash-es'
    ],

    // Entry points for dependency scanning
    entries: [
      'src/main.tsx',
      'src/pages/**/*.tsx'
    ],

    // Force re-optimization
    force: false
  }
});

// Benefits:
// 1. Faster server startup
// 2. Consistent bundling
// 3. No re-bundling surprises
```

---

### 4.3 Caching Strategies

**Impact**: HIGH - Reducing rebuild time

**Why**: Proper caching avoids re-processing unchanged files.

**Browser Caching**:
```typescript
// ✅ Cache-friendly chunk naming
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        // Hash in filename for cache busting
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    }
  }
});

// Generated files:
// assets/vendor-a1b2c3d4.js  (cache for 1 year)
// assets/app-e5f6g7h8.js     (changes often)

// When app.js changes, vendor.js hash stays same
// Browser keeps cached vendor.js
```

---

### 4.4 Parallel Processing

**Impact**: MEDIUM - Faster builds on multi-core systems

**Why**: Vite and ESBuild utilize multiple cores by default.

**Configuration**:
```typescript
// ✅ Vite automatically uses parallel processing
export default defineConfig({
  // ESBuild uses all CPU cores by default
  esbuild: {
    // Control parallelism if needed
    // logLevel: 'info'
  },

  build: {
    // Rollup also parallelizes
    rollupOptions: {
      // Parallel chunk generation
    }
  }
});

// No manual configuration needed!
// Vite optimally uses available cores
```

---

## 5. Asset Management

### 5.1 Static Assets

**Impact**: HIGH - Proper asset handling

**Why**: Static assets need optimization and proper cache headers.

**Incorrect**:
```typescript
// ❌ Importing assets as strings
import logoUrl from './logo.png';

<img src={logoUrl} alt="Logo" />

// Problems:
// 1. No optimization
// 2. No hash in filename
// 3. Poor caching
```

**Correct**:
```typescript
// ✅ Vite asset handling
import logoUrl from './logo.png';  // Returns hashed URL

<img src={logoUrl} alt="Logo" />
// Renders: <img src="/assets/logo-a1b2c3d4.png" alt="Logo" />

// ✅ Asset size threshold
export default defineConfig({
  build: {
    assetsInlineLimit: 4096  // < 4KB = inline as base64
  }
});

// Small icons inlined:
// <img src="data:image/png;base64,..." />

// Large images externalized:
// <img src="/assets/image-hash.png" />
```

---

### 5.2 Image Optimization

**Impact**: HIGH - Reducing image payload

**Why**: Optimized images load faster and use less bandwidth.

**Correct**:
```typescript
// ✅ Image optimization plugin
import { defineConfig } from 'vite';
import viteImagemin from 'vite-plugin-imagemin';

export default defineConfig({
  plugins: [
    viteImagemin({
      gifsicle: { optimizationLevel: 7 },
      mozjpeg: { quality: 80 },
      pngquant: { quality: [0.8, 0.9] },
      svgo: {
        plugins: [
          { name: 'removeViewBox', active: false }
        ]
      }
    })
  ]
});

// ✅ Responsive images
<picture>
  <source srcSet="/logo.webp" type="image/webp" />
  <img src="/logo.png" alt="Logo" />
</picture>
```

---

### 5.3 CSS Processing

**Impact**: HIGH - CSS optimization and bundling

**Why**: Proper CSS processing reduces bundle size and improves performance.

**Incorrect**:
```typescript
// ❌ No CSS optimization
import './styles.css';

// Problems:
// 1. No minification
// 2. No autoprefixing
// 3. Unused CSS included
```

**Correct**:
```typescript
// ✅ CSS optimization with Vite
export default defineConfig({
  css: {
    // PostCSS configuration
    postcss: {
      plugins: [
        autoprefixer(),
        cssnano({ preset: 'default' })
      ]
    },

    // CSS modules
    modules: {
      localsConvention: 'camelCaseOnly',
      scopeBehaviour: 'local'
    },

    // Preprocessor options
    preprocessorOptions: {
      scss: {
        additionalData: `@import "@/styles/variables.scss";`
      }
    }
  }
});

// ✅ CSS code splitting
import styles from './Component.module.scss';

// Only Component's CSS loaded with component
```

---

### 5.4 Font Loading

**Impact**: MEDIUM - Optimizing font delivery

**Why**: Fonts can block rendering. Proper loading prevents FOIT/FOUT.

**Correct**:
```typescript
// ✅ Optimized font loading
// index.html
<link
  rel="preload"
  href="/fonts/Inter-Regular.woff2"
  as="font"
  type="font/woff2"
  crossOrigin="anonymous"
/>

// CSS
@font-face {
  font-family: 'Inter';
  src: url('/fonts/Inter-Regular.woff2') format('woff2');
  font-display: swap;  // Prevent FOIT
  font-weight: 400;
}

// ✅ Subsetting fonts
// vite.config.ts
export default defineConfig({
  plugins: [
    ViteFonts({
      // Subset fonts to only used glyphs
      google: {
        families: ['Inter:400,500,700']
      }
    })
  ]
});
```

---

## 6. Environment Variables

### 6.1 Vite Environment Variables

**Impact**: CRITICAL - Configuration management

**Why**: Environment variables configure builds for different environments.

**Incorrect**:
```typescript
// ❌ Using process.env directly (doesn't work in Vite)
const apiUrl = process.env.API_URL;

// undefined! Vite doesn't expose process.env
```

**Correct**:
```typescript
// ✅ Vite environment variables (VITE_ prefix)
// .env
VITE_API_URL=https://api.example.com
VITE_APP_TITLE=My App

// .env.local (not committed)
VITE_API_URL=http://localhost:3000

// Usage
const apiUrl = import.meta.env.VITE_API_URL;
const title = import.meta.env.VITE_APP_TITLE;

// Benefits:
// 1. Type-safe with vite-env.d.ts
// 2. Tree-shakeable
// 3. Build-time replacement
```

---

### 6.2 Type Safety for Env

**Impact**: HIGH - Preventing runtime errors

**Why**: TypeScript can catch missing environment variables at build time.

**Correct**:
```typescript
// ✅ Type-safe environment variables
// env.d.ts
interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_APP_TITLE: string;
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// ✅ Runtime validation with Zod
import { z } from 'zod';

const envSchema = z.object({
  VITE_API_URL: z.string().url(),
  VITE_APP_TITLE: z.string().min(1),
  VITE_SUPABASE_URL: z.string().url(),
  VITE_SUPABASE_ANON_KEY: z.string().min(1)
});

export const env = envSchema.parse(import.meta.env);

// TypeScript errors if env var missing
// Runtime error if validation fails
```

---

### 6.3 Build-Time vs Runtime

**Impact**: HIGH - Understanding variable substitution

**Why**: Vite replaces environment variables at build time, not runtime.

**Build-Time Replacement**:
```typescript
// ✅ Build-time replacement
const apiUrl = import.meta.env.VITE_API_URL;

// Becomes after build:
const apiUrl = "https://api.example.com";

// Dead code elimination:
if (import.meta.env.DEV) {
  console.log('Development mode');
}

// Production build removes this entirely
```

---

### 6.4 Environment-Specific Builds

**Impact**: HIGH - Different configs per environment

**Why**: Production, staging, and development need different configurations.

**Correct**:
```bash
# .env (default)
VITE_API_URL=https://api.example.com

# .env.development (npm run dev)
VITE_API_URL=http://localhost:3000

# .env.staging (npm run build:staging)
VITE_API_URL=https://staging-api.example.com

# .env.production (npm run build)
VITE_API_URL=https://api.example.com
```

```json
// package.json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "build:staging": "vite build --mode staging"
  }
}
```

---

## 7. Bundle Analysis

### 7.1 Bundle Size Visualization

**Impact**: CRITICAL - Understanding bundle composition

**Why**: Visualizing bundles helps identify bloat and optimize imports.

**Correct**:
```typescript
// ✅ Bundle visualization plugin
import { defineConfig } from 'vite';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [
    visualizer({
      open: true,
      filename: 'dist/stats.html',
      gzipSize: true,
      brotliSize: true
    })
  ]
});

// After build: opens interactive treemap
// Shows:
// - Size of each module
// - Gzipped size
// - Brotli size
// - Dependency tree
```

---

### 7.2 Dependency Analysis

**Impact**: HIGH - Finding heavy dependencies

**Why**: Some dependencies are unexpectedly large. Finding them helps optimize.

**Analysis**:
```bash
# Install bundle analyzer
npm install -D rollup-plugin-visualizer

# Build and analyze
npm run build

# Opens stats.html showing:
# - moment.js: 200KB (replace with date-fns)
# - lodash: 70KB (use lodash-es for tree shaking)
# - react-icons: 300KB (import individual icons)
```

---

### 7.3 Performance Budgets

**Impact**: HIGH - Preventing bundle bloat

**Why**: Performance budgets enforce size limits, preventing regressions.

**Correct**:
```typescript
// ✅ Performance budgets in Vite
export default defineConfig({
  build: {
    chunkSizeWarningLimit: 500,  // 500KB warning
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Ensure vendor chunk stays under budget
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        }
      }
    }
  }
});

// Build fails if exceeded:
// ⚠ Some chunks are larger than 500 KiB after minification
```

---

### 7.4 Finding Bloat

**Impact**: HIGH - Identifying optimization opportunities

**Why**: Large dependencies can be replaced or tree-shaken.

**Common Culprits**:
```typescript
// ❌ Heavy dependencies
import moment from 'moment';  // 200KB
import _ from 'lodash';  // 70KB
import { Icon } from 'react-icons/fa';  // 300KB for all icons

// ✅ Lightweight alternatives
import { format } from 'date-fns';  // 20KB (tree-shakeable)
import { debounce } from 'lodash-es';  // 2KB (tree-shakeable)
import { FaHome } from 'react-icons/fa';  // 5KB (single icon)
```

---

## 8. Production Builds

### 8.1 Production Optimization

**Impact**: CRITICAL - Optimized production bundles

**Why**: Production builds prioritize size and performance over build speed.

**Correct**:
```typescript
// ✅ Production-optimized build
export default defineConfig(({ mode }) => ({
  build: {
    // Target modern browsers
    target: 'es2020',

    // Minification
    minify: 'esbuild',

    // Source maps for debugging
    sourcemap: 'hidden',

    // CSS code splitting
    cssCodeSplit: true,

    // Rollup optimizations
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          utils: ['date-fns', 'lodash-es']
        }
      }
    },

    // Report compressed size
    reportCompressedSize: true
  }
}));

// Build output:
// dist/assets/vendor-abc123.js  120 KB │ gzip: 40 KB
// dist/assets/app-def456.js     80 KB  │ gzip: 25 KB
```

---

### 8.2 Source Maps

**Impact**: HIGH - Debugging production issues

**Why**: Source maps enable debugging minified code while keeping bundles small.

**Incorrect**:
```typescript
// ❌ Inline source maps in production
export default defineConfig({
  build: {
    sourcemap: 'inline'
  }
});

// Problems:
// 1. Huge bundle size (source maps embedded)
// 2. Exposed source code
// 3. Slow load times
```

**Correct**:
```typescript
// ✅ Hidden source maps in production
export default defineConfig({
  build: {
    sourcemap: 'hidden'
  }
});

// Generates .map files but doesn't reference them
// Upload .map files to error tracking (Sentry)
// Users don't download source maps
// Developers can debug with original code
```

---

### 8.3 Minification

**Impact**: CRITICAL - Reducing bundle size

**Why**: Minification removes whitespace, renames variables, and optimizes code.

**Comparison**:
```typescript
// ✅ ESBuild minification (fast, good compression)
export default defineConfig({
  build: {
    minify: 'esbuild'
  }
});

// ✅ Terser minification (slow, better compression)
export default defineConfig({
  build: {
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log']
      }
    }
  }
});

// Benchmark:
// ESBuild: 2.3s, 120KB gzipped
// Terser: 12.5s, 115KB gzipped

// Use ESBuild for most projects
// Use Terser for ultra-optimized builds
```

---

### 8.4 Compression

**Impact**: HIGH - Reducing network payload

**Why**: Gzip/Brotli compression reduces transfer size by 70-80%.

**Correct**:
```typescript
// ✅ Pre-compression with Vite plugin
import viteCompression from 'vite-plugin-compression';

export default defineConfig({
  plugins: [
    // Gzip compression
    viteCompression({
      algorithm: 'gzip',
      ext: '.gz'
    }),

    // Brotli compression (better)
    viteCompression({
      algorithm: 'brotliCompress',
      ext: '.br'
    })
  ]
});

// Generates:
// app-abc123.js      (200KB original)
// app-abc123.js.gz   (60KB gzipped)
// app-abc123.js.br   (50KB brotli)

// Server serves .br or .gz based on Accept-Encoding
```

---

## 9. Advanced Patterns

### 9.1 Multi-Entry Builds

**Impact**: MEDIUM - Multiple apps from one config

**Why**: Monorepos may have multiple entry points.

**Correct**:
```typescript
// ✅ Multi-entry configuration
export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
        admin: path.resolve(__dirname, 'admin.html')
      }
    }
  }
});

// Generates:
// dist/index.html
// dist/admin.html
// dist/assets/main-*.js
// dist/assets/admin-*.js
```

---

### 9.2 Library Mode

**Impact**: HIGH - Building reusable libraries

**Why**: Library mode generates builds optimized for consumption by other projects.

**Correct**:
```typescript
// ✅ Library mode configuration
export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'MyLibrary',
      fileName: (format) => `my-library.${format}.js`,
      formats: ['es', 'cjs', 'umd']
    },
    rollupOptions: {
      external: ['react', 'react-dom'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM'
        }
      }
    }
  }
});

// Generates:
// dist/my-library.es.js   (ES modules)
// dist/my-library.cjs.js  (CommonJS)
// dist/my-library.umd.js  (UMD)
```

---

### 9.3 SSR Configuration

**Impact**: HIGH - Server-side rendering setup

**Why**: SSR improves SEO and initial load performance.

**Correct**:
```typescript
// ✅ SSR configuration
export default defineConfig({
  build: {
    ssr: true,
    rollupOptions: {
      input: {
        server: path.resolve(__dirname, 'src/entry-server.tsx')
      }
    }
  },
  ssr: {
    noExternal: ['@pulwave/ui']  // Bundle packages for SSR
  }
});
```

---

### 9.4 Worker Builds

**Impact**: MEDIUM - Optimizing Web Workers

**Why**: Workers run in separate threads, need separate builds.

**Correct**:
```typescript
// ✅ Web Worker with Vite
const worker = new Worker(
  new URL('./worker.ts', import.meta.url),
  { type: 'module' }
);

worker.postMessage({ task: 'process' });

// Vite automatically bundles worker.ts
```

---

## 10. Pulwave Integration

### 10.1 Pulwave Vite Configuration

**Impact**: CRITICAL - Pulwave's actual Vite setup

**Current Configuration**:
```typescript
// apps/web/real-estate/vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@pulwave/ui': path.resolve(__dirname, '../../../packages/ui'),
      '@pulwave/data': path.resolve(__dirname, '../../../packages/data'),
      '@pulwave/foundation': path.resolve(__dirname, '../../../packages/foundation')
    }
  },

  server: {
    port: 3000,
    open: true
  },

  build: {
    target: 'es2020',
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          query: ['@tanstack/react-query'],
          supabase: ['@supabase/supabase-js']
        }
      }
    }
  }
});
```

---

### 10.2 Monorepo Build Setup

**Impact**: CRITICAL - Turborepo + Vite integration

**Build Pipeline**:
```json
// turbo.json
{
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**"]
    }
  }
}

// Execution order:
// 1. foundation:build
// 2. data:build, ui:build (parallel)
// 3. features/*:build (parallel)
// 4. experience/*:build (parallel)
// 5. apps/web/real-estate:build
```

---

### 10.3 Package Bundling

**Impact**: HIGH - Building shared packages

**Package Configuration**:
```typescript
// packages/ui/vite.config.ts
export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'PulwaveUI',
      fileName: (format) => `index.${format}.js`,
      formats: ['es']
    },
    rollupOptions: {
      external: ['react', 'react-dom', '@pulwave/foundation'],
      output: {
        preserveModules: true,  // Keep module structure
        preserveModulesRoot: 'src'
      }
    }
  }
});
```

---

### 10.4 Build Performance

**Impact**: HIGH - Pulwave build optimization

**Current Performance**:
```bash
# Cold build (no cache)
turbo run build
# Total: ~60s

# Warm build (Turborepo cache)
turbo run build
# Total: ~1s (cache hit for all)

# After 1 package change
turbo run build
# Total: ~5s (rebuild package + dependents)
```

---

## 11. Appendices

### Appendix A: Complete Build Optimization Checklist

**Configuration**:
- [ ] Path aliases configured (@/)
- [ ] TypeScript config matches Vite aliases
- [ ] Environment variables use VITE_ prefix
- [ ] Type-safe environment variables

**Bundle Optimization**:
- [ ] Code splitting for routes
- [ ] Manual chunks for vendor code
- [ ] Dynamic imports for heavy components
- [ ] Tree shaking enabled (ES modules)

**Performance**:
- [ ] Initial bundle < 200KB gzipped
- [ ] Largest chunk < 100KB
- [ ] Source maps in production (hidden)
- [ ] CSS code splitting enabled

**Assets**:
- [ ] Images optimized
- [ ] Fonts preloaded
- [ ] SVGs inline or optimized
- [ ] Asset hashing for cache busting

**Production**:
- [ ] Minification enabled
- [ ] Compression enabled (gzip/brotli)
- [ ] Performance budgets set
- [ ] Bundle analysis reviewed

---

### Appendix B: Vite Configuration Reference

**Complete Configuration**:
```typescript
export default defineConfig({
  plugins: [],
  resolve: { alias: {} },
  server: { port: 3000 },
  build: {
    target: 'es2020',
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true,
    minify: 'esbuild',
    rollupOptions: {}
  },
  optimizeDeps: {
    include: [],
    exclude: []
  },
  css: {
    modules: {},
    preprocessorOptions: {}
  }
});
```

---

### Appendix C: Bundle Size Targets

**Target Sizes**:
```
Initial Bundle (before code splitting):
- Excellent: < 150KB gzipped
- Good: 150-250KB gzipped
- Acceptable: 250-400KB gzipped
- Poor: > 400KB gzipped

Individual Chunks:
- Vendor: < 150KB gzipped
- Route: < 50KB gzipped each
- Component: < 20KB gzipped each

Total Page Weight:
- Excellent: < 500KB gzipped
- Good: 500-1000KB gzipped
- Acceptable: 1-2MB gzipped
- Poor: > 2MB gzipped
```

---

### Appendix D: Common Build Issues

**Issue: Module not found**
```
Solution: Check path aliases in vite.config.ts and tsconfig.json
```

**Issue: Slow builds**
```
Solution:
1. Use ESBuild for minification
2. Disable source maps in dev
3. Optimize dependencies
4. Use Turborepo caching
```

**Issue: Large bundle**
```
Solution:
1. Code splitting
2. Dynamic imports
3. Tree shaking (ES modules)
4. Bundle analysis
```

---

**End of Build Tools Guide** - 40+ patterns covering Vite configuration, bundle optimization, build performance, and production builds. Follow these patterns for optimal build setup in Pulwave.
