# SCSS Mixins Library

## Responsive Breakpoints

```scss
@mixin breakpoint($size) {
  @if $size == sm { @media (min-width: $breakpoint-sm) { @content; } }
  @if $size == md { @media (min-width: $breakpoint-md) { @content; } }
  @if $size == lg { @media (min-width: $breakpoint-lg) { @content; } }
  @if $size == xl { @media (min-width: $breakpoint-xl) { @content; } }
}

// Usage
.card {
  padding: $spacing-4;
  
  @include breakpoint(md) {
    padding: $spacing-6;
  }
  
  @include breakpoint(lg) {
    padding: $spacing-8;
  }
}
```

## Flex Utilities

```scss
@mixin flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}

@mixin flex-between {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

@mixin flex-column {
  display: flex;
  flex-direction: column;
}

// Usage
.modal__overlay {
  @include flex-center;
}

.header {
  @include flex-between;
}
```

## Text Truncation

```scss
@mixin truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

@mixin line-clamp($lines) {
  display: -webkit-box;
  -webkit-line-clamp: $lines;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

// Usage
.card__title {
  @include truncate;
}

.card__description {
  @include line-clamp(3);
}
```

## Focus States

```scss
@mixin focus-ring {
  outline: 2px solid $color-primary;
  outline-offset: 2px;
}

@mixin focus-visible {
  &:focus-visible {
    @include focus-ring;
  }
}

// Usage
.button {
  @include focus-visible;
}
```

## Transitions

```scss
@mixin transition($properties...) {
  transition-property: $properties;
  transition-duration: 150ms;
  transition-timing-function: ease-out;
}

// Usage
.button {
  @include transition(background-color, color, box-shadow);
}
```

## Visually Hidden (Accessibility)

```scss
@mixin visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  margin: -1px;
  padding: 0;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

// Usage
.sr-only {
  @include visually-hidden;
}
```

## Scrollbar Styling

```scss
@mixin custom-scrollbar($width: 8px, $track: transparent, $thumb: $color-border) {
  &::-webkit-scrollbar {
    width: $width;
    height: $width;
  }
  
  &::-webkit-scrollbar-track {
    background: $track;
  }
  
  &::-webkit-scrollbar-thumb {
    background: $thumb;
    border-radius: $width / 2;
  }
}

// Usage
.scroll-container {
  @include custom-scrollbar;
}
```

## Aspect Ratio

```scss
@mixin aspect-ratio($width, $height) {
  aspect-ratio: $width / $height;
}

// Usage
.video-container {
  @include aspect-ratio(16, 9);
}
```
