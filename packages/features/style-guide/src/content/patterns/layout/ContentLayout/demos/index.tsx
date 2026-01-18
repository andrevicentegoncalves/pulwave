import { ContentLayout } from '@pulwave/widgets';

export const Variants = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div>
            <p><strong>Wide (Default)</strong></p>
            <ContentLayout variant="wide">
                <div style={{ background: 'var(--bg-accent-subtle)', padding: '20px', textAlign: 'center' }}>
                    Standard content width
                </div>
            </ContentLayout>
        </div>
        <div>
            <p><strong>XL</strong></p>
            <ContentLayout variant="xl">
                <div style={{ background: 'var(--bg-accent-subtle)', padding: '20px', textAlign: 'center' }}>
                    Extra wide content
                </div>
            </ContentLayout>
        </div>
    </div>
);
