import React from 'react';
import { Dropdown, DropdownItem, Button } from '@pulwave/ui';
import { DemoCard } from '@pulwave/features-style-guide';

const basicUsage = `<Dropdown trigger={<Button variant="secondary">Actions</Button>}>
    <DropdownItem onClick={handleEdit}>Edit</DropdownItem>
    <DropdownItem onClick={handleDelete}>Delete</DropdownItem>
</Dropdown>`;

/**
 * Basic dropdown demo
 */
export const DropdownBasicDemo = () => {
    return (
        <DemoCard
            title="Basic Dropdown"
            description="Simple action menu with items."
            sourceCode={basicUsage}
            showSourceToggle={true}
        >
            <Dropdown trigger={<Button kind="secondary" variant="outlined">Actions</Button>}>
                <DropdownItem onClick={() => alert('Edit clicked')}>Edit</DropdownItem>
                <DropdownItem onClick={() => alert('Duplicate clicked')}>Duplicate</DropdownItem>
                <DropdownItem onClick={() => alert('Delete clicked')}>Delete</DropdownItem>
            </Dropdown>
        </DemoCard>
    );
};

export default DropdownBasicDemo;
