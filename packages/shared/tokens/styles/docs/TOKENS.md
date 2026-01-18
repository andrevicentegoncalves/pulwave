# Pulwave Design Tokens

> **960+ tokens** | W3C DTCG format | Multi-tenant theming

## Quick Start

```bash
npm run tokens           # Build tokens
npm run tokens:watch     # Watch mode
npm run tokens:validate  # Validate references
npm run tokens:sync      # Export for Figma
```

---

## Architecture

```
Primitives (JSON) → Semantics (JSON) → Component (_tokens.scss) → CSS Variables
```

---

## Naming Conventions

### Colors

| Pattern | Example |
|---------|---------|
| `color.{name}.{weight}` | `color.primary.500` |
| `color.{context}.{variant}` | `color.text.primary` |
| `color.status.{state}` | `color.status.success` |

### Spacing

| Pattern | Example |
|---------|---------|
| `scale.{n}` | `scale.4` (16px) |
| `spacing.{name}` | `spacing.base` |

### Typography

| Pattern | Example |
|---------|---------|
| `fontSize.{category}.{size}` | `fontSize.title.xl` |
| `fontWeight.{name}` | `fontWeight.bold` |

---

## File Structure

```
tokens/source/
├── primitives/
│   ├── colors/          (brand-scales, neutral, status, base)
│   ├── typography/      (size, weight, family, spacing, style)
│   ├── spacing/         (scale)
│   ├── effects/         (shadow, blur, border)
│   ├── motion/          (timing)
│   └── ...
├── semantic/
│   ├── colors/          (semantic-colors)
│   ├── typography/      (presets)
│   ├── layout/          (spacing, dense)
│   └── ...
└── themes/
    ├── default.json
    ├── acme.json
    └── high-contrast.json
```

---

## Dark Mode

Use `$extensions.mode.dark`:

```json
{
  "text": {
    "primary": {
      "$value": "{color.neutral.900}",
      "$extensions": {
        "mode": { "dark": "{color.neutral.50}" }
      }
    }
  }
}
```

---

## Component Tokens

Components define local CSS variables in `_tokens.scss`:

```scss
.button {
    --btn-main: var(--color-brand-primary);
    --btn-padding-x: var(--spacing-6);
}
```

---

## Multi-Tenant Theming

```js
document.documentElement.dataset.tenant = 'acme';
document.documentElement.dataset.theme = 'dark';
```

---

## Figma Sync

```bash
npm run tokens:sync                     # File export
npm run tokens:sync -- --adapter=studio # Tokens Studio
npm run tokens:sync -- --adapter=figma  # Figma Variables
```
