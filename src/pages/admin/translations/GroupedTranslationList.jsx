import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Edit2, Trash2, Database, Type, FileJson } from '../../../components/ui';
import { Button, Badge } from '../../../components/ui';
import CircleFlag from '../../../components/ui/CircleFlag';

const GroupedTranslationList = ({ translations, locales, onEdit, onDelete }) => {
    // Group by key
    const groups = translations.reduce((acc, t) => {
        if (!acc[t.translation_key]) {
            acc[t.translation_key] = {
                key: t.translation_key,
                source_table: t.source_table,
                source_column: t.source_column,
                source_type: t.source_type,
                items: []
            };
        }
        acc[t.translation_key].items.push(t);
        return acc;
    }, {});

    const sortedKeys = Object.keys(groups).sort();

    return (
        <div className="grouped-translation-list">
            {sortedKeys.map(key => (
                <TranslationGroup
                    key={key}
                    group={groups[key]}
                    locales={locales}
                    onEdit={onEdit}
                    onDelete={onDelete}
                />
            ))}
        </div>
    );
};

const TranslationGroup = ({ group, locales, onEdit, onDelete }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    // Single Item View (Mimic Table Row)
    if (group.items.length === 1) {
        const item = group.items[0];
        const countryCode = item.locale_code.includes('-') ? item.locale_code.split('-')[1] : null;

        return (
            <div className="translation-group-single-row flex items-center p-3 border-b border-neutral-200 hover:bg-neutral-50 gap-4 bg-white transition-colors">
                {/* Key */}
                <div className="flex-1 flex items-center gap-2 min-w-0">
                    <div className="text-neutral-400 shrink-0">
                        {group.source_type === 'ui' && <Type size={14} />}
                        {group.source_type === 'json_config' && <FileJson size={14} />}
                        {group.source_type === 'database' && <Database size={14} />}
                        {!group.source_type && <Type size={14} />}
                    </div>
                    <div className="font-medium text-sm truncate select-all" title={group.key}>{group.key}</div>
                </div>

                {/* Locale */}
                <div className="w-32 flex items-center gap-2 shrink-0">
                    <CircleFlag countryCode={countryCode} size="s" />
                    <span className="text-sm text-neutral-600">{item.locale_code}</span>
                </div>

                {/* Value */}
                <div className="flex-1 min-w-0">
                    <div className="text-sm text-neutral-900 truncate" title={item.translated_text}>{item.translated_text}</div>
                </div>

                {/* Status */}
                <div className="w-24 shrink-0">
                    <Badge
                        type={item.status === 'published' ? 'success' : item.status === 'draft' ? 'warning' : 'neutral'}
                        variant="light"
                        size="s"
                    >
                        {item.status}
                    </Badge>
                </div>

                {/* Actions */}
                <div className="w-20 flex justify-end gap-1 shrink-0">
                    <Button variant="icon-circle" size="s" onClick={() => onEdit(item)}><Edit2 size={14} /></Button>
                    <Button variant="icon-circle" size="s" onClick={() => onDelete(item)} className="text-feedback-error"><Trash2 size={14} /></Button>
                </div>
            </div>
        );
    }

    // Group View (Multiple Items)
    // Parse DB parts for display
    let title = group.key;
    let subtitle = '';

    if (group.source_type === 'database' && group.source_table && group.source_column) {
        title = `${group.source_column}`; // Display column as main title
        subtitle = `Table: ${group.source_table}`;
    }

    // Check completeness
    const missingLocales = locales.filter(l => !group.items.find(i => i.locale_code === l.locale));
    const allPublished = group.items.every(i => i.status === 'published');

    return (
        <div className={`translation-group ${isExpanded ? 'expanded' : ''}`}>
            <div className="translation-group-header" onClick={() => setIsExpanded(!isExpanded)}>
                <div className="flex items-center gap-3 flex-1">
                    <button className="group-expand-btn">
                        {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                    </button>
                    <div className="group-icon">
                        {group.source_type === 'ui' && <Type size={16} className="text-neutral-500" />}
                        {group.source_type === 'json_config' && <FileJson size={16} className="text-neutral-500" />}
                        {group.source_type === 'database' && <Database size={16} className="text-primary" />}
                        {!group.source_type && <Type size={16} className="text-neutral-500" />}
                    </div>
                    <div className="group-info">
                        <div className="group-title font-medium">{title}</div>
                        {subtitle && <div className="group-subtitle text-xs text-neutral-500">{subtitle}</div>}
                    </div>
                </div>

                <div className="group-meta flex items-center gap-4">
                    {allPublished && <Badge type="success" variant="light" size="s">Published</Badge>}
                    <div className="locale-badges flex gap-1">
                        {group.items.map(item => {
                            const locale = locales.find(l => l.locale === item.locale_code);
                            const countryCode = item.locale_code.includes('-') ? item.locale_code.split('-')[1] : null;
                            return (
                                <div key={item.id} title={`${item.locale_code}: ${item.translated_text}`}>
                                    <CircleFlag countryCode={countryCode} size="s" />
                                </div>
                            );
                        })}
                    </div>
                    <Button variant="icon-circle" size="s" onClick={(e) => { e.stopPropagation(); onEdit(group.items[0]); }}>
                        <Edit2 size={14} />
                    </Button>
                </div>
            </div>

            {isExpanded && (
                <div className="translation-group-body">
                    <table className="w-full">
                        <tbody>
                            {group.items.map(item => (
                                <tr key={item.id} className="group-item-row border-b border-neutral-100 last:border-0 hover:bg-neutral-50">
                                    <td className="py-2 px-4 w-40">
                                        <div className="flex items-center gap-2">
                                            <CircleFlag countryCode={item.locale_code.includes('-') ? item.locale_code.split('-')[1] : null} size="s" />
                                            <span className="text-sm text-neutral-600">{item.locale_code}</span>
                                        </div>
                                    </td>
                                    <td className="py-2 px-4">
                                        <span className="text-sm font-medium">{item.translated_text}</span>
                                    </td>
                                    <td className="py-2 px-4 w-20 text-right">
                                        <div className="flex justify-end gap-1">
                                            <Button variant="icon-circle" size="s" onClick={() => onDelete(item)} className="text-feedback-error"><Trash2 size={12} /></Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {missingLocales.length > 0 && (
                                <tr className="group-item-row bg-neutral-50">
                                    <td colSpan={3} className="py-2 px-4 text-center">
                                        <span className="text-xs text-neutral-500">Missing: {missingLocales.map(l => l.name).join(', ')}</span>
                                        {/* In real app, "Add Missing" button here would be great */}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default GroupedTranslationList;
