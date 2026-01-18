# DevOps Skills - Category Guide

**Version 1.2.0**
Pulwave Engineering
2026-01-18

> **Note:**
> This is the dev-ops category compilation for AI agents and LLMs working on the Pulwave codebase.
> This document aggregates all 3 DevOps skills with links to detailed implementation guides.

## Abstract

DevOps guide for Pulwave's deployment and operations. Contains 3 skills covering CI/CD, deployment, and monitoring. Pulwave uses Vercel managed infrastructure (no Docker, no IaC).

**Note**: Skills removed in v1.2.0: `containers` (no Docker usage). Skills removed in v1.1.0: `iac` (Infrastructure as Code - Pulwave uses Vercel managed infrastructure, not Terraform/CloudFormation).

**DevOps Tech Stack:**
- GitHub Actions (CI/CD)
- Vercel (managed hosting and infrastructure)
- Supabase (managed backend)
- Sentry (monitoring)

---

## Table of Contents

1. [CI/CD](#1-cicd) (HIGH) - GitHub Actions, pipelines
2. [Monitoring (Ops)](#2-monitoring-ops) (HIGH) - Uptime, alerting
3. [Turborepo](#3-turborepo) (HIGH) - Monorepo build orchestration

---

## 1. CI/CD

**Location**: [ci-cd/](ci-cd/)
**Quick Ref**: [SKILL.md](ci-cd/SKILL.md)
**Full Guide**: ⚠️ AGENTS.md Q2 priority

**Impact**: HIGH

GitHub Actions workflows, deployment pipelines, automated testing, build optimization, caching strategies.

### Key Patterns

- **PR checks** - Lint, typecheck, test on every PR
- **Deploy on merge** - Automatic deployment to staging/production
- **Matrix builds** - Test multiple Node versions
- **Cache dependencies** - Faster CI runs

### When to Use

- Setting up CI/CD pipeline
- Automating deployments
- Running tests in CI
- Optimizing build time

### GitHub Actions Example

```yaml
# .github/workflows/ci.yml
name: CI

on:
  pull_request:
  push:
    branches: [main]

jobs:
  test:
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
      - run: npm run test
      - run: npm run build

  e2e:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npm run test:e2e

      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
```

---

## 2. Monitoring (Ops)

**Location**: [monitoring-ops/](monitoring-ops/)
**Quick Ref**: [SKILL.md](monitoring-ops/SKILL.md)
**Full Guide**: ⚠️ AGENTS.md Q2 priority

**Impact**: HIGH

Uptime monitoring, alerting, incident response, error tracking, performance monitoring.

### Key Patterns

- **Uptime checks** - Ping critical endpoints
- **Error alerting** - Sentry for error tracking
- **Performance monitoring** - APM for slow queries
- **Incident response** - Runbooks for common issues

### When to Use

- Setting up monitoring
- Responding to incidents
- Performance debugging
- Error investigation

### Monitoring Setup

```typescript
// Sentry configuration
import * as Sentry from '@sentry/react';

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  environment: import.meta.env.VITE_APP_ENV,
  tracesSampleRate: 0.1,
  integrations: [
    new Sentry.BrowserTracing(),
    new Sentry.Replay({
      maskAllText: false,
      blockAllMedia: false,
    }),
  ],
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
});

// Uptime monitoring (UptimeRobot config)
{
  "monitors": [
    {
      "friendly_name": "Pulwave Production",
      "url": "https://pulwave.com",
      "type": "http",
      "interval": 300
    },
    {
      "friendly_name": "Pulwave API",
      "url": "https://pulwave.com/api/health",
      "type": "http",
      "interval": 60
    }
  ]
}
```

---

## 3. Turborepo

**Location**: [turborepo/](turborepo/)
**Quick Ref**: [SKILL.md](turborepo/SKILL.md)
**Full Guide**: ⚠️ AGENTS.md Q2 priority

**Impact**: HIGH

Monorepo build orchestration, caching, parallel task execution, remote caching.

### Key Patterns

- **Task pipelines** - Define task dependencies
- **Remote caching** - Share build cache across team
- **Parallel execution** - Run tasks in parallel
- **Incremental builds** - Only rebuild what changed

### When to Use

- Building monorepo packages
- Optimizing CI/CD pipelines
- Setting up development workflow
- Managing package dependencies

### Turborepo Configuration

```json
// turbo.json
{
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", ".next/**"]
    },
    "test": {
      "dependsOn": ["build"],
      "outputs": ["coverage/**"]
    },
    "lint": {},
    "dev": {
      "cache": false
    }
  }
}
```

---

## Usage Workflows

### Deploying a Feature

**Deployment workflow:**

```bash
# 1. Create feature branch
git checkout -b feature/new-feature

# 2. Develop and test locally
npm run dev
npm run test

# 3. Create PR
git push origin feature/new-feature
# GitHub Actions runs CI checks

# 4. Review preview deployment
# Vercel automatically creates preview URL

# 5. Merge to main
# Vercel automatically deploys to production

# 6. Monitor deployment
# Check Sentry for errors
# Check uptime monitors
```

---

### Setting Up CI/CD

**CI/CD setup workflow:**

```bash
# 1. Create GitHub Actions workflow (ci-cd)
.github/workflows/ci.yml

# 2. Add test job
- Lint, typecheck, test, build

# 3. Add E2E job
- Playwright tests

# 4. Add deployment job (deployment)
- Deploy to Vercel on merge

# 5. Add secrets
- VITE_SUPABASE_URL
- VITE_SUPABASE_ANON_KEY
- VERCEL_TOKEN

# 6. Test pipeline
- Create PR, verify checks run
```

---

### Responding to Incident

**Incident response workflow:**

```bash
# 1. Identify issue (monitoring-ops)
- Check Sentry errors
- Check uptime monitors
- Check user reports

# 2. Assess severity (monitoring-ops)
- Critical (site down) → immediate rollback
- Major (feature broken) → hotfix
- Minor (cosmetic issue) → schedule fix

# 3. Rollback if needed (deployment)
- Vercel dashboard → Rollback to previous deployment

# 4. Fix and deploy (ci-cd, deployment)
- Create hotfix branch
- Fix issue
- Deploy to production

# 5. Post-mortem (monitoring-ops)
- Document incident
- Identify root cause
- Implement prevention
```

---

## Coverage Status

| Skill | SKILL.md | AGENTS.md | Priority |
|-------|----------|-----------|----------|
| ci-cd | ✅ | ⚠️ Q2 | HIGH |
| monitoring | ✅ | ⚠️ Q2 | HIGH |
| turborepo | ✅ | ⚠️ Q2 | HIGH |

**Current**: 0/3 skills with AGENTS.md (0%)
**Q1 Target**: 1/3 skills (33%)
**Q2 Target**: 3/3 skills (100%)

---

## Related Categories

- **Tools** - [../tools/AGENTS.md](../tools/AGENTS.md) - Development tools
- **Crosscutting** - [../crosscutting/AGENTS.md](../crosscutting/AGENTS.md) - Monitoring, logging
- **Testing** - [../testing/AGENTS.md](../testing/AGENTS.md) - CI testing

---

## Further Reading

- [Pulwave Architecture Guide](../../../CLAUDE.md)
- [Master Skills Library](../AGENTS.md)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Vercel Documentation](https://vercel.com/docs)

---

**Last Updated**: 2026-01-18
**Version**: 1.2.0
**Total Skills**: 3
**With AGENTS.md**: 0
**Maintained By**: Pulwave Engineering

**Changes in v1.2.0:**
- Removed `containers` (Containerization) - Pulwave uses Vercel managed infrastructure, no Docker in production
- Removed `deployment` section (consolidated into CI/CD workflows)

**Changes in v1.1.0:**
- Removed `iac` (Infrastructure as Code) - Pulwave uses Vercel managed infrastructure, not Terraform/CloudFormation
