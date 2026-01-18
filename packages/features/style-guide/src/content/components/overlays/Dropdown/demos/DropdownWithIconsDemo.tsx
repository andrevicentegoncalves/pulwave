import React from 'react';
import { Dropdown, DropdownItem, DropdownDivider, Button } from '@pulwave/ui';
import { Edit, Trash2, Archive, Copy, MoreVertical } from '@pulwave/ui';
import { DemoCard } from '@pulwave/features-style-guide';

const iconsUsage = `<Dropdown trigger={<Button><MoreVertical /></Button>}>
    <DropdownItem icon={<Edit size={16} />}>Edit</DropdownItem>
    <DropdownItem icon={<Copy size={16} />}>Duplicate</DropdownItem>
    <DropdownDivider />
    <DropdownItem icon={<Trash2 size={16} />}>Delete</DropdownItem>
</Dropdown>`;

/**
 * Dropdown with icons
 */
export const DropdownWithIconsDemo = () => {
    return (
        <DemoCard
            title="With Icons"
            description="Dropdown items with leading icons."
            sourceCode={iconsUsage}
            showSourceToggle={true}
        >
            <Dropdown trigger={<Button kind="secondary" variant="outlined" aria-label="More options"><MoreVertical aria-hidden="true" /></Button>}>
                <DropdownItem icon={<Edit size={16} />} onClick={() => { }}>Edit</DropdownItem>
                <DropdownItem icon={<Copy size={16} />} onClick={() => { }}>Duplicate</DropdownItem>
                <DropdownItem icon={<Archive size={16} />} onClick={() => { }}>Archive</DropdownItem>
                <DropdownDivider />
                <DropdownItem icon={<Trash2 size={16} />} onClick={() => { }}>Delete</DropdownItem>
            </Dropdown>
        </DemoCard>
    );
};

export default DropdownWithIconsDemo;
