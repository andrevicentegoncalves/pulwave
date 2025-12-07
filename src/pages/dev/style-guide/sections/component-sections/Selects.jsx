import React, { useState } from 'react';
import { Select, MultiSelectDropdown, SearchInput } from '../../../../../components/ui';
import { Card } from '../../../../../components/ui';

export default function Selects() {
    const [selectedSingle, setSelectedSingle] = useState('');
    const [selectedMulti, setSelectedMulti] = useState([]);
    const [searchValue, setSearchValue] = useState('');

    const options = [
        { value: 'apple', label: 'Apple' },
        { value: 'banana', label: 'Banana' },
        { value: 'cherry', label: 'Cherry' },
        { value: 'date', label: 'Date' },
        { value: 'elderberry', label: 'Elderberry' },
    ];

    return (
        <div className="space-y-8">
            <div>
                <h3 className="text-lg font-medium mb-4">Select Inputs</h3>
                <p className="text-muted-foreground mb-6">
                    Standard select components for single and multiple value selection.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <Card className="p-6 space-y-4">
                        <h4 className="font-medium text-sm text-foreground/80">Standard Select</h4>
                        <div className="space-y-4">
                            <Select
                                label="Choose a fruit"
                                value={selectedSingle}
                                onChange={(e) => setSelectedSingle(e.target.value)}
                                options={options}
                                placeholder="Select an option"
                            />
                            <div className="bg-muted p-3 rounded text-xs font-mono">
                                Selected: {selectedSingle || 'null'}
                            </div>
                        </div>

                        <h4 className="font-medium text-sm text-foreground/80 pt-4">Disabled State</h4>
                        <Select
                            label="Disabled Select"
                            value=""
                            disabled
                            options={options}
                        />

                        <h4 className="font-medium text-sm text-foreground/80 pt-4">Error State</h4>
                        <Select
                            label="Select with Error"
                            error="This field is required"
                            options={options}
                        />
                    </Card>

                    <Card className="p-6 space-y-4">
                        <h4 className="font-medium text-sm text-foreground/80">Multi Select Dropdown</h4>
                        <div className="space-y-4">
                            <MultiSelectDropdown
                                label="Choose multiple fruits" // Note: MultiSelectDropdown uses 'label' prop? Need to check api
                                options={options}
                                value={selectedMulti}
                                onChange={setSelectedMulti}
                                placeholder="Select fruits..."
                            />
                            <div className="bg-muted p-3 rounded text-xs font-mono">
                                Selected: {JSON.stringify(selectedMulti)}
                            </div>
                        </div>
                    </Card>
                </div>
            </div>

            <div>
                <h3 className="text-lg font-medium mb-4">Search Input</h3>
                <Card className="p-6">
                    <div className="max-w-md space-y-4">
                        <SearchInput
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                            placeholder="Search..."
                            onSearch={(val) => console.log('Searching for:', val)}
                        />
                        <div className="bg-muted p-3 rounded text-xs font-mono">
                            Search Value: {searchValue}
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
}
