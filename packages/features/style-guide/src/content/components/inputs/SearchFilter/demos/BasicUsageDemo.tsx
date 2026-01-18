import React, { useState } from 'react';
import { Select, Input } from '@pulwave/ui';
import { SearchFilter } from '@pulwave/widgets';
import { DemoCard } from '@pulwave/features-style-guide';

const codeUsage = `<SearchFilter
    onSearch={handleSearch}
    onReset={handleReset}
    activeFilters={activeBadges}
    placeholder="Search users…"
>
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <Select label="Status" value={filters.status} onChange={…} options={…} />
        <Select label="Category" value={filters.category} onChange={…} options={…} />
    </div>
</SearchFilter>`;

const SearchFilterBasicDemo = () => {
    const [filters, setFilters] = useState({
        status: '',
        category: '',
    });
    const [activeBadges, setActiveBadges] = useState<any[]>([]);

    const handleSearch = (term: string) => {
        console.log('Searching for:', term);
        updateBadges(term, filters);
    };

    const handleReset = () => {
        setFilters({ status: '', category: '' });
        setActiveBadges([]);
    };

    const updateBadges = (term: string, currentFilters: any) => {
        const badges = [];
        if (term) badges.push({ label: `Search: ${term}` });
        if (currentFilters.status) badges.push({ label: `Status: ${currentFilters.status}`, onRemove: () => setFilters(f => ({ ...f, status: '' })) });
        if (currentFilters.category) badges.push({ label: `Category: ${currentFilters.category}`, onRemove: () => setFilters(f => ({ ...f, category: '' })) });
        setActiveBadges(badges);
    };

    return (
        <DemoCard
            title="Basic Usage"
            description="SearchFilter with Select and Input controls in the panel."
            sourceCode={codeUsage}
        >
            <div style={{ maxWidth: '600px' }}>
                <SearchFilter
                    placeholder="Search users…"
                    onSearch={handleSearch}
                    onReset={handleReset}
                    activeFilters={activeBadges}
                >
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <Select
                            label="Status"
                            placeholder="Select status…"
                            value={filters.status}
                            onChange={(val) => setFilters(prev => ({ ...prev, status: val as string }))}
                            options={[
                                { value: 'active', label: 'Active' },
                                { value: 'inactive', label: 'Inactive' },
                                { value: 'pending', label: 'Pending' },
                            ]}
                        />
                        <Select
                            label="Category"
                            placeholder="Select category…"
                            value={filters.category}
                            onChange={(val) => setFilters(prev => ({ ...prev, category: val as string }))}
                            options={[
                                { value: 'admin', label: 'Admin' },
                                { value: 'user', label: 'User' },
                                { value: 'guest', label: 'Guest' },
                            ]}
                        />
                    </div>
                </SearchFilter>
            </div>
        </DemoCard>
    );
};

export default SearchFilterBasicDemo;
