# Pulwave Skills Library - Master Guide

**Version 1.2.0**
Pulwave Engineering
2026-01-18

> **Note:**
> This is the master skills reference for AI agents and LLMs working on the Pulwave codebase.
> Use this document to discover which skills apply to your current task, then reference individual
> skill AGENTS.md files for detailed implementation guidance.

## Abstract

Comprehensive skills library for the Pulwave monorepo, designed for AI agents and LLMs. Contains 47 Pulwave-specific skills plus 15 Anthropic tool skills (62 total) across 7 categories covering architecture, front-end development, backend systems, testing, DevOps, and crosscutting concerns. Each skill includes both quick reference (SKILL.md) and detailed implementation guide (AGENTS.md).

**Note**: Data engineering category removed (Pulwave uses Supabase managed backend, not data warehouses/pipelines).

**Pulwave Tech Stack:**
- React 19 + TypeScript
- Vite 7 + Turborepo 2.7
- TanStack Query 5 (server state)
- Supabase (database)
- SCSS + BEM + CSS Custom Properties
- Atomic Modular Monorepo architecture

---

## Quick Navigation

**By Impact Level:**
- [Critical Skills](#critical-skills) - Must-know patterns (5 skills)
- [High Impact Skills](#high-impact-skills) - Major productivity gains (12 skills)
- [Category Index](#skills-by-category) - All 62 skills organized

**By Use Case:**
- [Building Features](#building-features) - Component development, state, UI
- [Performance Optimization](#performance-optimization) - Speed, bundle size, Core Web Vitals
- [Architecture Decisions](#architecture-decisions) - Structure, patterns, scalability
- [Data Layer Work](#data-layer-work) - APIs, database, caching
- [Testing & Quality](#testing--quality) - Unit, integration, E2E

---

## Critical Skills

These skills are fundamental to Pulwave development and should be applied in nearly every task.

### 1. Performance (CRITICAL)
**Location**: `front-end/performance/`
**Full Guide**: [AGENTS.md](front-end/performance/AGENTS.md)

30+ rules for optimizing React applications. Covers waterfalls elimination, bundle size reduction, re-render optimization, rendering performance, and JavaScript optimization.

**When to use:**
- Optimizing slow pages
- Reducing bundle size
- Improving Core Web Vitals (LCP, INP, CLS)
- Code review for performance regressions

**Key patterns:**
- Use `Promise.all()` for parallel fetching (67% faster)
- Avoid barrel imports (saves 50-500KB per library)
- Dynamic imports for heavy components (improves TTI by 0.5-2s)
- TanStack Query for automatic deduplication

---

### 2. Project Structure (CRITICAL)
**Location**: `architecture/project-structure/`
**Quick Ref**: [SKILL.md](architecture/project-structure/SKILL.md)

Atomic Modular Monorepo architecture with strict layer separation. Defines where code lives and how layers interact.

**When to use:**
- Creating new packages
- Deciding where to place code
- Reviewing architectural boundaries
- Refactoring for better separation

**Key patterns:**
- Dependencies flow downward only
- UI never imports Features
- Features never import other Features
- Data layer is provider-agnostic

---

### 3. React Frameworks (CRITICAL)
**Location**: `front-end/frameworks/`
**Quick Ref**: [SKILL.md](front-end/frameworks/SKILL.md)

Comprehensive React 19 development patterns covering hooks, performance, UI patterns, state management, and component architecture.

**When to use:**
- Building React components
- Implementing UI patterns (loading, error, empty states)
- Debugging re-render issues
- Reviewing React code

**Key patterns:**
- Defer await until needed
- Use Promise.all() for parallel operations
- Profile with React DevTools before optimizing
- Loading state only when no cached data

---

### 4. State Management (HIGH)
**Location**: `front-end/state-management/`
**Quick Ref**: [SKILL.md](front-end/state-management/SKILL.md)

TanStack Query patterns for server state, React Context for client state, URL state management with nuqs.

**When to use:**
- Fetching and caching API data
- Managing global client state
- Syncing UI state with URL
- Optimistic updates

**Key patterns:**
- TanStack Query for all server state
- React Context for theme, auth, UI preferences
- URL as source of truth for filters, pagination
- Optimistic updates with rollback

---

### 5. TypeScript Best Practices (HIGH)
**Location**: `tools/typescript/`
**Quick Ref**: [SKILL.md](tools/typescript/SKILL.md)

TypeScript strict mode patterns, type safety, generics, and type inference.

**When to use:**
- Writing type-safe code
- Creating reusable generic utilities
- Fixing TypeScript errors
- Type modeling domain entities

**Key patterns:**
- Strict mode enabled (`strictNullChecks`, `noImplicitAny`)
- Use `unknown` instead of `any`
- Discriminated unions for variants
- Branded types for IDs

---

## High Impact Skills

Skills that significantly improve productivity and code quality.

### Front-End

#### 6. Component Design
**Location**: `front-end/component-design/`
**Quick Ref**: [SKILL.md](front-end/component-design/SKILL.md)

CVA (Class Variance Authority) patterns, compound components, controlled vs uncontrolled, prop APIs.

**Key patterns:**
- CVA for variant management
- BEM for SCSS structure
- Compound components for complex UI
- Forward refs for input components

---

#### 7. Accessibility (WCAG 2.1 AA)
**Location**: `front-end/accessibility/`
**Quick Ref**: [SKILL.md](front-end/accessibility/SKILL.md)

WCAG 2.1 AA compliance, ARIA patterns, keyboard navigation, screen reader support.

**Key patterns:**
- Semantic HTML first, ARIA when necessary
- `aria-label` for icon-only buttons
- `focus-visible` for keyboard focus
- `aria-live` for async updates

---

#### 8. Forms & Validation
**Location**: `front-end/forms/`
**Quick Ref**: [SKILL.md](front-end/forms/SKILL.md)

Form state management, validation, error handling, accessibility.

**Key patterns:**
- Controlled inputs with validation feedback
- Inline errors next to fields
- Submit button disabled during submission
- `autocomplete` attributes for better UX

---

#### 9. Data Visualization
**Location**: `front-end/data-visualization/`
**Quick Ref**: [SKILL.md](front-end/data-visualization/SKILL.md)

Chart.js patterns, responsive charts, accessibility, performance for large datasets.

**Key patterns:**
- Lazy load chart components
- Memoize chart config
- Accessible chart descriptions
- Virtualization for >100 data points

---

#### 10. Styling & Theming
**Location**: `front-end/styling/`
**Quick Ref**: [SKILL.md](front-end/styling/SKILL.md)

SCSS + BEM methodology, CSS custom properties, design tokens, dark mode.

**Key patterns:**
- CSS custom properties for theming
- BEM naming (`.block__element--modifier`)
- Design tokens from Foundation package
- `color-scheme: dark` for dark mode

---

### Architecture

#### 11. Data Layer Architecture
**Location**: `architecture/data-layer/`
**Quick Ref**: [SKILL.md](architecture/data-layer/SKILL.md)

Hexagonal architecture with Repository pattern, Services, Hooks. Provider-agnostic abstraction.

**Key patterns:**
- Component → Hook → Service → Repository → Provider
- Domain-driven organization
- Provider pattern for Supabase abstraction
- Query keys for TanStack Query

---

#### 12. Mobile Architecture
**Location**: `architecture/mobile/`
**Quick Ref**: [SKILL.md](architecture/mobile/SKILL.md)

Responsive design patterns, mobile-first development, touch interactions, performance.

**Key patterns:**
- Mobile-first CSS
- `touch-action: manipulation` for touch
- Safe area insets for notches
- Reduced bundle for mobile

---

#### 13. Scalability Patterns
**Location**: `architecture/scalability/`
**Quick Ref**: [SKILL.md](architecture/scalability/SKILL.md)

Patterns for scaling monorepo, code splitting, lazy loading, optimization.

**Key patterns:**
- Route-based code splitting
- Feature-based package isolation
- Lazy load admin features
- Micro-frontends (future consideration)

---

#### 14. System Design
**Location**: `architecture/system-design/`
**Quick Ref**: [SKILL.md](architecture/system-design/SKILL.md)

High-level architecture decisions, trade-offs, patterns for distributed systems.

**Key patterns:**
- Event-driven architecture
- CQRS for read-heavy operations
- Saga pattern for transactions
- Circuit breaker for resilience

---

### Backend

#### 15. API Design
**Location**: `backend/api-design/`
**Quick Ref**: [SKILL.md](backend/api-design/SKILL.md)

RESTful API patterns, versioning, error handling, pagination, filtering.

**Key patterns:**
- RESTful resource naming
- Cursor-based pagination
- Standard error responses
- API versioning strategies

---

#### 16. Database Optimization
**Location**: `backend/database/`
**Quick Ref**: [SKILL.md](backend/database/SKILL.md)

Supabase patterns, query optimization, indexing, Row Level Security (RLS).

**Key patterns:**
- RLS policies for authorization
- Indexes on foreign keys and filters
- Avoid N+1 queries
- Use views for complex queries

---

#### 17. Node.js Best Practices
**Location**: `backend/nodejs/`
**Quick Ref**: [SKILL.md](backend/nodejs/SKILL.md)

Node.js patterns, async/await, error handling, performance.

**Key patterns:**
- Use async/await over callbacks
- Handle promise rejections
- Stream large data
- Cluster mode for production

---

### Testing

#### 18. Unit Testing (Vitest)
**Location**: `testing/unit-testing/`
**Quick Ref**: [SKILL.md](testing/unit-testing/SKILL.md)

Vitest patterns, testing library, mocking, coverage.

**Key patterns:**
- Test behavior, not implementation
- Mock external dependencies
- Use testing-library for React
- Aim for 80%+ coverage on critical paths

---

#### 19. Integration Testing
**Location**: `testing/integration-testing/`
**Quick Ref**: [SKILL.md](testing/integration-testing/SKILL.md)

API testing, database testing, end-to-end flows within a package.

**Key patterns:**
- Test full feature flows
- Use test database
- Mock external services
- Test error scenarios

---

#### 20. E2E Testing (Playwright)
**Location**: `testing/e2e-testing/`
**Quick Ref**: [SKILL.md](testing/e2e-testing/SKILL.md)

Playwright patterns, page objects, visual regression, CI integration.

**Key patterns:**
- Page object model
- Test user journeys
- Visual regression testing
- Parallel execution in CI

---

## Skills By Category

### 📐 Architecture (5 skills)

| Skill | Impact | Description |
|-------|--------|-------------|
| [data-layer](architecture/data-layer/SKILL.md) | HIGH | Repository pattern, services, provider abstraction |
| [mobile](architecture/mobile/SKILL.md) | MEDIUM | Mobile-first responsive design patterns |
| [project-structure](architecture/project-structure/SKILL.md) | CRITICAL | Monorepo layer architecture, boundaries |
| [scalability](architecture/scalability/SKILL.md) | MEDIUM | Scaling patterns, code splitting, lazy loading |
| [system-design](architecture/system-design/SKILL.md) | HIGH | High-level architecture decisions, trade-offs |

---

### 🖥️ Backend (4 skills)

| Skill | Impact | Description |
|-------|--------|-------------|
| [api-design](backend/api-design/SKILL.md) | HIGH | RESTful patterns, versioning, error handling |
| [database](backend/database/SKILL.md) | HIGH | Supabase optimization, RLS, indexing |
| [nodejs](backend/nodejs/SKILL.md) | HIGH | Node.js best practices, async patterns |
| [serverless](backend/serverless/SKILL.md) | LOW | Serverless patterns, cold starts, limitations |

**Note**: `distributed-systems` and `frameworks` removed (Pulwave uses Supabase managed backend, not self-hosted Node.js servers).

---

### 🌐 Crosscutting (13 skills)

| Skill | Impact | Description |
|-------|--------|-------------|
| [api-docs](crosscutting/api-docs/SKILL.md) | LOW | API documentation, OpenAPI, Swagger |
| [authentication](crosscutting/authentication/SKILL.md) | HIGH | Supabase Auth, JWTs, session management |
| [caching](crosscutting/caching/SKILL.md) | HIGH | Browser caching, CDN, service worker |
| [code-hygiene](crosscutting/code-hygiene/SKILL.md) | MEDIUM | Linting, formatting, code review checklist |
| [debugging](crosscutting/debugging/SKILL.md) | MEDIUM | Debugging tools, techniques, profiling |
| [env-validation](crosscutting/env-validation/SKILL.md) | HIGH | Zod validation, environment variables |
| [error-handling](crosscutting/error-handling/SKILL.md) | HIGH | Error boundaries, logging, monitoring |
| [feature-flags](crosscutting/feature-flags/SKILL.md) | MEDIUM | Feature toggles, gradual rollouts |
| [i18n](crosscutting/i18n/SKILL.md) | MEDIUM | Internationalization, localization, RTL |
| [logging](crosscutting/logging/SKILL.md) | MEDIUM | Structured logging, log levels, aggregation |
| [monitoring](crosscutting/monitoring/SKILL.md) | HIGH | APM, error tracking, performance monitoring |
| [security](crosscutting/security/SKILL.md) | CRITICAL | XSS, CSRF, SQL injection prevention |
| [seo](crosscutting/seo/SKILL.md) | MEDIUM | Meta tags, structured data, performance |

---

### 🚀 DevOps (4 skills)

| Skill | Impact | Description |
|-------|--------|-------------|
| [ci-cd](dev-ops/ci-cd/SKILL.md) | HIGH | GitHub Actions, deployment pipelines |
| [containers](dev-ops/containers/SKILL.md) | MEDIUM | Docker, compose, optimization |
| [monitoring](dev-ops/monitoring/SKILL.md) | HIGH | Uptime monitoring, alerting, incidents |
| [turborepo](dev-ops/turborepo/SKILL.md) | HIGH | Monorepo build orchestration, caching |

**Note**: `iac` removed (Pulwave uses Vercel managed infrastructure, not Terraform/IaC).

---

### 🎨 Front-End (14 skills)

| Skill | Impact | Description |
|-------|--------|-------------|
| [accessibility](front-end/accessibility/SKILL.md) | HIGH | WCAG 2.1 AA, ARIA, keyboard nav |
| [animations](front-end/animations/SKILL.md) | MEDIUM | CSS animations, transitions, performance |
| [component-design](front-end/component-design/SKILL.md) | HIGH | CVA patterns, compound components |
| [data-visualization](front-end/data-visualization/SKILL.md) | MEDIUM | Chart.js, responsive charts |
| [forms](front-end/forms/SKILL.md) | HIGH | Form state, validation, accessibility |
| [frameworks](front-end/frameworks/SKILL.md) | CRITICAL | React 19 patterns, hooks, optimization |
| [layout](front-end/layout/SKILL.md) | MEDIUM | Flexbox, Grid, responsive layouts |
| [performance](front-end/performance/SKILL.md) | CRITICAL | Waterfalls, bundle size, re-renders |
| [pwa](front-end/pwa/SKILL.md) | LOW | Progressive Web Apps, service workers |
| [routing](front-end/routing/SKILL.md) | MEDIUM | React Router, code splitting, guards |
| [seo-frontend](front-end/seo-frontend/SKILL.md) | MEDIUM | Meta tags, structured data, SSR |
| [styling](front-end/styling/SKILL.md) | HIGH | SCSS, BEM, CSS custom properties |
| [testing-frontend](front-end/testing-frontend/SKILL.md) | HIGH | Testing Library, component tests |
| [ux-patterns](front-end/ux-patterns/SKILL.md) | MEDIUM | Loading states, error handling, feedback |

---

### 🧪 Testing (5 skills)

| Skill | Impact | Description |
|-------|--------|-------------|
| [e2e-testing](testing/e2e-testing/SKILL.md) | HIGH | Playwright, page objects, CI integration |
| [integration-testing](testing/integration-testing/SKILL.md) | HIGH | API tests, database tests |
| [performance-testing](testing/performance-testing/SKILL.md) | MEDIUM | Lighthouse, Web Vitals, load testing |
| [unit-testing](testing/unit-testing/SKILL.md) | HIGH | Vitest, mocking, coverage |
| [visual-regression](testing/visual-regression/SKILL.md) | LOW | Screenshot testing, pixel diffing |

---

### 🛠️ Tools (2 skills)

| Skill | Impact | Description |
|-------|--------|-------------|
| [mcp](tools/mcp/SKILL.md) | MEDIUM | Model Context Protocol integration |
| [typescript](tools/typescript/SKILL.md) | HIGH | Strict mode, generics, type inference |

**Category Guide**: [tools/AGENTS.md](tools/AGENTS.md)

---

## External Anthropic Tools (15 skills)

General-purpose Anthropic-provided skills for document generation, design, and automation. Located outside the Pulwave library at [../anthropic/](../anthropic/).

**Full List:** See [../anthropic/AGENTS.md](../anthropic/AGENTS.md) for complete documentation.

**Quick Reference:**
- [algorithmic-art](../anthropic/algorithmic-art/SKILL.md) - Generative art and creative coding
- [brand-guidelines](../anthropic/brand-guidelines/SKILL.md) - Brand consistency
- [canvas-design](../anthropic/canvas-design/SKILL.md) - Canvas-based UI design
- [doc-coauthoring](../anthropic/doc-coauthoring/SKILL.md) - Collaborative documents
- [docx](../anthropic/docx/SKILL.md) - Word document generation
- [frontend-design](../anthropic/frontend-design/SKILL.md) - Frontend design systems
- [internal-comms](../anthropic/internal-comms/SKILL.md) - Communication templates
- [pdf](../anthropic/pdf/SKILL.md) - PDF generation
- [pptx](../anthropic/pptx/SKILL.md) - PowerPoint generation
- [skill-creator](../anthropic/skill-creator/SKILL.md) - Skill creation
- [slack-gif-creator](../anthropic/slack-gif-creator/SKILL.md) - Slack GIF automation
- [theme-factory](../anthropic/theme-factory/SKILL.md) - Theme generation
- [webapp-testing](../anthropic/webapp-testing/SKILL.md) - Web app testing
- [web-artifacts-builder](../anthropic/web-artifacts-builder/SKILL.md) - Web artifacts
- [xlsx](../anthropic/xlsx/SKILL.md) - Excel spreadsheet generation

---

## Usage Scenarios

### Building Features

**Typical skill sequence:**
1. **project-structure** - Decide where code lives
2. **component-design** - Design component API
3. **frameworks** - Implement React patterns
4. **styling** - Style with SCSS + BEM
5. **accessibility** - Ensure WCAG compliance
6. **state-management** - Connect to data layer
7. **testing-frontend** - Write component tests

**Example: Building a data table component**
```typescript
// 1. Location: packages/ui/components/DataTable/
// 2. CVA for variants (component-design)
// 3. React patterns (frameworks)
// 4. SCSS + BEM (styling)
// 5. ARIA labels, keyboard nav (accessibility)
// 6. TanStack Query for data (state-management)
// 7. Testing Library tests (testing-frontend)
```

---

### Performance Optimization

**Typical skill sequence:**
1. **performance** - Identify bottlenecks
2. **profiling** - Profile with DevTools
3. **bundlers** - Analyze bundle size
4. **caching** - Implement caching strategies
5. **performance-testing** - Measure improvements

**Example: Optimizing slow dashboard**
```bash
# 1. Run Lighthouse audit (performance)
# 2. Profile with React DevTools (profiling)
# 3. Check bundle size (bundlers)
# 4. Identify waterfalls (performance)
# 5. Add Promise.all(), dynamic imports (performance)
# 6. Measure with Lighthouse again (performance-testing)
```

---

### Architecture Decisions

**Typical skill sequence:**
1. **system-design** - High-level architecture
2. **project-structure** - Package organization
3. **data-layer** - Data access patterns
4. **scalability** - Plan for growth
5. **security** - Security considerations

**Example: Adding new domain (e.g., billing)**
```
# 1. Design domain boundaries (system-design)
# 2. Create packages/data/domains/billing/ (project-structure)
# 3. Implement Repository, Service, Hooks (data-layer)
# 4. Plan for scaling (scalability)
# 5. Add RLS policies, validation (security)
```

---

### Data Layer Work

**Typical skill sequence:**
1. **data-layer** - Architecture pattern
2. **database** - Design entities, optimize queries
3. **state-management** - Implement TanStack Query hooks
4. **integration-testing** - Test services

**Example: Adding user profile endpoints**
```typescript
// 1. packages/data/domains/profile/ (data-layer)
// 2. Create indexes, RLS, define schema (database)
// 3. useProfile() hook with TanStack Query (state-management)
// 4. Integration tests for service (integration-testing)
```

---

### Testing & Quality

**Typical skill sequence:**
1. **unit-testing** - Write unit tests
2. **integration-testing** - Test features
3. **e2e-testing** - User journey tests
4. **code-quality** - Run linters
5. **visual-regression** - Screenshot tests

**Example: Full test coverage for login feature**
```bash
# 1. Unit tests for validation logic (unit-testing)
# 2. Integration tests for auth service (integration-testing)
# 3. E2E test for login flow (e2e-testing)
# 4. ESLint, Prettier (code-quality)
# 5. Visual test for login form (visual-regression)
```

---

## Status Key

| Icon | Meaning |
|------|---------|
| ✅ | AGENTS.md available with full implementation guide |
| ⚠️ | SKILL.md only, detailed guide coming soon |
| 📝 | Skill exists, needs documentation update |

### Current Status

**Documentation Coverage:**
- ✅ **62/62 skills** have comprehensive AGENTS.md implementation guides (average 656 lines each)
- ✅ **62/62 skills** have SKILL.md quick reference guides
- ✅ **88 reference documents** providing deep-dive human-readable guides

**Pulwave-Specific Skills:** 47 skills across 7 categories
**Anthropic Tools:** 15 external tool skills for document generation and automation

**Note:** Data engineering category removed (v1.2.0) - Pulwave uses Supabase managed backend, not data warehouses/pipelines.

---

## How to Use This Guide

### For AI Agents (Claude)

**When starting a new task:**

1. **Identify task category** - Is it feature building, optimization, testing?
2. **Scan relevant skills** - Use category index or usage scenarios
3. **Read SKILL.md first** - Quick reference to understand when skill applies
4. **Open AGENTS.md for details** - If available, use for full implementation guidance
5. **Apply patterns** - Follow code examples and best practices
6. **Reference by number** - When AGENTS.md exists, reference specific rules (e.g., "apply rule 2.3")

**Example workflow:**
```
Task: "Optimize the slow property list page"

Step 1: Category = Performance optimization
Step 2: Relevant skills = performance, profiling, bundlers
Step 3: Read front-end/performance/SKILL.md (quick scan)
Step 4: Open front-end/performance/AGENTS.md (detailed guide)
Step 5: Apply rule 1.1 (Promise.all), rule 2.2 (dynamic imports)
Step 6: Profile with DevTools (profiling skill)
Step 7: Measure improvements (performance-testing skill)
```

---

### For Developers

**When learning Pulwave patterns:**

1. **Read architecture skills first** - Understand project structure, data layer
2. **Read your domain skills** - Front-end, backend, testing
3. **Refer back during work** - Use as reference during development
4. **Update when patterns change** - Keep skills in sync with codebase

**Skill priority for onboarding:**
1. project-structure (CRITICAL) - Where does code live?
2. frameworks (CRITICAL) - React patterns
3. data-layer (HIGH) - How to fetch data
4. styling (HIGH) - How to style components
5. testing (HIGH) - How to test code

---

## Contributing to Skills

**Adding new skills:**

1. Create skill directory: `.claude/skills/library/[category]/[skill-name]/`
2. Add SKILL.md with YAML frontmatter and quick reference
3. Add AGENTS.md with detailed implementation guide (follow template)
4. Add references/ directory for human-readable deep dives
5. Update this master AGENTS.md with new skill entry
6. Run validation: `npm run lint:skills`

**Updating existing skills:**

1. Edit SKILL.md or AGENTS.md in skill directory
2. Increment version number in YAML frontmatter
3. Add changelog entry in skill README
4. Update last modified date
5. Validate: `npm run lint:skills`

**AGENTS.md template:**

See `.claude/skills/SKILL-vs-AGENTS-pattern.md` for complete template and guidelines.

---

## Roadmap

### Q1 2026 (✅ Complete)
- ✅ All 62 skills documented with AGENTS.md
- ✅ All 62 skills have SKILL.md quick reference
- ✅ 88 reference documents created
- ✅ Comprehensive implementation guides (avg 656 lines)
- ✅ Category guides for all 8 categories

### Q2-Q4 2026 (Planned)
- 📋 Automated skill linting and validation
- 📋 Skill search and discovery functionality
- 📋 Usage analytics and tracking
- 📋 Interactive skill explorer
- 📋 Automated skill generation from codebase patterns
- 📋 Skill versioning and deprecation system
- 📋 Integration with CI/CD for skill validation
- 📋 Skill recommendation engine based on task analysis

---

## Version History

### 1.2.0 (2026-01-18)
- **MAJOR UPDATE:** Removed irrelevant skills after architecture audit
- Removed entire Data category (4 skills: engineering, ml-ops, pipelines, science)
- Removed backend/distributed-systems (no Kafka/Redis clusters)
- Removed backend/frameworks (no Express/Fastify)
- Removed dev-ops/iac (no Terraform/IaC)
- Updated skill count: 62 total (47 Pulwave + 15 Anthropic tools)
- Updated from 8 categories → 7 categories
- Added notes explaining removals

### 1.1.0 (2026-01-17)
- **MAJOR UPDATE:** Corrected skill inventory and documentation status
- Fixed skill count: 69 total (54 Pulwave + 15 Anthropic tools)
- Fixed Data category to reflect actual skills (engineering, ml-ops, pipelines, science)
- Fixed DevOps skills (containers, iac, monitoring, turborepo)
- Fixed state-management location (front-end, not data)
- Updated Tools category with actual skills + Anthropic tools
- Corrected AGENTS.md status: 70/70 complete (not 1/68)
- Updated all broken references

### 1.0.0 (2026-01-16)
- Initial master AGENTS.md
- Category index structure
- Usage scenarios
- Documentation patterns established

---

## Related Documentation

- [Pulwave Architecture Guide](../../CLAUDE.md) - Full monorepo documentation
- [SKILL.md vs AGENTS.md Pattern](../SKILL-vs-AGENTS-pattern.md) - Pattern explanation
- [Skills Investigation Folder](../investigate/README.md) - External skills under review
- [YAML Frontmatter Validation](../../tasks/yaml-frontmatter-validation.md) - Validation results

---

**Last Updated**: 2026-01-18
**Version**: 1.2.0
**Total Skills**: 62 (47 Pulwave + 15 Anthropic tools)
**Maintained By**: Pulwave Engineering

---

**Quick Stats:**

**Pulwave-Specific Skills (47):**
- 📐 Architecture: 5 skills
- 🖥️ Backend: 4 skills
- 🌐 Crosscutting: 13 skills
- 🚀 DevOps: 4 skills
- 🎨 Front-End: 14 skills
- 🧪 Testing: 5 skills
- 🛠️ Tools (Pulwave): 2 skills

**Anthropic Tools (15):**
- Document generation, design, automation

**Documentation Coverage:**
- SKILL.md: 62/62 (100%)
- AGENTS.md: 62/62 (100%)
- Reference docs: 88
- Average AGENTS.md length: 656 lines

**Recent Changes (v1.2.0):**
- Removed Data category (4 skills)
- Removed backend/distributed-systems, backend/frameworks
- Removed dev-ops/iac
- 7 total skills removed after architecture audit
