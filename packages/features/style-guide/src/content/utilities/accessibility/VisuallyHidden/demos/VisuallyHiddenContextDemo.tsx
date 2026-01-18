import React from 'react';
import { VisuallyHidden, Text } from '@ui';
import { DemoCard } from '@pulwave/features-style-guide';

export const VisuallyHiddenContextDemo = () => {
    return (
        <DemoCard
            title="Additional Context"
            description="Add extra context for screen readers without visual clutter."
        >
            {() => (
                <div>
                    <Text as="p">
                        Total: <Text as="strong" weight="bold">$1,234.56</Text>
                        <VisuallyHidden> (including tax and shipping)</VisuallyHidden>
                    </Text>
                    <Text as="p" style={{ color: 'var(--color-on-surface-muted)', fontSize: '0.875rem' }}>
                        Screen readers will announce "Total: $1,234.56 (including tax and shipping)"
                    </Text>
                </div>
            )}
        </DemoCard>
    );
};
export default VisuallyHiddenContextDemo;
