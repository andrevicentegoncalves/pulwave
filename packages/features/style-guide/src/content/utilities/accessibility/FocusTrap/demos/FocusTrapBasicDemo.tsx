import React, { useState } from 'react';
import { FocusTrap, Button, Input, Text } from '@ui';
import { DemoCard } from '@pulwave/features-style-guide';

export const FocusTrapBasicDemo = () => {
    const [isActive, setIsActive] = useState(false);

    return (
        <DemoCard
            title="Basic Focus Trap"
            description="Tab cycles through elements within the trap. Press Escape to deactivate."
        >
            {() => (
                <div>
                    <Button onClick={() => setIsActive(true)} disabled={isActive}>
                        Activate Focus Trap
                    </Button>

                    {isActive && (
                        <FocusTrap
                            active={isActive}
                            onEscape={() => setIsActive(false)}
                        >
                            <div style={{
                                marginTop: '1rem',
                                padding: '1.5rem',
                                border: '2px solid var(--color-primary-500)',
                                borderRadius: 'var(--border-radius-m)'
                            }}>
                                <Text>Focus is now trapped. Tab through these elements:</Text>
                                <Input label="First Input" style={{ marginBottom: '0.75rem' }} />
                                <Input label="Second Input" style={{ marginBottom: '0.75rem' }} />
                                <Button onClick={() => setIsActive(false)}>
                                    Deactivate (or press Escape)
                                </Button>
                            </div>
                        </FocusTrap>
                    )}
                </div>
            )}
        </DemoCard>
    );
};
export default FocusTrapBasicDemo;
