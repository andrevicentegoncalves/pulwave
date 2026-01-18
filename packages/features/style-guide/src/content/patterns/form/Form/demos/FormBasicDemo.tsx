import React, { useState } from 'react';
import { Form, FormGroup, FormRow, FormActions, Input, Button } from '@pulwave/ui';
import { DemoCard } from '@pulwave/features-style-guide';

export const FormBasicDemo = () => {
    const [formData, setFormData] = useState({ name: '', email: '' });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        alert(`Submitted: ${JSON.stringify(formData)}`);
    };

    return (
        <DemoCard
            title="Basic Form"
            description="Simple vertical form with field grouping."
        >
            <Form onSubmit={handleSubmit}>
                <FormGroup>
                    <Input
                        label="Name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                    <Input
                        label="Email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                </FormGroup>
                <FormActions>
                    <Button kind="secondary" type="button">Cancel</Button>
                    <Button type="submit">Save</Button>
                </FormActions>
            </Form>
        </DemoCard>
    );
};
export default FormBasicDemo;
