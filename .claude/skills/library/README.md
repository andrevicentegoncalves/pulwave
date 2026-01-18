# Skills Library Organization

The `library/` folder contains production-ready skills organized into 7 clear top-level domains.

## Structure Overview

```
library/
├── architecture/       # System design, scalability, project structure, data layer
├── backend/            # API design, database
├── crosscutting/       # Security, authentication, i18n, monitoring, error handling
├── dev-ops/            # CI/CD, deployment, monitoring, Turborepo
├── front-end/          # Performance, frameworks, accessibility, styling, forms
├── testing/            # Unit, integration, E2E, performance, visual regression
└── tools/              # TypeScript, MCP, document processing, creative utilities
```

## Domain Principles

### 1. Architecture (5 skills)
High-level system design and structural patterns.
- **Key Skills**: [System Design](./architecture/system-design/SKILL.md), [Scalability](./architecture/scalability/SKILL.md), [Project Structure](./architecture/project-structure/SKILL.md), [Data Layer](./architecture/data-layer/SKILL.md)

### 2. Backend (2 skills)
Server-side implementation patterns.
- **Key Skills**: [API Design](./backend/api-design/SKILL.md), [Database](./backend/database/SKILL.md)

### 3. Crosscutting (15 skills)
Quality and operational concerns that span all layers.
- **Key Skills**: [Security](./crosscutting/security/SKILL.md), [Authentication](./crosscutting/authentication/SKILL.md), [Code Hygiene](./crosscutting/code-hygiene/SKILL.md), [i18n](./crosscutting/i18n/SKILL.md), [Error Handling](./crosscutting/error-handling/SKILL.md)

### 4. DevOps (3 skills)
Automation, deployment, and operational excellence.
- **Key Skills**: [CI/CD](./dev-ops/ci-cd/SKILL.md), [Monitoring](./dev-ops/monitoring/SKILL.md), [Turborepo](./dev-ops/turborepo/SKILL.md)

### 5. Front-End (18 skills)
Client-side implementation, UI quality, and user experience.
- **Key Skills**: [Performance](./front-end/performance/SKILL.md), [Frameworks](./front-end/frameworks/SKILL.md), [Accessibility](./front-end/accessibility/SKILL.md), [Component Design](./front-end/component-design/SKILL.md), [Styling](./front-end/styling/SKILL.md)

### 6. Testing (6 skills)
Comprehensive quality assurance and test automation.
- **Key Skills**: [Unit Testing](./testing/unit-testing/SKILL.md), [Integration Testing](./testing/integration-testing/SKILL.md), [E2E Testing](./testing/e2e-testing/SKILL.md)

### 7. Tools (11 skills)
Development tools, document processing, and creative utilities.
- **Key Skills**: [TypeScript](./tools/typescript/SKILL.md), [MCP](./tools/mcp/SKILL.md)
- **Document Processing**: PDF, DOCX, PPTX, XLSX generation
- **Workflow**: Doc coauthoring, skill creation, web artifacts
- **Creative**: Algorithmic art, GIF creation

## Skill Documentation Pattern

Each skill folder must contain a `SKILL.md` file with the following frontmatter:

```yaml
---
name: skill-name
description: Concisely describe the purpose
version: 1.0.0
tags: [Relevant, Tags]
---
```

### Two-Document Pattern

Skills follow a two-document structure:
- **SKILL.md** - Quick reference (2-5 KB) for skill discovery and decision-making
- **AGENTS.md** - Comprehensive guide (20-60 KB) for AI agents with complete code examples

Use the `references/` subfolder for detailed checklists, regex patterns, or deep-dive documentation for human readers.

## Version History

### v1.4.0 (2026-01-18) - Library Integration
- Integrated all Anthropic tools into unified library structure
- Added 16 skills (9 Anthropic tools + 4 design tools + 1 React patterns + 2 communication tools)
- Total skills: 44 → 60 (36% expansion)
- Tools category: 2 → 11 (450% expansion)
- Front-End category: 14 → 18 (29% expansion)
- No distinction between "Pulwave" and "Anthropic" skills - all organized by function

### v1.3.0 (2026-01-18) - Architecture Refinement
- Removed 3 misaligned skills (nodejs, serverless, containers)
- Total skills: 47 → 44

### v1.2.0 (2026-01-18) - Data Category Removal
- Removed data/ category (7 skills: engineering, ml-ops, pipelines, science, distributed-systems, frameworks, iac)
- Total skills: 54 → 47

### v1.0.0 (2026-01-16) - Initial Release
- 54 Pulwave-specific skills across 8 categories
