/**
 * Getting Started Registry
 * Docs for introduction and setup guides
 */
import type { ComponentRegistry } from '../types';

import {
    OverviewDoc,
    PrinciplesDoc,
    ForDesignersDoc,
    ForDevelopersDoc,
    IAAuditDoc,
} from '../../content/getting-started/Introduction/docs';

export const gettingStartedRegistry: ComponentRegistry = {
    'getting-started/introduction/overview': {
        doc: OverviewDoc,
        title: 'Overview',
    },
    'getting-started/introduction/principles': {
        doc: PrinciplesDoc,
        title: 'Design Principles',
    },
    'getting-started/introduction/for-designers': {
        doc: ForDesignersDoc,
        title: 'For Designers',
    },
    'getting-started/introduction/for-developers': {
        doc: ForDevelopersDoc,
        title: 'For Developers',
    },
    'getting-started/introduction/ia-audit': {
        doc: IAAuditDoc,
        title: 'IA Audit',
    },
};
