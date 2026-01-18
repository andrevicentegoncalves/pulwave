import React from 'react';
import { ComponentDoc } from '@pulwave/features-style-guide';

const SidebarSectionDoc: ComponentDoc = {
    name: 'SidebarSection',
    description: 'A collapsible navigation section intended for use within the application sidebar.',
    usage: `
\`\`\`tsx
import { SidebarSection } from '@pulwave/ui';

<SidebarSection
    title="Menu"
    items={[{ key: '1', label: 'Home', icon: HomeIcon }]}
    onSelect={handleSelect}
/>
\`\`\`
`,
    props: [
        { name: 'title', type: "string", description: 'Section header.' },
        { name: 'items', type: "SidebarItem[]", description: 'List of navigation items.' },
        { name: 'activeKey', type: "string", description: 'Currently selected item key.' },
        { name: 'onSelect', type: "(item) => void", description: 'Selection callback.' },
        { name: 'isExpanded', type: "boolean", default: "true", description: 'Expanded/Collapsed state.' },
    ]
};

export default SidebarSectionDoc;
