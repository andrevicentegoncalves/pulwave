
import React, { useState } from 'react';
import { RichTextEditor, Stack, Text, Card } from '@pulwave/ui';
import { DemoCard } from '@pulwave/features-style-guide';

const codeUsage = `<RichTextEditor
    content={value}
    onChange={setValue}
    placeholder="Type something…"
    minHeight="200px"
/>`;

export default function RichTextEditorBasic() {
    const [value, setValue] = useState('<p>Hello <strong>World</strong>!</p>');

    return (
        <DemoCard sourceCode={codeUsage} showSourceToggle={true}
            title="Rich Text Editor"
            description="WYSIWYG editor for rich text content."
        >
            <Stack gap="m">
                <RichTextEditor
                    content={value}
                    onChange={setValue}
                    placeholder="Type something…"
                    minHeight="200px"
                />

                <Card padding="s" variant="outlined">
                    <Text size="s" weight="medium" color="muted">Output HTML:</Text>
                    <Text as="pre" size="s" style={{
                        whiteSpace: 'pre-wrap',
                        margin: 0,
                        marginTop: 'var(--spacing-2)'
                    }}>
                        {value}
                    </Text>
                </Card>
            </Stack>
        </DemoCard>
    );
}
