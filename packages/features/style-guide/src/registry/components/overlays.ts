/**
 * Overlays Registry
 * Components that appear on top of other content
 */
import type { ComponentRegistry } from '../types';
import * as OverlaysContent from '../../content/components/overlays';

export const overlaysRegistry: ComponentRegistry = {
    'components/overlays/command-palette': {
        doc: OverlaysContent.CommandPaletteDoc,
        demos: OverlaysContent.CommandPaletteDemos,
        title: 'CommandPalette',
    },
    'components/overlays/drawer': {
        doc: OverlaysContent.DrawerDoc,
        demos: OverlaysContent.DrawerDemos,
        title: 'Drawer',
    },
    'components/overlays/dropdown': {
        doc: OverlaysContent.DropdownDoc,
        demos: OverlaysContent.DropdownDemos,
        title: 'Dropdown',
    },
    'components/overlays/popover': {
        doc: OverlaysContent.PopoverDoc,
        demos: OverlaysContent.PopoverDemos,
        title: 'Popover',
    },
    'components/overlays/command': {
        doc: OverlaysContent.CommandDoc,
        demos: OverlaysContent.CommandDemos,
        title: 'Command',
    },
};
