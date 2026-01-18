import React from 'react';
import { ComponentDoc } from '@pulwave/features-style-guide';

const LiveRegionDoc: ComponentDoc = {
  name: 'LiveRegion',
  description: 'Manages ARIA live regions to announce dynamic content changes to screen readers without moving focus.',
  usage: `
\`\`\`tsx
import { LiveRegion, useAnnounceContext } from '@pulwave/ui';

// Wrap your app
<LiveRegion>
  <App />
</LiveRegion>

// Use hook in components
const MyComponent = () => {
  const { announce } = useAnnounceContext();
  
  const handleSave = () => {
    save();
    announce("Changes saved successfully");
  };
};
\`\`\`
`,
  props: [
    { name: 'announce(message, priority)', type: "function", description: 'Trigger an announcement.' },
    { name: 'priority', type: "'polite' | 'assertive'", default: "'polite'", description: 'Polite waits for silence; assertive interrupts.' },
  ]
};

export default LiveRegionDoc;
