/**
 * Components Registry Index
 * Aggregates all component registries
 * 
 * Foundation content has been migrated. Other content pending.
 */
import type { ComponentRegistry } from '../../core/types';

// Migrated registries
import { foundationRegistry } from './foundation';
import { inputsRegistry } from './inputs';
import { layoutRegistry } from './layout';
import { navigationRegistry } from './navigation';
import { dataDisplayRegistry } from './data-display';
import { patternsRegistry } from './patterns';
import { utilitiesRegistry } from './utilities';
import { actionsRegistry } from './actions';
import { feedbackRegistry } from './feedback';
import { overlaysRegistry } from './overlays';

import { typographyRegistry } from './typography';
import { dataVisualizationRegistry } from './data-visualization';
import { gettingStartedRegistry } from './getting-started';


export const componentsRegistry: ComponentRegistry = {
    ...gettingStartedRegistry,
    ...foundationRegistry,
    ...typographyRegistry,
    ...inputsRegistry,
    ...layoutRegistry,
    ...navigationRegistry,
    ...dataDisplayRegistry,
    ...feedbackRegistry,
    ...overlaysRegistry,
    ...patternsRegistry,
    ...utilitiesRegistry,
    ...actionsRegistry,
    ...dataVisualizationRegistry,
};

// Re-export for granular access
export {
    gettingStartedRegistry,
    foundationRegistry,
    inputsRegistry,
    layoutRegistry,
    navigationRegistry,
    dataDisplayRegistry,
    patternsRegistry,
    utilitiesRegistry,
    actionsRegistry,
    feedbackRegistry,
    overlaysRegistry,
    typographyRegistry,
    dataVisualizationRegistry
};

