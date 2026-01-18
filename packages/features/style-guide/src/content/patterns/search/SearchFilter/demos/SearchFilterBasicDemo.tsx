import { useState } from 'react';
import { SearchFilter } from '@pulwave/widgets';
import { Stack, FormGrid, FormGridRow, Select, Input } from '@pulwave/ui';
import { type ActiveFilter } from '@pulwave/widgets';
import { DemoCard } from '@pulwave/features-style-guide';
import demoCode from './SearchFilterBasicDemo.tsx?raw';

const SearchFilterBasicDemo = () => {
    const [activeFilters, setActiveFilters] = useState<ActiveFilter[]>([]);

    const handleSearch = (term: string) => {
        console.log('Search:', term);
    };

    const handleAddFilter = (label: string) => {
        setActiveFilters([...activeFilters, {
            label,
            onRemove: () => setActiveFilters(prev => prev.filter(f => f.label !== label))
        }]);
    };

    return (
        <DemoCard sourceCode={demoCode} showSourceToggle={true}
            title="Search Filter Pattern"
            description="Expandable search bar with advanced filter controls."
        >
            <Stack gap={6}>
                <SearchFilter
                    placeholder="Search users…"
                    onSearch={handleSearch}
                    activeFilters={activeFilters}
                    onReset={() => setActiveFilters([])}
                >
                    <FormGrid>
                        <FormGridRow columns={2}>
                            <Select<string>
                                label="Status"
                                options={[{ value: 'active', label: 'Active' }, { value: 'pending', label: 'Pending' }]}
                                value=""
                                onChange={(val) => handleAddFilter(`Status: ${val}`)}
                            />
                            <Select<string>
                                label="Role"
                                options={[{ value: 'admin', label: 'Admin' }, { value: 'user', label: 'User' }]}
                                value=""
                                onChange={(val) => handleAddFilter(`Role: ${val}`)}
                            />
                        </FormGridRow>
                        <FormGridRow columns={1}>
                            <Input label="Date Range" placeholder="Select dates…" />
                        </FormGridRow>
                    </FormGrid>
                </SearchFilter>
            </Stack>
        </DemoCard>
    );
};

export default SearchFilterBasicDemo;
