import React, { useState } from 'react';
import { InlineEdit, Stack, Text, Box } from '@pulwave/ui';
import { DemoCard } from '@pulwave/features-style-guide';

const demoCode = `
import { InlineEdit, Stack, Text, Box } from '@pulwave/ui';

const InlineEditDemo = () => {
    const [title, setTitle] = useState('Project Alpha');
    const [desc, setDesc] = useState('This project targets Q3 launch.');

    return (
        <Stack spacing={6}>
            <Box>
                <InlineEdit
                    label="Project Title"
                    value={title}
                    onSave={setTitle}
                />
            </Box>
            <Box>
                <InlineEdit
                    label="Description (Textarea)"
                    value={desc}
                    onSave={setDesc}
                    as="textarea"
                />
            </Box>
        </Stack>
    );
};`;

const InlineEditBasicDemo = () => {
    const [title, setTitle] = useState('Project Alpha');
    const [desc, setDesc] = useState('This project targets Q3 launch.');

    return (
        <DemoCard sourceCode={demoCode} showSourceToggle={true}
            title="Inline Edit"
            description="Click on the text to edit it in place."
        >
            <Stack spacing={6}>
                <Box>
                    <InlineEdit
                        label="Project Title"
                        value={title}
                        onSave={setTitle}
                    />
                    <Text size="s" style={{ marginTop: '0.5rem' }}>
                        Value: {title}
                    </Text>
                </Box>

                <Box>
                    <InlineEdit
                        label="Description (Textarea)"
                        value={desc}
                        onSave={setDesc}
                        as="textarea"
                    />
                </Box>

                <Box>
                    <InlineEdit
                        label="Disabled State"
                        value="This cannot be edited"
                        onSave={() => { }}
                        disabled
                    />
                </Box>
            </Stack>
        </DemoCard>
    );
};

export default InlineEditBasicDemo;
