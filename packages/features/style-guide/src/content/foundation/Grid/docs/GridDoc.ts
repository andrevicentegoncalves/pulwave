/**
 * GridDoc - Foundation documentation for Grid & Layout system
 */
import type { DocData } from '@pulwave/features-style-guide';

export const GridDoc: DocData = {
    name: 'Grid & Layout',
    description: 'The grid system provides a flexible, responsive foundation for page layouts using CSS Grid and Flexbox utilities.',
    sections: [
        {
            id: 'purpose',
            name: 'Purpose',
            content: `The grid system enables consistent, responsive layouts across all screen sizes. It provides structure for page composition while maintaining flexibility.`
        },
        {
            id: 'columns',
            name: 'Column System',
            content: `| Breakpoint | Columns | Gutter | Margin |
|------------|---------|--------|--------|
| xs (0-575px) | 4 | 16px | 16px |
| sm (576-767px) | 4 | 16px | 24px |
| md (768-991px) | 8 | 24px | 32px |
| lg (992-1199px) | 12 | 24px | 48px |
| xl (1200-1399px) | 12 | 32px | 64px |
| xxl (1400px+) | 12 | 32px | 80px |`
        },
        {
            id: 'containers',
            name: 'Container Widths',
            content: `| Token | Max Width | Use Case |
|-------|-----------|----------|
| \`--container-sm\` | 540px | Narrow content |
| \`--container-md\` | 720px | Medium content |
| \`--container-lg\` | 960px | Standard content |
| \`--container-xl\` | 1140px | Wide content |
| \`--container-xxl\` | 1320px | Full-width layouts |
| \`--container-fluid\` | 100% | Edge-to-edge |`
        },
        {
            id: 'usage',
            name: 'Usage',
            content: `\`\`\`scss
// Basic grid container
.layout {
    display: grid;
    grid-template-columns: repeat(12, 1fr);
    gap: var(--spacing-4);
}

// Responsive column span
.sidebar {
    grid-column: span 12;
    
    @include bp-up(md) {
        grid-column: span 3;
    }
}

.content {
    grid-column: span 12;
    
    @include bp-up(md) {
        grid-column: span 9;
    }
}
\`\`\``
        },
        {
            id: 'dodont',
            title: "Do / Don't",
            content: `### Do
- Use the 12-column grid for complex layouts
- Use CSS Grid for 2D layouts
- Use Flexbox for 1D layouts (rows or columns)
- Respect gutter and margin tokens

### Don't
- Nest grids more than 2 levels deep
- Mix grid systems (Bootstrap + custom)
- Use hardcoded widths instead of spans`
        }
    ]
};

export default GridDoc;
