# Design Tokens

## Spacing Scale

```scss
$spacing-1: 4px;   // Tight
$spacing-2: 8px;   // Default gap
$spacing-3: 12px;  // Medium
$spacing-4: 16px;  // Section padding
$spacing-6: 24px;  // Large
$spacing-8: 32px;  // Section margins
$spacing-12: 48px; // Page margins
$spacing-16: 64px; // Hero sections
```

## Color System

### Semantic Colors (Use These)
```scss
// Text
$color-text-primary: var(--color-text-primary);
$color-text-secondary: var(--color-text-secondary);
$color-text-tertiary: var(--color-text-tertiary);

// Backgrounds
$color-background-primary: var(--color-background-primary);
$color-background-secondary: var(--color-background-secondary);
$color-surface: var(--color-surface);

// Interactive
$color-primary: var(--color-primary);
$color-primary-hover: var(--color-primary-hover);

// Status
$color-error: var(--color-error);
$color-success: var(--color-success);
$color-warning: var(--color-warning);

// Borders
$color-border: var(--color-border);
$color-border-light: var(--color-border-light);
```

## Typography Scale

```scss
// Font Sizes
$font-size-xs: 12px;
$font-size-sm: 14px;
$font-size-md: 16px;
$font-size-lg: 18px;
$font-size-xl: 20px;
$font-size-2xl: 24px;
$font-size-3xl: 30px;

// Font Weights
$font-weight-normal: 400;
$font-weight-medium: 500;
$font-weight-semibold: 600;
$font-weight-bold: 700;

// Line Heights
$line-height-tight: 1.25;
$line-height-normal: 1.5;
$line-height-relaxed: 1.75;
```

## Border Radius

```scss
$radius-sm: 4px;
$radius-md: 8px;
$radius-lg: 12px;
$radius-xl: 16px;
$radius-full: 9999px;
```

## Shadows

```scss
$shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
$shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
$shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);
$shadow-xl: 0 20px 25px rgba(0, 0, 0, 0.15);
```

## Z-Index Scale

```scss
$z-index-dropdown: 100;
$z-index-sticky: 200;
$z-index-modal-backdrop: 300;
$z-index-modal: 400;
$z-index-popover: 500;
$z-index-tooltip: 600;
$z-index-toast: 700;
```

## Breakpoints

```scss
$breakpoint-sm: 640px;
$breakpoint-md: 768px;
$breakpoint-lg: 1024px;
$breakpoint-xl: 1280px;
$breakpoint-2xl: 1536px;
```
