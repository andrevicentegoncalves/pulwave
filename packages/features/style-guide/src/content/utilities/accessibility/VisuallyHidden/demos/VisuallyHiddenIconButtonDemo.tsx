import React from 'react';
import { VisuallyHidden, Button } from '@pulwave/ui';
import { Search, Download, Share2 } from '@pulwave/ui';
import { DemoCard } from '@pulwave/features-style-guide';

export const VisuallyHiddenIconButtonDemo = () => {
    return (
        <DemoCard
            title="Icon-Only Buttons"
            description="Buttons with icons have hidden accessible labels for screen readers."
        >
            {() => (
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <Button kind="secondary" variant="outlined">
                        <Search size={20} />
                        <VisuallyHidden>Search</VisuallyHidden>
                    </Button>
                    <Button kind="secondary" variant="outlined">
                        <Download size={20} />
                        <VisuallyHidden>Download</VisuallyHidden>
                    </Button>
                    <Button kind="secondary" variant="outlined">
                        <Share2 size={20} />
                        <VisuallyHidden>Share</VisuallyHidden>
                    </Button>
                </div>
            )}
        </DemoCard>
    );
};
export default VisuallyHiddenIconButtonDemo;
