# CI/CD Pipelines

**Abstract**: Comprehensive guide to building efficient, reliable CI/CD pipelines with GitHub Actions for modern web applications. Covers pipeline architecture, caching strategies, testing automation, build optimization, deployment patterns, monorepo CI with Turborepo, security best practices, and monitoring for fast, safe deployments.

---

## Table of Contents

1. [CI/CD Fundamentals](#1-cicd-fundamentals)
   - 1.1 [CI/CD Definition](#11-cicd-definition) (CRITICAL)
   - 1.2 [Pipeline Stages](#12-pipeline-stages) (CRITICAL)
   - 1.3 [Pipeline Architecture](#13-pipeline-architecture) (CRITICAL)
   - 1.4 [Fail Fast Principle](#14-fail-fast-principle) (CRITICAL)

2. [GitHub Actions](#2-github-actions)
   - 2.1 [Workflow Basics](#21-workflow-basics) (CRITICAL)
   - 2.2 [Triggers and Events](#22-triggers-and-events) (CRITICAL)
   - 2.3 [Jobs and Steps](#23-jobs-and-steps) (CRITICAL)
   - 2.4 [Matrix Builds](#24-matrix-builds) (HIGH)
   - 2.5 [Reusable Workflows](#25-reusable-workflows) (HIGH)

3. [Caching Strategy](#3-caching-strategy)
   - 3.1 [Dependency Caching](#31-dependency-caching) (CRITICAL)
   - 3.2 [Build Cache](#32-build-cache) (CRITICAL)
   - 3.3 [Docker Layer Caching](#33-docker-layer-caching) (HIGH)
   - 3.4 [Cache Invalidation](#34-cache-invalidation) (HIGH)

4. [Testing in CI](#4-testing-in-ci)
   - 4.1 [Unit Tests](#41-unit-tests) (CRITICAL)
   - 4.2 [Integration Tests](#42-integration-tests) (CRITICAL)
   - 4.3 [E2E Tests](#43-e2e-tests) (HIGH)
   - 4.4 [Test Parallelization](#44-test-parallelization) (HIGH)

5. [Build Optimization](#5-build-optimization)
   - 5.1 [Parallel Jobs](#51-parallel-jobs) (CRITICAL)
   - 5.2 [Conditional Execution](#52-conditional-execution) (CRITICAL)
   - 5.3 [Incremental Builds](#53-incremental-builds) (HIGH)
   - 5.4 [Build Artifacts](#54-build-artifacts) (MEDIUM)

6. [Deployment Strategies](#6-deployment-strategies)
   - 6.1 [Environment Management](#61-environment-management) (CRITICAL)
   - 6.2 [Blue-Green Deployment](#62-blue-green-deployment) (HIGH)
   - 6.3 [Canary Deployment](#63-canary-deployment) (HIGH)
   - 6.4 [Rollback Strategy](#64-rollback-strategy) (CRITICAL)

7. [Monorepo CI](#7-monorepo-ci)
   - 7.1 [Turborepo Integration](#71-turborepo-integration) (CRITICAL)
   - 7.2 [Affected Package Detection](#72-affected-package-detection) (CRITICAL)
   - 7.3 [Remote Caching](#73-remote-caching) (HIGH)

8. [Security](#8-security)
   - 8.1 [Secrets Management](#81-secrets-management) (CRITICAL)
   - 8.2 [Dependency Scanning](#82-dependency-scanning) (CRITICAL)
   - 8.3 [SAST/DAST](#83-sastdast) (HIGH)
   - 8.4 [Container Scanning](#84-container-scanning) (HIGH)

9. [Monitoring and Metrics](#9-monitoring-and-metrics)
   - 9.1 [Pipeline Metrics](#91-pipeline-metrics) (CRITICAL)
   - 9.2 [Build Time Tracking](#92-build-time-tracking) (HIGH)
   - 9.3 [Deployment Frequency](#93-deployment-frequency) (MEDIUM)

10. [Pulwave Integration](#10-pulwave-integration)
    - 10.1 [Monorepo Pipeline](#101-monorepo-pipeline) (CRITICAL)
    - 10.2 [Package Testing](#102-package-testing) (CRITICAL)
    - 10.3 [App Deployment](#103-app-deployment) (HIGH)

**Appendix**
- [A. GitHub Actions Reference](#appendix-a-github-actions-reference)
- [B. Pipeline Optimization Checklist](#appendix-b-pipeline-optimization-checklist)
- [C. Deployment Checklist](#appendix-c-deployment-checklist)
- [D. Troubleshooting Guide](#appendix-d-troubleshooting-guide)

---

## 1. CI/CD Fundamentals

### 1.1 CI/CD Definition (CRITICAL)

Understand the difference between Continuous Integration and Continuous Deployment.

**Continuous Integration (CI)**:
```
Goal: Merge code frequently, validate early

Process:
1. Developer pushes code to branch
2. CI runs: lint → test → build
3. Feedback within minutes
4. Fix issues before merge

Benefits:
- Catch bugs early
- Reduce integration conflicts
- Maintain code quality
```

**Continuous Deployment (CD)**:
```
Goal: Automate deployment to production

Process:
1. Code merged to main branch
2. CI passes all checks
3. CD automatically deploys to staging
4. Automated tests in staging
5. Automatic promotion to production

Benefits:
- Faster time to market
- Reduced manual errors
- Consistent deployments
```

### 1.2 Pipeline Stages (CRITICAL)

Structure pipelines with clear, sequential stages.

**Incorrect** - Single monolithic job:
```yaml
# .github/workflows/monolith.yml
jobs:
  everything:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Do everything
        run: |
          npm install
          npm run lint
          npm run test
          npm run build
          npm run deploy
      # Problem: If lint fails, still runs tests/build/deploy
      # Problem: Can't see which stage failed at a glance
```

**Correct** - Multi-stage pipeline:
```yaml
# .github/workflows/ci.yml
name: CI Pipeline

on: [push, pull_request]

jobs:
  # Stage 1: Lint (fail fast - 1 min)
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run lint
      - run: npm run typecheck

  # Stage 2: Test (parallel - 3 min)
  test:
    needs: lint
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run test

  # Stage 3: Build (parallel - 5 min)
  build:
    needs: lint
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-artifact@v4
        with:
          name: build-output
          path: dist/

  # Stage 4: Deploy (only on main - conditional)
  deploy:
    needs: [test, build]
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/download-artifact@v4
        with:
          name: build-output
      - run: npm run deploy
```

### 1.3 Pipeline Architecture (CRITICAL)

Design pipelines for speed and reliability.

**Pipeline Architecture Principles**:
```
1. Fail Fast
   ├── Run cheap checks first (lint, typecheck)
   └── Expensive checks later (build, E2E tests)

2. Parallel Execution
   ├── Test and Build run in parallel (both need lint)
   └── Independent jobs don't wait for each other

3. Conditional Execution
   ├── Deploy only on main branch
   ├── E2E tests only on PRs to main
   └── Release only on tags

4. Caching
   ├── Cache dependencies (node_modules)
   ├── Cache build outputs (Turborepo)
   └── Cache Docker layers
```

**Visual Pipeline Flow**:
```
                    ┌─────────┐
                    │ Trigger │ (push/PR)
                    └────┬────┘
                         │
                    ┌────▼────┐
                    │  Lint   │ (1 min - FAIL FAST)
                    └────┬────┘
                         │
            ┌────────────┴────────────┐
            │                         │
       ┌────▼────┐              ┌────▼────┐
       │  Test   │              │  Build  │ (parallel - 3-5 min)
       └────┬────┘              └────┬────┘
            │                         │
            └────────────┬────────────┘
                         │
                    ┌────▼────┐
                    │ Deploy  │ (only main - 2 min)
                    └─────────┘
```

### 1.4 Fail Fast Principle (CRITICAL)

Run fastest, most likely to fail checks first.

**Incorrect** - Slow checks first:
```yaml
jobs:
  ci:
    steps:
      - run: npm run build        # 5 minutes
      - run: npm run test         # 3 minutes
      - run: npm run lint         # 30 seconds
      # If lint fails, wasted 8 minutes on build/test
```

**Correct** - Fail fast:
```yaml
jobs:
  # Step 1: Fastest checks (30s-1min)
  lint:
    steps:
      - run: npm run lint         # 30 seconds
      - run: npm run typecheck    # 30 seconds

  # Step 2: Medium checks (2-3min) - only if lint passes
  test:
    needs: lint
    steps:
      - run: npm run test:unit    # 2 minutes

  # Step 3: Slow checks (5min+) - only if tests pass
  build:
    needs: test
    steps:
      - run: npm run build        # 5 minutes

  # Step 4: Very slow checks (10min+) - only if build passes
  e2e:
    needs: build
    steps:
      - run: npm run test:e2e     # 10 minutes
```

---

## 2. GitHub Actions

### 2.1 Workflow Basics (CRITICAL)

Create GitHub Actions workflows with proper structure.

**Basic Workflow Structure**:
```yaml
# .github/workflows/ci.yml
name: CI                        # Workflow name (shown in UI)

on:                             # Triggers
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:                           # Jobs to run
  test:                         # Job ID
    runs-on: ubuntu-latest      # Runner environment

    steps:                      # Steps within job
      - name: Checkout code     # Step name
        uses: actions/checkout@v4  # Action to use

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:                   # Action inputs
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci             # Shell command

      - name: Run tests
        run: npm test
```

### 2.2 Triggers and Events (CRITICAL)

Configure workflow triggers appropriately.

**Pulwave Trigger Patterns**:
```yaml
# Pattern 1: PR validation
on:
  pull_request:
    branches: [main, develop]
    types: [opened, synchronize, reopened]

# Pattern 2: Main branch CI
on:
  push:
    branches: [main]

# Pattern 3: Release workflow
on:
  push:
    tags:
      - 'v*.*.*'

# Pattern 4: Manual trigger with inputs
on:
  workflow_dispatch:
    inputs:
      environment:
        description: 'Environment to deploy'
        required: true
        type: choice
        options:
          - staging
          - production

# Pattern 5: Path filtering (only run if specific files change)
on:
  push:
    paths:
      - 'packages/**'
      - 'apps/**'
      - '.github/workflows/**'
    paths-ignore:
      - '**.md'
      - 'docs/**'

# Pattern 6: Scheduled workflows (cron)
on:
  schedule:
    - cron: '0 0 * * 0'  # Weekly on Sunday at midnight
```

### 2.3 Jobs and Steps (CRITICAL)

Organize jobs for optimal parallelization and dependency management.

**Pulwave CI Job Structure**:
```yaml
name: Pulwave CI

on: [push, pull_request]

jobs:
  # Job 1: Code quality (fast, fail fast)
  quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Lint
        run: npm run lint

      - name: Type check
        run: npm run typecheck

      - name: Check circular dependencies
        run: npm run check:circular

  # Job 2: Unit tests (parallel with job 1)
  test:
    needs: quality
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run test:unit -- --coverage

      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/coverage-final.json

  # Job 3: Build (parallel with test)
  build:
    needs: quality
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run build

      - name: Upload build artifacts
        uses: actions/upload-artifact@v4
        with:
          name: dist
          path: |
            apps/*/dist
            packages/*/dist
          retention-days: 7

  # Job 4: E2E tests (sequential after build)
  e2e:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Download build artifacts
        uses: actions/download-artifact@v4
        with:
          name: dist

      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npm run test:e2e

      - name: Upload Playwright report
        if: failure()
        uses: actions/upload-artifact@v4
        with:
          name: playwright-report
          path: playwright-report/
```

### 2.4 Matrix Builds (HIGH)

Test across multiple Node versions and operating systems.

**Pulwave Matrix Strategy**:
```yaml
jobs:
  test:
    strategy:
      matrix:
        node-version: [18, 20, 22]
        os: [ubuntu-latest, windows-latest, macos-latest]
      fail-fast: false  # Continue other jobs if one fails

    runs-on: ${{ matrix.os }}

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node ${{ matrix.node-version }}
        uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
          cache: 'npm'

      - run: npm ci
      - run: npm test

# Alternative: Include/exclude specific combinations
jobs:
  test:
    strategy:
      matrix:
        include:
          # Test latest Node on all OS
          - node-version: 20
            os: ubuntu-latest
          - node-version: 20
            os: windows-latest
          - node-version: 20
            os: macos-latest

          # Test LTS versions only on Ubuntu
          - node-version: 18
            os: ubuntu-latest
          - node-version: 22
            os: ubuntu-latest
```

### 2.5 Reusable Workflows (HIGH)

Create reusable workflows to avoid duplication.

**Reusable Workflow Definition**:
```yaml
# .github/workflows/reusable-test.yml
name: Reusable Test Workflow

on:
  workflow_call:
    inputs:
      node-version:
        required: true
        type: string
      test-command:
        required: false
        type: string
        default: 'npm test'
    secrets:
      CODECOV_TOKEN:
        required: true

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ inputs.node-version }}
          cache: 'npm'
      - run: npm ci
      - run: ${{ inputs.test-command }}
      - uses: codecov/codecov-action@v3
        with:
          token: ${{ secrets.CODECOV_TOKEN }}
```

**Using Reusable Workflow**:
```yaml
# .github/workflows/ci.yml
name: CI

on: [push, pull_request]

jobs:
  test-node-20:
    uses: ./.github/workflows/reusable-test.yml
    with:
      node-version: '20'
      test-command: 'npm run test:coverage'
    secrets:
      CODECOV_TOKEN: ${{ secrets.CODECOV_TOKEN }}

  test-node-18:
    uses: ./.github/workflows/reusable-test.yml
    with:
      node-version: '18'
    secrets:
      CODECOV_TOKEN: ${{ secrets.CODECOV_TOKEN }}
```

---

## 3. Caching Strategy

### 3.1 Dependency Caching (CRITICAL)

Cache dependencies to speed up CI builds.

**Incorrect** - No caching:
```yaml
steps:
  - uses: actions/checkout@v4
  - uses: actions/setup-node@v4
    with:
      node-version: '20'
  - run: npm ci  # Downloads all deps every time (2-3 min)
  - run: npm test
```

**Correct** - Dependency caching:
```yaml
steps:
  - uses: actions/checkout@v4

  - uses: actions/setup-node@v4
    with:
      node-version: '20'
      cache: 'npm'  # Automatically caches node_modules
      # Cache key based on package-lock.json hash

  - run: npm ci  # Uses cache if available (10-20 seconds)
  - run: npm test

# Alternative: Manual cache control
steps:
  - uses: actions/checkout@v4

  - name: Cache node modules
    uses: actions/cache@v3
    with:
      path: node_modules
      key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
      restore-keys: |
        ${{ runner.os }}-node-

  - run: npm ci
  - run: npm test
```

### 3.2 Build Cache (CRITICAL)

Cache build outputs with Turborepo.

**Pulwave Turborepo Caching**:
```yaml
# .github/workflows/ci.yml
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - run: npm ci

      # Turborepo remote caching
      - name: Build with Turborepo
        run: npm run build
        env:
          TURBO_TOKEN: ${{ secrets.TURBO_TOKEN }}
          TURBO_TEAM: ${{ secrets.TURBO_TEAM }}

      # Alternative: GitHub Actions cache for Turborepo
      - name: Cache Turborepo
        uses: actions/cache@v3
        with:
          path: .turbo
          key: ${{ runner.os }}-turbo-${{ github.sha }}
          restore-keys: |
            ${{ runner.os }}-turbo-
```

### 3.3 Docker Layer Caching (HIGH)

Cache Docker layers for faster builds.

**Docker Build with Caching**:
```yaml
jobs:
  docker:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3

      - name: Login to Container Registry
        uses: docker/login-action@v3
        with:
          registry: ghcr.io
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Build and push
        uses: docker/build-push-action@v5
        with:
          context: .
          push: true
          tags: ghcr.io/${{ github.repository }}:latest
          cache-from: type=gha
          cache-to: type=gha,mode=max
```

### 3.4 Cache Invalidation (HIGH)

Properly invalidate caches when dependencies change.

**Cache Key Strategies**:
```yaml
# Strategy 1: Exact match (fastest, most strict)
- uses: actions/cache@v3
  with:
    path: node_modules
    key: ${{ runner.os }}-node-${{ hashFiles('package-lock.json') }}

# Strategy 2: Restore fallback (more flexible)
- uses: actions/cache@v3
  with:
    path: node_modules
    key: ${{ runner.os }}-node-${{ hashFiles('package-lock.json') }}
    restore-keys: |
      ${{ runner.os }}-node-

# Strategy 3: Multi-level cache (monorepo)
- uses: actions/cache@v3
  with:
    path: |
      node_modules
      packages/*/node_modules
    key: ${{ runner.os }}-deps-${{ hashFiles('**/package-lock.json') }}
    restore-keys: |
      ${{ runner.os }}-deps-
```

---

## 10. Pulwave Integration

### 10.1 Monorepo Pipeline (CRITICAL)

Complete CI/CD pipeline for Pulwave monorepo.

**.github/workflows/ci.yml**:
```yaml
name: Pulwave CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

env:
  NODE_VERSION: '20'
  TURBO_TOKEN: ${{ secrets.TURBO_TOKEN }}
  TURBO_TEAM: ${{ secrets.TURBO_TEAM }}

jobs:
  # Stage 1: Code Quality (1-2 min)
  quality:
    runs-on: ubuntu-latest
    timeout-minutes: 5

    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0  # For Turborepo affected packages

      - uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Lint
        run: npm run lint

      - name: Type check
        run: npm run typecheck

      - name: Check circular dependencies
        run: npm run check:circular

      - name: Check architecture boundaries
        run: npm run check:architecture

  # Stage 2: Test (parallel - 3-5 min)
  test:
    needs: quality
    runs-on: ubuntu-latest
    timeout-minutes: 10

    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'

      - run: npm ci

      - name: Run unit tests
        run: npm run test:unit -- --coverage

      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/coverage-final.json
          flags: unittests

  # Stage 3: Build (parallel - 5-7 min)
  build:
    needs: quality
    runs-on: ubuntu-latest
    timeout-minutes: 15

    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'

      - run: npm ci

      - name: Build packages and apps
        run: npm run build

      - name: Upload build artifacts
        uses: actions/upload-artifact@v4
        with:
          name: dist
          path: |
            apps/*/dist
            packages/*/dist
          retention-days: 7

  # Stage 4: E2E Tests (sequential - 10-15 min)
  e2e:
    needs: build
    runs-on: ubuntu-latest
    timeout-minutes: 20

    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'

      - name: Download build artifacts
        uses: actions/download-artifact@v4
        with:
          name: dist

      - run: npm ci
      - run: npx playwright install --with-deps chromium

      - name: Run E2E tests
        run: npm run test:e2e

      - name: Upload Playwright report
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 7

  # Stage 5: Deploy to Staging (only on main)
  deploy-staging:
    needs: [test, build, e2e]
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    environment:
      name: staging
      url: https://staging.pulwave.com

    steps:
      - uses: actions/checkout@v4

      - name: Download build artifacts
        uses: actions/download-artifact@v4
        with:
          name: dist

      - name: Deploy to Vercel
        run: npx vercel --prod --token=${{ secrets.VERCEL_TOKEN }}
        env:
          VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
          VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID }}
```

### 10.2 Package Testing (CRITICAL)

Test affected packages in monorepo.

**Turborepo Affected Testing**:
```yaml
jobs:
  test-affected:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - run: npm ci

      # Test only affected packages
      - name: Test affected packages
        run: |
          npx turbo run test \
            --filter="...[origin/main]" \
            --continue
```

### 10.3 App Deployment (HIGH)

Deploy apps conditionally based on changes.

**Conditional App Deployment**:
```yaml
jobs:
  deploy-real-estate:
    if: |
      github.ref == 'refs/heads/main' &&
      contains(github.event.head_commit.message, '[real-estate]')
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci
      - run: npm run build --filter=@pulwave/real-estate
      - run: npm run deploy --filter=@pulwave/real-estate
        env:
          VERCEL_TOKEN: ${{ secrets.VERCEL_TOKEN }}
```

---

## Appendix A: GitHub Actions Reference

```yaml
# Complete workflow example
name: Workflow Name

on:
  push:
    branches: [main]
    tags: ['v*']
    paths:
      - 'src/**'
  pull_request:
    branches: [main]
  workflow_dispatch:
  schedule:
    - cron: '0 0 * * 0'

env:
  GLOBAL_VAR: value

jobs:
  job-id:
    runs-on: ubuntu-latest
    timeout-minutes: 30
    strategy:
      matrix:
        node: [18, 20]
      fail-fast: false

    env:
      JOB_VAR: value

    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Step name
        run: echo "Hello"
        env:
          STEP_VAR: value

      - name: Conditional step
        if: success() && github.ref == 'refs/heads/main'
        run: echo "Deploy"
```

## Appendix B: Pipeline Optimization Checklist

```markdown
# Pipeline Optimization Checklist

## Caching
- [ ] Dependencies cached (node_modules)
- [ ] Build outputs cached (Turborepo)
- [ ] Docker layers cached
- [ ] Cache keys include lock file hash

## Parallelization
- [ ] Independent jobs run in parallel
- [ ] Test suites parallelized
- [ ] Matrix builds for multi-version testing

## Fail Fast
- [ ] Lint runs before tests
- [ ] Type check runs before build
- [ ] Fast checks run before slow checks

## Conditional Execution
- [ ] Deploy only on main branch
- [ ] E2E tests skip on docs changes
- [ ] Build artifacts only when needed

## Performance
- [ ] Pipeline completes in <10 min
- [ ] PR checks complete in <5 min
- [ ] Timeout limits set on all jobs
```

## Appendix C: Deployment Checklist

```markdown
# Deployment Checklist

## Pre-Deploy
- [ ] All tests passing
- [ ] Build successful
- [ ] Code reviewed and approved
- [ ] Secrets configured
- [ ] Environment variables set

## Deploy
- [ ] Deploy to staging first
- [ ] Run smoke tests
- [ ] Check logs for errors
- [ ] Verify critical paths work

## Post-Deploy
- [ ] Monitor error rates
- [ ] Check performance metrics
- [ ] Verify rollback procedure
- [ ] Update deployment docs
```

## Appendix D: Troubleshooting Guide

```markdown
# Common CI/CD Issues

## Cache Issues
- **Problem**: Stale cache causing failures
- **Solution**: Bump cache version in key

## Timeout Issues
- **Problem**: Jobs timing out
- **Solution**: Increase timeout-minutes, optimize tests

## Dependency Issues
- **Problem**: npm ci fails
- **Solution**: Delete lock file cache, regenerate

## Build Failures
- **Problem**: Build works locally, fails in CI
- **Solution**: Check Node version, env vars, dependencies

## Secret Issues
- **Problem**: Secrets not available
- **Solution**: Check secret names, environment settings
```

---

**Impact Levels Summary**:
- **CRITICAL** (24): Pipeline architecture, GitHub Actions basics, caching, testing, deployment, security
- **HIGH** (15): Matrix builds, reusable workflows, E2E tests, optimization, monitoring
- **MEDIUM** (3): Build artifacts, deployment frequency, advanced patterns
- **LOW** (0): None

**Total Patterns**: 42+ comprehensive CI/CD patterns for modern web applications
