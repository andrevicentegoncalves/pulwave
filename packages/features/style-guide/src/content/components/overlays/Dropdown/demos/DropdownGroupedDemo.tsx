import React from 'react';
import { Dropdown, DropdownItem, DropdownLabel, DropdownDivider, Button } from '@ui';
import { DemoCard } from '@pulwave/features-style-guide';

const groupedUsage = `<Dropdown trigger={<Button>Menu</Button>}>
    <DropdownLabel>Edit</DropdownLabel>
    <DropdownItem>Cut</DropdownItem>
    <DropdownItem>Copy</DropdownItem>
    <DropdownDivider />
    <DropdownLabel>Actions</DropdownLabel>
    <DropdownItem>Share</DropdownItem>
</Dropdown>`;

/**
 * Grouped dropdown
 */
export const DropdownGroupedDemo = () => {
    return (
        <DemoCard
            title="Grouped Items"
            description="Organize items with labels and dividers."
            sourceCode={groupedUsage}
            showSourceToggle={true}
        >
            <Dropdown trigger={<Button kind="secondary">Menu</Button>}>
                <DropdownLabel>Edit</DropdownLabel>
                <DropdownItem onClick={() => { }}>Cut</DropdownItem>
                <DropdownItem onClick={() => { }}>Copy</DropdownItem>
                <DropdownItem onClick={() => { }}>Paste</DropdownItem>
                <DropdownDivider />
                <DropdownLabel>Actions</DropdownLabel>
                <DropdownItem onClick={() => { }}>Share</DropdownItem>
                <DropdownItem onClick={() => { }}>Export</DropdownItem>
            </Dropdown>
        </DemoCard>
    );
};

export default DropdownGroupedDemo;
