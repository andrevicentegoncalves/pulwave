import { Database, Type, FileJson } from '@pulwave/ui';
import { GroupRow } from './components/GroupRow';
import type { TranslationItem } from './AllTranslationsList';
import type { Locale } from '@pulwave/entity-translation';

interface GroupedTranslationListProps {
    translations: TranslationItem[];
    locales?: Locale[];
    onEdit: (item: TranslationItem) => void;
    onDelete: (id: string) => void;
}

interface TranslationGroup {
    key: string;
    source_table?: string;
    source_column?: string;
    source_type?: string;
    items: TranslationItem[];
}

const GroupedTranslationList = ({ translations, locales, onEdit, onDelete }: GroupedTranslationListProps) => {
    // Group by key manually (reduce) or use utility if strictly needed.
    // The original code used reduce inline. I'll stick to that.

    const groups = translations.reduce<Record<string, TranslationGroup>>((acc, t) => {
        const key = t.translation_key || '';
        if (!acc[key]) {
            acc[key] = {
                key,
                source_table: t.table_name,
                source_column: t.column_name,
                source_type: t.source_type,
                items: []
            };
        }
        acc[key].items.push(t);
        return acc;
    }, {});

    // slice() creates explicit copy before sort to avoid mutation
    const sortedKeys = Object.keys(groups).slice().sort();

    return (
        <div className="grouped-translation-list admin-list-optimized">
            {sortedKeys.map(key => {
                const group = groups[key];

                // Determine icon based on source_type
                let icon = <Type size={14} className="text-neutral-500" />;
                if (group.source_type === 'json_config') icon = <FileJson size={14} className="text-neutral-500" />;
                if (group.source_type === 'database') icon = <Database size={14} className="color-text-primary" />;

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
                        onEdit={(item: TranslationItem) => onEdit({ ...item, items: group.items } as TranslationItem)}
                        onDelete={(item: TranslationItem) => onDelete(item.id || '')}
                    />
                );
            })}
        </div>
    );
};

export default GroupedTranslationList;
