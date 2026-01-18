/**
 * @foundation/hooks
 * 
 * Generic, reusable hooks that don't depend on domain services.
 * 
 * ARCHITECTURE (Best Practices):
 * - Generic hooks (useDebounce, useMediaQuery) → foundation/hooks
 * - Domain hooks (useUser, useProfileData) → features/data/hooks
 * - UI-component hooks → co-located with component
 * 
 * NOTE: Domain-specific hooks have moved to @pulwave/entities
 */

// Generic utility hooks
export { useDebounce } from './useDebounce';
export { useMediaQuery } from './useMediaQuery';
export { useLocalStorage } from './useLocalStorage';
export { useFormState } from './useFormState';
export { useClickOutside } from './useClickOutside';

// Data table hook (generic, no domain dependencies)
export { useDataTable } from './useDataTable';

// Slider utilities (not hooks, but slider-related utils)
export * from './useSliderValue';
export * from './useSliderDrag';
export * from './useSliderKeyboard';
