import { ComponentDoc } from '@pulwave/features-style-guide';

const PulwaveProviderDoc: ComponentDoc = {
    name: 'PulwaveProvider',
    description: 'The root provider component that manages global state for the design system, including theme, text direction (RTL/LTR), and density.',
    usage: `
\`\`\`tsx
import { PulwaveProvider } from '@pulwave/ui';

const App = () => (
  <PulwaveProvider defaultTheme="system" defaultDirection="ltr">
    <YourApp />
  </PulwaveProvider>
);
\`\`\`
`,
    props: [
        { name: 'defaultTheme', type: "'light' | 'dark' | 'system'", default: "'system'", description: 'Initial theme.' },
        { name: 'defaultDirection', type: "'ltr' | 'rtl'", default: "'ltr'", description: 'Initial text direction.' },
        { name: 'defaultDensity', type: "'compact' | 'comfortable' | 'spacious'", default: "'comfortable'", description: 'Initial UI density.' },
    ]
};

export default PulwaveProviderDoc;
