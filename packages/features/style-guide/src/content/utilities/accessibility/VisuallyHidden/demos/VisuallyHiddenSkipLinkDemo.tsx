import { VisuallyHidden, Text } from '@pulwave/ui';
import { DemoCard } from '@pulwave/features-style-guide';

export const VisuallyHiddenSkipLinkDemo = () => {
    return (
        <DemoCard
            title="Skip Link"
            description="Tab to reveal the skip link (focusable variant). It becomes visible on focus."
        >
            <div>
                <VisuallyHidden focusable>
                    <a
                        href="#main-content"
                        style={{
                            display: 'block',
                            padding: '1rem',
                            background: 'var(--color-primary-500)',
                            color: 'var(--color-on-primary)',
                            textDecoration: 'none',
                            borderRadius: '4px',
                            fontWeight: 'bold'
                        }}
                    >
                        Skip to main content
                    </a>
                </VisuallyHidden>
                <Text as="p" style={{ marginTop: '1rem' }}>
                    Press Tab to focus the skip link above. It will become visible when focused.
                </Text>
            </div>
        </DemoCard>
    );
};
export default VisuallyHiddenSkipLinkDemo;
