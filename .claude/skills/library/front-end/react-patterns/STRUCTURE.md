# React Best Practices - File Structure

## Overview

Complete skill downloaded from Vercel's agent-skills repository with all source files.

**Total Size:** 283 KB
**Total Files:** 52 files

## File Structure

```
react-best-practices/
├── SKILL.md (5.2 KB)           # Quick reference for LLMs
├── AGENTS.md (64 KB)           # Compiled document with all rules
├── README.md (3.6 KB)          # Documentation (created locally)
├── STRUCTURE.md (this file)    # Structure guide (created locally)
└── rules/ (207 KB, 49 files)   # Individual rule markdown files
    ├── _sections.md            # Section metadata and descriptions
    ├── _template.md            # Template for creating new rules
    ├── async-*.md (5 files)    # Eliminating Waterfalls (CRITICAL)
    ├── bundle-*.md (5 files)   # Bundle Size Optimization (CRITICAL)
    ├── server-*.md (5 files)   # Server-Side Performance (HIGH)
    ├── client-*.md (4 files)   # Client-Side Data Fetching (MEDIUM-HIGH)
    ├── rerender-*.md (7 files) # Re-render Optimization (MEDIUM)
    ├── rendering-*.md (7 files)# Rendering Performance (MEDIUM)
    ├── js-*.md (12 files)      # JavaScript Performance (LOW-MEDIUM)
    └── advanced-*.md (2 files) # Advanced Patterns (LOW)
```

## Rule File Format

Each rule file follows this structure:

```yaml
---
title: Rule Name
impact: CRITICAL | HIGH | MEDIUM | LOW
impactDescription: Brief impact description
tags: tag1, tag2, tag3
---

## Rule Name

Brief explanation of the rule and why it matters.

**Incorrect (description):**

```typescript
// Bad code example
```

**Correct (description):**

```typescript
// Good code example
```

Additional context, references, or notes.
```

## Rule Categories (47 rules total)

### 1. Async - Eliminating Waterfalls (5 rules) - CRITICAL
- async-defer-await.md - Move await into branches where actually used
- async-parallel.md - Use Promise.all() for independent operations
- async-dependencies.md - Use better-all for partial dependencies
- async-api-routes.md - Start promises early in API routes
- async-suspense-boundaries.md - Use Suspense to stream content

### 2. Bundle - Bundle Size Optimization (5 rules) - CRITICAL
- bundle-barrel-imports.md - Import directly, avoid barrel files
- bundle-dynamic-imports.md - Use next/dynamic for heavy components
- bundle-defer-third-party.md - Load analytics after hydration
- bundle-conditional.md - Load modules only when feature activated
- bundle-preload.md - Preload on hover/focus for perceived speed

### 3. Server - Server-Side Performance (5 rules) - HIGH
- server-cache-react.md - Use React.cache() for per-request deduplication
- server-cache-lru.md - Use LRU cache for cross-request caching
- server-serialization.md - Minimize data passed to client components
- server-parallel-fetching.md - Restructure components to parallelize fetches
- server-after-nonblocking.md - Use after() for non-blocking operations

### 4. Client - Client-Side Data Fetching (4 rules) - MEDIUM-HIGH
- client-swr-dedup.md - Use SWR for automatic request deduplication
- client-event-listeners.md - Deduplicate global event listeners
- client-passive-event-listeners.md - Use passive listeners for scroll performance
- client-localstorage-schema.md - Version and minimize localStorage data

### 5. Rerender - Re-render Optimization (7 rules) - MEDIUM
- rerender-defer-reads.md - Don't subscribe to state only used in callbacks
- rerender-memo.md - Extract expensive work into memoized components
- rerender-dependencies.md - Use primitive dependencies in effects
- rerender-derived-state.md - Subscribe to derived booleans, not raw values
- rerender-functional-setstate.md - Use functional setState for stable callbacks
- rerender-lazy-state-init.md - Pass function to useState for expensive values
- rerender-transitions.md - Use startTransition for non-urgent updates

### 6. Rendering - Rendering Performance (7 rules) - MEDIUM
- rendering-animate-svg-wrapper.md - Animate div wrapper, not SVG element
- rendering-content-visibility.md - Use content-visibility for long lists
- rendering-hoist-jsx.md - Extract static JSX outside components
- rendering-svg-precision.md - Reduce SVG coordinate precision
- rendering-hydration-no-flicker.md - Use inline script for client-only data
- rendering-activity.md - Use Activity component for show/hide
- rendering-conditional-render.md - Use ternary, not && for conditionals

### 7. JS - JavaScript Performance (12 rules) - LOW-MEDIUM
- js-batch-dom-css.md - Group CSS changes via classes or cssText
- js-index-maps.md - Build Map for repeated lookups
- js-cache-property-access.md - Cache object properties in loops
- js-cache-function-results.md - Cache function results in module-level Map
- js-cache-storage.md - Cache localStorage/sessionStorage reads
- js-combine-iterations.md - Combine multiple filter/map into one loop
- js-length-check-first.md - Check array length before expensive comparison
- js-early-exit.md - Return early from functions
- js-hoist-regexp.md - Hoist RegExp creation outside loops
- js-min-max-loop.md - Use loop for min/max instead of sort
- js-set-map-lookups.md - Use Set/Map for O(1) lookups
- js-tosorted-immutable.md - Use toSorted() for immutability

### 8. Advanced - Advanced Patterns (2 rules) - LOW
- advanced-event-handler-refs.md - Store event handlers in refs
- advanced-use-latest.md - useLatest for stable callback refs

## Special Files

### _sections.md
Defines all 8 categories with:
- Section ID (filename prefix)
- Impact level (CRITICAL, HIGH, MEDIUM-HIGH, MEDIUM, LOW-MEDIUM, LOW)
- Description of the category
- Ordering for documentation

### _template.md
Template for creating new rules with:
- YAML frontmatter structure
- Markdown formatting guide
- Code example patterns

## How Rules Are Compiled

The individual rule files in `rules/` are compiled into `AGENTS.md`:

1. Rules are grouped by section prefix (async-, bundle-, etc.)
2. Sections are ordered by impact (CRITICAL → LOW)
3. Each section gets a header with impact level and description
4. Rules are numbered within their section
5. Full code examples and explanations are preserved

This modular structure allows:
- Easy addition of new rules
- Individual rule updates without touching the compilation
- Automated generation of the full guide
- Selective rule extraction for specific use cases

## Applicability to Pulwave

### Highly Relevant (Use Directly)
- ✅ All **async** rules - waterfall elimination
- ✅ Most **bundle** rules - code splitting, dynamic imports
- ✅ **client** rules - SWR patterns, event listeners
- ✅ All **rerender** rules - React optimization
- ✅ All **rendering** rules - browser performance
- ✅ All **js** rules - general performance
- ✅ **advanced** patterns - stable refs

### Needs Review (Next.js Specific)
- ⚠️ **server** rules - React.cache(), after() are Next.js App Router features
- ⚠️ Some **bundle** patterns reference next/dynamic

### Recommendation
Use the rules/ folder for selective implementation. Extract non-Next.js patterns and adapt server-side patterns for your architecture.

---

**Downloaded:** 2026-01-16
**Source:** https://github.com/vercel-labs/agent-skills/tree/main/skills/react-best-practices
**License:** MIT
**Status:** ⚠️ Under investigation before adding to library
