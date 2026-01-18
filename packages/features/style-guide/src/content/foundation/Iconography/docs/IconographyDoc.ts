/**
 * Iconography Foundation Documentation
 */
import type { DocData } from '@pulwave/features-style-guide';

import IconLibraryShell from './IconLibraryShell/IconLibraryShell';

export const IconographyDoc: DocData = {
    name: 'Iconography',
    description: 'Icon tokens define consistent sizing, stroke width, and optical alignment for a cohesive visual language across the interface.',
    component: IconLibraryShell,
    sections: [
        {
            id: 'purpose',
            name: 'Purpose',
            content: `Icons provide visual shortcuts for actions, navigation, and status communication. Pulwave uses Lucide icons with customized sizing and stroke weights for optimal clarity.`
        },
        {
            id: 'scale',
            name: 'Icon Scale',
            content: `| Token | Size | Stroke | Use Case |
|-------|------|--------|----------|
| \`--icon-xs\` | 12px | 1.5px | Inline with small text |
| \`--icon-s\` | 16px | 1.5px | Buttons, form fields |
| \`--icon-m\` | 20px | 2px | Navigation, cards |
| \`--icon-l\` | 24px | 2px | Section headers |
| \`--icon-xl\` | 32px | 2px | Empty states, features |
| \`--icon-2xl\` | 48px | 2.5px | Hero sections |`
        },
        {
            id: 'usage',
            name: 'Usage Guidelines',
            content: `### Semantic Usage

- **Navigation**: Use filled icons for active states, outlined for inactive
- **Actions**: Use consistent icons for common actions (edit, delete, add)
- **Status**: Use color + icon for status indication (success, warning, error)

### Implementation

\`\`\`tsx
import { Icon } from '@pulwave/ui';
import { Settings, User, Bell } from 'lucide-react';

<Icon icon={Settings} size="m" />
<Icon icon={User} size="l" color="primary" />
\`\`\``
        },
        {
            id: 'accessibility',
            name: 'Icon Accessibility',
            content: `| Scenario | Requirement |
|----------|-------------|
| Decorative icons | \`aria-hidden="true"\` |
| Icon-only buttons | \`aria-label="Action name"\` |
| Meaningful icons | \`role="img" aria-label="Description"\` |
| Status icons | Pair with visible text or announcement |`
        },
        {
            id: 'dodont',
            name: 'Do / Don\'t',
            content: `### Do
- Use icons from the approved Lucide library
- Maintain consistent sizing within contexts
- Pair icon-only buttons with tooltips
- Use semantic colors for status icons

### Don't
- Mix icon libraries (Lucide + FontAwesome)
- Use icons without accessible alternatives
- Scale icons with transform (use size prop)
- Create custom icons without design approval`
        }
    ]
};

export default IconographyDoc;
