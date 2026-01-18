import React, { useState } from 'react';
import { Button } from '@pulwave/ui';
import { ImportModal } from '@pulwave/widgets';
import { DemoCard } from '@pulwave/features-style-guide';

export const ImportModalBasicDemo = () => {
    const [isOpen, setIsOpen] = useState(false);

    const handleImport = async (data: any[], filenames: string) => {
        alert(`Imported ${data.length} rows from ${filenames}`);
        setIsOpen(false);
    };

    return (
        <DemoCard title="Import Modal" description="A comprehensive file import dialog with preview and validation.">
            <Button onClick={() => setIsOpen(true)}>Open Import Modal</Button>
            <ImportModal
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                onImport={handleImport}
                entityName="Users"
                supportedFormats={['json', 'csv']}
            />
        </DemoCard>
    );
};
