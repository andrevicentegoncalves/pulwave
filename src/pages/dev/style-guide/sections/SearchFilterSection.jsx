import React, { useState } from 'react';
import SearchFilter from '../../../../components/forms/SearchFilter';
import Select from '../../../../components/ui/Select';
import Input from '../../../../components/ui/Input';

const SearchFilterSection = () => {
    const [activeFilters, setActiveFilters] = useState([
        { label: 'Status: Active', onRemove: () => removeFilter('status') },
        { label: 'Type: Residential', onRemove: () => removeFilter('type') },
    ]);

    const removeFilter = (key) => {
        console.log('Removing filter:', key);
        // In a real app, you'd update the state here
    };

    return (
        <section className="style-guide-section">
            <h2>Search & Filter</h2>
            <p className="section-description">
                A complex search component with expandable filter area and active filter badges.
            </p>

            <div className="component-demo">
                <SearchFilter
                    placeholder="Search properties..."
                    onSearch={(val) => console.log('Search:', val)}
                    onReset={() => console.log('Reset')}
                    activeFilters={activeFilters}
                >
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                        <Select
                            label="Status"
                            options={[
                                { value: 'active', label: 'Active' },
                                { value: 'pending', label: 'Pending' },
                            ]}
                        />
                        <Select
                            label="Property Type"
                            options={[
                                { value: 'residential', label: 'Residential' },
                                { value: 'commercial', label: 'Commercial' },
                            ]}
                        />
                        <Input label="Price Range" placeholder="Min - Max" />
                    </div>
                </SearchFilter>
            </div>
        </section>
    );
};

export default SearchFilterSection;
