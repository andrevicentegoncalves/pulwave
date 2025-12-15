import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Edit2, Trash2, Button, Badge, Globe } from './index';
import CircleFlag from './CircleFlag';

/**
 * GroupRow - Reusable expandable group row component
 * Supports nested children for recursive groupings.
 * 
 * Props:
 * - title: string - Main title text
 * - icon?: ReactNode - Icon to display before title
 * - items: Array - Items in the group (used for flags/badges and expanded table)
 * - children?: ReactNode - Nested content (e.g., more GroupRows) - overrides items table
 * - localeKey?: string - Key to extract locale code from items (default: 'locale_code')
 * - textKey?: string - Key to extract display text from items (default: 'translated_text')
 * - allPublished?: boolean - Whether all items are published
 * - totalLocales?: number - Total available locales (if items.length >= totalLocales, show globe)
 * - onEdit?: (group) => void - Edit handler
 * - onDelete?: (item) => void - Delete handler for individual items
 * - renderItem?: (item) => ReactNode - Custom item row renderer
 * - defaultExpanded?: boolean - Whether to start expanded (default: false)
 * - isChild?: boolean - Is this a child row (affects styling and indentation)
 * - className?: string - Additional class names
 * - count?: number - Override count display (e.g., "3 columns" instead of items count)
 * - countLabel?: string - Label for count (default: 'item(s)')
 */
const GroupRow = ({
    title,
    icon,
    items = [],
    children,
    localeKey = 'locale_code',
    textKey = 'translated_text',
    allPublished = false,
    totalLocales,
    onEdit,
    onDelete,
    renderItem,
    defaultExpanded = false,
    isChild = false,
    className = '',
    count,
    countLabel,
    forceGroup = false,
    depth = 0
}) => {
    const [isExpanded, setIsExpanded] = useState(defaultExpanded);

    // Get display count
    const displayCount = count ?? items.length;
    const displayLabel = countLabel ?? (displayCount === 1 ? 'item' : 'items');

    // Check if all locales are filled (for globe icon)
    const allLocalesFilled = totalLocales > 0 && items.length >= totalLocales;

    // Determine styles based on depth
    const isTopLevel = depth === 0;
    const paddingLeft = `${(depth * 1.5) + 1}rem`; // Dynamic indent: 1rem, 2.5rem, 4rem...

    // Background: Top level = neutral-50, Child = white
    const bgClass = isTopLevel ? 'bg-neutral-50' : 'bg-white';

    // Border: Visual hierarchy line for children
    const borderClass = !isTopLevel ? 'border-l-4 border-neutral-200' : '';

    // Title style
    const titleClass = isTopLevel ? 'font-medium' : 'text-sm font-medium text-neutral-700';

    // Header container style
    const headerClass = `translation-group-header ${bgClass} ${borderClass} hover:bg-neutral-100 transition-colors`;

    // Single Item View (Flat Row) - only when no children AND not forced group
    if (!children && items.length === 1 && !forceGroup) {
        const item = items[0];
        const localeCode = item[localeKey] || '';
        const countryCode = localeCode.includes('-') ? localeCode.split('-')[1] : null;
        const displayText = item[textKey] || '';

        return (
            <div
                className={`generic-group-row-single flex items-center p-3 border-b border-neutral-200 hover:bg-neutral-50 gap-4 bg-white transition-colors ${className}`}
                style={{ paddingLeft }}
            >
                {/* Icon + Title */}
                <div className="flex-1 flex items-center gap-2 min-w-0">
                    {!isTopLevel && <div className="w-1 h-1 rounded-full bg-neutral-300 mr-1"></div>} {/* Bullet for leaf */}
                    {icon && <div className="text-neutral-400 shrink-0">{icon}</div>}
                    <div className="font-medium text-sm truncate select-all" title={title}>{title}</div>
                </div>

                {/* Locale */}
                <div className="w-32 flex items-center gap-2 shrink-0">
                    <CircleFlag countryCode={countryCode} size="s" />
                    <span className="text-sm text-neutral-600">{localeCode}</span>
                </div>

                {/* Value */}
                <div className="flex-1 min-w-0">
                    <div className="text-sm text-neutral-900 truncate" title={displayText}>{displayText}</div>
                </div>

                {/* Status */}
                <div className="w-24 shrink-0">
                    <Badge
                        type={item.status === 'published' ? 'success' : item.status === 'draft' ? 'warning' : 'neutral'}
                        variant="light"
                        size="s"
                    >
                        {item.status || 'draft'}
                    </Badge>
                </div>

                {/* Actions */}
                <div className="w-20 flex justify-end gap-1 shrink-0">
                    {onEdit && <Button variant="icon-circle" size="s" onClick={() => onEdit(item)}><Edit2 size={14} /></Button>}
                    {onDelete && <Button variant="icon-circle" size="s" onClick={() => onDelete(item)} className="text-feedback-error"><Trash2 size={14} /></Button>}
                </div>
            </div>
        );
    }

    // Multi-Item Expandable Group View
    return (
        <div className={`generic-group-row ${isExpanded ? 'expanded' : ''} ${className}`}>
            <div
                className={headerClass}
                onClick={() => setIsExpanded(!isExpanded)}
                style={{ paddingLeft }}
            >
                <div className="flex items-center gap-3 flex-1">
                    <button className="group-expand-btn text-neutral-400 hover:text-neutral-600">
                        {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                    </button>
                    {icon && <div className="group-icon">{icon}</div>}
                    <div className="group-info">
                        <div className={titleClass}>{title}</div>
                    </div>
                </div>

                <div className="group-meta flex items-center gap-4">
                    {/* Count Badge */}
                    <span className="text-xs text-neutral-400 font-medium">
                        {displayCount} {displayLabel}
                    </span>
                    {/* For parent rows with children: show globe if allComplete prop is true */}
                    {children && allLocalesFilled && (
                        <div title="All languages translated" className="text-feedback-success">
                            <Globe size={18} />
                        </div>
                    )}
                    {/* Locale Flags (only if items and not using children) */}
                    {!children && items.length > 0 && (
                        <div className="locale-badges flex gap-1">
                            {allLocalesFilled ? (
                                // Show globe icon if all locales are filled
                                <div title="All languages translated" className="text-feedback-success">
                                    <Globe size={18} />
                                </div>
                            ) : (
                                // Show individual flags
                                items.map((item, idx) => {
                                    const localeCode = item[localeKey] || '';
                                    const countryCode = localeCode.includes('-') ? localeCode.split('-')[1] : null;
                                    const displayText = item[textKey] || '';
                                    return (
                                        <div key={item.id || idx} title={`${localeCode}: ${displayText}`}>
                                            <CircleFlag countryCode={countryCode} size="s" />
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    )}
                    {/* Status Badge */}
                    {allPublished && <Badge type="success" variant="light" size="s">Published</Badge>}
                    {/* Edit Action */}
                    {onEdit && (
                        <Button variant="icon-circle" size="s" onClick={(e) => { e.stopPropagation(); onEdit(items[0]); }}>
                            <Edit2 size={14} />
                        </Button>
                    )}
                </div>
            </div>

            {isExpanded && (
                <div className="translation-group-body" style={!children ? { paddingLeft } : undefined}>
                    {/* If children provided, render them; otherwise render items table */}
                    {children ? (
                        <div className="space-y-0">
                            {children}
                        </div>
                    ) : (
                        <table className="w-full">
                            <tbody>
                                {items.map((item, idx) => {
                                    if (renderItem) return renderItem(item, idx);

                                    const localeCode = item[localeKey] || '';
                                    const countryCode = localeCode.includes('-') ? localeCode.split('-')[1] : null;
                                    const displayText = item[textKey] || '';

                                    return (
                                        <tr key={item.id || idx} className="group-item-row border-b border-neutral-100 last:border-0 hover:bg-neutral-50">
                                            <td className="py-2 px-4 w-40">
                                                <div className="flex items-center gap-2">
                                                    <CircleFlag countryCode={countryCode} size="s" />
                                                    <span className="text-sm text-neutral-600">{localeCode}</span>
                                                </div>
                                            </td>
                                            <td className="py-2 px-4">
                                                <span className="text-sm font-medium">{displayText}</span>
                                            </td>
                                            <td className="py-2 px-4 w-20 text-right">
                                                {onDelete && (
                                                    <div className="flex justify-end gap-1">
                                                        <Button variant="icon-circle" size="s" onClick={() => onDelete(item)} className="text-feedback-error">
                                                            <Trash2 size={12} />
                                                        </Button>
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    )}
                </div>
            )}
        </div>
    );
};

export default GroupRow;
