import React from 'react';
import { ComponentDoc } from '@pulwave/features-style-guide';

const GroupRowDoc: ComponentDoc = {
    name: 'GroupRow',
    description: 'An expandable row component designed for displaying grouped data items, particularly useful for localization/translation management interfaces.',
    status: 'stable',
    overview: {
        description: 'Expandable row for grouped data items.',
    },
    props: [
        { name: 'title', type: "string", description: 'Group title.' },
        { name: 'items', type: "Array<GroupRowItem>", description: 'Array of data items to display when expanded.' },
        { name: 'icon', type: "ReactNode", description: 'Optional icon.' },
        { name: 'count', type: "number", description: 'Explicit count to display.' },
        { name: 'onEdit', type: "(item) => void", description: 'Edit callback.' },
        { name: 'onDelete', type: "(item) => void", description: 'Delete callback.' },
    ]
};

export default GroupRowDoc;
