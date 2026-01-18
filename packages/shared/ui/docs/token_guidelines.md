# Token Guidelines & Best Practices

This document serves as the master reference for using design tokens in the Pulwave UI system. It consolidates rules for spacing, sizing, colors, typography, and borders to ensure consistency.

---

## 🎨 Colors

### Brand
| Token | Hex/Value | Usage |
| :--- | :--- | :--- |
| `var(--color-brand-primary)` | `hsl(160, 94%, 27%)` | Primary actions, links, active states |
| `var(--color-brand-primary-hover)` | `hsl(160, 94%, 22%)` | Hover state for primary actions |
| `var(--color-brand-primary-active)` | `hsl(160, 94%, 16%)` | Active/Pressed state |
| `var(--color-brand-primary-subtle)` | `hsl(160, 94%, 95%)` | Backgrounds for selected items, light accents |
| `var(--color-brand-secondary)` | `hsl(45, 88%, 50%)` | Secondary actions, highlights |
| `var(--color-brand-tertiary)` | `hsl(12, 88%, 50%)` | Tertiary accents |

### Text
| Token | Usage |
| :--- | :--- |
| `var(--color-text-primary)` | Main body text, headings |
| `var(--color-text-secondary)` | Subtitles, labels, secondary info |
| `var(--color-text-tertiary)` | Disabled-look but visible text, placeholders |
| `var(--color-text-disabled)` | Truly disabled states |
| `var(--color-text-inverse)` | Text on dark backgrounds (usually white) |
| `var(--color-text-on-primary)` | Text on primary brand background |

### Surface (Backgrounds)
| Token | Usage |
| :--- | :--- |
| `var(--color-surface-default)` | default card background (White / DkGray) |
| `var(--color-surface-subtle)` | Page background (Light Gray / Black) |
| `var(--color-surface-strong)` | Slightly darker/lighter areas (Sidebars, headers) |
| `var(--color-surface-hover)` | Hover state for interactive surfaces |
| `var(--color-surface-pressed)` | Pressed state |
| `var(--color-surface-selected)` | Selected state background |
| `var(--color-surface-inverse)` | Tooltips, Toasts (Dark on Light) |

### Borders
| Token | Usage |
| :--- | :--- |
| `var(--color-border-default)` | Standard borders for inputs, cards |
| `var(--color-border-subtle)` | Dividers, hairines |
| `var(--color-border-strong)` | Stronger definition |
| `var(--color-border-hover)` | Hover state for inputs |
| `var(--color-border-focus)` | Focus state for inputs |
| `var(--color-border-error)` | Error state |

### Status
All status colors usually have `default`, `subtle` (bg), `text`, and `hover` variants.

| Status | Tokens |
| :--- | :--- |
| **Error** | `var(--color-status-error)` (Red) |
| **Success** | `var(--color-status-success)` (Green) |
| **Warning** | `var(--color-status-warning)` (Yellow/Orange) |
| **Info** | `var(--color-status-info)` (Blue) |

---

## 🔠 Typography

### Font Family
| Token | Value | Usage |
| :--- | :--- | :--- |
| `var(--font-family-base)` | Roboto... | Body text, UI elements |
| `var(--font-family-heading)` | Montserrat... | Headlines, Titles |
| `var(--font-family-mono)` | Courier New... | Code snippets, IDs |

### Font Sizes
| Token | Value (px) | Usage |
| :--- | :--- | :--- |
| `var(--font-size-body-s)` | 14px | Small body text, standard UI |
| `var(--font-size-body-m)` | 16px | Standard body text |
| `var(--font-size-body-l)` | 18px | Large body text |
| `var(--font-size-label-s)` | 13px | Small labels |
| `var(--font-size-label-m)` | 14px | Standard labels |
| `var(--font-size-title-s)` | 18px | Small functional titles |
| `var(--font-size-title-m)` | 20px | Medium titles |
| `var(--font-size-title-l)` | 24px | Large titles |
| `var(--font-size-title-xl)` | 32px | Extra large titles |
| `var(--font-size-display-*)` | 40px+ | Marketing headers |

### Font Weights
| Token | Value | usage |
| :--- | :--- | :--- |
| `var(--font-weight-regular)` | 400 | Standard text |
| `var(--font-weight-medium)` | 500 | Labels, specific highlights |
| `var(--font-weight-semi-bold)` | 600 | Titles, buttons |
| `var(--font-weight-bold)` | 700 | Emphasized titles |

---

## 📏 Spacing & Sizing

> **Core Rule:** Use `scale` tokens for **everything** numeric related to the 4px grid.

### Scale Tokens
| Token | Value |
| :--- | :--- |
| `var(--scale-0)` | 0 |
| `var(--scale-1)` | 4px (0.25rem) |
| `var(--scale-2)` | 8px (0.5rem) |
| `var(--scale-3)` | 12px (0.75rem) |
| `var(--scale-4)` | 16px (1rem) |
| `var(--scale-5)` | 20px (1.25rem) |
| `var(--scale-6)` | 24px (1.5rem) |
| `var(--scale-8)` | 32px |
| `var(--scale-10)` | 40px |
| `var(--scale-12)` | 48px |
| `var(--scale-16)` | 64px |
| ... | Up to `scale-100` |

### Layout Widths
| Token | Value | Usage |
| :--- | :--- | :--- |
| `var(--container-s)` | 40rem | Small form/modal |
| `var(--container-m)` | 48rem | Standard content column |
| `var(--container-l)` | 64rem | |
| `var(--container-xl)` | 80rem | |
| `var(--container-2xl)` | 120rem | Max width for full pages |

---

## 📦 Borders & Radius

### Border Radius
> [!IMPORTANT]
> **Default Radius**: Use `var(--border-radius-2xl)` (24px) for **all** main containers, panels, and cards unless the design explicitly demands otherwise.

| Token | Value | Usage |
| :--- | :--- | :--- |
| `var(--border-radius-s)` | 4px | Inner elements, checks |
| `var(--border-radius-m)` | 8px | Standard inputs, small cards |
| `var(--border-radius-l)` | 12px | Medium cards |
| `var(--border-radius-xl)` | 16px | Large cards |
| `var(--border-radius-2xl)` | 24px | **Default** for Panels/Containers |
| `var(--border-radius-round)`| 50% | Avatars, circular actions |
| `var(--border-radius-pill)` | 9999px | Pills, Tags, Buttons |

### Border Width
| Token | Value | Usage |
| :--- | :--- | :--- |
| `1px` or `var(--border-width-2xs)` | 1px | Standard border |
| `var(--border-width-xs)` | 2px | Focus rings, active states |

---

## 🌑 Shadows (Elevation)

| Token | Usage |
| :--- | :--- |
| `var(--shadow-s)` / `elevation-card` | Subtle lift (Cards) |
| `var(--shadow-m)` / `elevation-floating` | Dropdowns, Hover states |
| `var(--shadow-l)` / `elevation-modal` | Modals, Dialogs |
| `var(--shadow-xl)` / `elevation-popover` | Popovers, Tooltips |

---

## 🚫 Migration Cheat Sheet (Legacy -> New)

| Legacy | **New Token** |
| :--- | :--- |
| `--color-primary-500` | `var(--color-brand-primary)` |
| `--color-surface` | `var(--color-surface-default)` |
| `--spacing-*` (numeric) | `var(--scale-*)` |
| `--radius-*` | `var(--border-radius-*)` |
| `z-index: [number]` | `var(--z-index-*)` |
| `--font-weight-semibold` | `var(--font-weight-semi-bold)` |
| `16px` | `var(--scale-4)` |

---

## 🛠️ Automated Migration

To automatically migrate legacy variables in SCSS files, use the fix script:

```bash
node packages/foundation/scripts/styles/fix-styles.cjs
```

> [!TIP]
> This script handles common mappings for spacing, radius, colors, and shadows. Always review changes after running.
