---
name: pulwave-skills-library
description: Complete skills library for the Pulwave monorepo covering architecture, frontend, backend, testing, DevOps, and tooling
version: 1.4.0
tags: [Skills Library, Master Index, Pulwave]
---

# Pulwave Skills Library

Complete skills reference for AI agents and developers working on the Pulwave monorepo.

## When to Use

- Starting any development task in Pulwave
- Looking for best practices and patterns
- Understanding architectural decisions
- Implementing new features
- Code review and quality assurance

## Quick Stats

- **Total Skills**: 60 (unified library - all Anthropic tools integrated)
- **Library Categories**: 7 (Architecture, Backend, Crosscutting, DevOps, Front-End, Testing, Tools)
- **With AGENTS.md**: 60/60 (100%)
- **Coverage**: 100% SKILL.md, 100% AGENTS.md, 130+ reference docs
- **Note**: v1.4.0 integrated all external tools into unified library structure

---

## Critical Skills (Must Know)

| Skill | Category | Impact | Status |
|-------|----------|--------|--------|
| [Performance](front-end/performance/SKILL.md) | Front-End | CRITICAL | ✅ Complete |
| [Project Structure](architecture/project-structure/SKILL.md) | Architecture | CRITICAL | ✅ Complete |
| [React Frameworks](front-end/frameworks/SKILL.md) | Front-End | CRITICAL | ✅ Complete |
| [State Management](front-end/state-management/SKILL.md) | Front-End | HIGH | ✅ Complete |
| [Security](crosscutting/security/SKILL.md) | Crosscutting | CRITICAL | ✅ Complete |

---

## All Skills by Category

### 📐 Architecture (5 skills)

- [Data Layer](architecture/data-layer/SKILL.md) - Repository pattern, services, provider abstraction
- [Mobile](architecture/mobile/SKILL.md) - Mobile-first responsive design patterns
- [Project Structure](architecture/project-structure/SKILL.md) - Monorepo layer architecture
- [Scalability](architecture/scalability/SKILL.md) - Scaling patterns, code splitting
- [System Design](architecture/system-design/SKILL.md) - High-level architecture decisions

**Category Guide**: [architecture/AGENTS.md](architecture/AGENTS.md)

---

### 🖥️ Backend (2 skills)

- [API Design](backend/api-design/SKILL.md) - RESTful patterns, versioning
- [Database](backend/database/SKILL.md) - Supabase optimization, RLS, indexing

**Category Guide**: [backend/AGENTS.md](backend/AGENTS.md)

**Note**: `distributed-systems`, `frameworks`, `nodejs`, and `serverless` removed (Pulwave uses Supabase managed backend, no self-hosted servers or Edge Functions)

---

### 🌐 Crosscutting (15 skills)

- [API Docs](crosscutting/api-docs/SKILL.md) - OpenAPI, Swagger
- [Authentication](crosscutting/authentication/SKILL.md) - Supabase Auth, JWTs
- [Brand Guidelines](crosscutting/brand-guidelines/SKILL.md) - Brand consistency tools
- [Caching](crosscutting/caching/SKILL.md) - Browser, CDN, service worker
- [Code Hygiene](crosscutting/code-hygiene/SKILL.md) - Linting, formatting
- [Debugging](crosscutting/debugging/SKILL.md) - Tools, techniques
- [Environment Validation](crosscutting/env-validation/SKILL.md) - Zod validation
- [Error Handling](crosscutting/error-handling/SKILL.md) - Boundaries, logging
- [Feature Flags](crosscutting/feature-flags/SKILL.md) - Toggles, rollouts
- [I18n](crosscutting/i18n/SKILL.md) - Internationalization
- [Internal Comms](crosscutting/internal-comms/SKILL.md) - Internal communication templates
- [Logging](crosscutting/logging/SKILL.md) - Structured logging
- [Monitoring](crosscutting/monitoring/SKILL.md) - APM, error tracking
- [Security](crosscutting/security/SKILL.md) - OWASP Top 10 prevention
- [SEO](crosscutting/seo/SKILL.md) - Meta tags, structured data

**Category Guide**: [crosscutting/AGENTS.md](crosscutting/AGENTS.md)

---

### 🚀 DevOps (3 skills)

- [CI/CD](dev-ops/ci-cd/SKILL.md) - GitHub Actions, pipelines
- [Monitoring](dev-ops/monitoring/SKILL.md) - Uptime, alerting
- [Turborepo](dev-ops/turborepo/SKILL.md) - Monorepo build orchestration

**Category Guide**: [dev-ops/AGENTS.md](dev-ops/AGENTS.md)

**Note**: `iac` and `containers` removed (Pulwave uses Vercel managed infrastructure, no Docker in production)

---

### 🎨 Front-End (18 skills)

- [Accessibility](front-end/accessibility/SKILL.md) - WCAG 2.1 AA compliance
- [Animations](front-end/animations/SKILL.md) - CSS animations, transitions
- [Canvas Design](front-end/canvas-design/SKILL.md) - Interactive canvas design (50+ fonts)
- [Component Design](front-end/component-design/SKILL.md) - CVA, compound components
- [Data Visualization](front-end/data-visualization/SKILL.md) - Chart.js patterns
- [Forms](front-end/forms/SKILL.md) - Form state, validation
- [Frameworks](front-end/frameworks/SKILL.md) - React 19 patterns
- [Frontend Design](front-end/frontend-design/SKILL.md) - Frontend design utilities
- [Layout](front-end/layout/SKILL.md) - Flexbox, Grid, responsive
- [Performance](front-end/performance/SKILL.md) - ✅ Waterfalls, bundle size, re-renders
- [PWA](front-end/pwa/SKILL.md) - Progressive Web Apps
- [React Patterns](front-end/react-patterns/SKILL.md) - Vercel best practices (47 rules)
- [Routing](front-end/routing/SKILL.md) - React Router patterns
- [SEO (Frontend)](front-end/seo-frontend/SKILL.md) - Meta tags, structured data
- [Styling](front-end/styling/SKILL.md) - SCSS, BEM, theming
- [Testing (Frontend)](front-end/testing-frontend/SKILL.md) - Component tests
- [Theme Factory](front-end/theme-factory/SKILL.md) - Design theme generation
- [UX Patterns](front-end/ux-patterns/SKILL.md) - Loading, error, empty states

**Category Guide**: [front-end/AGENTS.md](front-end/AGENTS.md)

---

### 🧪 Testing (6 skills)

- [E2E Testing](testing/e2e-testing/SKILL.md) - Playwright, page objects
- [Integration Testing](testing/integration-testing/SKILL.md) - API, database tests
- [Performance Testing](testing/performance-testing/SKILL.md) - Lighthouse, load tests
- [Unit Testing](testing/unit-testing/SKILL.md) - Vitest, mocking
- [Visual Regression](testing/visual-regression/SKILL.md) - Screenshot testing
- [Web App Testing](testing/webapp-testing/SKILL.md) - Web testing utilities

**Category Guide**: [testing/AGENTS.md](testing/AGENTS.md)

---

### 🛠️ Tools (11 skills)

**Development Tools**:
- [MCP](tools/mcp/SKILL.md) - Model Context Protocol integration
- [TypeScript](tools/typescript/SKILL.md) - Strict mode, generics

**Document Processing**:
- [PDF](tools/pdf/SKILL.md) - PDF generation
- [DOCX](tools/docx/SKILL.md) - Word documents
- [PPTX](tools/pptx/SKILL.md) - PowerPoint presentations
- [XLSX](tools/xlsx/SKILL.md) - Excel spreadsheets

**Workflow Tools**:
- [Doc Coauthoring](tools/doc-coauthoring/SKILL.md) - Document collaboration
- [Skill Creator](tools/skill-creator/SKILL.md) - Create new skills
- [Web Artifacts](tools/web-artifacts/SKILL.md) - Deployable web artifacts

**Creative Tools**:
- [Algorithmic Art](tools/algorithmic-art/SKILL.md) - Generative art
- [Slack GIF Creator](tools/slack-gif-creator/SKILL.md) - Animated GIFs

**Category Guide**: [tools/AGENTS.md](tools/AGENTS.md)

---

## Full Documentation

For comprehensive implementation guides with complete code examples:

**Master Guide**: [AGENTS.md](AGENTS.md) - Complete library index with usage scenarios

**Category Guides**: Each category has an AGENTS.md that compiles all skills in that category

**Skill Guides**: Individual skills with detailed AGENTS.md (starting with performance)

---

## Usage by Task Type

### Building Features
→ [project-structure](architecture/project-structure/SKILL.md) + [components](front-end/components/SKILL.md) + [frameworks](front-end/frameworks/SKILL.md) + [state-management](front-end/state-management/SKILL.md)

### Performance Optimization
→ [performance](front-end/performance/SKILL.md) + [caching](crosscutting/caching/SKILL.md) + [monitoring](crosscutting/monitoring/SKILL.md)

### Architecture Decisions
→ [system-design](architecture/system-design/SKILL.md) + [project-structure](architecture/project-structure/SKILL.md) + [data-layer](architecture/data-layer/SKILL.md) + [scalability](architecture/scalability/SKILL.md)

### Data Layer Work
→ [data-layer](architecture/data-layer/SKILL.md) + [database](backend/database/SKILL.md) + [state-management](front-end/state-management/SKILL.md)

### Testing & Quality
→ [unit-testing](testing/unit-testing/SKILL.md) + [integration-testing](testing/integration-testing/SKILL.md) + [e2e-testing](testing/e2e-testing/SKILL.md) + [code-quality](tools/code-quality/SKILL.md)

---

## Documentation Status

### ✅ Complete (Q1 2026)
- All 62 skills have comprehensive AGENTS.md guides
- All 62 skills have SKILL.md quick references
- 88 reference documents for deep dives
- 7 category compilation guides

### 📋 Future Enhancements (Q2-Q4 2026)
- Automated skill validation and linting
- Skills recommendation engine
- Usage tracking and analytics
- Interactive skill explorer

---

## Related Documentation

- [Pulwave Architecture Guide](../../CLAUDE.md) - Complete monorepo documentation
- [Pattern Analysis](../SKILL-vs-AGENTS-pattern.md) - SKILL.md vs AGENTS.md explained
- [Implementation Summary](../AGENTS-IMPLEMENTATION-SUMMARY.md) - Current status and progress

---

**Last Updated**: 2026-01-18
**Version**: 1.4.0
**Total Skills**: 60 (unified library)
**Maintained By**: Pulwave Engineering

**Changes in v1.4.0:**
- **LIBRARY INTEGRATION**: Unified all Anthropic tools into library structure
- Added 16 skills: 9 from Anthropic + 1 from investigate (react-patterns)
- Tools: 2 → 11 skills (+9: pdf, docx, pptx, xlsx, doc-coauthoring, skill-creator, web-artifacts, algorithmic-art, slack-gif-creator)
- Front-End: 14 → 18 skills (+4: canvas-design, theme-factory, frontend-design, react-patterns)
- Testing: 5 → 6 skills (+1: webapp-testing)
- Crosscutting: 13 → 15 skills (+2: internal-comms, brand-guidelines)
- Deleted `.claude/skills/anthropic/` and `.claude/skills/investigate/react-best-practices/` folders
- All skills now in unified library structure with consistent documentation

**Changes in v1.3.0:**
- Removed backend/nodejs (no self-hosted Node.js servers)
- Removed backend/serverless (no Supabase Edge Functions)
- Removed dev-ops/containers (no Docker usage, Vercel managed)
- Deleted docker-compose.yml and Dockerfile.dev (untracked files)
- Total: 3 skills removed + 2 Docker files deleted

**Changes in v1.2.0:**
- Removed Data category (4 skills)
- Removed backend/distributed-systems, backend/frameworks (2 skills)
- Removed dev-ops/iac (1 skill)
- Total: 7 skills removed after architecture alignment audit
