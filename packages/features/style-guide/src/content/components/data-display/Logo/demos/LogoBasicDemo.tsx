import React from 'react';
import { Logo, Stack } from '@pulwave/ui';
import { DemoCard } from '@pulwave/features-style-guide';

export const LogoBasicDemo = () => {
    return (
        <DemoCard title="Logo Variants" description="Different presentation styles for the brand logo.">
            <Stack gap="6" direction="row" align="center">
                <Logo variant="full" size="m" />
                <Logo variant="mark" size="m" />
                <Logo variant="full" size="m" collapsed />
                <div style={{ background: '#000', padding: '1rem', borderRadius: '4px', color: 'white' }}>
                    <Logo variant="full" size="m" title="Dark Mode" />
                </div>
            </Stack>
        </DemoCard>
    );
};

