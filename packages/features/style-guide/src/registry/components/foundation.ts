/**
 * Foundation Component Registry
 * Docs and demos for all 11 foundation elements
 */
import type { ComponentRegistry } from '../types';

// Existing foundations - docs
import { ColorDoc } from '../../content/foundation/Color/docs';
import { TypographyDoc } from '../../content/foundation/Typography/docs';
import { SpacingDoc } from '../../content/foundation/Spacing/docs';
import { ElevationDoc } from '../../content/foundation/Elevation/docs';
import { MotionDoc } from '../../content/foundation/Motion/docs';

// New foundations - docs
import { BordersDoc } from '../../content/foundation/Borders/docs';
import { BreakpointsDoc } from '../../content/foundation/Breakpoints/docs';
import { ZIndexDoc } from '../../content/foundation/ZIndex/docs';
import { IconographyDoc } from '../../content/foundation/Iconography/docs';
import { AccessibilityDoc } from '../../content/foundation/Accessibility/docs';
import { GridDoc as GridSystemDoc } from '../../content/foundation/Grid/docs';
import { default as RTLDoc } from '../../content/foundation/concepts/RTL/docs';
import { default as DensityDoc } from '../../content/foundation/concepts/Density/docs';
import { default as AccessibilityConceptDoc } from '../../content/foundation/concepts/Accessibility/docs';
import { default as PulwaveProviderDoc } from '../../content/foundation/concepts/Setup/docs/PulwaveProviderDoc';

// Existing foundations - demos
import * as ColorDemos from '../../content/foundation/Color/demos';
import * as TypographyDemos from '../../content/foundation/Typography/demos';
import * as SpacingDemos from '../../content/foundation/Spacing/demos';
import * as ElevationDemos from '../../content/foundation/Elevation/demos';
import * as MotionDemos from '../../content/foundation/Motion/demos';
import * as GridDemos from '../../content/foundation/Grid/demos';

// New foundations - demos
import * as BordersDemos from '../../content/foundation/Borders/demos';
import * as BreakpointsDemos from '../../content/foundation/Breakpoints/demos';
import * as ZIndexDemos from '../../content/foundation/ZIndex/demos';
import * as IconographyDemos from '../../content/foundation/Iconography/demos';
import * as AccessibilityDemos from '../../content/foundation/Accessibility/demos';
import * as RTLDemos from '../../content/foundation/concepts/RTL/demos';
import * as DensityDemos from '../../content/foundation/concepts/Density/demos';
import * as PulwaveProviderDemos from '../../content/foundation/concepts/Setup/demos';

export const foundationRegistry: ComponentRegistry = {
    // Existing foundations
    'foundation/color/overview': {
        doc: ColorDoc,
        demos: ColorDemos,
        title: 'Color',
    },
    'foundation/typography/overview': {
        doc: TypographyDoc,
        demos: TypographyDemos,
        title: 'Typography',
    },
    'foundation/spacing/overview': {
        doc: SpacingDoc,
        demos: SpacingDemos,
        title: 'Spacing',
    },
    'foundation/elevation/overview': {
        doc: ElevationDoc,
        demos: ElevationDemos,
        title: 'Elevation',
    },
    'foundation/motion/overview': {
        doc: MotionDoc,
        demos: MotionDemos,
        title: 'Motion',
    },
    'foundation/grid-system/overview': {
        doc: GridSystemDoc,
        demos: GridDemos,
        title: 'Grid System',
    },
    'foundation/concepts/rtl': {
        doc: RTLDoc,
        demos: RTLDemos,
        title: 'RTL Support',
    },
    'foundation/concepts/density': {
        doc: DensityDoc,
        demos: DensityDemos,
        title: 'Density Control',
    },
    'foundation/concepts/accessibility': {
        doc: AccessibilityDoc,
        demos: AccessibilityDemos,
        title: 'Accessibility Overview',
    },
    // New foundations
    'foundation/borders/overview': {
        doc: BordersDoc,
        demos: BordersDemos,
        title: 'Borders & Shape',
    },
    'foundation/breakpoints/overview': {
        doc: BreakpointsDoc,
        demos: BreakpointsDemos,
        title: 'Breakpoints',
    },
    'foundation/z-index/overview': {
        doc: ZIndexDoc,
        demos: ZIndexDemos,
        title: 'Z-Index & Layers',
    },
    'foundation/iconography/overview': {
        doc: IconographyDoc,
        demos: IconographyDemos,
        title: 'Iconography',
    },
    'foundation/accessibility/overview': {
        doc: AccessibilityDoc,
        demos: AccessibilityDemos,
        title: 'Accessibility',
    },
    'foundation/concepts/pulwave-provider': {
        doc: PulwaveProviderDoc,
        demos: PulwaveProviderDemos,
        title: 'PulwaveProvider',
    },
};
