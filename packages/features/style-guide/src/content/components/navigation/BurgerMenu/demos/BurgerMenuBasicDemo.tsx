import React, { useState } from 'react';
import { BurgerMenu, Text } from '@ui';
import { DemoCard } from '@pulwave/features-style-guide';

const basicUsage = `<BurgerMenu
    isOpen={isOpen}
    onClick={() => setIsOpen(!isOpen)}
/>`;

/**
 * Basic BurgerMenu demo
 */
export const BurgerMenuBasicDemo = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <DemoCard
            title="Basic BurgerMenu"
            description="Click to toggle between hamburger and X states."
            sourceCode={basicUsage}
            showSourceToggle={true}
        >
            <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                <BurgerMenu
                    isOpen={isOpen}
                    onClick={() => setIsOpen(!isOpen)}
                />
                <Text color="muted">
                    Menu is {isOpen ? 'open' : 'closed'}
                </Text>
            </div>
        </DemoCard>
    );
};

export default BurgerMenuBasicDemo;
