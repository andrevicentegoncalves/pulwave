import React from 'react';
import { ComponentDoc } from '@pulwave/features-style-guide';

const LogoDoc: ComponentDoc = {
    name: 'Logo',
    description: 'The official brand logo component. Supports full and mark-only variants, resizing, and collapsed states.',
    status: 'stable',
    overview: {
        description: 'Brand logo with support for full and mark-only modes.',
    },
    props: [
        { name: 'variant', type: "'full' | 'mark'", default: "'full'", description: 'Full logo (icon + text) or icon only.' },
        { name: 'size', type: "'s' | 'm' | 'l'", default: "'m'", description: 'Size of the logo.' },
        { name: 'collapsed', type: "boolean", default: "false", description: 'Hides text even if variant is full.' },
        { name: 'title', type: "string", description: 'Custom title override.' },
        { name: 'subtitle', type: "string", description: 'Optional subtitle text.' },
    ]
};

export default LogoDoc;
