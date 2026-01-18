
import React from 'react';
import { FormGrid, FormGridRow, Input, Select, Button, Stack } from '@pulwave/ui';
import { DemoCard } from '@pulwave/features-style-guide';

const codeUsage = `<FormGrid>
    <FormGridRow columns={2}>
        <Input label="First Name" placeholder="Jane" />
        <Input label="Last Name" placeholder="Doe" />
    </FormGridRow>

    <FormGridRow columns={1}>
        <Input label="Email Address" placeholder="jane.doe@company.com" />
    </FormGridRow>

    <FormGridRow columns={3}>
        <Select
            label="Country"
            options={[{ value: 'us', label: 'United States' }, { value: 'ca', label: 'Canada' }]}
            value="us"
        />
        <Input label="State/Province" placeholder="CA" />
        <Input label="Zip Code" placeholder="90210" />
    </FormGridRow>

    <Stack justify="end" spacing={4} style={{ marginTop: 'var(--spacing-4)' }}>
        <Button kind="secondary" variant="outlined">Cancel</Button>
        <Button kind="primary" variant="filled">Save Changes</Button>
    </Stack>
</FormGrid>`;

const FormGridBasicDemo = () => {
    return (
        <DemoCard sourceCode={codeUsage} showSourceToggle={true}
            title="Basic Form Layout"
            description="Using FormGrid and FormGridRow to layout input fields."
        >
            <FormGrid>
                <FormGridRow columns={2}>
                    <Input label="First Name" placeholder="Jane" />
                    <Input label="Last Name" placeholder="Doe" />
                </FormGridRow>

                <FormGridRow columns={1}>
                    <Input label="Email Address" placeholder="jane.doe@company.com" />
                </FormGridRow>

                <FormGridRow columns={3}>
                    <Select
                        label="Country"
                        options={[{ value: 'us', label: 'United States' }, { value: 'ca', label: 'Canada' }]}
                        value="us"
                        onChange={() => { }}
                    />
                    <Input label="State/Province" placeholder="CA" />
                    <Input label="Zip Code" placeholder="90210" />
                </FormGridRow>

                <Stack justify="end" spacing={4} style={{ marginTop: 'var(--spacing-4)' }}>
                    <Button kind="secondary" variant="outlined">Cancel</Button>
                    <Button kind="primary" variant="filled">Save Changes</Button>
                </Stack>
            </FormGrid>
        </DemoCard>
    );
};

export default FormGridBasicDemo;
