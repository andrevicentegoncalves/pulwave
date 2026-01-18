/**
 * Utils Barrel Export
 * 
 * @package @foundation
 */

// Date utilities
export * from './date';
// Note: dateHelpers.ts has duplicate functions from date.ts - not exported

// String formatters
export * from './formatters';

// CSS class utilities
export * from './classNames';
export * from './constants';

// Geolocation
export * from './geolocation';

// Grouping utilities
export * from './groupBy';

// Nominatim geocoding
export * from './nominatim';

// Validators
export * from './validators';

// Type re-exports for backward compatibility
export type {
    BaseComponentProps,
    SpacingScale,
    Size,
    ColorVariant,
    StateVariant,
    Orientation,
    Position,
    Alignment,
    Justify,
    TranslationBundles,
    BundleHashes
} from '@pulwave/types';

// Hook re-exports for backward compatibility
export {
    useMediaQuery,
    useDebounce,
    useLocalStorage,
    useFormState,
    useClickOutside,
    useDataTable
} from '@pulwave/hooks';
