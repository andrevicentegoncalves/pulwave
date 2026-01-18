/**
 * VisuallyHidden Demos
 */
import React from 'react';
import { VisuallyHidden, Button, Icon, Text } from '@ui';
import { Search, Download, Share2 } from '@ui';
import { DemoCard } from '@pulwave/features-style-guide';

/**
 * Icon button with hidden label
 */
export const VisuallyHiddenIconButtonDemo = () => {
    return (
        <DemoCard
            title="Icon-Only Buttons"
            description="Buttons with icons have hidden accessible labels for screen readers."
        >
            {() => (
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <Button variant="secondary">
                        <Search size={20} />
                        <VisuallyHidden>Search</VisuallyHidden>
                    </Button>
                    <Button variant="secondary">
                        <Download size={20} />
                        <VisuallyHidden>Download</VisuallyHidden>
                    </Button>
                    <Button variant="secondary">
                        <Share2 size={20} />
                        <VisuallyHidden>Share</VisuallyHidden>
                    </Button>
                </div>
            )}
        </DemoCard>
    );
};

/**
 * Skip link demo
 */
export const VisuallyHiddenSkipLinkDemo = () => {
    return (
        <DemoCard
            title="Skip Link"
            description="Tab to reveal the skip link (focusable variant). It becomes visible on focus."
        >
            {() => (
                <div>
                    <VisuallyHidden focusable>
                        <Text
                            as="a"
                            href="#main-content"
                            style={{
                                display: 'block',
                                padding: '1rem',
                                background: 'var(--color-primary-500)',
                                color: 'var(--color-on-primary)',
                                textDecoration: 'none'
                            }}
                        >
                            Skip to main content
                        </Text>
                    </VisuallyHidden>
                    <Text as="p" style={{ marginTop: '1rem' }}>
                        Press Tab to focus the skip link above. It will become visible when focused.
                    </Text>
                </div>
            )}
        </DemoCard>
    );
};

/**
 * Additional context demo
 */
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
