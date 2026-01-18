# Styles2: Modern Token Architecture

> **Status:** Production Ready ✅  
> **Tokens:** 960+ (primitives + semantics + themes)

---

## Quick Start

```bash
npm run tokens           # Build all tokens
npm run tokens:watch     # Watch mode
npm run tokens:validate  # Validate references
npm run tokens:themes    # Generate themes (default, acme, high-contrast)
npm run tokens:sync      # Export for Figma
```

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                        BIDIRECTIONAL SYNC                          │
│                                                                     │
│   Figma Tokens Studio  ←──────────────────────→  JSON Files        │
│   (Design source)           W3C DTCG Format      (Code source)     │
└──────────────────────────────┬──────────────────────────────────────┘
                               ↓
┌─────────────────────────────────────────────────────────────────────┐
│                        BUILD OUTPUTS                                │
│                                                                     │
│   tokens.css     → Browser runtime (CSS variables)                 │
│   tokens.ts      → React Native / TypeScript access                │
│   _tokens.scss   → SCSS compile-time (optional)                    │
│   tokens.json    → Figma Tokens Studio import                      │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Folder Structure

```
styles2/
├── tokens/
│   ├── source/                  # 👈 EDIT HERE
│   │   ├── primitives/
│   │   │   ├── colors/          # brand-scales, neutral, status, base
│   │   │   ├── typography/      # size, weight, family, spacing, style
│   │   │   ├── spacing/scale.json
│   │   │   ├── effects/         # shadow, blur, border
│   │   │   ├── motion/timing.json
│   │   │   ├── layout/containers.json
│   │   │   ├── breakpoints/responsive.json
│   │   │   └── interaction/focus.json
│   │   ├── semantic/
│   │   │   ├── colors/semantic-colors.json
│   │   │   ├── typography/presets.json
│   │   │   ├── layout/         # spacing, dense
│   │   │   └── ...
│   │   └── themes/
│   │       ├── default.json
│   │       ├── acme.json
│   │       └── high-contrast.json
│   │
│   ├── generated/               # 👈 AUTO-GENERATED
│   │   ├── tokens.css
│   │   ├── tokens.ts
│   │   ├── _tokens.scss
│   │   └── tokens.json
│   │
│   └── sync/                    # 👈 FIGMA EXPORTS
│       ├── tokens-export.json
│       ├── tokens-studio.json
│       └── figma-variables.json
│
└── scripts/
    ├── build-tokens.cjs         # Main build
    ├── build-hsl-themes.cjs     # Theme generation
    └── sync-tokens.cjs          # Figma sync (3 adapters)
```

---

## Token Format (W3C DTCG)

```json
{
  "color": {
    "primary": {
      "500": { "$value": "#10b981", "$type": "color" }
    }
  }
}
```

Dark mode via `$extensions`:

```json
{
  "color": {
    "text": {
      "primary": {
        "$value": "{color.neutral.900}",
        "$extensions": {
          "mode": { "dark": "{color.neutral.50}" }
        }
      }
    }
  }
}
```

---

## Usage

### CSS (Web)

```css
.button {
  background: var(--color-brand-primary);
  padding: var(--scale-4);
  border-radius: var(--border-radius-m);
}
```

### TypeScript (React Native)

```tsx
import { tokens } from '@pulwave/foundation/styles/tokens/generated/tokens';

const primary = tokens['color.primary.500'];
```

---

## Figma Sync

```bash
# Default: file export
npm run tokens:sync

# Tokens Studio format
npm run tokens:sync -- --adapter=studio

# Figma Variables API format
npm run tokens:sync -- --adapter=figma
```

---

## Themes

| Theme | File | Purpose |
|-------|------|---------|
| default | `themes/default.json` | Primary brand |
| acme | `themes/acme.json` | Tenant example |
| high-contrast | `themes/high-contrast.json` | WCAG AAA accessibility |

Apply via data attribute:

```html
<html data-tenant="default" data-theme="light">
```

---

## Current Status

| Category | Files | Status |
|----------|-------|--------|
| Primitives | 23 | ✅ |
| Semantics | 6 | ✅ |
| Themes | 3 | ✅ |
| **Total Tokens** | **960+** | ✅ |
