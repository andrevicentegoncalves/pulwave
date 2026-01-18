/**
 * Component Registry Types
 * Defines the structure for all component registrations
 */
import React, { type ElementType } from 'react';

export interface Reference {
    title: string;
    url: string;
    author?: string;
    source?: string;
}

export interface DemoEntry {
    name?: string;
    title?: string;
    description?: string;
    code?: string;
    component: React.ElementType;
}

export interface ComponentDoc {
    id?: string;
    name: string;
    subtitle?: string;
    displayName?: string;
    description: string;
    usage?: string;
    status?: 'stable' | 'beta' | 'deprecated' | 'experimental';
    version?: string;
    lastUpdated?: string;
    accessibilityStatus?: any; // Will be properly typed when AccessibilityStatus is imported
    liveDemo?: React.ElementType;
    whenToUse?: string[];
    whenNotToUse?: (string | any)[];
    componentComparison?: any;
    stateMatrix?: any;
    overview?: {
        demo?: React.ElementType;
        demos?: (React.ElementType | DemoEntry)[];
        description?: string;
        variants?: string[];
    };
    formatting?: any;
    content?: any;
    universalBehaviors?: any;
    variantDocs?: any[];
    modifiers?: any[];
    states?: any;
    props?: any[];
    anatomy?: any;
    inUse?: any;
    accessibility?: any;
    designRecommendations?: string[];
    developmentConsiderations?: string[];
    extensions?: any;
    relatedComponents?: any[];
    responsiveBehavior?: any[];
    styleTokens?: any[];
    typography?: any[];
    structure?: any[];
    references?: Reference[];
    feedbackUrl?: string;
    sections?: any[]; // For foundation docs
    component?: React.ElementType; // For custom doc pages
    dos?: string[];
    donts?: string[];
    category?: string;
    dependencies?: string[];
    designer?: string;
    tags?: string[];
    sourcePath?: string;
    examples?: any[];
}

export type DocumentationItem = ComponentDoc;

export type DocData = ComponentDoc;

/** Alias for foundation/getting-started documentation pages */
export type FoundationDoc = ComponentDoc;

export interface ComponentRegistration {
    /** Documentation object for the component (optional if component is provided) */
    doc?: ComponentDoc | Record<string, any>;
    /** Demos module containing demo components (optional) */
    demos?: Record<string, any>;
    /** Display title for the component */
    title: string;
    /** Direct component to render (overrides DocPage behavior) */
    component?: ElementType;
}

export type ComponentRegistry = Record<string, ComponentRegistration>;

/**
 * Filters demo exports to only include valid React components.
 */
export const filterDemos = (demosModule?: Record<string, any>): ElementType[] => {
    if (!demosModule) return [];

    // Check for a default export that is an ordered array of demo objects
    const defaultExport = demosModule.default;
    if (Array.isArray(defaultExport) && defaultExport.length > 0) {
        if (typeof defaultExport[0] === 'object' && defaultExport[0] !== null && 'component' in defaultExport[0]) {
            return defaultExport
                .filter((item): item is { component: ElementType } =>
                    typeof item === 'object' && item !== null && typeof item.component === 'function'
                )
                .map(item => item.component);
        }
        const components = defaultExport.filter((v): v is ElementType => typeof v === 'function');
        if (components.length > 0) return components;
    }

    return Object.values(demosModule).filter(
        (v): v is ElementType => typeof v === 'function'
    );
};
