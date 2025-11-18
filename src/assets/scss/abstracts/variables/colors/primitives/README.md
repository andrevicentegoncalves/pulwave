# Color Primitives System - Technical Overview

## System Purpose

A mathematically-derived, perceptually uniform color system that generates HSL colors from composable primitives, enabling multi-theme support with built-in accessibility validation.

---

## Architecture

### Three-Layer System

```
Layer 1: Base Lightness (common)
    ↓
Layer 2: Color Primitives (theme-specific)
    ↓
Layer 3: Factory Functions (generation)
    ↓
Public API: get-color()
```

### Layer 1: Base Lightness Scales

**Location:** `variables/colors/base.scss`

**Purpose:** Universal lightness values shared across all themes

**Components:**
- `$base-lightness` - 12-weight scale (0-950) for vibrant colors
- `$neutral-lightness` - 12-weight scale optimized for text contrast
- `$all-weights` - List of valid weight values
- `$weight-steps` - Semantic step sizes

**Mathematical Foundation:**
```
L(w) = L_max - (L_max - L_min) × (w/1000)^γ

Where:
  L_max = 100% (white)
  L_min = 5% (darkest, preserves depth)
  γ = 2.0 (perceptual uniformity exponent)
```

**Weight Scale:**
- 0-100: Backgrounds (100%, 98%, 95%)
- 200-400: Borders, disabled states (88%, 76%, 62%)
- 500: Brand color base - perceptual center (50%)
- 600-700: Interactive states (40%, 30%)
- 800-950: Text, emphasis (20%, 12%, 5%)

**Neutral Scale Difference:**
- More granular in light range (99.5%, 99%, 98.5%, 98%, etc.)
- Optimized for text contrast ratios
- Compressed dark range for text hierarchy

---

### Layer 2: Color Primitives

**Location:** `variables/colors/primitives.scss`

**Purpose:** Theme-specific color definitions

**Structure:**
```scss
// primitives.scss forwards all themes:
@forward 'primitives/default' as default-*;
@forward 'primitives/flygroups' as flygroups-*;
@forward 'primitives/base' as base-*;
```

**Each Theme File Contains:**

1. **Color Config** (`$theme-color-config`)
   - Maps family names to hue/saturation pairs
   - Defines available color families
   - HSL color space (hue: 0-360°, saturation: 0-100%)

2. **Custom Lightness** (`$theme-custom-lightness`)
   - Optional per-family lightness overrides
   - Overrides base lightness for specific weights
   - Can define complete custom scales

**Color Families:**
- Brand: `primary`, `secondary`, `tertiary`
- Feedback: `success`, `warning`, `info`, `danger`
- System: `neutral`, `accent`
- Custom: Domain-specific (e.g., `tier-miles`)

---

### Layer 3: Factory Functions

**Location:** `variables/colors/factory.scss`

**Purpose:** Generate colors from primitives and provide utilities

**Core Function:**
```scss
create-color($color-config, $custom-lightness, $base-lightness, $family, $weight)
  → Retrieves hue/saturation from config
  → Resolves lightness (custom → base → error)
  → Returns hsl(hue, saturation, lightness)
```

**Resolution Order:**
1. Check `$custom-lightness[$family][$weight]`
2. Fallback to `$base-lightness[$weight]`
3. Throw error if neither exists

**Function Categories:**

1. **Color Manipulation**
   - `lighten-color`, `darken-color`
   - `saturate-color`, `desaturate-color`

2. **Accessibility**
   - `relative-luminance` - WCAG luminance calculation
   - `contrast-ratio` - WCAG contrast ratio (1-21)
   - `meets-wcag` - Boolean validation
   - `auto-text-color` - Automatic light/dark selection
   - `accessible-weight` - Find WCAG-compliant weight

3. **Interactive States**
   - `hover-color` - One step darker (+100 weight)
   - `active-color` - Two steps darker (+200 weight)
   - `disabled-color` - Fixed at weight 200

4. **Analysis**
   - `get-lightness`, `get-hue`, `get-saturation`
   - `is-light`, `is-dark`

5. **Validation**
   - `validate-color-config` - Check required keys
   - `@include contrast-report` - Debug output

---

### Public API

**Location:** `functions/primitives.scss`

**Single Entry Point:**
```scss
get-color($family, $weight: 500)
```

**Behavior:**
1. Reads `flags.$primitives` to determine active theme
2. Loads corresponding `$color-config`, `$base-lightness`, `$custom-lightness`
3. Calls `factory.create-color()` with resolved primitives
4. Returns HSL color

**Theme Switching:**
```scss
// flags.scss
$primitives: 'default' !default;  // or 'flygroups', 'mytheme', etc.
```

---

## Color Generation Flow

```
User calls: get-color('primary', 600)
    ↓
1. Check flags.$primitives → 'default'
    ↓
2. Load primitives:
   - $default-color-config
   - $default-custom-lightness
   - $base-base-lightness
    ↓
3. Call factory.create-color():
   a. Get hue/saturation from $default-color-config['primary']
   b. Check $default-custom-lightness['primary'][600] → null
   c. Fallback to $base-base-lightness[600] → 40%
   d. Return hsl(97, 48%, 40%)
```

---

## Lightness Resolution Logic

**Priority Cascade:**
```
1. Custom Lightness (theme-specific override)
   ↓ (if not found)
2. Base Lightness (universal scale)
   ↓ (if not found)
3. Error
```

**Special Case - Neutral:**
Custom lightness often maps entire `$neutral-scale` to override base completely.

---

## Theme System

### Creating a New Theme

**Required Files:**
1. `primitives/_mytheme.scss` - Define `$mytheme-color-config` and `$mytheme-custom-lightness`
2. Update `primitives.scss` - Add `@forward 'primitives/mytheme' as mytheme-*`
3. Update `functions/primitives.scss` - Add theme conditional in `get-color()`
4. Set flag - `$primitives: 'mytheme'`

### Multi-App Architecture

**Shared Across Apps:**
- Base lightness scales
- Factory functions
- Utility functions
- Component styles (reference `get-color()`)

**App-Specific:**
- Color config (hue/saturation)
- Custom lightness overrides
- Theme flag setting

**Per-App Compilation:**
Each app sets `$primitives` flag before import, gets unique color values compiled into CSS.

---

## Accessibility System

### WCAG Contrast Requirements

| Text Size | AA | AAA |
|-----------|-----|-----|
| Normal | 4.5:1 | 7:1 |
| Large | 3:1 | 4.5:1 |

### Contrast Calculation

Uses WCAG relative luminance formula:
1. Convert RGB to 0-1 range
2. Apply gamma correction (2.4)
3. Calculate luminance: `0.2126×R + 0.7152×G + 0.0722×B`
4. Compute ratio: `(L1 + 0.05) / (L2 + 0.05)`

### Auto Text Color Selection

Compares contrast of light vs dark text on background, returns better option.

### Accessible Weight Finding

Iterates through weights (50-950) until WCAG requirement is met, returns first passing weight.

---

## File Structure

```
scss/
├── flags.scss                       # Theme selector
├── variables/
│   └── colors/
│       ├── base.scss                # Universal lightness scales
│       ├── primitives.scss          # Theme forwarding hub
│       ├── primitives/
│       │   ├── _default.scss        # Default theme
│       │   ├── _flygroups.scss      # Flygroups theme
│       │   └── _base.scss           # Base scales
│       └── factory.scss             # Color generation functions
└── functions/
    └── primitives.scss              # Public get-color() API
```

---

## Key Concepts

### Primitives
Foundational color definitions: hue (0-360°) + saturation (0-100%)

### Weight
Numeric identifier for lightness level (0, 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950)

### Family
Semantic color group (primary, success, neutral, etc.)

### Theme
Complete set of color configs and overrides

### Custom Lightness
Per-theme, per-family lightness overrides that supersede base scale

### Base Lightness
Universal, scientifically-derived lightness scale shared across themes

### Perceptual Uniformity
Each weight step feels visually equal despite varying mathematical differences

---

## Design Principles

1. **Separation of Concerns** - Primitives (hue/sat) separate from lightness scales
2. **Composability** - Mix and match primitives with scales
3. **Override Hierarchy** - Custom → Base → Error
4. **Theme Isolation** - Themes don't know about each other
5. **Single Source of Truth** - One API (`get-color()`) for all consumers
6. **Compile-Time Generation** - Zero runtime cost
7. **Accessibility by Default** - Validation built into system
8. **Scientific Foundation** - Mathematical color uniformity

---

## Validation & Error Handling

### Compile-Time Validation

**Family Not Found:**
```
Error: Color family 'xyz' not found in configuration.
Available families: [list]
```

**Weight Not Found:**
```
Error: Weight '350' not found.
Available weights: [0, 50, 100, ..., 950]
```

**Missing Keys:**
```
Error: Color family 'primary' missing required 'hue' key
```

### Warnings

**No Accessible Weight:**
```
Warning: No weight of 'primary' meets AA contrast on background #fff.
Using weight 950.
```

---

## Performance

- **Compilation:** All colors generated at SCSS compile time
- **Output:** Pure CSS with literal HSL values
- **Runtime:** Zero JavaScript, zero performance cost
- **Size:** Each `get-color()` call outputs single HSL value

---

## Extension Points

### Adding Color Family
Add to theme's `$color-config` map

### Customizing Lightness
Add to theme's `$custom-lightness` map

### Creating Theme
1. New primitives file
2. Forward in index
3. Add conditional in API
4. Set flag

### Adding Utility Function
Add to `factory.scss`, import via primitives API if needed

---

**Version:** 1.0  
**Type:** Technical Reference  
**Audience:** Design system developers