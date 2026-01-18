/**
 * Forms Pattern Documentation
 * Comprehensive guide to building forms with Pulwave components
 */
import { lazy } from 'react';
import type { DocumentationItem } from '@pulwave/features-style-guide';

const FormsPage = lazy(() => import('./FormsPage'));

export const FormsDoc: DocumentationItem = {
    id: 'forms-pattern',
    name: 'Forms',
    description: 'Comprehensive form patterns using Input, Select, Checkbox, TextArea, and Button components. Examples include login forms, contact forms, and multi-step forms.',
    category: 'patterns',
    status: 'stable',
    component: FormsPage,
    dependencies: ['Input', 'Select', 'Checkbox', 'TextArea', 'Button', 'FormGrid'],
    designer: 'Pulwave Team',
    tags: ['form', 'input', 'select', 'checkbox', 'login', 'contact', 'pattern'],
    lastUpdated: '2026-01-09',
};

export default FormsDoc;
