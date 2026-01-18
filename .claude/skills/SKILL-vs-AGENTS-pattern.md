# SKILL.md vs AGENTS.md Pattern Analysis

**Date**: 2026-01-16
**Source**: Vercel agent-skills repository
**Reference**: react-best-practices skill

---

## Executive Summary

Vercel's agent-skills repository uses a **two-document pattern** for each skill:

1. **SKILL.md** - Quick reference for humans and LLMs to decide *when* to use the skill
2. **AGENTS.md** - Comprehensive guide for LLMs to *follow* when implementing the skill

This pattern optimizes for both human readability and AI consumption.

---

## Document Comparison

| Aspect | SKILL.md | AGENTS.md |
|--------|----------|-----------|
| **Purpose** | Entry point & quick reference | Complete implementation guide |
| **Audience** | Humans + LLMs (decision-making) | AI agents + LLMs (implementation) |
| **Size** | ~5 KB | ~64 KB |
| **Content Depth** | High-level overview | Full detailed rules |
| **Code Examples** | Minimal or none | Complete (incorrect vs correct) |
| **Rule Format** | Bullet list with brief descriptions | Numbered sections with full explanations |
| **Performance Metrics** | General (e.g., "improve LCP") | Specific (e.g., "reduces TTI by 40%") |
| **When Used** | Skill discovery & selection | Active code generation/review |

---

## SKILL.md Structure

### Template

```yaml
---
name: skill-name
description: Brief description of what this skill covers
license: MIT
metadata:
  author: organization-name
  version: "1.0.0"
---

# Skill Title

Brief tagline or mission statement.

## When to Apply

- Specific scenario 1
- Specific scenario 2
- Specific scenario 3

## Rule Categories by Priority

| Category | Impact | Rules |
|----------|--------|-------|
| Category 1 | CRITICAL | 5 |
| Category 2 | HIGH | 7 |
| Category 3 | MEDIUM | 12 |

## Quick Reference

### 1. Category Name (IMPACT LEVEL)
- rule-id-1 - Brief one-line description
- rule-id-2 - Brief one-line description
- rule-id-3 - Brief one-line description

### 2. Next Category (IMPACT LEVEL)
- rule-id-4 - Brief one-line description
- rule-id-5 - Brief one-line description

## Full Compiled Document

For the complete guide with all rules expanded: `AGENTS.md`

## Additional Resources

- External documentation links
- Related skills
- Further reading
```

### Key Characteristics

1. **YAML Frontmatter**: Structured metadata for tooling
2. **Quick Scanability**: Table of contents with impact levels
3. **Rule IDs**: Consistent naming (prefix-topic.md)
4. **Pointer to AGENTS.md**: Explicit reference to detailed guide
5. **Concise**: ~5KB, readable in 2-3 minutes

---

## AGENTS.md Structure

### Template

```markdown
# Skill Title

**Version 1.0.0**
Author/Organization
Date

> **Note:**
> This document is mainly for agents and LLMs to follow when [task description].
> Prompts should reference specific sections or rules by number for targeted guidance.

## Abstract

Comprehensive [domain] guide for [technology], designed for AI agents and LLMs.
Contains [N]+ rules across [M] categories, prioritized by performance impact...

## Table of Contents

1. [Category Name](#1-category-name) (IMPACT: CRITICAL)
   1.1 [Rule Name](#11-rule-name)
   1.2 [Rule Name](#12-rule-name)
2. [Next Category](#2-next-category) (IMPACT: HIGH)
   2.1 [Rule Name](#21-rule-name)
   ...

## 1. Category Name

**Impact: CRITICAL**

[Category description explaining why this matters and the scale of impact]

### 1.1 Rule Name

**Impact: HIGH** ([specific metric/benefit])

[Detailed explanation of the rule, why it matters, and the technical reasoning]

**Incorrect: [description of what's wrong]**

```typescript
// Bad code example that violates the rule
// Includes comments explaining WHY this is problematic
```

**Correct: [description of what's right]**

```typescript
// Good code example that follows the rule
// Includes comments explaining WHY this is better
```

**Metrics**: [Specific performance improvements or benefits]

**When to apply**: [Specific scenarios where this rule matters most]

**Exceptions**: [Rare cases where you might not follow this rule]

---

[Repeat for all rules...]
```

### Key Characteristics

1. **LLM-Optimized Header**: Explicitly states it's for agents
2. **Numbered Sections**: Easy reference (e.g., "follow rule 2.3")
3. **Complete Code Examples**: Always shows incorrect AND correct
4. **Detailed Explanations**: Full context, not just the rule
5. **Specific Metrics**: Quantified benefits when possible
6. **Structured Format**: Consistent pattern for parsing
7. **Comprehensive**: 10-15x larger than SKILL.md

---

## The Relationship

```
┌─────────────┐
│  SKILL.md   │ ← User/LLM browses skills library
└──────┬──────┘
       │ "I need this skill"
       ↓
┌─────────────┐
│ AGENTS.md   │ ← LLM applies specific rules during implementation
└─────────────┘
```

### Workflow

1. **Discovery**: LLM reads SKILL.md to understand if skill applies
2. **Decision**: Quick reference helps decide which rules are relevant
3. **Implementation**: LLM opens AGENTS.md for detailed guidance
4. **Application**: LLM follows numbered rules with full code examples
5. **Verification**: LLM checks against incorrect examples

### Why Two Documents?

**SKILL.md Benefits:**
- Fast loading (5KB vs 64KB)
- Easy scanning for humans
- Good for skill discovery
- Low token usage for decision-making

**AGENTS.md Benefits:**
- Complete implementation details
- Consistent code examples
- LLM can reference specific sections
- No need to fetch external docs
- Self-contained guidance

---

## Implementation for Pulwave

### Current State

Our skills currently have:
- ✅ SKILL.md with YAML frontmatter
- ✅ Quick reference sections
- ⚠️ Reference to `references/` directory for details
- ❌ No AGENTS.md files
- ❌ External reference files must be loaded separately

### Gaps

1. **No self-contained implementation guide** - LLMs must read multiple files
2. **Limited code examples** - SKILL.md has minimal examples
3. **Inconsistent detail** - Some references/ files missing or incomplete
4. **Higher token cost** - Must load multiple files to get full context

### Proposed Changes

#### Phase 1: Create Category AGENTS.md Files

For each major category, create a compiled AGENTS.md:

```
.claude/skills/library/
├── front-end/
│   ├── AGENTS.md          # ← Compile all front-end skills
│   ├── performance/
│   │   ├── SKILL.md       # ← Keep as-is (quick ref)
│   │   ├── AGENTS.md      # ← NEW (detailed guide)
│   │   └── references/    # ← Keep for human reading
│   ├── frameworks/
│   │   ├── SKILL.md
│   │   ├── AGENTS.md      # ← NEW
│   │   └── references/
│   └── ...
├── backend/
│   ├── AGENTS.md          # ← Compile all backend skills
│   └── ...
└── AGENTS.md              # ← ROOT: Compile ALL skills
```

#### Phase 2: Update SKILL.md References

Change from:
```markdown
## Reference Documentation

Guide in `references/performance.md`:
- Topic 1
- Topic 2
```

To:
```markdown
## Full Compiled Document

For the complete guide with all rules expanded: `AGENTS.md`

## Additional Resources

Human-readable guides in `references/`:
- `performance.md` - Deep dive into performance optimization
- `bundle-size.md` - Bundle analysis strategies
```

#### Phase 3: Populate AGENTS.md

For each skill, create AGENTS.md with:

1. **Extract content from references/** - Compile all reference docs
2. **Add complete code examples** - Show incorrect vs correct for every rule
3. **Add specific metrics** - Quantify benefits where possible
4. **Number all rules** - Use hierarchical numbering (1.1, 1.2, etc.)
5. **Add LLM-optimized header** - State it's for agents
6. **Consistent format** - Follow Vercel template structure

---

## Template for Our AGENTS.md

```markdown
# [Skill Name]

**Version 1.0.0**
Pulwave Engineering
2026-01-16

> **Note:**
> This document is designed for AI agents and LLMs working on the Pulwave codebase.
> Reference specific sections by number (e.g., "follow rule 2.3") for targeted guidance.

## Abstract

Comprehensive guide for [domain/technology] in Pulwave's [stack description].
Contains [N] rules across [M] categories...

**Tech Stack Context:**
- React 19 + TypeScript
- Vite 7 + Turborepo 2.7
- TanStack Query 5 (server state)
- Supabase (database)
- SCSS + BEM + CSS Custom Properties

## Table of Contents

1. [Category 1](#1-category-1) (IMPACT: CRITICAL)
2. [Category 2](#2-category-2) (IMPACT: HIGH)
...

## 1. Category Name

**Impact: [CRITICAL/HIGH/MEDIUM/LOW]**

[Category description and why it matters in Pulwave context]

### 1.1 Rule Name

**Impact: [LEVEL]** ([specific benefit])

[Detailed explanation with Pulwave-specific context]

**Incorrect: [what's wrong]**

```typescript
// Bad example from Pulwave codebase
// Explain WHY this is problematic in our architecture
```

**Correct: [what's right]**

```typescript
// Good example following Pulwave patterns
// Explain WHY this aligns with our architecture
```

**Pulwave-Specific Notes:**
- How this relates to our layer architecture
- Which packages this applies to
- Any exceptions for our codebase

---

[Continue for all rules...]

## Appendix A: Quick Reference

[Table or list of all rules with IDs for quick lookup]

## Appendix B: Related Skills

- [Other Pulwave skills that relate to this one]

## Appendix C: Further Reading

- Pulwave Architecture Guide (`.claude/CLAUDE.md`)
- Design tokens documentation
- [Other internal docs]
```

---

## Benefits for Pulwave

### For AI Agents (Claude)

1. **Single file loading** - No need to read 5+ files for one skill
2. **Complete examples** - All code examples in one place
3. **Numbered references** - Can ask Claude to "follow rule 2.3"
4. **Context-aware** - Examples use Pulwave's actual stack
5. **Lower token cost** - One 64KB file vs multiple smaller files

### For Developers

1. **Quick reference** - SKILL.md still provides fast overview
2. **Deep dive available** - AGENTS.md for comprehensive understanding
3. **Consistent format** - All skills follow same structure
4. **Self-documenting** - Code examples show both ways
5. **Single source of truth** - AGENTS.md is always up-to-date

### For Maintenance

1. **Easier updates** - Update AGENTS.md once, not multiple files
2. **Version control** - Clear versioning in frontmatter
3. **Validation** - Can lint/validate AGENTS.md structure
4. **Automation** - Can generate AGENTS.md from rules/ like Vercel does

---

## Implementation Priority

### High Priority (Create First)

1. **front-end/performance/AGENTS.md** - Most used, highest impact
2. **front-end/frameworks/AGENTS.md** - React patterns, daily use
3. **architecture/project-structure/AGENTS.md** - Critical for codebase
4. **data/state-management/AGENTS.md** - TanStack Query patterns

### Medium Priority

5. **crosscutting/error-handling/AGENTS.md** - Affects all layers
6. **testing/unit-testing/AGENTS.md** - Quality assurance
7. **backend/api-design/AGENTS.md** - API patterns

### Category Compilations

8. **front-end/AGENTS.md** - Compile all 14 front-end skills
9. **architecture/AGENTS.md** - Compile all 5 architecture skills
10. **library/AGENTS.md** - ROOT: Compile all 68 skills

---

## Example: Performance Skill Transformation

### Current Structure (SKILL.md only)

```
front-end/performance/
├── SKILL.md (2 KB)
└── references/
    ├── react-optimization.md (?)
    ├── bundle-size.md (?)
    └── server-rendering.md (?)
```

**Problem**: LLM must read 4 files, references may be incomplete

### New Structure (SKILL.md + AGENTS.md)

```
front-end/performance/
├── SKILL.md (2 KB) ← Quick reference
├── AGENTS.md (40-60 KB) ← Complete guide
└── references/ ← Keep for human reading
    ├── react-optimization.md
    ├── bundle-size.md
    └── server-rendering.md
```

**Benefit**: LLM reads 2 files max (SKILL.md + AGENTS.md), gets complete guidance

---

## Next Steps

1. ✅ Document pattern analysis (this file)
2. ⬜ Create template for Pulwave AGENTS.md
3. ⬜ Implement first example: `front-end/performance/AGENTS.md`
4. ⬜ Get user approval on format
5. ⬜ Implement remaining high-priority AGENTS.md files
6. ⬜ Create category compilations
7. ⬜ Create root library/AGENTS.md
8. ⬜ Update all SKILL.md files to reference AGENTS.md
9. ⬜ Validate all AGENTS.md files with linter
10. ⬜ Update `.claude/tasks/yaml-frontmatter-validation.md`

---

**Status**: ⚠️ Analysis complete, implementation pending user approval
**Last Updated**: 2026-01-16
