# Vercel React Best Practices Skill

## Overview

Comprehensive performance optimization guide for React and Next.js applications from Vercel Engineering. Contains 40+ rules across 8 categories, prioritized by impact from critical to incremental.

## Source

- **Repository:** https://github.com/vercel-labs/agent-skills
- **Skill Path:** skills/react-best-practices
- **License:** MIT
- **Author:** Vercel Engineering
- **Version:** 1.0.0

## Files

- **SKILL.md** (5.2 KB) - Quick reference guide with rule categories and when to apply
- **AGENTS.md** (64 KB) - Complete guide with detailed explanations, code examples, and impact metrics

## Rule Categories

| Priority | Category | Impact | Rules |
|----------|----------|--------|-------|
| 1 | Eliminating Waterfalls | CRITICAL | 5 rules |
| 2 | Bundle Size Optimization | CRITICAL | 5 rules |
| 3 | Server-Side Performance | HIGH | 5 rules |
| 4 | Client-Side Data Fetching | MEDIUM-HIGH | 4 rules |
| 5 | Re-render Optimization | MEDIUM | 7 rules |
| 6 | Rendering Performance | MEDIUM | 7 rules |
| 7 | JavaScript Performance | LOW-MEDIUM | 12 rules |
| 8 | Advanced Patterns | LOW | 2 rules |

## Key Features

### Critical Performance Patterns
- Eliminating waterfalls (Promise.all, dependency-based parallelization)
- Bundle size optimization (dynamic imports, barrel file avoidance)
- Server-side caching (React.cache, LRU cache)
- Strategic Suspense boundaries

### Best Practices Coverage
- React Server Components (RSC) patterns
- Next.js App Router optimization
- Client-side data fetching with SWR
- Re-render optimization techniques
- Modern JavaScript performance patterns

### Code Examples
- Incorrect vs correct implementations
- Real-world performance metrics
- Browser-specific optimizations
- TypeScript type safety patterns

## When to Use

Reference these guidelines when:
- Writing new React components or Next.js pages
- Implementing data fetching (client or server-side)
- Reviewing code for performance issues
- Refactoring existing React/Next.js code
- Optimizing bundle size or load times

## Installation Date

- **Installed:** 2026-01-16
- **Installed By:** Claude AI
- **Validated:** ✅ YAML frontmatter valid

## Related Skills

- [accessibility](../accessibility/) - WCAG 2.1+ compliance and ARIA patterns
- [web-interface](../web-interface/) - Web interface guidelines
- [design-system](../design-system/) - Design system implementation
- [performance](../performance/) - General performance optimization
- [frameworks](../frameworks/) - Framework-specific patterns

## Usage in Pulwave

This skill is particularly relevant for:
- React 19 components in the UI layer
- Next.js App Router patterns (if migrating)
- Data fetching optimization with TanStack Query
- Bundle size optimization for production builds
- Performance improvements in mobile/responsive views

## References

1. [React Documentation](https://react.dev)
2. [Next.js Documentation](https://nextjs.org)
3. [SWR Documentation](https://swr.vercel.app)
4. [Vercel Blog - Package Imports](https://vercel.com/blog/how-we-optimized-package-imports-in-next-js)
5. [Vercel Blog - Dashboard Performance](https://vercel.com/blog/how-we-made-the-vercel-dashboard-twice-as-fast)

---

**Note:** This skill is designed for AI agents and LLMs to follow when maintaining, generating, or refactoring React and Next.js codebases. Humans may also find it useful, but guidance here is optimized for automation and consistency by AI-assisted workflows.
