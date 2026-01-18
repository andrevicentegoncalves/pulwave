import { useState, memo, type ReactNode } from 'react';
import { ChevronDown, ChevronRight, Edit2, Trash2, Globe } from '../../icon-library';
import { cn } from '@pulwave/utils';
import { Button } from '../Button';
import { Badge } from '../Badge';
import { Tooltip } from '../Tooltip';
import { CircleFlag } from '../CircleFlag';
import { Skeleton } from '../Skeleton';
import {
    groupRowVariants,
    groupRowHeaderVariants,
    type GroupRowProps,
    type GroupRowItem
} from './types';
import './styles/_index.scss';

export * from './types';

/**
 * GroupRow - Reusable expandable group row component
 * Supports nested children for recursive groupings.
 * Memoized to prevent re-renders when parent state changes but props are unchanged.
 */
export const GroupRow = memo(({
    title,
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
    const paddingLeft = `${(depth * 1.5) + 1}rem`; // Dynamic indent: 1rem, 2.5rem, 4rem...

    // Skeleton loading state
    if (isLoading) {
        return (
            <div className={cn('group-row skeleton-row', className)}>
                <div className={cn(groupRowHeaderVariants({ level: isTopLevel ? 'top' : 'nested' }))} style={{ paddingLeft }}>
                    <Skeleton variant="rectangular" width={16} height={16} />
                    <Skeleton variant="circular" width={20} height={20} />
                    <Skeleton variant="text" width="30%" height={16} />
                    <div className="flex-1" />
                    <div className="flex gap-1">
                        {[...Array(6)].map((_, i) => (
                            <Skeleton key={i} variant="circular" width={20} height={20} />
                        ))}
                    </div>
                    <Skeleton variant="rectangular" width={70} height={24} className="border-radius-round" />
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
                className={cn(groupRowVariants({ isSingle: true }), className)}
                style={{ paddingLeft }}
            >
                {/* Icon + Title */}
                <div className="flex-1 flex align-items-center gap-2 min-w-0">
                    {!isTopLevel && <div className="group-row__bullet"></div>}
                    {icon && <div className="text-neutral-400 shrink-0" aria-hidden="true">{icon}</div>}
                    <div className="font-weight-medium text-sm truncate select-all" title={title}>{title}</div>
                </div>

                {/* Locale */}
                <div className="group-row__locale-badge">
                    <CircleFlag countryCode={countryCode} size="s" />
                    <span>{localeCode}</span>
                </div>

                {/* Value */}
                <div className="flex-1 min-w-0">
                    <div className="text-sm text-neutral-900 truncate" title={displayText}>{displayText}</div>
                </div>

                {/* Status */}
                <div className="w-24 shrink-0">
                    <Badge
                        status={item.status === 'published' ? 'success' : item.status === 'draft' ? 'warning' : 'neutral'}
                        variant="light"
                        size="s"
                    >
                        {item.status || 'draft'}
                    </Badge>
                </div>

                {/* Actions */}
                <div className="w-20 flex justify-end gap-1 shrink-0">
                    {onEdit && <Button variant="ghost" shape="circle" size="s" onClick={() => onEdit(item)} aria-label="Edit"><Edit2 size={14} aria-hidden="true" /></Button>}
                    {onDelete && <Button variant="ghost" shape="circle" size="s" onClick={() => onDelete(item)} className="text-feedback-error" aria-label="Delete"><Trash2 size={14} aria-hidden="true" /></Button>}
                </div>
            </div>
        );
    }

    // Multi-Item Expandable Group View
    return (
        <div className={cn(groupRowVariants({ expanded: isExpanded }), className)}>
            <div
                className={cn(groupRowHeaderVariants({ level: isTopLevel ? 'top' : 'nested' }))}
                onClick={() => {
                    const newState = !isExpanded;
                    setIsExpanded(newState);
                    if (onToggle) onToggle(newState);
                }}
                style={{ paddingLeft }}
            >
                <div className="group-row__info">
                    <button className="group-row__expand-btn" aria-label={isExpanded ? 'Collapse' : 'Expand'} aria-expanded={isExpanded}>
                        {isExpanded ? <ChevronDown size={16} aria-hidden="true" /> : <ChevronRight size={16} aria-hidden="true" />}
                    </button>
                    {icon && <div className="group-icon" aria-hidden="true">{icon}</div>}
                    <div className="group-info">
                        <div className={cn('group-row__title', !isTopLevel && 'group-row__title--nested')}>{title}</div>
                    </div>
                </div>

                <div className="group-row__meta">
                    {/* Count Badge */}
                    <span className="group-row__count">
                        {displayCount} {displayLabel}
                    </span>
                    {/* For parent rows with children: show globe if allComplete prop is true */}
                    {children && allLocalesFilled && (
                        <div title="All languages translated" className="text-feedback-success" aria-hidden="true">
                            <Globe size={18} />
                        </div>
                    )}
                    {/* Locale Flags (only if items and not using children) */}
                    {!children && items.length > 0 && (
                        <div className="locale-badges flex gap-1">
                            {allLocalesFilled ? (
                                // Show globe icon if all locales are filled
                                <Tooltip content="All languages translated" direction="top">
                                    <div className="text-feedback-success" aria-hidden="true">
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
                                            <span className="text-xs text-neutral-400 font-weight-medium margin-left-1">+{items.length - 10}</span>
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
                        <Button variant="ghost" shape="circle" size="s" onClick={(e) => { e.stopPropagation(); onEdit(items[0]); }} aria-label="Edit">
                            <Edit2 size={14} aria-hidden="true" />
                        </Button>
                    )}
                </div>
            </div>

            {isExpanded && (
                <div className="group-row__body" style={!children ? { paddingLeft } : undefined}>
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
                                            <td className="padding-vertical-2 padding-horizontal-4 w-40">
                                                <div className="flex align-items-center gap-2">
                                                    <CircleFlag countryCode={countryCode} size="s" />
                                                    <span className="text-sm text-neutral-600">{localeCode}</span>
                                                </div>
                                            </td>
                                            <td className="padding-vertical-2 padding-horizontal-4">
                                                <span className="text-sm font-weight-medium">{displayText}</span>
                                            </td>
                                            <td className="padding-vertical-2 padding-horizontal-4 w-20 text-align-right">
                                                {onDelete && (
                                                    <div className="flex justify-end gap-1">
                                                        <Button variant="ghost" shape="circle" size="s" onClick={() => onDelete(item)} className="text-feedback-error" aria-label="Delete">
                                                            <Trash2 size={12} aria-hidden="true" />
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
});

GroupRow.displayName = 'GroupRow';
