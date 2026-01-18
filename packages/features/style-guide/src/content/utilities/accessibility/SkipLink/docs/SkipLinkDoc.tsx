import React from 'react';
import { ComponentDoc } from '@pulwave/features-style-guide';

const SkipLinkDoc: ComponentDoc = {
  name: 'SkipLink',
  description: 'An accessible navigation bypass link. Hidden by default, it becomes visible when focused, allowing keyword users to skip repetitive navigation.',
  usage: `
\`\`\`tsx
import { SkipLink } from '@pulwave/ui';

<body>
  <SkipLink targetId="main-content" />
  <nav>...</nav>
  <main id="main-content">
    ...
  </main>
</body>
\`\`\`
`,
  props: [
    { name: 'targetId', type: "string", default: "'main-content'", description: 'ID of the element to jump to.' },
    { name: 'children', type: "ReactNode", default: "'Skip to main content'", description: 'Link text.' },
  ]
};

export default SkipLinkDoc;
