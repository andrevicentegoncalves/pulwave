export { default as StyleGuideApp } from './src/pages/StyleGuidePage';
export { default as StyleGuidePage } from './src/pages/StyleGuidePage';
export { default as IconLibraryPage } from './src/pages/IconLibraryPage';

// Registry is now part of the feature package
export {
    componentRegistry,
    getComponentByPath,
    SECTIONS,
    CATEGORIES,
    getNavigationTree
} from '@pulwave/features-style-guide';

export type {
    ComponentRegistry,
    ComponentRegistration
} from '@pulwave/features-style-guide';
