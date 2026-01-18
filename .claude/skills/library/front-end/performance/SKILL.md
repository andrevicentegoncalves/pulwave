---
name: performance
description: Comprehensive guide for optimizing web applications. Covers React rendering, bundle size, Vercel edge runtime, and core web vitals.
version: 1.0.0
tags: [Front-End, Performance, React, Next.js, Optimization]
---

# Web Performance & Optimization

Building blazing fast experiences.

## When to Use

- Optimizing slow React/Next.js pages
- Reducing bundle size
- Debugging LCP/TTI issues
- Reviewing PRs for performance regressions

## Quick Reference

### Critical Priorities (The 80/20)
1. **Eliminate Waterfalls**: avoid sequential awaits (Use `Promise.all()`).
2. **Defer Await**: move awaits into conditional branches where they are actually used.
3. **Avoid Barrel Imports**: import directly from source files (`/icons/Check` vs `{ Check }`).
4. **Dynamic Imports**: Lazy-load heavy components (Editors, Charts).
5. **Strategic Suspense**: Stream content while showing layout.

### Core Web Vitals
- **LCP (Largest Contentful Paint)**: < 2.5s (Visual speed).
- **INP (Interaction to Next Paint)**: < 200ms (Responsiveness).
- **CLS (Cumulative Layout Shift)**: < 0.1 (Stability).

## Full Compiled Guide

For complete implementation guidance with 30+ rules and detailed code examples: **[AGENTS.md](AGENTS.md)**

The AGENTS.md includes:
- **Eliminating Waterfalls** (CRITICAL) - 4 rules with 67% faster load times
- **Bundle Size Optimization** (CRITICAL) - 4 rules saving 50-500KB
- **Re-render Optimization** (MEDIUM) - 7 rules with 60-90% fewer re-renders
- **Rendering Performance** (MEDIUM) - 6 rules for 60fps animations
- **JavaScript Performance** (LOW-MEDIUM) - 6 rules with 100x faster operations
- **Client-Side Data Fetching** (MEDIUM-HIGH) - 3 rules for efficient caching
- **Advanced Patterns** (LOW) - 2 rules for edge cases

## Additional Resources

Human-readable deep dives in `references/`:
- `react-optimization.md` - Re-render prevention, memoization strategies
- `bundle-size.md` - Bundle analysis, tree-shaking techniques
- `server-rendering.md` - Server-side optimization patterns

## Common Pitfalls

- **Wait-on-Render**: Fetching data inside `useEffect` causes a waterfall. (Fetch in parent/RSC instead).
- **Transition: all**: Causes browser to re-calculate every property. Use specific properties.
- **Micro-optimizations**: Don't optimize `for` loops before fixing network waterfalls.
