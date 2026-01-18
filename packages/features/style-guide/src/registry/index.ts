/**
 * Unified Style Guide Registry
 * Central configuration for all style guide sections, components, docs, and demos
 * 
 * @package @pulwave/experience/style-guide
 * 
 * Usage:
 * ```typescript
 * import { componentRegistry, getComponentByPath, SECTIONS, CATEGORIES } from './registry';
 * 
 * // Get a component by path
 * const button = getComponentByPath('components/primitives/button');
 * // button = { doc: ButtonDoc, demos: ButtonDemos, title: 'Button' }
 * 
 * // Get all registered paths
 * const allPaths = Object.keys(componentRegistry);
 * ```
 */

import type { ComponentRegistry, ComponentRegistration } from '../core/types';
import { componentsRegistry } from './components';

// Re-export types
export type { ComponentRegistry, ComponentRegistration } from '../core/types';
export { filterDemos } from '../core/types';

// ================================================================
// UNIFIED COMPONENT REGISTRY
// ================================================================

/**
 * The unified component registry containing all docs and demos
 * indexed by their route path (e.g., 'components/primitives/button')
 */
export const componentRegistry: ComponentRegistry = componentsRegistry;

/**
 * Get a component registration by its route path
 * @param path - The route path (e.g., 'components/primitives/button')
 * @returns The component registration or undefined if not found
 */
export const getComponentByPath = (path: string): ComponentRegistration | undefined => {
    return componentRegistry[path];
};

/**
 * Check if a component exists in the registry
 * @param path - The route path to check
 */
export const hasComponent = (path: string): boolean => {
    return path in componentRegistry;
};

/**
 * Get all registered component paths
 */
export const getAllPaths = (): string[] => {
    return Object.keys(componentRegistry);
};

/**
 * Get all components for a specific section
 * @param section - The section prefix (e.g., 'components', 'data-visualization')
 */
export const getComponentsForSection = (section: string): ComponentRegistry => {
    return Object.fromEntries(
        Object.entries(componentRegistry).filter(([path]) => path.startsWith(section))
    );
};

// ================================================================
// RE-EXPORT SECTIONS AND CATEGORIES
// ================================================================

// Re-export from the existing registry.ts for backwards compatibility
export { SECTIONS, CATEGORIES, getCategoriesForSection, getNavigationTree } from './navigation';

// Re-export individual component registries for granular access
export {
    gettingStartedRegistry,
    foundationRegistry,
    inputsRegistry,
    layoutRegistry,
    navigationRegistry,
    dataDisplayRegistry,
    feedbackRegistry,
    overlaysRegistry,
    patternsRegistry,
    utilitiesRegistry,
    dataVisualizationRegistry,
    actionsRegistry,
} from './components';
