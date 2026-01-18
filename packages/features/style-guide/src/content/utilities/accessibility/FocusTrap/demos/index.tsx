/**
 * FocusTrap Demos
 */
import React, { useState } from 'react';
import { FocusTrap, Button, Input, Text } from '@ui';
import { DemoCard } from '@pulwave/features-style-guide';

/**
 * Basic focus trap demo
 */
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

/**
 * Modal-like focus trap demo
 */
export const FocusTrapModalDemo = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <DemoCard
            title="Modal-like Behavior"
            description="Focus trap with overlay behavior and return focus on close."
        >
            {() => (
                <div>
                    <Button onClick={() => setIsOpen(true)}>Open Modal</Button>

                    {isOpen && (
                        <div style={{
                            position: 'fixed',
                            inset: 0,
                            background: 'rgba(0,0,0,0.5)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            zIndex: 1000
                        }}>
                            <FocusTrap
                                active={isOpen}
                                onEscape={() => setIsOpen(false)}
                                returnFocus
                            >
                                <div
                                    role="dialog"
                                    aria-modal="true"
                                    aria-labelledby="modal-title"
                                    style={{
                                        background: 'var(--color-surface-default)',
                                        padding: '2rem',
                                        borderRadius: 'var(--border-radius-l)',
                                        maxWidth: '400px'
                                    }}
                                >
                                    <Text as="h3" category="title" size="m" id="modal-title">Trapped Modal</Text>
                                    <Text>Focus cannot leave this dialog until closed.</Text>
                                    <Button onClick={() => setIsOpen(false)}>Close</Button>
                                </div>
                            </FocusTrap>
                        </div>
                    )}
                </div>
            )}
        </DemoCard>
    );
};
