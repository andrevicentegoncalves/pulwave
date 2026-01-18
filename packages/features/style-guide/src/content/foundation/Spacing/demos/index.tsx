/**
 * Spacing Foundation - Demos Index
 *
 * Comprehensive demos for the spacing system
 */
import { Text } from "@pulwave/ui";
import { DemoCard } from '@pulwave/features-style-guide';
import SpacingScaleDemo from './SpacingScaleDemo';

// Component Spacing Demo
const componentSpacingCode = `<div className="card">
    <div style={{ marginBottom: 'var(--spacing-4)' }}>Header</div>
    <div style={{ padding: 'var(--spacing-3)' }}>Content</div>
</div>`;

export const ComponentSpacingDemo = () => (
    <DemoCard sourceCode={componentSpacingCode} showSourceToggle={true} title="Component Spacing" description="Applying spacing tokens to components.">
        <div className="component-spacing-demo">
            <Text as="h4" category="title" size="s" weight="bold">Card with Standard Spacing</Text>
            <div className="component-spacing-demo__card">
                <div className="component-spacing-demo__header">Card Header</div>
                <div className="component-spacing-demo__body">
                    <Text>Content uses consistent spacing tokens for padding and gaps.</Text>
                </div>
                <div className="component-spacing-demo__footer">
                    <button>Action</button>
                </div>
            </div>

            <Text as="h4" category="title" size="s" weight="bold">Form Field Spacing</Text>
            <div className="component-spacing-demo__form">
                <div className="component-spacing-demo__field">
                    <Text as="label" size="s" weight="medium" htmlFor="spacing-demo-field-1">Label (spacing-2 below)</Text>
                    <input type="text" id="spacing-demo-field-1" placeholder="Input field…" />
                    <Text size="xs" color="muted">Helper text (spacing-1 above)</Text>
                </div>
                <div className="component-spacing-demo__field">
                    <Text as="label" size="s" weight="medium" htmlFor="spacing-demo-field-2">Label</Text>
                    <input type="text" id="spacing-demo-field-2" placeholder="Another field…" />
                </div>
            </div>
        </div>
    </DemoCard>
);

// Grid Gap Demo
const gridGapCode = `<div style={{ display: 'grid', gap: 'var(--spacing-4)' }}>
    <Text>Item 1</Text>
    <Text>Item 2</Text>
</div>`;

export const GridGapDemo = () => (
    <DemoCard sourceCode={gridGapCode} showSourceToggle={true} title="Grid Gaps" description="Using spacing tokens for layout gaps.">
        <div className="grid-gap-demo">
            <Text as="h4" category="title" size="s" weight="bold">Small Gap (spacing-2)</Text>
            <div className="grid-gap-demo__grid grid-gap-demo__grid--small">
                <div className="grid-gap-demo__item"><Text>1</Text></div>
                <div className="grid-gap-demo__item"><Text>2</Text></div>
                <div className="grid-gap-demo__item"><Text>3</Text></div>
                <div className="grid-gap-demo__item"><Text>4</Text></div>
            </div>

            <Text as="h4" category="title" size="s" weight="bold">Medium Gap (spacing-4)</Text>
            <div className="grid-gap-demo__grid grid-gap-demo__grid--medium">
                <div className="grid-gap-demo__item"><Text>1</Text></div>
                <div className="grid-gap-demo__item"><Text>2</Text></div>
                <div className="grid-gap-demo__item"><Text>3</Text></div>
                <div className="grid-gap-demo__item"><Text>4</Text></div>
            </div>

            <Text as="h4" category="title" size="s" weight="bold">Large Gap (spacing-6)</Text>
            <div className="grid-gap-demo__grid grid-gap-demo__grid--large">
                <div className="grid-gap-demo__item"><Text>1</Text></div>
                <div className="grid-gap-demo__item"><Text>2</Text></div>
                <div className="grid-gap-demo__item"><Text>3</Text></div>
                <div className="grid-gap-demo__item"><Text>4</Text></div>
            </div>
        </div>
    </DemoCard>
);

export { default as SpacingScaleDemo } from './SpacingScaleDemo';
export const SpacingDemos = [SpacingScaleDemo, ComponentSpacingDemo, GridGapDemo];
