---
name: ci-cd
description: Patterns for Continous Integration and Deployment. Covers GitHub Actions, pipeline optimization, and release automation.
version: 1.0.0
tags: [DevOps, CI/CD, GitHub Actions, Pipelines, Automation]
---

# CI/CD Pipelines

Automating the path from code to production.

## When to Use

- Setting up a new repository
- Debugging slow pipelines
- Automating releases
- Configuring preview environments

## Quick Reference

### Pipeline Stages
1. **Lint/Check**: Fast static analysis (ESLint, Prettier, Typescript). Fail fast.
2. **Test**: Unit and Integration tests.
3. **Build**: Compile artifacts (Docker images, JS bundles).
4. **Deploy**: Push to Staging/Production.

### Caching Strategy
- Cache `node_modules` (key: `pnpm-lock.yaml`).
- Cache build outputs (TurboRepo/Nx).
- Cache Docker layers.

## Full Compiled Guide

**Category Guide**: [../dev-ops/AGENTS.md](../dev-ops/AGENTS.md) - Complete dev-ops category with all patterns and examples

**Individual AGENTS.md**: [AGENTS.md](./AGENTS.md) - Comprehensive CI/CD pipelines guide (42+ patterns)

### What's in AGENTS.md

**CI/CD Fundamentals** (CRITICAL):
- CI vs CD definitions and processes
- Pipeline stages (lint, test, build, deploy)
- Pipeline architecture principles (fail fast, parallel execution, conditional execution)
- Fail fast principle with staged checks

**GitHub Actions** (CRITICAL):
- Workflow basics and structure
- Triggers and events (push, PR, manual, scheduled)
- Jobs and steps organization
- Matrix builds for multi-version testing
- Reusable workflows to avoid duplication

**Caching Strategy** (CRITICAL):
- Dependency caching (node_modules)
- Build cache with Turborepo
- Docker layer caching
- Cache invalidation strategies

**Testing in CI** (CRITICAL):
- Unit tests with coverage
- Integration tests
- E2E tests with Playwright
- Test parallelization

**Build Optimization** (CRITICAL):
- Parallel jobs execution
- Conditional execution based on branch/path
- Incremental builds
- Build artifacts management

**Deployment Strategies** (CRITICAL/HIGH):
- Environment management (staging, production)
- Blue-green deployment
- Canary deployment
- Rollback strategy

**Monorepo CI** (CRITICAL):
- Turborepo integration
- Affected package detection
- Remote caching setup

**Security** (CRITICAL/HIGH):
- Secrets management
- Dependency scanning
- SAST/DAST integration
- Container security scanning

**Monitoring and Metrics** (CRITICAL/HIGH):
- Pipeline metrics tracking
- Build time monitoring
- Deployment frequency metrics

**Pulwave Integration** (CRITICAL):
- Complete monorepo pipeline (quality → test → build → e2e → deploy)
- Package testing with Turborepo affected
- App deployment strategies

**Appendices**:
- Complete GitHub Actions reference
- Pipeline optimization checklist
- Deployment checklist
- Troubleshooting guide

## Additional Resources

### Pipeline Patterns
Guide in `references/pipelines.md`:
- Matrix builds (Node 16/18/20)
- Conditional execution (`if: github.event_name == 'push'`)
- Reusable workflows

### Deployment Strategies
Guide in `references/deployment.md`:
- Blue/Green
- Canary
- Rolling Updates
- Feature Flags (vs Branch Deployments)

## Key Metrics

- **Pipeline Duration**: Target < 5 min for PRs, < 10 min for Deploy.
- **Success Rate**: % of green builds.
- **Recovery Time**: Time to revert a bad deploy.

## Tools

- **GitHub Actions**: Standard runner.
- **CircleCI**: Advanced enterprise runner.
- **Argocd**: GitOps deployment (K8s).
- **Changesets**: Version management.
