/**
 * Entity Infrastructure
 * Provider-agnostic data layer infrastructure.
 *
 * @package @pulwave/entity-infrastructure
 */

// Export the provider factory
export * from './ProviderFactory';

// Export types
export * from './types';
export * from './interfaces';

// Export the default data provider instance
export { createDataProvider } from './ProviderFactory';

// Create and export the default dataProvider instance
import { createDataProvider } from './ProviderFactory';
export const dataProvider = createDataProvider();
