import React, { useState } from 'react';
import { RichTextEditor, Stack, Text } from '@pulwave/ui';
import { DemoCard } from '@pulwave/features-style-guide';

export const RichTextEditorBasicDemo = () => {
    const [content, setContent] = useState('<p>Hello <strong>World</strong>!</p>');

    return (
        <DemoCard title="Basic Editor" description="A standard WSYIWYG editor using TipTap.">
            <Stack gap="4">
                <RichTextEditor
                    content={content}
                    onChange={setContent}
                    placeholder="Type something amazing…"
                />
                <div style={{ marginTop: '1rem', padding: '1rem', background: 'var(--color-surface-muted)', borderRadius: '4px' }}>
                    <Text category="label" size="s" color="muted">HTML Output:</Text>
                    <Text category="body" size="s" style={{ fontFamily: 'monospace' }}>{content}</Text>
                </div>
            </Stack>
        </DemoCard>
    );
};

