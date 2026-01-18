import { ComponentDoc } from '@pulwave/features-style-guide';

const ImportModalDoc: ComponentDoc = {
    name: 'ImportModal',
    description: 'A pre-built modal for importing data from files (JSON, CSV, XLS). Includes drag-and-drop, parsing, preview, and validation hooks.',
    usage: `
\`\`\`tsx
import { ImportModal } from '@pulwave/ui';

<ImportModal
    isOpen={isOpen}
    onClose={close}
    onImport={(data) => saveData(data)}
    entityName="Products"
/>
\`\`\`
`,
    props: [
        { name: 'isOpen', type: "boolean", description: 'Controls visibility.' },
        { name: 'onImport', type: "(data, filenames) => Promise<void>", description: 'Called when user confirms import.' },
        { name: 'supportedFormats', type: "string[]", default: "['json', 'csv']", description: 'Allowed file extensions.' },
        { name: 'onValidate', type: "(data) => Promise<ValidationResult>", description: 'Optional validation hook.' },
    ]
};

export default ImportModalDoc;
