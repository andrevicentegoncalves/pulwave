import React from 'react';
import { BurgerMenu, Text } from '@ui';
import { DemoCard } from '@pulwave/features-style-guide';

const statesUsage = `<BurgerMenu isOpen={false} onClick={() => {}} />
<BurgerMenu isOpen={true} onClick={() => {}} />`;

/**
 * BurgerMenu states demo
 */
export const BurgerMenuStatesDemo = () => {
    return (
        <DemoCard
            title="States Comparison"
            description="Side-by-side comparison of closed and open states."
            sourceCode={statesUsage}
            showSourceToggle={true}
        >
            <div style={{ display: 'flex', gap: '3rem', alignItems: 'center' }}>
                <div style={{ textAlign: 'center' }}>
                    <BurgerMenu isOpen={false} onClick={() => { }} />
                    <Text size="s" color="muted" style={{ marginTop: '0.5rem' }}>
                        Closed
                    </Text>
                </div>
                <div style={{ textAlign: 'center' }}>
                    <BurgerMenu isOpen={true} onClick={() => { }} />
                    <Text size="s" color="muted" style={{ marginTop: '0.5rem' }}>
                        Open
                    </Text>
                </div>
            </div>
        </DemoCard>
    );
};

export default BurgerMenuStatesDemo;
