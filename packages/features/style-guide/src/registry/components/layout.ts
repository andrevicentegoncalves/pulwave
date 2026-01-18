/**
 * Layout Registry
 * Components for structural layout and composition
 */
import type { ComponentRegistry } from '../types';

// Docs
import { default as BoxDoc } from '../../content/components/layout/Box/docs/BoxDoc';
import { default as DividerDoc } from '../../content/components/layout/Divider/docs/DividerDoc';
import { default as FormGridDoc } from '../../content/components/layout/FormGrid/docs/FormGridDoc';
import { default as GridDoc } from '../../content/components/layout/Grid/docs/GridDoc';
import { default as InlineDoc } from '../../content/components/layout/Inline/docs/InlineDoc';
import { default as ScrollAreaDoc } from '../../content/components/layout/ScrollArea/docs/ScrollAreaDoc';
import { default as SectionHeaderDoc } from '../../content/components/layout/SectionHeader/docs/SectionHeaderDoc';
import { default as SplitPaneDoc } from '../../content/components/layout/SplitPane/docs/SplitPaneDoc';
import { default as StackDoc } from '../../content/components/layout/Stack/docs/StackDoc';

// Demos
import * as BoxDemos from '../../content/components/layout/Box/demos';
import * as DividerDemos from '../../content/components/layout/Divider/demos';
import * as FormGridDemos from '../../content/components/layout/FormGrid/demos';
import * as GridDemos from '../../content/components/layout/Grid/demos';
import * as InlineDemos from '../../content/components/layout/Inline/demos';
import * as ScrollAreaDemos from '../../content/components/layout/ScrollArea/demos';
import * as SectionHeaderDemos from '../../content/components/layout/SectionHeader/demos';
import * as SplitPaneDemos from '../../content/components/layout/SplitPane/demos';
import * as StackDemos from '../../content/components/layout/Stack/demos';

export const layoutRegistry: ComponentRegistry = {
    'components/layout/box': {
        doc: BoxDoc,
        demos: BoxDemos,
        title: 'Box',
    },
    'components/layout/divider': {
        doc: DividerDoc,
        demos: DividerDemos,
        title: 'Divider',
    },
    'components/layout/form-grid': {
        doc: FormGridDoc,
        demos: FormGridDemos,
        title: 'FormGrid',
    },
    'components/layout/grid': {
        doc: GridDoc,
        demos: GridDemos,
        title: 'Grid',
    },
    'components/layout/inline': {
        doc: InlineDoc,
        demos: InlineDemos,
        title: 'Inline',
    },
    'components/layout/scroll-area': {
        doc: ScrollAreaDoc,
        demos: ScrollAreaDemos,
        title: 'ScrollArea',
    },
    'components/layout/section-header': {
        doc: SectionHeaderDoc,
        demos: SectionHeaderDemos,
        title: 'SectionHeader',
    },
    'components/layout/split-pane': {
        doc: SplitPaneDoc,
        demos: SplitPaneDemos,
        title: 'SplitPane',
    },
    'components/layout/stack': {
        doc: StackDoc,
        demos: StackDemos,
        title: 'Stack',
    },
};
