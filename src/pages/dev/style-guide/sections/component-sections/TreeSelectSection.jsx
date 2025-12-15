import React, { useState } from 'react';
import { TreeSelect, AccordionSelect, TreeDropdown, ColumnChips, Card } from '../../../../../components/ui';
import { Table2 } from 'lucide-react';

/**
 * TreeSelect Section - Showcases tree-based multi-select components
 */
const TreeSelectSection = () => {
    // Sample tree data
    const sampleTreeData = [
        {
            id: 'profiles',
            label: 'profiles',
            icon: <Table2 size={14} />,
            children: [
                { id: 'profiles.name', label: 'name' },
                { id: 'profiles.description', label: 'description' },
                { id: 'profiles.bio', label: 'bio' },
                { id: 'profiles.avatar_url', label: 'avatar_url' },
            ]
        },
        {
            id: 'countries',
            label: 'countries',
            icon: <Table2 size={14} />,
            children: [
                { id: 'countries.name', label: 'name' },
                { id: 'countries.official_name', label: 'official_name' },
                { id: 'countries.native_name', label: 'native_name' },
            ]
        },
        {
            id: 'addresses',
            label: 'addresses',
            icon: <Table2 size={14} />,
            children: [
                { id: 'addresses.label', label: 'label' },
                { id: 'addresses.notes', label: 'notes' },
            ]
        },
    ];

    // Accordion data format (items instead of children)
    const sampleAccordionData = sampleTreeData.map(t => ({
        ...t,
        items: t.children,
    }));

    // States for demos
    const [treeSelected, setTreeSelected] = useState(['profiles.name', 'profiles.description', 'countries.name']);
    const [accordionSelected, setAccordionSelected] = useState(['profiles.bio', 'countries.official_name']);
    const [dropdownSelected, setDropdownSelected] = useState(['addresses.label']);

    // ColumnChips sample data
    const columnChipsData = {
        profiles: ['name', 'description', 'bio'],
        countries: ['name', 'official_name'],
        addresses: ['label', 'notes'],
    };

    return (
        <section className="style-guide__section" id="tree-select">
            <h2 className="style-guide__title">Tree & Accordion Multi-Select</h2>
            <p className="style-guide__intro">Hierarchical selection components for table→column configs</p>

            <div className="style-guide__grid style-guide__grid--2col">
                {/* TreeSelect */}
                <Card variant="elevated">
                    <h4 className="style-guide__subtitle">TreeSelect (Multi-Select Mode)</h4>
                    <p className="style-guide__description">Collapsible tree with checkboxes for parent/child selection</p>
                    <TreeSelect
                        data={sampleTreeData}
                        selectedItems={treeSelected}
                        onChange={setTreeSelected}
                        searchable={true}
                        showCounts={true}
                        expandAll={false}
                    />
                    <pre className="style-guide__code">
                        Selected: {JSON.stringify(treeSelected, null, 2)}
                    </pre>
                </Card>

                {/* TreeSelect Read-Only */}
                <Card variant="elevated">
                    <h4 className="style-guide__subtitle">TreeSelect (Read-Only Mode)</h4>
                    <p className="style-guide__description">Same tree without checkboxes - view only</p>
                    <TreeSelect
                        data={sampleTreeData}
                        selectedItems={treeSelected}
                        onChange={() => { }}
                        readOnly={true}
                        showCounts={true}
                        expandAll={true}
                    />
                </Card>

                {/* AccordionSelect */}
                <Card variant="elevated">
                    <h4 className="style-guide__subtitle">AccordionSelect (Multi-Select Mode)</h4>
                    <p className="style-guide__description">Accordion-style sections with selectable items</p>
                    <AccordionSelect
                        data={sampleAccordionData}
                        selectedItems={accordionSelected}
                        onChange={setAccordionSelected}
                        searchable={true}
                        showCounts={true}
                        allowMultipleOpen={true}
                    />
                    <pre className="style-guide__code">
                        Selected: {JSON.stringify(accordionSelected, null, 2)}
                    </pre>
                </Card>

                {/* AccordionSelect Read-Only */}
                <Card variant="elevated">
                    <h4 className="style-guide__subtitle">AccordionSelect (Read-Only Mode)</h4>
                    <p className="style-guide__description">Accordion without checkboxes - browsing mode</p>
                    <AccordionSelect
                        data={sampleAccordionData}
                        selectedItems={accordionSelected}
                        onChange={() => { }}
                        readOnly={true}
                        showCounts={true}
                    />
                </Card>

                {/* TreeDropdown */}
                <Card variant="elevated">
                    <h4 className="style-guide__subtitle">TreeDropdown</h4>
                    <p className="style-guide__description">Dropdown trigger with tree-structured multi-select</p>
                    <TreeDropdown
                        label="Select Columns"
                        data={sampleTreeData}
                        selectedItems={dropdownSelected}
                        onChange={setDropdownSelected}
                        placeholder="Choose columns..."
                        fullWidth
                    />
                    <pre className="style-guide__code">
                        Selected: {JSON.stringify(dropdownSelected, null, 2)}
                    </pre>
                </Card>

                {/* ColumnChips */}
                <Card variant="elevated">
                    <h4 className="style-guide__subtitle">ColumnChips</h4>
                    <p className="style-guide__description">Badge-style display of table→column hierarchy</p>
                    <ColumnChips
                        data={columnChipsData}
                        maxTablesShown={5}
                        maxColumnsShown={5}
                    />
                </Card>

                {/* ColumnChips Editable */}
                <Card variant="elevated">
                    <h4 className="style-guide__subtitle">ColumnChips (Editable)</h4>
                    <p className="style-guide__description">With remove buttons for editing</p>
                    <ColumnChips
                        data={columnChipsData}
                        editable={true}
                        onRemove={(table) => console.log('Remove table:', table)}
                        onRemoveColumn={(table, col) => console.log('Remove column:', table, col)}
                    />
                </Card>

                {/* ColumnChips Empty */}
                <Card variant="elevated">
                    <h4 className="style-guide__subtitle">ColumnChips (Empty State)</h4>
                    <p className="style-guide__description">When no items are selected</p>
                    <ColumnChips
                        data={{}}
                        emptyText="No columns configured"
                    />
                </Card>
            </div>
        </section>
    );
};

export default TreeSelectSection;
