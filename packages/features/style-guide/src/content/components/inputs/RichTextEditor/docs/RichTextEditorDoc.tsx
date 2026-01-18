import React from 'react';
import { ComponentDoc } from '@pulwave/features-style-guide';

const RichTextEditorDoc: ComponentDoc = {
    name: 'RichTextEditor',
    description: 'A rich text editor component based on TipTap, providing a familiar WYSIWYG editing experience.',
    usage: `
\`\`\`tsx
import { RichTextEditor } from '@pulwave/ui';
import { useState } from 'react';

const MyEditor = () => {
    const [content, setContent] = useState('');

    return (
        <RichTextEditor
            content={content}
            onChange={setContent}
        />
    );
};
\`\`\`
`,
    props: [
        { name: 'content', type: "string", description: 'Initial HTML content.' },
        { name: 'onChange', type: "(html: string) => void", description: 'Callback when content changes.' },
        { name: 'placeholder', type: "string", description: 'Placeholder text when empty.' },
        { name: 'editable', type: "boolean", default: "true", description: 'Whether the editor is read-only.' },
        { name: 'minHeight', type: "string", default: "'150px'", description: 'Minimum height of the editor content area.' },
        { name: 'showToolbar', type: "boolean", default: "true", description: 'Whether to show the toolbar.' },
    ]
};

export default RichTextEditorDoc;
