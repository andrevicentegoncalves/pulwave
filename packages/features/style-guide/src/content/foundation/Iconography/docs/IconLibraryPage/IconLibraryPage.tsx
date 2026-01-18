import React, { useState, useMemo, useDeferredValue } from 'react';
import { Card, SearchInput, EmptyState, useToast, Stack, Text, Button, Tooltip, Label, RotateCcw, Select, Badge } from "@pulwave/ui";
import type { ButtonKind } from "@pulwave/ui";
import type { IconComponent } from '@pulwave/ui/icon-library';
import * as AllIcons from '@pulwave/ui/icon-library';

// Map icon sizes to Button t-shirt sizes for proper proportions
const getButtonSizeForIcon = (iconSize: number): 'xs' | 's' | 'm' | 'l' | 'xl' | '2xl' => {
    switch (iconSize) {
        case 16: return 's';   // XS: 16px icon in 32px button
        case 20: return 'm';   // S: 20px icon in 40px button
        case 24: return 'l';   // M: 24px icon in 48px button
        case 32: return 'xl';  // L: 32px icon in 56px button
        case 40: return '2xl'; // XL: 40px icon in 80px button
        default: return 'm';
    }
};

// Define categories based on index.ts structure
const CATEGORIES = {
    'All': [],
    'Actions': ['Check', 'CheckCircle', 'X', 'XCircle', 'Plus', 'Minus', 'Edit', 'Edit2', 'Edit3', 'Pencil', 'Trash', 'Trash2', 'Save', 'Download', 'Upload', 'Copy', 'Clipboard', 'ClipboardCheck', 'ClipboardCopy', 'Share', 'Share2', 'ExternalLink', 'Link', 'Link2', 'Unlink', 'Undo', 'Redo', 'RefreshCw', 'RefreshCcw', 'RotateCw', 'RotateCcw', 'MousePointerClick', 'TextCursorInput', 'Workflow', 'Library'],
    'Navigation': ['ChevronUp', 'ChevronDown', 'ChevronLeft', 'ChevronRight', 'ChevronsUp', 'ChevronsDown', 'ChevronsLeft', 'ChevronsRight', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowUpRight', 'ArrowDownLeft', 'ArrowUpLeft', 'ArrowDownRight', 'MoveUp', 'MoveDown', 'MoveLeft', 'MoveRight', 'Home', 'Menu', 'MoreHorizontal', 'MoreVertical', 'Grip', 'GripVertical', 'GripHorizontal', 'Navigation2', 'PanelTopClose', 'GalleryHorizontalEnd', 'GitBranch'],
    'Communication': ['Mail', 'Send', 'MessageSquare', 'MessageCircle', 'Phone', 'PhoneCall', 'PhoneOff', 'Video', 'VideoOff', 'Bell', 'BellOff', 'BellRing'],
    'Feedback': ['AlertCircle', 'AlertTriangle', 'AlertOctagon', 'Info', 'HelpCircle', 'CheckCircle2', 'XOctagon', 'Ban', 'ThumbsUp', 'ThumbsDown', 'Star', 'Heart', 'Loader', 'Loader2'],
    'Media': ['Image', 'ImagePlus', 'Camera', 'Play', 'Pause', 'Square', 'Circle', 'Volume', 'Volume1', 'Volume2', 'VolumeX', 'Mic', 'MicOff', 'Film', 'Music'],
    'Files': ['File', 'FileText', 'FilePlus', 'FileMinus', 'FileCheck', 'FileX', 'Files', 'Folder', 'FolderOpen', 'FolderPlus', 'FolderMinus', 'Archive', 'Paperclip', 'Printer', 'FileSpreadsheet'],
    'User': ['User', 'UserPlus', 'UserMinus', 'UserCheck', 'UserX', 'Users', 'UserCircle', 'LogIn', 'LogOut', 'Key', 'Lock', 'Unlock', 'Shield', 'ShieldCheck', 'ShieldOff'],
    'Interface': ['Eye', 'EyeOff', 'Search', 'ZoomIn', 'ZoomOut', 'Filter', 'SlidersHorizontal', 'Settings', 'Settings2', 'Cog', 'Wrench', 'Maximize', 'Maximize2', 'Minimize', 'Minimize2', 'Expand', 'Shrink', 'Columns', 'Rows', 'Grid', 'List', 'LayoutGrid', 'LayoutList', 'Table', 'Table2', 'PanelLeft', 'PanelRight', 'Sidebar', 'SidebarOpen', 'SidebarClose', 'FormInput', 'CheckSquare', 'ChevronDownSquare', 'ListFilter', 'ToggleLeft'],
    'Data': ['BarChart2', 'BarChart3', 'BarChart4', 'TrendingUp', 'TrendingDown', 'Activity', 'Database', 'HardDrive', 'Server'],
    'Time': ['Calendar', 'CalendarDays', 'CalendarCheck', 'CalendarX', 'CalendarPlus', 'CalendarMinus', 'Clock', 'Timer', 'TimerOff', 'Hourglass', 'History'],
    'Commerce': ['ShoppingCart', 'ShoppingBag', 'CreditCard', 'Wallet', 'Receipt', 'Package', 'Gift', 'Tag', 'Tags', 'Percent', 'DollarSign', 'Euro'],
    'Misc': ['Globe', 'Map', 'MapPin', 'Navigation', 'Compass', 'Sun', 'Moon', 'Cloud', 'CloudOff', 'Wifi', 'WifiOff', 'Bluetooth', 'Battery', 'BatteryCharging', 'BatteryLow', 'BatteryFull', 'Zap', 'Power', 'Terminal', 'Code', 'Code2', 'Braces', 'Hash', 'AtSign', 'Bookmark', 'Flag', 'Award', 'Crown', 'Sparkles', 'Palette', 'Box', 'Accessibility', 'Layers', 'Puzzle', 'Rocket', 'Smile', 'Shapes', 'Gauge', 'Dumbbell', 'Waves', 'Shirt', 'Briefcase']
};

const IconLibraryPage = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const { showToast } = useToast();

    // Appearance State
    const [size, setSize] = useState(24);
    const [strokeWidth, setStrokeWidth] = useState(2);
    const [color, setColor] = useState('primary'); // Kind as default

    // Defer heavy grid updates to keep UI responsive
    const deferredSize = useDeferredValue(size);
    const deferredStrokeWidth = useDeferredValue(strokeWidth);
    const deferredColor = useDeferredValue(color);


    const resetAppearance = () => {
        setSize(24);
        setStrokeWidth(2);
        setColor('primary'); // Reset to primary
    };

    // Filter out non-icon exports and process icons
    const iconList = useMemo(() => {
        return Object.entries(AllIcons)
            .filter(([name, component]) => {
                // Filter out types or non-component exports if any
                return typeof component === 'object' || typeof component === 'function';
            })
            .sort((a, b) => a[0].localeCompare(b[0]));
    }, []);

    const filteredIcons = useMemo(() => {
        let filtered = iconList;

        // Category Filter
        if (selectedCategory !== 'All') {
            const categoryIcons = (CATEGORIES[selectedCategory as keyof typeof CATEGORIES] || []) as string[];
            filtered = filtered.filter(([name]) => categoryIcons.includes(name));
        }

        // Search Filter
        if (searchQuery) {
            const lowerQuery = searchQuery.toLowerCase();
            filtered = filtered.filter(([name]) =>
                name.toLowerCase().includes(lowerQuery)
            );
        }

        return filtered;
    }, [iconList, searchQuery, selectedCategory]);

    const handleCopy = (name: string) => {
        const importString = `import { ${name} } from "@pulwave/ui";`;
        navigator.clipboard.writeText(importString);
        // Defensive check - addToast might not be available from context
        if (typeof showToast === 'function') {
            showToast(`Import for ${name} copied.`, 'success', 2000);
        }
    };

    const categoryOptions = Object.keys(CATEGORIES).map(cat => ({
        label: cat,
        value: cat
    }));


    // Pagination State
    const [visibleLimit, setVisibleLimit] = useState(100);

    // Reset limit when filters change
    React.useEffect(() => {
        setVisibleLimit(100);
    }, [searchQuery, selectedCategory]);

    const visibleIcons = filteredIcons.slice(0, visibleLimit);

    return (
        <Stack gap="xl">
            {/* Title Row - Badge and description side by side */}
            <div className="icon-library-page__title-row">
                <Badge status="info" size="m">{iconList.length} icons</Badge>
                <Text variant="body-l" className="text-neural-600 dark:text-neural-400">
                    Complete collection of icons available in the system. Click any icon to copy its import statement.
                </Text>
            </div>

            {/* Controls Row - Appearance only */}
            <div className="icon-library-page__controls-row">
                {/* Appearance Card */}
                <Card padding="md" className="icon-library-page__appearance-card">
                    {/* Header with Reset in top-right */}
                    <div className="icon-library-page__appearance-header">
                        <Text variant="body-m" weight="bold">Appearance</Text>
                        <Button
                            kind="neutral"
                            variant="soft"
                            size="s"
                            shape="circle"
                            onClick={resetAppearance}
                            aria-label="Reset appearance"
                        >
                            <RotateCcw size={16} aria-hidden="true" />
                        </Button>
                    </div>

                    <div className="icon-library-page__appearance-stack">
                        {/* Color Presets - All Kinds */}
                        <div>
                            <Label size="s" className="mb-2">Color</Label>
                            <div className="icon-library-page__color-grid">
                                {[
                                    { kind: 'primary' },
                                    { kind: 'secondary' },
                                    { kind: 'tertiary' },
                                    { kind: 'neutral' },
                                    { kind: 'success' },
                                    { kind: 'warning' },
                                    { kind: 'error' },
                                    { kind: 'info' },
                                    { kind: 'critical' },
                                    { kind: 'growth' },
                                    { kind: 'maintenance' },
                                    { kind: 'discovery' },
                                    { kind: 'premium' },
                                    { kind: 'urgent' },
                                    { kind: 'promotion' },
                                ].map((c) => (
                                    <Tooltip key={c.kind} content={c.kind.charAt(0).toUpperCase() + c.kind.slice(1)} direction="top">
                                        <Button
                                            shape="circle"
                                            size="xs"
                                            kind={c.kind as ButtonKind}
                                            variant="filled"
                                            className={`icon-library-page__color-dot p-0 ${color === c.kind ? 'button--active' : ''}`}
                                            onClick={() => setColor(c.kind)}
                                            aria-label={`Select ${c.kind} color`}
                                        />
                                    </Tooltip>
                                ))}
                            </div>
                        </div>

                        {/* T-Shirt Sizes */}
                        <div>
                            <Label size="s" className="mb-2">Size</Label>
                            <div className="icon-library-page__size-buttons">
                                {[
                                    { label: 'XS', value: 16 },
                                    { label: 'S', value: 20 },
                                    { label: 'M', value: 24 },
                                    { label: 'L', value: 32 },
                                    { label: 'XL', value: 40 },
                                ].map((s) => (
                                    <Button
                                        key={s.label}
                                        kind={size === s.value ? 'primary' : 'neutral'}
                                        variant={size === s.value ? 'filled' : 'soft'}
                                        size="m"
                                        shape="circle"
                                        className={size !== s.value ? 'icon-library-page__control-button-inactive' : ''}
                                        onClick={() => setSize(s.value)}
                                    >
                                        {s.label}
                                    </Button>
                                ))}
                            </div>
                        </div>

                        {/* Stroke Width Presets */}
                        <div>
                            <Label size="s" className="mb-2">Stroke</Label>
                            <div className="icon-library-page__stroke-buttons">
                                {[
                                    { label: 'Thin', value: 1 },
                                    { label: 'Regular', value: 1.5 },
                                    { label: 'Medium', value: 2 },
                                    { label: 'Bold', value: 2.5 },
                                ].map((sw) => (
                                    <Button
                                        key={sw.label}
                                        kind={strokeWidth === sw.value ? 'primary' : 'neutral'}
                                        variant={strokeWidth === sw.value ? 'filled' : 'soft'}
                                        size="m"
                                        className={strokeWidth !== sw.value ? 'icon-library-page__control-button-inactive' : ''}
                                        onClick={() => setStrokeWidth(sw.value)}
                                    >
                                        {sw.label}
                                    </Button>
                                ))}
                            </div>
                        </div>
                    </div>
                </Card>
            </div>

            {/* ... Filters Row ... */}
            <div className="icon-library-page__filters-row">
                <div className="icon-library-page__search-wrapper">
                    <SearchInput
                        placeholder={`Search ${iconList.length} icons...`}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onClear={() => setSearchQuery('')}
                        className="icon-library-page__search-input"
                        size="l"
                    />
                </div>

                <div className="icon-library-page__category-select">
                    <Select
                        options={categoryOptions}
                        value={selectedCategory === 'All' ? '' : selectedCategory}
                        onChange={(val) => setSelectedCategory(val as string || 'All')}
                        placeholder="Select a category"
                        size="l"
                    />
                </div>
            </div>

            {
                visibleIcons.length > 0 ? (
                    <>
                        <div className="icon-library-page__grid">
                            {visibleIcons.map(([name, IconComponent]) => (
                                <Tooltip key={name} content={name} direction="top">
                                    <Button
                                        kind={deferredColor as ButtonKind}
                                        variant="outlined"
                                        shape="circle"
                                        size={getButtonSizeForIcon(deferredSize)}
                                        onClick={() => handleCopy(name)}
                                        className={`icon-library-page__icon-button icon-lib-stroke-${String(deferredStrokeWidth).replace('.', '-')}`}
                                    >
                                        {React.createElement(IconComponent as IconComponent, {
                                            size,
                                            strokeWidth,
                                        })}
                                    </Button>
                                </Tooltip>
                            ))}
                        </div>

                        {/* Load More Button */}
                        {visibleIcons.length < filteredIcons.length && (
                            <div className="flex justify-center mt-8">
                                <Button
                                    kind="neutral"
                                    variant="soft"
                                    onClick={() => setVisibleLimit(prev => prev + 100)}
                                >
                                    Load More ({filteredIcons.length - visibleIcons.length} remaining)
                                </Button>
                            </div>
                        )}
                    </>
                ) : (
                    <EmptyState
                        icon={<AllIcons.Search size={48} />}
                        title="No icons found"
                        description={`No icons matching "${searchQuery}"${selectedCategory !== 'All' ? ` in ${selectedCategory}` : ''}`}
                    >
                        <div className="flex gap-2">
                            <button
                                onClick={() => setSearchQuery('')}
                                className="text-primary-600 hover:text-primary-700 font-medium"
                            >
                                Clear search
                            </button>
                            {selectedCategory !== 'All' && (
                                <button
                                    onClick={() => setSelectedCategory('All')}
                                    className="text-primary-600 hover:text-primary-700 font-medium"
                                >
                                    Clear category
                                </button>
                            )}
                        </div>
                    </EmptyState>
                )
            }
        </Stack >
    );
};

export default IconLibraryPage;
