# ADR-006: Package Reorganization - Data Layer Elevation

**Status:** Superseded
**Date:** 2026-01-12
**Deciders:** Architecture Team
**Technical Story:** Post-audit package structure optimization

> **⚠️ Historical Document**: This ADR documents a previous reorganization (packages/features/data → packages/data). The structure has since evolved further (packages/data → packages/entities, packages/foundation → packages/shared, packages/ui → packages/shared/ui, packages/patterns → packages/widgets, packages/experience → packages/pages). See current structure in [ARCHITECTURE.md](../ARCHITECTURE.md).

---

## Context and Problem Statement

After completing a comprehensive architecture audit (9.8/10 score), we identified that the data layer's placement within `packages/features/data/` was architecturally suboptimal. Should the data layer remain nested or be elevated to a top-level package?

## Decision Drivers

- Data layer (516 files) is 28% of features package - disproportionately large
- Data is infrastructure, not a business feature
- Dependency hierarchy was inverted (Features containing Infrastructure)
- Industry standards (Turborepo, Nx) use top-level data packages
- Import paths (`@pulwave/data`) suggested top-level but weren't
- Team ownership was ambiguous

## Considered Options

1. **Elevate data to `packages/data/` and move cross-cutting concerns to foundation**
2. Keep current structure (`packages/features/data/`)
3. Create separate `packages/infrastructure/` layer

## Decision Outcome

**Chosen option:** "Elevate data + move cross-cutting to foundation"

### Changes Made

**Data Layer**: `packages/features/data/` → `packages/data/`  
**Security**: `packages/data/.../security/` → `packages/foundation/security/`  
**Analytics**: `packages/data/.../analytics/` → `packages/foundation/analytics/`

### Rationale

**Data Elevation**:
- Data is core infrastructure, not a feature
- Fixes dependency order: Foundation → Data → Features → Experience
- Aligns with industry patterns (Next.js Commerce, Turborepo)
- Import clarity: `@pulwave/data` comes from `packages/data`

**Security to Foundation**:
- Pure utilities (escapeHtml, sanitizeInput, CSRF)
- Zero database operations
- No `ISecurityRepository` - doesn't follow data pattern
- Should be available to all packages

**Analytics to Foundation**:
- Client-side tracking (Google Analytics, Mixpanel)
- No database storage (sends to external providers)
- Cross-cutting observability concern

### Positive Consequences

✅ Clear architectural layers (Foundation → Data → Features → Experience)  
✅ Correct team ownership (Infra owns Foundation+Data, Features own business logic)  
✅ Security/Analytics available to all packages  
✅ Import paths match structure  
✅ Industry-standard organization  

### Negative Consequences

⚠️ One-time migration effort (2-3 hours)  
⚠️ Breaking change for import paths (automated with script)  
⚠️ All developers need to understand new structure  

## Implementation Details

### New Structure

```
packages/
├── foundation/         # Level 0: Pure utilities
│   ├── security/      ⭐ Cross-cutting security
│   ├── analytics/     ⭐ Cross-cutting observability
│   ├── hooks/
│   └── utils/
├── data/              # Level 1: Data access ⭐ ELEVATED
│   ├── domains/
│   ├── providers/
│   └── infrastructure.ts
├── ui/                 # Level 2: Presentational
├── patterns/           # Level 2: Composite
├── features/           # Level 3: Business features
│   ├── admin/
│   ├── auth/
│   └── payments/
└── experience/         # Level 4: Apps
```

### Configuration Updates

**package.json**:
```json
{
  "workspaces": [
    "packages/foundation",
    "packages/data",      // Added
    "packages/ui",
    "packages/patterns",
    "packages/features/*",
    "packages/experience/*"
  ]
}
```

**tsconfig.packages.json**:
```json
{
  "paths": {
    "@pulwave/data": ["packages/data/index.ts"],
    "@pulwave/data/*": ["packages/data/*"],
    "@pulwave/security": ["packages/foundation/security/index.ts"],
    "@pulwave/analytics": ["packages/foundation/analytics/index.ts"]
  }
}
```

### Migration Script

All `@pulwave/features-data` imports automatically updated to `@pulwave/data` using PowerShell:

```powershell
Get-ChildItem -Recurse -Include *.ts,*.tsx | 
  Select-String "@pulwave/features-data" | 
  ForEach-Object { $_.Path } | Get-Unique | 
  ForEach-Object { 
    (Get-Content $_) -replace '@pulwave/features-data', '@pulwave/data' | 
    Set-Content $_ 
  }
```

## Verification

**Structure**:
- ✅ `packages/data/` exists (489 files)
- ✅ `packages/foundation/security/` exists
- ✅ `packages/foundation/analytics/` exists

**Tests**: Data layer tests running to verify functionality

## Alternatives Considered

### Option 2: Keep Current Structure

**Pros**: No migration needed, works currently  
**Cons**: Architecturally incorrect, violates principles

**Rejected because**: Technical debt would accumulate

### Option 3: Infrastructure Package

Create `packages/infrastructure/` for data layer

**Pros**: Explicit infrastructure designation  
**Cons**: Non-standard, adds complexity

**Rejected because**: `packages/data` is industry standard

## Links

- [Package Analysis](file:///C:/Users/andre/.gemini/antigravity/brain/4878ef75-586b-4b74-8a22-86fa5b33b20c/data_layer_package_analysis.md)
- [Implementation Plan](file:///C:/Users/andre/.gemini/antigravity/brain/4878ef75-586b-4b74-8a22-86fa5b33b20c/data_layer_reorganization_plan.md)
- [ADR-001: Provider-Agnostic Data Layer](./001-provider-agnostic-data-layer.md)

---

**Tags:** architecture, organization, data-layer, foundation, refactoring  
**Related ADRs:** ADR-001, ADR-002
