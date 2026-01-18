# Pulwave Utility System Guidelines

> A comprehensive, token-driven utility class system combining **Tailwind-like agility** with **semantically consistent design tokens**.

---

## Table of Contents

1. [Core Philosophy](#core-philosophy)
2. [File Structure](#file-structure)
3. [Prefixes & Variants](#prefixes--variants)
4. [Utility Reference](#utility-reference)
5. [How to Extend](#how-to-extend)
6. [Best Practices](#best-practices)

---

## Core Philosophy

1. **Token-Driven**: Every utility class is generated from design tokens. If a value isn't in tokens, it won't be in utilities.
2. **Naming Convention**: We follow widely adopted conventions (Tailwind/Bootstrap) to minimize learning curve.
3. **No Hardcoded Values**: Utilities reference CSS variables (e.g., `var(--scale-4)`), not pixels.
4. **Composable**: Utilities can be combined to build complex layouts without custom CSS.

---

## File Structure

```
utilities/
├── _index.scss           # Main entry point
├── _keyframes.scss       # Consolidated animation keyframes
├── _spacing.scss         # Margin, padding, gap utilities
├── _sizing.scss          # Width, height, min/max utilities
├── _typography.scss      # Font, text utilities
├── _colors.scss          # Text, background, border, fill, stroke colors
├── _layout.scss          # Position, z-index, overflow, overscroll utilities
├── _flex.scss            # Flexbox & CSS Grid utilities
├── _effects.scss         # Shadow, opacity, blur, ring utilities
├── _gradient.scss        # Gradient direction and color stop utilities
├── _divide.scss          # Child element border utilities
├── _columns.scss         # Multi-column layout utilities
├── _blend.scss           # Mix blend mode and background blend mode
├── _interactions.scss    # Cursor, pointer-events, scroll utilities
├── _transition.scss      # Transition and animation utilities
├── _transform.scss       # Rotate, scale, translate utilities
├── _icons.scss           # Icon sizing and alignment utilities
├── _images.scss          # Background image utilities
├── _svg.scss             # SVG fill, stroke, and path utilities
├── _loaders.scss         # Loading indicator components
├── _lists.scss           # List style utilities
├── _tables.scss          # Table layout utilities
└── _accessibility.scss   # Screen reader, focus, reduced motion utilities
```

---

## Prefixes & Variants

The system supports a powerful set of prefixes to handle responsive design and interactive states. These can be stacked (e.g., `m:hover:bg-primary`).

### Responsive Prefixes
Apply styles at specific breakpoints and up.

| Prefix | Min Width | Target |
|--------|-----------|--------|
| `s:` | 640px | Small Tablets |
| `m:` | 768px | Tablets |
| `l:` | 1024px | Laptops |
| `xl:` | 1280px | Desktops |
| `2xl:` | 1920px | Large screens |

### State Prefixes
Apply styles on interaction.

| Prefix | State | Example |
|--------|-------|---------|
| `hover:` | `:hover` | `hover:bg-primary` |
| `focus:` | `:focus` | `focus:ring-2` |
| `active:` | `:active` | `active:scale-95` |
| `disabled:` | `:disabled` | `disabled:opacity-50` |

### Advanced Interaction Prefixes
Pattern-based states for complex components.

| Prefix | Description | Example |
|--------|-------------|---------|
| `group-hover:` | Styles when a parent `.group` is hovered | `.group:hover .group-hover:text-white` |
| `peer-hover:` | Styles when a previous sibling `.peer` is hovered | `.peer:hover ~ .peer-hover:block` |

### Dark Mode
| Prefix | Description | Example |
|--------|-------------|---------|
| `dark:` | Styles when `.dark` class is present on a parent | `dark:bg-slate-900` |

### Example Usage
```html
<div class="group p-4 m:p-8 bg-surface-default hover:bg-surface-hover dark:bg-slate-800">
  <h2 class="text-body-m l:text-body-l group-hover:text-primary">
    Responsive, Interactive Card
  </h2>
</div>
```

---

## Utility Reference

### Typography (`_typography.scss`)

| Category | Examples | Description |
|----------|----------|-------------|
| **Presets** | `.text-display-hero`, `.text-body-m` | Composite classes setting size, weight, leading |
| **Weights** | `.font-bold`, `.font-regular` | Font weight utilities |
| **Leading** | `.leading-tight`, `.leading-normal` | Line height utilities |
| **Tracking** | `.tracking-wide`, `.tracking-tight` | Letter spacing utilities |
| **Alignment** | `.text-left`, `.text-center`, `.text-right` | Text alignment |
| **Transform** | `.uppercase`, `.lowercase`, `.capitalize` | Text transformation |
| **Truncation** | `.truncate`, `.line-clamp-2` | Text overflow handling |
| **Whitespace** | `.whitespace-nowrap`, `.whitespace-pre` | White space control |

### Spacing (`_spacing.scss`)

| Category | Examples | Description |
|----------|----------|-------------|
| **Scale** | `.m-4`, `.p-2`, `.gap-4` | Uses `scale-*` tokens |
| **Semantic** | `.m-section`, `.p-base` | Uses `spacing-*` tokens |
| **Axes** | `.mx-4`, `.py-2` | Horizontal/vertical shortcuts |
| **Negative** | `.-m-4`, `.-mt-2` | Negative margin utilities |
| **Space Between** | `.space-x-4`, `.space-y-2` | Child element spacing |
| **Field Sizing** | `.field-sizing-content`, `.field-sizing-fixed` | Auto-size form inputs |

### Colors (`_colors.scss`)

| Category | Examples | Description |
|----------|----------|-------------|
| **Text** | `.text-primary`, `.text-blue-500` | Text color utilities |
| **Background** | `.bg-surface-default`, `.bg-primary` | Background color utilities |
| **Border** | `.border-default`, `.border-error` | Border color utilities |
| **Fill** | `.fill-primary-500`, `.fill-current` | SVG fill colors |
| **Stroke** | `.stroke-primary-500`, `.stroke-current` | SVG stroke colors |

### Layout & Flex (`_layout.scss`, `_flex.scss`)

| Category | Examples | Description |
|----------|----------|-------------|
| **Display** | `.flex`, `.grid`, `.block`, `.hidden` | Display utilities |
| **Flex Direction** | `.flex-row`, `.flex-col` | Flex direction |
| **Justify** | `.justify-between`, `.justify-center` | Justify content |
| **Align** | `.items-center`, `.items-start` | Align items |
| **Grid** | `.grid-cols-4`, `.grid-cols-12` | Grid columns |
| **Position** | `.absolute`, `.relative`, `.sticky` | Positioning |
| **Z-Index** | `.z-overlay-modal`, `.z-10` | Stacking order |
| **Box Decoration** | `.box-decoration-clone`, `.box-decoration-slice` | Fragment styling |
| **Responsive** | `.m:flex-col`, `.l:grid-cols-3` | Breakpoint prefixes |

### Effects (`_effects.scss`)

| Category | Examples | Description |
|----------|----------|-------------|
| **Rounded** | `.rounded-m`, `.rounded-full` | Border radius |
| **Shadow** | `.shadow-m`, `.shadow-xl` | Box shadow |
| **Opacity** | `.opacity-50`, `.opacity-75` | Opacity utilities |
| **Outline** | `.outline`, `.outline-dashed`, `.outline-hidden` | Outline styles |
| **Ring** | `.ring`, `.ring-2`, `.ring-primary` | Focus ring system |
| **Blur** | `.blur-s`, `.blur-xl` | Filter blur |
| **Backdrop** | `.backdrop-blur-m` | Backdrop filter |

### Gradients (`_gradient.scss`)

| Category | Examples | Description |
|----------|----------|-------------|
| **Direction** | `.bg-gradient-to-r`, `.bg-gradient-to-br` | Gradient direction |
| **From** | `.from-primary-500`, `.from-transparent` | Start color |
| **Via** | `.via-secondary-500` | Middle color |
| **To** | `.to-primary-900`, `.to-transparent` | End color |
| **Position** | `.from-50%`, `.via-25%`, `.to-100%` | Color stop positions |

### Divide (`_divide.scss`)

| Category | Examples | Description |
|----------|----------|-------------|
| **Width X** | `.divide-x`, `.divide-x-2`, `.divide-x-4` | Vertical dividers between children |
| **Width Y** | `.divide-y`, `.divide-y-2`, `.divide-y-4` | Horizontal dividers between children |
| **Style** | `.divide-solid`, `.divide-dashed`, `.divide-dotted` | Divider line style |
| **Color** | `.divide-default`, `.divide-primary-500` | Divider color |
| **Reverse** | `.divide-x-reverse`, `.divide-y-reverse` | Reverse divider direction |

### Columns (`_columns.scss`)

| Category | Examples | Description |
|----------|----------|-------------|
| **Count** | `.columns-2`, `.columns-3`, `.columns-auto` | Number of columns |
| **Width** | `.columns-xs`, `.columns-m`, `.columns-xl` | Column width constraints |
| **Gap** | `.column-gap-4`, `.column-gap-8` | Gap between columns |
| **Rule** | `.column-rule-1`, `.column-rule-solid` | Column divider styling |
| **Span** | `.column-span-all`, `.column-span-none` | Spanning across columns |

### Blend Modes (`_blend.scss`)

| Category | Examples | Description |
|----------|----------|-------------|
| **Mix Blend** | `.mix-blend-multiply`, `.mix-blend-overlay` | Element blend with background |
| **BG Blend** | `.bg-blend-screen`, `.bg-blend-darken` | Background image blending |

### Transforms (`_transform.scss`)

| Category | Examples | Description |
|----------|----------|-------------|
| **Rotate** | `.rotate-45`, `.rotate-90`, `.-rotate-45` | Rotation (positive and negative) |
| **Scale** | `.scale-105`, `.scale-150`, `.flip-x` | Scaling and flipping |
| **Translate** | `.translate-x-4`, `.-translate-x-1/2` | Translation (positive and negative) |
| **Skew** | `.skew-x-6`, `.-skew-y-3` | Skewing |
| **Origin** | `.origin-center`, `.origin-top-left` | Transform origin |
| **Reset** | `.transform-none`, `.transform-gpu` | Reset and GPU acceleration |

### Interactions & Transitions (`_interactions.scss`, `_transition.scss`)

| Category | Examples | Description |
|----------|----------|-------------|
| **Cursor** | `.cursor-pointer`, `.cursor-not-allowed` | Cursor styles |
| **Selection** | `.select-none`, `.select-text` | User selection |
| **State** | `.interactive`, `.hover-lift` | Interactive effects |
| **Transition** | `.transition`, `.transition-colors` | Transition properties |
| **Duration** | `.duration-fast`, `.duration-slow` | Transition duration |
| **Easing** | `.ease-out`, `.ease-spring` | Timing functions |
| **Animation** | `.animate-spin`, `.animate-pulse` | Animation presets |

### Accessibility (`_accessibility.scss`)

| Category | Examples | Description |
|----------|----------|-------------|
| **Screen Reader** | `.sr-only`, `.not-sr-only` | Visually hide content |
| **Focus** | `.focus-visible`, `.focus-ring` | Focus indicators |
| **Motion** | `.motion-reduce`, `.motion-safe` | Reduced motion support |
| **Forced Colors** | `.forced-color-adjust-auto` | High contrast mode |
| **Print** | `.print-hidden`, `.print-only` | Print utilities |
| **Color Scheme** | `.scheme-light`, `.scheme-dark` | Native UI theming |

### Modern CSS Features (`_container.scss`, `_mask.scss`, etc.)

> **25 Modern Features** for future-proofing. Some are bleeding-edge with limited browser support.

| Category | Examples | Description |
|----------|----------|-------------|
| **Logical Properties** | `.ms-4`, `.me-4`, `.m-inline-auto` | Internationalization-ready spacing |
| **Logical Inset** | `.inset-inline-0`, `.start-4` | Logical positioning |
| **Container Queries** | `.container-type-inline-size` | Element-based responsive design |
| **Subgrid** | `.grid-cols-subgrid` | Nested grid alignment |
| **Perspective** | `.perspective-m`, `.perspective-origin-center` | 3D transforms |
| **Backdrop Hue** | `.backdrop-hue-rotate-90` | Backdrop filter effects |
| **Text Wrap** | `.text-pretty`, `.text-balance` | Modern text wrapping |
| **View Transitions** | `.view-transition-none` | Page transition API |
| **Scroll Timeline** | `.animate-scroll`, `.scroll-timeline-y` | Scroll-driven animations |
| **Containment** | `.contain-content`, `.contain-strict` | Rendering performance |
| **Field Sizing** | `.field-sizing-content` | Auto-growing inputs |
| **Scrollbar Gutter** | `.scrollbar-gutter-stable` | Layout stability |
| **Masking** | `.mask-linear`, `.mask-cover` | CSS masking effects |
| **Hanging Punctuation** | `.hanging-first` | Typography polish |
| **Content Visibility** | `.content-auto` | Rendering optimization |
| **Shape Outside** | `.shape-margin` | Text wrap around shapes |
| **Image Rendering** | `.image-render-pixel` | Pixel art scaling |
| **Discrete Transitions** | `.transition-discrete` | Animate display: none |
| **Writing Mode** | `.writing-vertical-rl` | Vertical text layouts |
| **Underline Position** | `.underline-under` | Precise underlines |
| **Font Synthesis** | `.font-synthesis-none` | Prevent faux fonts |
| **Interpolate Size** | `.interpolate-size` | Animate to height: auto |
| **Starting Style** | `.starting-hidden`, `.starting-fade` | Initial render animations |
| **Anchor Positioning** | `.anchor-name-auto` | CSS-only popovers (experimental) |

---

## How to Extend

> **Important**: Do **not** add raw values directly to utility files.

### Adding New Utilities

1. **Add the value to tokens** (`tokens/source/` JSON files)
2. **Build tokens**: `npm run tokens`
3. The SCSS loops will automatically generate new utility classes

### Example: Adding a New Spacing Value

```json
// tokens/source/primitives/spacing/scale.json
{
  "scale": {
    "13": { "$value": "52px", "$type": "dimension" }
  }
}
```

After running `npm run tokens`, utilities like `.m-13`, `.p-13`, `.gap-13` will be automatically generated.

---

## Best Practices

### Do ✅

- Use utility classes for common patterns
- Combine utilities for layout composition
- Use responsive prefixes for adaptive layouts
- Leverage semantic color utilities (`.text-primary` over `.text-green-500`)

### Don't ❌

- Don't add hardcoded values to utility files
- Don't create one-off utility classes in components
- Don't override utility classes with `!important`
- Don't use utilities for complex component-specific styles

### When to Use Components vs Utilities

| Use Utilities | Use Components |
|--------------|----------------|
| Simple layouts | Complex, reusable patterns |
| Quick prototyping | Production UI elements |
| Overriding component defaults | Encapsulated styling |
| Responsive adjustments | State management in CSS |
