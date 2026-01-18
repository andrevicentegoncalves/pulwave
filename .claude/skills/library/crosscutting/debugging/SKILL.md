---
name: debugging
description: Systematic approach to finding and fixing bugs. Covers reproduction steps, root cause analysis, and debugging tools.
version: 1.0.0
tags: [Debugging, Troubleshooting, Root Cause Analysis]
---

# Systematic Debugging

Stop guessing. Start measuring.

## When to Use

- "It works on my machine"
- Production outages
- Performance regressions
- Heisenbugs (Intermittent failures)

## Quick Reference

### The Wolf Fence Algorithm
1. **Bisection**: Divide the system in half. Is the error in the first half or second?
2. Repeat until you trap the wolf (bug).
   - *Git Bisect*: Automatically find the commit that broke tests.

### Rubber Duck Debugging
Explain the code line-by-line to an inanimate object (or a colleague). You usually find the bug before finishing the explanation.

## Full Compiled Guide

**Category Guide**: [../crosscutting/AGENTS.md](../crosscutting/AGENTS.md) - Complete crosscutting category with all patterns and examples

**Individual AGENTS.md**: [AGENTS.md](./AGENTS.md) - Comprehensive systematic debugging guide (40+ patterns)

### What's in AGENTS.md

**Debugging Fundamentals** (CRITICAL):
- The scientific method for debugging (hypothesis, observation, testing)
- Reproduction steps and minimal repro cases
- Root cause analysis (5 Whys technique)
- Debugging mindset (methodical vs emotional)

**Debugging Strategies** (CRITICAL):
- Wolf Fence Algorithm (bisection, O(log n) bug hunting)
- Rubber duck debugging
- Git bisect for regression hunting
- Binary search approach to narrow problem space
- Trace-driven debugging with strategic logging

**Browser DevTools** (CRITICAL):
- Console debugging with console.table, console.group
- Breakpoints (line, conditional, logpoints)
- Network tab analysis for API debugging
- Performance profiling to find bottlenecks
- Memory leak detection with heap snapshots

**VS Code Debugging** (CRITICAL):
- Launch configurations for Vite + React
- Breakpoints and watch expressions
- Call stack navigation to find root cause
- Debug Console for live code execution

**React DevTools** (CRITICAL):
- Component tree inspection
- Props and state inspection in real-time
- Profiler for re-render analysis
- Hooks debugging with dependency tracking

**Network Debugging** (HIGH):
- Request/response inspection in Network tab
- CORS error debugging
- WebSocket debugging
- API error handling patterns

**Console Debugging Patterns** (HIGH):
- Strategic log placement (not everywhere)
- Console methods (table, group, time, trace)
- Custom formatters for complex objects
- Removing debug logs automatically

**Error Tracking** (CRITICAL/HIGH):
- Sentry integration for production errors
- Error boundaries to isolate failures
- Context enrichment for better error reports
- Stack trace analysis

**Production Debugging** (CRITICAL):
- Source maps for readable production errors
- Session replay tools (Sentry Replay)
- Remote logging to central services
- Feature flags for instant rollback

**Pulwave Integration** (CRITICAL):
- Debugging in Turborepo monorepo
- TanStack Query DevTools for cache inspection
- Supabase debugging (query logs, RLS errors)
- Vite debug configuration

**Appendices**:
- Complete debugging checklist
- Common bug patterns with fixes
- DevTools keyboard shortcuts
- Git bisect reference

## Additional Resources

### Strategies
Guide in `references/strategies.md`:
- Reproduction (Minimal Repro Case)
- Logging for Debugging
- Remote Debugging

### Tools
Guide in `references/tools.md`:
- Chrome DevTools
- VS Code Debugger
- Network Sniffing (Wireshark/Charles Proxy)

## Key Metrics

- **MTTR (Mean Time To Recovery)**: How fast you fix it.
- **Root Cause Identified**: % of issues with "Why" answered, not just "Fixed".

## Tools

- **Sentry**: Application Monitoring.
- **LogRocket**: Session Replay (Frontend).
- **Honeycomb**: High cardinality debugging.
