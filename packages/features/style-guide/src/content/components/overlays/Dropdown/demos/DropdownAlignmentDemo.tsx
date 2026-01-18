import React from 'react';
import { Dropdown, DropdownItem, Button } from '@pulwave/ui';
import { DemoCard } from '@pulwave/features-style-guide';

const alignmentUsage = `<Dropdown align="left" trigger={<Button>Left</Button>}>
    <DropdownItem>Option 1</DropdownItem>
</Dropdown>

<Dropdown align="right" trigger={<Button>Right</Button>}>
    <DropdownItem>Option 1</DropdownItem>
</Dropdown>`;

/**
 * Right-aligned dropdown
 */
export const DropdownAlignmentDemo = () => {
    return (
        <DemoCard
            title="Alignment"
            description="Dropdown menu can align left or right."
            sourceCode={alignmentUsage}
            showSourceToggle={true}
        >
            <div style={{ display: 'flex', gap: '2rem', justifyContent: 'space-between' }}>
                <Dropdown trigger={<Button kind="secondary" variant="outlined">Left Aligned</Button>} align="left">
                    <DropdownItem onClick={() => { }}>Option 1</DropdownItem>
                    <DropdownItem onClick={() => { }}>Option 2</DropdownItem>
                </Dropdown>
                <Dropdown trigger={<Button kind="secondary" variant="outlined">Right Aligned</Button>} align="right">
                    <DropdownItem onClick={() => { }}>Option 1</DropdownItem>
                    <DropdownItem onClick={() => { }}>Option 2</DropdownItem>
                </Dropdown>
            </div>
        </DemoCard>
    );
};

export default DropdownAlignmentDemo;
