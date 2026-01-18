# BEM Naming Convention

## Structure

```
.block                  → Component
.block__element         → Child of component
.block--modifier        → Variation of component
.block__element--modifier → Variation of element
```

## Examples

### Button Component

```scss
.button {
  padding: $spacing-3 $spacing-4;
  font-size: $font-size-md;
  border-radius: $radius-md;
  
  // Elements
  &__icon {
    margin-right: $spacing-2;
  }
  
  &__label {
    font-weight: $font-weight-medium;
  }
  
  // Modifiers
  &--primary {
    background-color: $color-primary;
    color: white;
  }
  
  &--secondary {
    background-color: transparent;
    border: 1px solid $color-border;
  }
  
  &--small {
    padding: $spacing-2 $spacing-3;
    font-size: $font-size-sm;
  }
  
  &--large {
    padding: $spacing-4 $spacing-6;
    font-size: $font-size-lg;
  }
}
```

### Card Component

```scss
.card {
  background: $color-surface;
  border-radius: $radius-lg;
  box-shadow: $shadow-md;
  
  &__header {
    padding: $spacing-4;
    border-bottom: 1px solid $color-border-light;
  }
  
  &__title {
    font-size: $font-size-lg;
    font-weight: $font-weight-semibold;
  }
  
  &__body {
    padding: $spacing-4;
  }
  
  &__footer {
    padding: $spacing-4;
    border-top: 1px solid $color-border-light;
  }
  
  // Modifiers
  &--elevated {
    box-shadow: $shadow-lg;
  }
  
  &--outlined {
    box-shadow: none;
    border: 1px solid $color-border;
  }
}
```

## Nesting Rules

### Max 3 Levels

```scss
// ✅ Correct - flat structure
.card { }
.card__header { }
.card__title { }
.card--elevated { }

// ❌ Wrong - too deep
.card {
  .header {
    .title {
      .icon {
        // 4 levels deep!
      }
    }
  }
}
```

### Pseudo-classes OK

```scss
.button {
  &:hover { }      // OK
  &:focus { }      // OK
  &:disabled { }   // OK
  
  &--primary {
    &:hover { }    // OK - 2 levels
  }
}
```

## Naming Guidelines

| Type | Pattern | Example |
|------|---------|---------|
| Block | `noun` | `.card`, `.button`, `.modal` |
| Element | `block__noun` | `.card__header`, `.button__icon` |
| Modifier | `block--adjective` | `.card--elevated`, `.button--primary` |
| State | `is-*` or `has-*` | `.is-active`, `.has-error` |

## Anti-Patterns

```scss
// ❌ camelCase
.cardHeader { }

// ❌ Multiple dashes
.card-header-title { }

// ❌ Element of element
.card__header__title { }

// ✅ Correct
.card__header-title { }
// or
.card-header__title { }
```
