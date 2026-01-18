import { useState, memo, type ReactNode } from 'react';
import { ChevronDown, ChevronRight, Edit2, Trash2, Globe } from '@pulwave/ui';
import { Button, Badge, Tooltip, Skeleton } from '@pulwave/ui';
import { CircleFlag } from './CircleFlag';

export interface GroupRowItem {
    id?: string | number;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
}

export interface GroupRowProps {
    title: string;
    subtitle?: string;
    icon?: ReactNode;
    items?: GroupRowItem[];
    children?: ReactNode;
    localeKey?: string;
    textKey?: string;
    allPublished?: boolean;
    totalLocales?: number;
    onEdit?: (item: GroupRowItem) => void;
    onDelete?: (item: GroupRowItem) => void;
    renderItem?: (item: GroupRowItem, idx: number) => ReactNode;
    defaultExpanded?: boolean;
    isChild?: boolean;
    className?: string;
    count?: number;
    countLabel?: string;
    forceGroup?: boolean;
    depth?: number;
    isLoading?: boolean;
    onToggle?: (isExpanded: boolean) => void;
}

/**
 * GroupRow - Reusable expandable group row component
 * Supports nested children for recursive groupings.
 * Migrated to use Tailwind CSS and @pulwave/ui components.
 */
export const GroupRow = memo(({
    title,
    subtitle,
    icon,
    items = [],
    children,
    localeKey = 'locale_code',
    textKey = 'translated_text',
    allPublished = false,
    totalLocales = 0,
    onEdit,
    onDelete,
    renderItem,
    defaultExpanded = false,
    className = '',
    count,
    countLabel,
    forceGroup = false,
    depth = 0,
    isLoading = false,
    onToggle,
}: GroupRowProps) => {
    const [isExpanded, setIsExpanded] = useState(defaultExpanded);

    // Get display count
    const displayCount = count ?? items.length;
    const displayLabel = countLabel ?? (displayCount === 1 ? 'item' : 'items');

    // Check if all locales are filled (for globe icon)
    const allLocalesFilled = totalLocales > 0 && items.length >= totalLocales;

    // Determine styles based on depth
    const isTopLevel = depth === 0;
    const paddingLeft = `${(depth * 1.5) + 0.75}rem`; // Adjusted padding logic for Tailwind: 0.75rem (p-3) base

    // Skeleton loading state
    if (isLoading) {
        return (
            <div className={`w-full ${className}`}>
                <div
                    className={`flex items-center justify-between p-3 border-b border-neutral-100 ${isTopLevel ? 'bg-neutral-50' : 'bg-white border-l-4 border-neutral-200'}`}
                    style={{ paddingLeft }}
                >
                    <Skeleton className="w-4 h-4 mr-2" />
                    <Skeleton className="w-5 h-5 mr-3 rounded-full" />
                    <Skeleton className="w-1/3 h-4" />
                    <div className="flex-1" />
                    <div className="flex gap-1">
                        {[...Array(6)].map((_, i) => (
                            <Skeleton key={i} className="w-5 h-5 rounded-full" />
                        ))}
                    </div>
                    <Skeleton className="w-16 h-6 ml-4" />
                </div>
            </div>
        );
    }

    // Single Item View (Flat Row) - only when no children AND not forced group
    if (!children && items.length === 1 && !forceGroup) {
        const item = items[0];
        const localeCode = item[localeKey] || '';
        const countryCode = localeCode.includes('-') ? localeCode.split('-')[1] : null;
        const displayText = item[textKey] || '';

        return (
            <div
                className={`flex items-center p-3 border-b border-neutral-100 gap-4 bg-white transition-colors hover:bg-neutral-50 ${className}`}
                style={{ paddingLeft }}
            >
                {/* Icon + Title */}
                <div className="flex-1 flex items-center gap-2 min-w-0">
                    {!isTopLevel && <div className="w-1 h-1 rounded-full bg-neutral-300 mr-1"></div>}
                    {icon && <div className="text-neutral-400 flex-shrink-0" aria-hidden="true">{icon}</div>}
                    <div className="font-medium text-sm truncate select-all text-neutral-900" title={title}>{title}</div>
                </div>

                {/* Locale */}
                <div className="flex items-center gap-2 w-32 flex-shrink-0">
                    <CircleFlag countryCode={countryCode} size="s" />
                    <span className="text-sm text-neutral-500">{localeCode}</span>
                </div>

                {/* Value */}
                <div className="flex-1 min-w-0">
                    <div className="text-sm text-neutral-900 truncate" title={displayText}>{displayText}</div>
                </div>

                {/* Status */}
                <div className="w-24 flex-shrink-0">
                    <Badge
                        status={item.status === 'published' ? 'success' : item.status === 'draft' ? 'warning' : 'neutral'}
                        variant="light"
                        size="s"
                    >
                        {item.status || 'draft'}
                    </Badge>
                </div>

                {/* Actions */}
                <div className="w-20 flex justify-end gap-1 flex-shrink-0">
                    {onEdit && <Button variant="ghost" size="s" onClick={() => onEdit(item)} className="h-8 w-8 p-0 rounded-full" aria-label="Edit"><Edit2 size={14} aria-hidden="true" /></Button>}
                    {onDelete && <Button variant="ghost" size="s" onClick={() => onDelete(item)} className="h-8 w-8 p-0 rounded-full text-red-600 hover:text-red-700 hover:bg-red-50" aria-label="Delete"><Trash2 size={14} aria-hidden="true" /></Button>}
                </div>
            </div>
        );
    }

    // Multi-Item Expandable Group View
    return (
        <div className={`w-full ${isExpanded ? 'bg-neutral-50/50' : ''} ${className}`}>
            <div
                className={`
                    flex items-center justify-between p-3 cursor-pointer transition-colors border-b border-neutral-100
                    ${isTopLevel ? 'bg-neutral-50 hover:bg-neutral-100 font-medium' : 'bg-white hover:bg-neutral-50 border-l-4 border-neutral-200'}
                `}
                onClick={() => {
                    const newState = !isExpanded;
                    setIsExpanded(newState);
                    if (onToggle) onToggle(newState);
                }}
                style={{ paddingLeft }}
            >
                <div className="flex items-center gap-3 flex-1">
                    <button
                        className="text-neutral-500 hover:text-neutral-900 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1 rounded"
                        aria-label={isExpanded ? 'Collapse group' : 'Expand group'}
                        aria-expanded={isExpanded}
                    >
                        {isExpanded ? <ChevronDown size={16} aria-hidden="true" /> : <ChevronRight size={16} aria-hidden="true" />}
                    </button>
                    {icon && <div className="text-neutral-400" aria-hidden="true">{icon}</div>}
                    <div className="flex flex-col">
                        <div className={`${!isTopLevel ? 'text-sm text-neutral-600' : 'text-neutral-900'}`}>{title}</div>
                        {subtitle && <div className="text-xs text-neutral-400 font-normal">{subtitle}</div>}
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    {/* Count Badge */}
                    <span className="text-xs text-neutral-500">
                        {displayCount} {displayLabel}
                    </span>
                    {/* For parent rows with children: show globe if allComplete prop is true */}
                    {children && allLocalesFilled && (
                        <div title="All languages translated" className="text-green-600" aria-hidden="true">
                            <Globe size={18} />
                        </div>
                    )}
                    {/* Locale Flags (only if items and not using children) */}
                    {!children && items.length > 0 && (
                        <div className="flex gap-1">
                            {allLocalesFilled ? (
                                // Show globe icon if all locales are filled
                                <Tooltip content="All languages translated" direction="top">
                                    <div className="text-green-600 cursor-help" aria-hidden="true">
                                        <Globe size={18} />
                                    </div>
                                </Tooltip>
                            ) : (
                                // Show individual flags (limited to 10)
                                <>
                                    {items.slice(0, 10).map((item, idx) => {
                                        const localeCode = item[localeKey] || '';
                                        const countryCode = localeCode.includes('-') ? localeCode.split('-')[1] : null;
                                        const displayText = item[textKey] || '';
                                        return (
                                            <Tooltip key={item.id || idx} content={`${localeCode}: ${displayText}`} direction="top">
                                                <div>
                                                    <CircleFlag countryCode={countryCode} size="s" />
                                                </div>
                                            </Tooltip>
                                        );
                                    })}
                                    {items.length > 10 && (
                                        <Tooltip content={`${items.length - 10} more locales`} direction="top">
                                            <span className="text-xs text-neutral-400 font-medium ml-1">+{items.length - 10}</span>
                                        </Tooltip>
                                    )}
                                </>
                            )}
                        </div>
                    )}
                    {/* Status Badge */}
                    {allPublished && <Badge status="success" variant="light" size="s">Published</Badge>}
                    {/* Edit Action */}
                    {onEdit && (
                        <Button variant="ghost" size="s" className="h-8 w-8 p-0 rounded-full text-neutral-500" onClick={(e) => { e.stopPropagation(); onEdit(items[0]); }} aria-label="Edit translation">
                            <Edit2 size={14} aria-hidden="true" />
                        </Button>
                    )}
                </div>
            </div>

            {isExpanded && (
                <div className="w-full">
                    {/* If children provided, render them; otherwise render items table */}
                    {children ? (
                        <div className="space-y-0">
                            {children}
                        </div>
                    ) : (
                        <div className="w-full bg-white">
                            {items.map((item, idx) => {
                                if (renderItem) return renderItem(item, idx);

                                const localeCode = item[localeKey] || '';
                                const countryCode = localeCode.includes('-') ? localeCode.split('-')[1] : null;
                                const displayText = item[textKey] || '';

                                return (
                                    <div key={item.id || idx} className="flex border-b border-neutral-100 last:border-0 hover:bg-neutral-50 transition-colors">
                                        <div className="py-2 px-4 w-40 flex items-center gap-2 border-r border-neutral-50">
                                            <CircleFlag countryCode={countryCode} size="s" />
                                            <span className="text-sm text-neutral-600">{localeCode}</span>
                                        </div>
                                        <div className="py-2 px-4 flex-1">
                                            <span className="text-sm font-medium text-neutral-900">{displayText}</span>
                                        </div>
                                        <div className="py-2 px-4 w-20 flex justify-end">
                                            {onDelete && (
                                                <Button variant="ghost" size="s" onClick={() => onDelete(item)} className="h-7 w-7 p-0 rounded-full text-red-600 hover:bg-red-50" aria-label="Delete translation">
                                                    <Trash2 size={12} aria-hidden="true" />
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
});

GroupRow.displayName = 'GroupRow';
