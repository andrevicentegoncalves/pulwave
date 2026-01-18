import React, { useState } from 'react';
import { FocusTrap, Button, Text } from '@ui';
import { DemoCard } from '@pulwave/features-style-guide';

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
export default FocusTrapModalDemo;
