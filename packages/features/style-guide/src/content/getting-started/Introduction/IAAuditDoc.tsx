/**
 * Getting Started - Information Architecture Audit Documentation
 */
import type { FoundationDoc } from '@pulwave/features-style-guide';

export const IAAuditDoc: FoundationDoc = {
    name: 'IA Audit',
    description: 'Information Architecture audit and organization of the Pulwave Design System.',
    sections: [
        {
            id: 'overview',
            title: 'Overview',
            content: `
The Pulwave Design System follows a hierarchical information architecture that mirrors our codebase structure and mental models.

**Core Principles:**
- **Findability** - Components are where you expect them
- **Scalability** - Structure supports growth
- **Consistency** - Similar items are grouped together
- **Discoverability** - Related content is easy to find
            `.trim(),
        },
        {
            id: 'navigation-structure',
            title: 'Navigation Structure',
            content: `
**Level 1: Top-Level Sections**
- Getting Started
- Foundation
- Components
- Patterns
- Data Visualization

**Level 2: Categories**
Each section contains related categories:

\`\`\`
Foundation/
├── Color
├── Typography
├── Spacing
├── Elevation
└── Motion

Components/
├── Forms
├── Navigation
├── Feedback
├── Layout
└── Data Display

Data Visualization/
├── Line & Area
├── Bar
├── Pie & Radial
├── Hierarchical
└── Geography
\`\`\`

**Level 3: Individual Items**
- Specific components or documentation pages
- Code examples and demos
- API references
            `.trim(),
        },
        {
            id: 'categorization',
            title: 'Component Categorization',
            content: `
Components are organized by **primary use case**:

**By Function:**
- Forms: Input, Select, Checkbox, Radio
- Navigation: Menu, Tabs, Breadcrumb
- Feedback: Alert, Toast, Modal
- Layout: Card, Grid, Stack

**By Data Type:**
- Data Display: Table, List, Avatar
- Data Visualization: Charts, Graphs

**By Interaction:**
- Actions: Button, IconButton
- Inputs: TextField, DatePicker

**Why This Matters:**
- Users search by what they need to do ("I need a form input")
- Not by technical implementation ("I need a controlled component")
- Categories reflect user mental models
            `.trim(),
        },
        {
            id: 'search-taxonomy',
            title: 'Search & Taxonomy',
            content: `
**Primary Keywords:**
Each component has primary keywords for search:

\`\`\`
Button:
- Primary: button, action, click
- Aliases: CTA, submit, link-button

Input:
- Primary: input, text-field, form
- Aliases: text-box, field, entry

Card:
- Primary: card, container, panel
- Aliases: box, surface, tile
\`\`\`

**Tag System:**
Components are tagged with:
- **Category**: Form, Navigation, etc.
- **Type**: Interactive, Display, Layout
- **Status**: Stable, Beta, Deprecated
- **Platform**: Web, Mobile, Universal
            `.trim(),
        },
        {
            id: 'documentation-structure',
            title: 'Documentation Structure',
            content: `
Each component follows a consistent documentation pattern:

**1. Overview**
- Component name and description
- When to use / When not to use
- Key features

**2. Demos**
- Basic example
- Variant examples
- Advanced usage
- Edge cases

**3. API Reference**
- Props table
- TypeScript types
- Default values

**4. Guidelines**
- Dos and Don'ts
- Accessibility notes
- Best practices

**5. Related Components**
- Similar components
- Complementary components
- Alternative solutions
            `.trim(),
        },
        {
            id: 'maintenance',
            title: 'Maintenance & Updates',
            content: `
**IA Review Schedule:**
- **Quarterly**: Review component categories
- **Bi-annually**: Audit navigation structure
- **Annually**: Full IA restructure if needed

**Update Triggers:**
- New component types (e.g., Data Visualization)
- User feedback on findability
- Search analytics showing gaps
- Significant feature additions

**Process:**
1. Identify gaps or confusion points
2. Propose restructure with team
3. Update navigation and registry
4. Add redirects for old paths
5. Update documentation
6. Communicate changes to users
            `.trim(),
        },
        {
            id: 'metrics',
            title: 'Success Metrics',
            content: `
**Measuring IA Effectiveness:**

**Quantitative:**
- Search success rate
- Time to find component
- Navigation depth (clicks to goal)
- Bounce rate on documentation pages

**Qualitative:**
- User interviews and testing
- Feedback on organization
- Support ticket themes
- Developer satisfaction surveys

**Targets:**
- 90%+ search success rate
- <30 seconds to find component
- <3 clicks to reach any page
- <5% bounce rate on component docs
            `.trim(),
        },
    ],
    dos: [
        'Group similar components together',
        'Use clear, descriptive category names',
        'Provide multiple paths to the same component',
        'Add comprehensive search keywords',
        'Review and update taxonomy regularly',
    ],
    donts: [
        'Create overly deep navigation hierarchies',
        'Use technical jargon in category names',
        'Orphan components without clear categories',
        'Ignore user feedback on organization',
        'Let the structure stagnate as the system grows',
    ],
};
