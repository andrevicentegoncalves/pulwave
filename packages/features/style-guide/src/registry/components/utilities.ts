/**
 * Utilities Registry
 * Helper components and accessibility tools
 */
import type { ComponentRegistry } from '../types';

// Docs
import { default as SidebarToggleDoc } from '../../content/components/inputs/SidebarToggle/docs/SidebarToggleDoc';
import { default as ThemeToggleDoc } from '../../content/components/inputs/ThemeToggle/docs/ThemeToggleDoc';
import { default as FocusTrapDoc } from '../../content/utilities/accessibility/FocusTrap/docs/FocusTrapDoc';
import { default as VisuallyHiddenDoc } from '../../content/utilities/accessibility/VisuallyHidden/docs/VisuallyHiddenDoc';
import { default as LiveRegionDoc } from '../../content/utilities/accessibility/LiveRegion/docs/LiveRegionDoc';
import { default as SkipLinkDoc } from '../../content/utilities/accessibility/SkipLink/docs/SkipLinkDoc';
import { default as ErrorBoundaryDoc } from '../../content/utilities/error-handling/ErrorBoundary/docs/ErrorBoundaryDoc';

// Demos
import * as SidebarToggleDemos from '../../content/components/inputs/SidebarToggle/demos';
import * as ThemeToggleDemos from '../../content/components/inputs/ThemeToggle/demos';
import * as FocusTrapDemos from '../../content/utilities/accessibility/FocusTrap/demos';
import * as VisuallyHiddenDemos from '../../content/utilities/accessibility/VisuallyHidden/demos';
import * as LiveRegionDemos from '../../content/utilities/accessibility/LiveRegion/demos';
import * as SkipLinkDemos from '../../content/utilities/accessibility/SkipLink/demos';
import * as ErrorBoundaryDemos from '../../content/utilities/error-handling/ErrorBoundary/demos';

export const utilitiesRegistry: ComponentRegistry = {
    'utilities/app-controls/sidebar-toggle': {
        doc: SidebarToggleDoc,
        demos: SidebarToggleDemos,
        title: 'SidebarToggle',
    },
    'utilities/app-controls/theme-toggle': {
        doc: ThemeToggleDoc,
        demos: ThemeToggleDemos,
        title: 'ThemeToggle',
    },
    'utilities/accessibility/focus-trap': {
        doc: FocusTrapDoc,
        demos: FocusTrapDemos,
        title: 'FocusTrap',
    },
    'utilities/accessibility/visually-hidden': {
        doc: VisuallyHiddenDoc,
        demos: VisuallyHiddenDemos,
        title: 'VisuallyHidden',
    },
    'utilities/accessibility/live-region': {
        doc: LiveRegionDoc,
        demos: LiveRegionDemos,
        title: 'LiveRegion',
    },
    'utilities/accessibility/skip-link': {
        doc: SkipLinkDoc,
        demos: SkipLinkDemos,
        title: 'SkipLink',
    },
    'utilities/error-handling/error-boundary': {
        doc: ErrorBoundaryDoc,
        demos: ErrorBoundaryDemos,
        title: 'ErrorBoundary',
    },
};
