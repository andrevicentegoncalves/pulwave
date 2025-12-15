import React from 'react';
import { Database, Type, FileJson, GroupRow } from '../../../components/ui';
import { groupBy } from '../../../utils';

const GroupedTranslationList = ({ translations, locales, onEdit, onDelete }) => {
    // Group by key using utility
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
            {sortedKeys.map(key => {
                const group = groups[key];

                // Determine icon based on source_type
                let icon = <Type size={14} className="text-neutral-500" />;
                if (group.source_type === 'json_config') icon = <FileJson size={14} className="text-neutral-500" />;
                if (group.source_type === 'database') icon = <Database size={14} className="text-primary" />;

                // Determine title/subtitle
                let title = group.key;
                let subtitle = '';
                if (group.source_type === 'database' && group.source_table && group.source_column) {
                    title = group.source_column;
                    subtitle = `Table: ${group.source_table}`;
                }

                const allPublished = group.items.every(i => i.status === 'published');

                return (
                    <GroupRow
                        key={key}
                        title={title}
                        subtitle={subtitle}
                        icon={icon}
                        items={group.items}
                        localeKey="locale_code"
                        textKey="translated_text"
                        allPublished={allPublished}
                        onEdit={(item) => onEdit({ ...item, items: group.items })}
                        onDelete={onDelete}
                    />
                );
            })}
        </div>
    );
};

// Export TranslationGroup for backward compatibility (now wraps GroupRow)
export const TranslationGroup = ({ group, locales, onEdit, onDelete }) => {
    let icon = <Type size={14} className="text-neutral-500" />;
    if (group.source_type === 'json_config') icon = <FileJson size={14} className="text-neutral-500" />;
    if (group.source_type === 'database') icon = <Database size={14} className="text-primary" />;

    let title = group.key;
    let subtitle = '';
    if (group.source_type === 'database' && group.source_table && group.source_column) {
        title = group.source_column;
        subtitle = `Table: ${group.source_table}`;
    }

    const allPublished = group.items.every(i => i.status === 'published');

    return (
        <GroupRow
            title={title}
            subtitle={subtitle}
            icon={icon}
            items={group.items}
            localeKey="locale_code"
            textKey="translated_text"
            allPublished={allPublished}
            onEdit={(item) => onEdit({ ...item, items: group.items })}
            onDelete={onDelete}
        />
    );
};

export default GroupedTranslationList;

