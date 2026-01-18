# Claude Skills

The official repository for Claude Skills, organized into a production-grade hierarchical library.

## Getting Started

Skills are invoked via `/[skill-name]` or automatically used by agents to perform high-quality audits, transformations, and code generation.

### Skills Library

**Unified Library**: [`.claude/skills/library/`](./library/README.md) - 60 skills across 7 categories (Architecture, Backend, Crosscutting, DevOps, Front-End, Testing, Tools).

**Version**: v1.4.0 (2026-01-18)
- All skills unified in single library structure
- Includes 9 Anthropic tools (document processing, creative utilities)
- Organized by functional category, not by source

## Usage Workflow

**Always follow the Skill -> Implementation Plan -> Execution loop:**

1. **Invoke**: Run a skill audit (e.g., `/library/front-end/performance`).
2. **Review**: Analyze the audit results.
3. **Plan**: Create or update an implementation plan in [`.claude/tasks/`](../tasks/) or artifact directory.
4. **Execute**: Apply fixes incrementally.
5. **Verify**: Re-run the audit to confirm resolution.

## Library Organization

Skills are organized into 7 functional categories:

- **Architecture** (5 skills) - System design, scalability, project structure, data layer
- **Backend** (2 skills) - API design, database
- **Crosscutting** (15 skills) - Security, authentication, i18n, monitoring, error handling
- **DevOps** (3 skills) - CI/CD, monitoring, Turborepo
- **Front-End** (18 skills) - Performance, frameworks, accessibility, styling, forms
- **Testing** (6 skills) - Unit, integration, E2E, performance, visual regression
- **Tools** (11 skills) - TypeScript, MCP, document processing (PDF, DOCX, PPTX, XLSX), creative tools

## Contributing

To add a new skill to the library:
1. Identify the correct category in the `library/` folder.
2. Create a subfolder with a descriptive name.
3. Add a `SKILL.md` file following the template in the [Library README](./library/README.md).
4. Update the main [Skills Index](./library/SKILL.md) to include your new skill.
5. Update the category's `AGENTS.md` file with the new skill details.

## Documentation Pattern

Each skill follows a two-document pattern:
- **SKILL.md** - Quick reference for humans and LLMs (when to use)
- **AGENTS.md** - Comprehensive guide for LLMs (how to implement)

See [SKILL-vs-AGENTS-pattern.md](./SKILL-vs-AGENTS-pattern.md) for detailed documentation pattern.
