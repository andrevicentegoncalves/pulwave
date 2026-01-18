/**
 * Actions Registry
 * Components for user actions and triggers
 */
import type { ComponentRegistry } from '../types';
import * as ActionsContent from '../../content/components/actions';

export const actionsRegistry: ComponentRegistry = {
    'components/actions/button': {
        doc: ActionsContent.ButtonDoc,
        demos: ActionsContent.ButtonDemos,
        title: 'Button',
    },
    'components/actions/floating-action-button': {
        doc: ActionsContent.FloatingActionButtonDoc,
        demos: ActionsContent.FloatingActionButtonDemos,
        title: 'FloatingActionButton',
    },
    'components/actions/link': {
        doc: ActionsContent.LinkDoc,
        demos: ActionsContent.LinkDemos,
        title: 'Link',
    },
    'components/actions/segmented-control': {
        doc: ActionsContent.SegmentedControlDoc,
        demos: ActionsContent.SegmentedControlDemos,
        title: 'SegmentedControl',
    },
    'components/actions/split-button': {
        doc: ActionsContent.SplitButtonDoc,
        demos: ActionsContent.SplitButtonDemos,
        title: 'SplitButton',
    },
};
