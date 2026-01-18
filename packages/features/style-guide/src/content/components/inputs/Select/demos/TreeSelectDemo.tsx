import React, { useState } from 'react';
import { DemoCard } from '@pulwave/features-style-guide';
import {
    Select,
    Icon,
    Folder,
    File,
    Image,
    Globe,
    Briefcase,
    Users,
    Server,
    MapPin,
    Building
} from '@pulwave/ui';
import type { SelectOption } from '@pulwave/ui';

const TreeSelectDemo = () => {
    const [selected, setSelected] = useState<string[]>([]);

    // Rich data with icons and hierarchy
    const initialData: SelectOption<string>[] = [
        {
            value: 'company',
            label: 'Company Resources',
            icon: <Building size={16} />,
            isExpandable: true,
            children: [
                {
                    value: 'engineering',
                    label: 'Engineering Department',
                    icon: <Server size={16} />,
                    isExpandable: true,
                    children: [
                        {
                            value: 'frontend',
                            label: 'Frontend Development Team Lead Position',
                            icon: <Users size={16} />,
                            isExpandable: true,
                            children: [
                                { value: 'frontend-senior', label: 'Senior Frontend Engineer - React & TypeScript Specialist', icon: <File size={16} /> }
                            ]
                        },
                        { value: 'backend', label: 'Backend Infrastructure and Cloud Services', icon: <Users size={16} /> },
                        { value: 'devops', label: 'DevOps and Continuous Integration Pipeline', icon: <Server size={16} /> },
                        { value: 'qa', label: 'Quality Assurance and Testing Automation', icon: <File size={16} /> }
                    ]
                },
                {
                    value: 'design',
                    label: 'Design',
                    icon: <Image size={16} />,
                    isExpandable: true,
                    children: [
                        { value: 'product-design', label: 'Product Design', icon: <File size={16} /> },
                        { value: 'marketing-design', label: 'Marketing Design', icon: <File size={16} /> }
                    ]
                }
            ]
        },
        {
            value: 'locations',
            label: 'Locations',
            icon: <Globe size={16} />,
            isExpandable: true,
            children: [
                { value: 'ny', label: 'New York', icon: <MapPin size={16} /> },
                { value: 'lon', label: 'London', icon: <MapPin size={16} /> },
                { value: 'sf', label: 'San Francisco', icon: <MapPin size={16} /> }
            ]
        },
        {
            value: 'lazy',
            label: 'Archives (Lazy Load)',
            icon: <Folder size={16} />,
            isExpandable: true,
            children: []
        }
    ];

    const [data, setData] = useState(initialData);
    const [loadingNodes, setLoadingNodes] = useState<string[]>([]);

    const handleExpand = (value: string) => {
        // Mock lazy load
        if (value === 'lazy' && data.find(d => d.value === 'lazy')?.children?.length === 0) {
            setLoadingNodes(prev => [...prev, value]);
            setTimeout(() => {
                setData(prev => prev.map(node => {
                    if (node.value === 'lazy') {
                        return {
                            ...node,
                            children: [
                                { value: '2023', label: '2023 Documents', icon: <File size={16} /> },
                                { value: '2022', label: '2022 Documents', icon: <File size={16} /> }
                            ]
                        };
                    }
                    return node;
                }));
                setLoadingNodes(prev => prev.filter(v => v !== value));
            }, 1000);
        }
    };

    const codeUsage = `<Select 
    multiple
    tree
    searchable
    options={data} 
    value={selected} 
    onChange={setSelected} 
    placeholder="Select resources…" 
/>`;

    return (
        <DemoCard
            title="Tree Select"
            description="Hierarchical selection with search, icons, and lazy loading."
            showPrimaryToggle
            sourceCode={codeUsage}
            showSourceToggle
        >
            <div style={{ maxWidth: '400px' }}>
                <Select<string>
                    multiple
                    tree
                    searchable
                    searchPlaceholder="Search resources…"
                    recursiveSelection
                    options={data}
                    value={selected}
                    onChange={(val) => setSelected(val as string[] || [])}
                    onExpand={handleExpand}
                    loadingNodes={loadingNodes}
                    placeholder="Select resources…"
                    showSelectAll
                    showFooter
                    fullWidth
                />
            </div>
        </DemoCard>
    );
};

export default TreeSelectDemo;
