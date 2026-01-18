# Token Migration Guidelines

This document serves as the source of truth for migrating hardcoded values and legacy mixins to the new `styles2` token system.

---

## ⚠️ Critical: Token Import Rules

> [!IMPORTANT]
> **Always use CSS custom properties (`var(--token-name)`) instead of SCSS variables (`$token-name`).**

### ✅ Correct - Use CSS Variables
```scss
@use '@pulwave/foundation/styles/scss/abstracts' as *;

.component {
    font-size: var(--font-size-body-m);
    color: var(--color-text-primary);
    z-index: var(--z-index-dropdown);
}
```

### ❌ Avoid - SCSS Variables from _tokens.scss
```scss
// DON'T import _tokens.scss for direct $variable use
@use '@pulwave/foundation/styles/tokens/generated/_tokens' as *;

.component {
    font-size: $font-size-body-m;  // ❌ Will cause undefined variable errors
}
```

**Why?** The `_tokens.scss` file contains a Sass map, not bare variables. CSS variables are:
- Available at runtime (themeable, responsive)
- Consistent across components
- No import dependency issues


## Typography

### Legacy Mixin Replacement

Replace `@include typography-responsive($category, $size, $weight)` with CSS variables.

| Category | Size | Font Size Token | Line Height Token | Weight Token (Default) |
| :--- | :--- | :--- | :--- | :--- |
| **headline** | `l` | `--font-size-headline-l` | `--line-height-tight` | `--font-weight-bold` |
| | `m` | `--font-size-headline-m` | `--line-height-tight` | `--font-weight-bold` |
| | `s` | `--font-size-headline-s` | `--line-height-tight` | `--font-weight-bold` |
| **title** | `l` | `--font-size-title-l` | `--line-height-tight` | `--font-weight-semi-bold` |
| | `m` | `--font-size-title-m` | `--line-height-tight` | `--font-weight-semi-bold` |
| | `s` | `--font-size-title-s` | `--line-height-tight` | `--font-weight-semi-bold` |
| **body** | `l` | `--font-size-body-l` | `--line-height-normal` | `--font-weight-regular` |
| | `m` | `--font-size-body-m` | `--line-height-normal` | `--font-weight-regular` |
| | `s` | `--font-size-body-s` | `--line-height-normal` | `--font-weight-regular` |
| **label** | `l` | `--font-size-label-l` | `--line-height-normal` | `--font-weight-medium` |
| | `m` | `--font-size-label-m` | `--line-height-normal` | `--font-weight-medium` |
| | `s` | `--font-size-label-s` | `--line-height-normal` | `--font-weight-medium` |
| **caption** | `m` | `--font-size-caption-m` | `--line-height-normal` | `--font-weight-regular` |
| | `s` | `--font-size-caption-s` | `--line-height-normal` | `--font-weight-regular` |

---

## Colors

Replace hex codes, `rgba()`, or legacy `$-` variables with Semantic Color Tokens.

### Brand
| Legacy / Hex (Approx) | Semantic Token | Dark Mode |
| :--- | :--- | :--- |
| Primary Blue | `var(--color-brand-primary)` | `primary.400` |
| Primary Hover | `var(--color-brand-primary-hover)` | `primary.300` |
| Secondary | `var(--color-brand-secondary)` | `secondary.400` |

### Text
| Usage | Token |
| :--- | :--- |
| Default Body Text | `var(--color-text-primary)` |
| Muted / Subtitles | `var(--color-text-secondary)` |
| Disabled Text | `var(--color-text-disabled)` |
| Text on Primary/Dark | `var(--color-text-on-primary)` |

### Surface (Backgrounds)
| Usage | Token |
| :--- | :--- |
| Page Background | `var(--color-surface-default)` |
| Card / Container | `var(--color-surface-default)` / `var(--color-surface-subtle)` |
| Hover State | `var(--color-surface-hover)` |
| Active/Pressed | `var(--color-surface-pressed)` |
| Error Background | `var(--color-surface-error-subtle)` |

### Borders
| Usage | Token |
| :--- | :--- |
| Default Border | `var(--color-border-default)` |
| Subtle/Divider | `var(--color-border-subtle)` |
| Strong/Input | `var(--color-border-strong)` |
| Focus Ring | `var(--color-border-focus)` |
| Error Border | `var(--color-border-error)` |

---

## Spacing & Layout

Replace `px` values with Scale Tokens.

| Pixels | Legacy Name | Token | CSS Variable |
| :--- | :--- | :--- | :--- |
| 0px | `none` | `scale.0` | `0` |
| 1px | - | `scale.0.25` | `1px` (use border width tokens ideally) |
| 2px | - | `scale.0.5` | `0.125rem` |
| 4px | `micro` | `scale.1` | `var(--scale-1)` / `0.25rem` |
| 8px | `tight` | `scale.2` | `var(--scale-2)` / `0.5rem` |
| 12px | `compact` | `scale.3` | `var(--scale-3)` / `0.75rem` |
| 16px | `base` | `scale.4` | `var(--scale-4)` / `1rem` |
| 20px | `comfortable` | `scale.5` | `var(--scale-5)` |
| 24px | `spacious` | `scale.6` | `var(--scale-6)` |
| 32px | `generous` | `scale.8` | `var(--scale-8)` |
| 40px | `section` | `scale.10` | `var(--scale-10)` |
| 48px | `section-large` | `scale.12` | `var(--scale-12)` |
| 64px | - | `scale.16` | `var(--scale-16)` |

**Usage Rule:**
Always use `var(--scale-X)` for margins, padding, width, height, and gap.

---

## Borders & Radius

### Border Radius

> [!IMPORTANT]
> **Default border-radius**: Use `--border-radius-2xl` (1.5rem / 24px) for all components unless design requires otherwise.

| Pixels | Token | CSS Variable |
| :--- | :--- | :--- |
| 0px | `none` | `0` |
| 1px | `2xs` | `var(--border-radius-2xs)` |
| 2px | `xs` | `var(--border-radius-xs)` |
| 4px | `s` | `var(--border-radius-s)` |
| 8px | `m` | `var(--border-radius-m)` |
| 12px | `l` | `var(--border-radius-l)` |
| 16px | `xl` | `var(--border-radius-xl)` |
| 24px | `2xl` | `var(--border-radius-2xl)` **← Default** |
| 50% | `round` | `var(--border-radius-round)` |
| 9999px | `pill` | `var(--border-radius-pill)` |

### Border Width
| Pixels | Token | CSS Variable |
| :--- | :--- | :--- |
| 1px | `2xs` | `var(--border-width-2xs)` (or just `1px` often acceptable for hairline) |
| 2px | `xs` | `var(--border-width-xs)` |
| 4px | `m` | `var(--border-width-m)` |

---

## Shadows & Effects

| Usage | Token |
| :--- | :--- |
| Subtle/Card Shadow | `var(--shadow-s)` |
| Dropdown/Hover Shadow | `var(--shadow-m)` |
| Modal/Overlay Shadow | `var(--shadow-l)` |
| Extra-large Shadow | `var(--shadow-xl)` |
| Inner Shadow | `var(--shadow-inner)` |
| Focus Ring | Use `outline` with `--color-border-focus` |

---

## Legacy to Styles2 Mapping (Audit Findings)

Use this table to map deprecated token names found in components (like Button/Input) to the new system.

| Legacy / Invalid Token | New Semantic Token | Notes |
| :--- | :--- | :--- |
| `--color-primary-500` | `--color-brand-primary` | Base brand color |
| `--color-primary-hover` | `--color-brand-primary-hover` | Hover state |
| `--color-on-primary-default` | `--color-text-on-primary` | Text on primary bg |
| `--color-error-default` | `--color-status-error` | Error state |
| `--color-success-default` | `--color-status-success` | Success state |
| `--color-on-error-default` | `--color-text-on-error` | Text on error bg |
| `--color-surface-container-high` | `--color-surface-strong` | or `--color-surface-subtle` depending on context |
| `--color-surface-container-highest` | `--color-surface-strong` | |
| `--color-on-surface-default` | `--color-text-primary` | Default text color |
| `--color-on-surface-variant` | `--color-text-secondary` | Muted/variant text |
| `--color-outline-default` | `--color-border-default` | Default border |
| `--color-outline-variant` | `--color-border-subtle` | Subtle border |
| `--color-primary-500` | `--color-brand-primary` | |
| `--color-on-surface` | `--color-text-primary` | |
| `--color-surface` | `--color-surface-default` | |
| `--color-surface-container-*` | `--color-surface-subtle` / `--color-surface-strong` | |
| `--color-on-surface` | `--color-text-primary` | |
| `--color-on-surface-variant` | `--color-text-secondary` | |
| `--color-on-surface-muted` | `--color-text-disabled` / `--color-text-secondary` | |
| `--color-border-primary` | `--color-border-default` | |
| `--color-feedback-*` | `--color-status-*` | e.g. `feedback-error` -> `status-error` |
| `--avatar-size-*` (local) | `--avatar-size-*` (global) | Use global tokens (e.g. `3rem`) instead of local overrides if possible |
| `$color-border-neutral-default` | `var(--color-border-default)` | |
| `$color-bg-surface-default` | `var(--color-surface-default)` | |
| `$radius-m` | `var(--radius-m)` | |
| `$shadow-lg` | `var(--shadow-l)` | |
| `$color-text-neutral-*` | `var(--color-text-*)` | |
| `$color-icon-neutral-*` | `var(--color-text-*)` | |
| `$color-border-danger-*` | `var(--color-status-error)` / `var(--color-error-*)` | |
| `color-*-container` (status) | `var(--color-status-*-subtle)` | e.g. `error-container` -> `status-error-subtle` |
| `color-on-*-container` (status) | `var(--color-status-*-text)` | e.g. `on-error-container` -> `status-error-text` |
| `color-*-default` (status) | `var(--color-status-*)` | e.g. `error-default` -> `status-error` |
| `var(--spacing-*)` | `var(--scale-*)` | Spacing now uses scale tokens |
| `color-primary-*` (numbered) | `var(--color-brand-primary-*)` | e.g. `primary-50` -> `brand-primary-subtle` |
| `color-outline-variant` | `var(--color-border-subtle)` | |
| `color-surface-container-low` | `var(--color-surface-subtle)` or `var(--color-surface-disabled)` | |
| `color-surface-container-high` | `var(--color-surface-hover)` | |
| `color-surface-container` | `var(--color-surface-subtle)` | |
| `color-error-container` | `var(--color-status-error-subtle)` | |
| `color-info-container` | `var(--color-status-info-subtle)` | |
| `color-warning-container` | `var(--color-status-warning-subtle)` | |
| `color-primary-container` | `var(--color-brand-primary-subtle)` | |
| `color-bg-*` | `color-surface-*` | |
| `color-text-neutral-*` | `color-text-*` | |
| `color-icon-*` | `color-text-*` | Icons use text colors in new system |
| `--tooltip-*` (local) | `--color-inverse-*` | Tooltips usually use inverse colors |
| `--skeleton-bg` | `--color-surface-subtle` | |
| `--skeleton-shine` | `--color-surface-default` | |
| `bg-primary-subtle` | `primary-100` / `surface-selected` | |
| Hardcoded `px` (e.g. `12px`, `80px`) | `--scale-*` | |
| `--spacing-*` | `--scale-*` | |
| `color-mix(...)` | Use alpha/overlay tokens if possible | Avoid complex dynamic calculations in CSS if tokens exist |
| `--color-overlay-dark` | `--color-overlay-strong` | |
| `--shadow-elevation-3` | `--color-shadow-strong` | |
| `--border-radius-m` | `--border-radius-m` | ✅ Already correct |
| `--border-radius-xl` | `--border-radius-xl` | ✅ Already correct |
| `--border-radius-2xl` | `--border-radius-2xl` | **Default** for components |
| `--border-radius-circle` | `--border-radius-round` | |
| `--spacing-*` | `--scale-*` | Use scale tokens directly |
| Hardcoded `px` (e.g. `32px`) | `--scale-*` | `32px` -> `--scale-8` |
| `--font-size-label-medium` | `--font-size-label-m` | |
| `--font-size-label-large` | `--font-size-label-l` | |
| `--font-size-body-small` | `--font-size-body-s` | |
| `--font-size-body-medium` | `--font-size-body-m` | |
| `--font-size-body-large` | `--font-size-body-l` | |

### Newly Discovered Invalid Tokens (Button, Card, Auth Audit)

| Invalid Token | Correct Token | Component/Context |
| :--- | :--- | :--- |
| `--radius-l/m/s` | `--border-radius-l/m/s` | Card, Button - incorrect prefix |
| `--radius-full` | `--border-radius-pill` | Multiple - deprecated radius name |
| `--ease-out` | `--easing-ease-out` | Card, Button - wrong name |
| `--font-size-label-*` | `--font-size-ui-*` | Button sizes - labels use ui tokens |
| `--color-primary-500` | `--color-brand-primary` | Auth, Shell - use semantic not numbered |
| `--color-primary-200` | `--color-brand-primary-subtle` | Auth - use semantic |
| `--font-family-sans` | `--font-family-base` | Auth - wrong family name |
| `--color-outline-variant` | `--color-border-subtle` | Card - MD3 to semantic |
| `--color-surface-container-low` | `--color-surface-subtle` | Card - MD3 to semantic |
| `--shadow-2/3` | `--shadow-s/m` | Card - use s/m/l naming |
| `--spacing-*` | `--scale-*` | Shell, Payments - use scale tokens |
| `--color-text-muted` | `--color-text-secondary` | Shell - deprecated text color |
| `--color-text-default` | `--color-text-primary` | Shell - deprecated text color |
| `--color-on-surface-default` | `--color-text-primary` | Features - deprecated semantic |
| `--color-on-surface-subtle` | `--color-text-secondary` | Features - deprecated semantic |
| `--color-surface-primary` | `--color-surface-default` | Sidebar - deprecated surface |
| `--border-width-xs` | `--border-width-1` | Admin - deprecated width |
| `--color-neutral-*` | `--color-surface-*` | Admin - deprecated neutral palette |
| `--shadow-3` | `--shadow-m` | Card - use s/m/l naming |

## Migration Checklist

1.  [ ] Identify hardcoded value (e.g. `#1a73e8`, `16px`).
2.  [ ] Find matching token in this file.
3.  [ ] Replace with `var(--token-name)`.
4.  [ ] Verify active state/dark mode behavior (tokens handle this automatically).

