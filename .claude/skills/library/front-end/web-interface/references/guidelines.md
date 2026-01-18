# Web Interface Detailed Guidelines

## Accessibility (A11y)

- **Interactive Elements**: All interactive elements MUST be reachable via keyboard (Tab index).
- **ARIA**: Use `aria-label` for buttons that only have icons. Use `aria-live` for toasts.
- **Semantic HTML**: `<nav>`, `<main>`, `<header>`, `<footer>`, `<aside>`. Avoid "Div-itis".
- **Focus visible**: Focus rings should be clearly visible but only on keyboard interaction (`focus-visible`).

## Forms & Input

- **Labeling**: Every input needs a `<label>`. Use `htmlFor`.
- **Validation**: Show error messages *near* the field. Focus the first invalid field on submit.
- **Autosave**: If using autosave, show a "Saving..." indicator.
- **Confirmation**: Destructive actions (Delete) need a modal or "Hold to confirm" button.

## Content & Typography

- **Long Content**: Always use `truncate`, `line-clamp`, or fixed height with overflow for user-generated text.
- **Loading states**: Finish with `…` (e.g., "Uploading…").
- **Numbers**: Use `font-variant-numeric: tabular-nums` in tables for vertical alignment of digits.

## Animation

- **Property selection**: Only animate `transform` and `opacity`. Animating `width/height/margin` causes Reflow/Layout shift.
- **Duration**: Keep transitions between 150ms and 300ms. Anything slower feels sluggish.
- **Reduced Motion**: wrap animations in a check for `(prefers-reduced-motion: reduce)`.

## Safe Areas

Always account for the Home Bar and Notches on mobile browsers.
- `padding-bottom: env(safe-area-inset-bottom)`
- `padding-top: env(safe-area-inset-top)`
