/**
 * Grid/Elevation Foundation - Demos Index
 *
 * Comprehensive demos for the grid and elevation system
 */
import { DemoCard } from '@pulwave/features-style-guide';
import { Text } from "@pulwave/ui";
import ElevationScaleDemo from './ElevationScaleDemo';

// Z-Index Demo
const zIndexUsage = `// Usage of z-index tokens
// CSS Variables:
// --z-index-base (0)
// --z-index-dropdown (100)
// --z-index-sticky (200)
// --z-index-overlay (300)
// --z-index-modal (400)
// --z-index-toast (500)
// --z-index-tooltip (600)

<div style={{ zIndex: 'var(--z-index-sticky)' }}>
    Sticky Content
</div>`;

export const ZIndexDemo = () => (
    <DemoCard sourceCode={zIndexUsage} showSourceToggle={true}
        title="Z-Index Layers"
        description="Visualizing the z-index stacking context."
    >
        <div className="z-index-demo">
            <div className="z-index-demo__stack">
                {[
                    { name: 'tooltip', value: 600 },
                    { name: 'toast', value: 500 },
                    { name: 'modal', value: 400 },
                    { name: 'overlay', value: 300 },
                    { name: 'sticky', value: 200 },
                    { name: 'dropdown', value: 100 },
                    { name: 'base', value: 0 },
                ].map(({ name, value }, index) => (
                    <div
                        key={name}
                        className="z-index-demo__layer"
                        style={{
                            transform: `translateY(${index * 8}px) translateX(${index * 8}px)`,
                            zIndex: value
                        }}
                    >
                        <Text as="span" variant="body-xs" weight="medium">{name} ({value})</Text>
                    </div>
                ))}
            </div>
        </div>
    </DemoCard>
);

// Grid Layout Demo
const gridUsage = `// The 12-column grid system is typically handled via layout components or CSS Grid.
// This is a visualization of the underlying 12-column structure.

<div className="grid-container">
    <div className="col-4">...</div>
    <div className="col-8">...</div>
</div>`;

export const GridLayoutDemo = () => (
    <DemoCard sourceCode={gridUsage} showSourceToggle={true}
        title="Grid System"
        description="12-column flexible grid system."
    >
        <div className="grid-layout-demo">
            <Text as="h4" variant="heading-s" className="mb-4">12-Column Grid</Text>
            <div className="grid-layout-demo__container">
                {Array.from({ length: 12 }).map((_, i) => (
                    <div key={i} className="grid-layout-demo__column">
                        {i + 1}
                    </div>
                ))}
            </div>

            <Text as="h4" variant="heading-s" className="mb-4 mt-8">Common Layouts</Text>
            <div className="grid-layout-demo__examples">
                <div className="grid-layout-demo__example">
                    <div className="grid-layout-demo__col-4">4</div>
                    <div className="grid-layout-demo__col-8">8</div>
                </div>
                <div className="grid-layout-demo__example">
                    <div className="grid-layout-demo__col-6">6</div>
                    <div className="grid-layout-demo__col-6">6</div>
                </div>
                <div className="grid-layout-demo__example">
                    <div className="grid-layout-demo__col-3">3</div>
                    <div className="grid-layout-demo__col-3">3</div>
                    <div className="grid-layout-demo__col-3">3</div>
                    <div className="grid-layout-demo__col-3">3</div>
                </div>
            </div>
        </div>
    </DemoCard>
);

export const GridDemos = [ElevationScaleDemo, ZIndexDemo, GridLayoutDemo];
