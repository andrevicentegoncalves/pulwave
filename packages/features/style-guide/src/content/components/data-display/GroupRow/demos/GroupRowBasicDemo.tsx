import React from 'react';
import { GroupRow } from '@pulwave/ui';
import { Layout } from '@pulwave/ui';
import { DemoCard } from '@pulwave/features-style-guide';

export const GroupRowBasicDemo = () => {
    return (
        <DemoCard title="Group Row" description="Expandable row for grouped data.">
            <GroupRow
                title="Marketing Campaign"
                icon={<Layout size={16} />}
                count={3}
                items={[
                    { id: '1', locale_code: 'en-US', translated_text: 'Summer Sale', status: 'published' },
                    { id: '2', locale_code: 'fr-FR', translated_text: 'Soldes d\'Ã©tÃ©', status: 'draft' },
                    { id: '3', locale_code: 'es-ES', translated_text: 'Rebajas de verano', status: 'published' }
                ]}
                defaultExpanded
            />
            <GroupRow
                title="Legal Documents"
                icon={<Layout size={16} />}
                count={12}
                items={[]} // simulate lazy loaded or large group
            />
        </DemoCard>
    );
};

