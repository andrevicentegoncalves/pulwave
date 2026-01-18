---
name: build-tools
description: Build tool configuration and optimization for Vite, Webpack, and modern bundlers. Covers configuration, performance, and bundle analysis.
version: 1.0.0
tags: [Vite, Webpack, Bundlers, Build, Optimization]
---

# Build Tools Guide

Configuration and optimization for modern JavaScript bundlers.

## When to Use

- Setting up build configuration
- Optimizing bundle size
- Debugging build issues
- Configuring path aliases

## Quick Reference

### Vite Config
```typescript
export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
        },
      },
    },
  },
});
```

### Dynamic Imports
```tsx
const Editor = lazy(() => import('./Editor'));
```

## Full Compiled Guide

**Category Guide**: [../front-end/AGENTS.md](../front-end/AGENTS.md) - Complete front-end category with all patterns and examples

**Individual AGENTS.md**: [AGENTS.md](./AGENTS.md) - Comprehensive build tools configuration guide (40+ patterns)

### What's in AGENTS.md

**Build Tools Fundamentals** (CRITICAL):
- Vite vs Webpack comparison and when to use each
- ESBuild architecture for lightning-fast builds
- Rollup for production builds
- Development vs production build strategies

**Vite Configuration** (CRITICAL):
- Basic configuration with optimal settings
- Path aliases for clean imports
- Plugin system integration
- Development server optimization

**Bundle Optimization** (CRITICAL):
- Code splitting strategies (route-based, component-based)
- Manual chunks for better caching
- Dynamic imports for on-demand loading
- Tree shaking with ES modules

**Build Performance** (CRITICAL):
- Build speed optimization with ESBuild
- Dependency pre-bundling configuration
- Caching strategies for faster rebuilds
- Parallel processing utilization

**Asset Management** (HIGH):
- Static assets handling and optimization
- Image optimization strategies
- CSS processing with PostCSS
- Font loading optimization

**Environment Variables** (CRITICAL):
- Vite environment variables (VITE_ prefix)
- Type safety with TypeScript
- Build-time vs runtime variables
- Environment-specific builds

**Bundle Analysis** (HIGH):
- Bundle size visualization tools
- Dependency analysis for finding bloat
- Performance budgets enforcement
- Identifying optimization opportunities

**Production Builds** (CRITICAL):
- Production optimization strategies
- Source maps for debugging
- Minification (ESBuild vs Terser)
- Compression (gzip and Brotli)

**Advanced Patterns** (MEDIUM):
- Multi-entry builds for monorepos
- Library mode for reusable packages
- SSR configuration
- Web Worker builds

**Pulwave Integration** (CRITICAL):
- Pulwave's Vite 7 configuration
- Monorepo build setup with Turborepo
- Package bundling for shared libraries
- Build performance metrics

**Appendices**:
- Complete build optimization checklist
- Vite configuration reference
- Bundle size targets
- Common build issues and solutions

## Additional Resources

### Vite Configuration
Complete setup in `references/vite.md`:
- Basic configuration
- Path aliases
- Build optimization
- Environment variables

### Bundle Optimization
Strategies in `references/optimization.md`:
- Code splitting
- Tree shaking
- Manual chunks
- Bundle analysis

## Key Metrics
- Initial bundle: < 200KB gzipped
- Largest chunk: < 100KB
- TTFB: < 1.8s
