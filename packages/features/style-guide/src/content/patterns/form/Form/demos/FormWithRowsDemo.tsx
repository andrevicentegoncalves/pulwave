import { Form, FormRow, FormActions, Input, Button } from '@ui';
import { DemoCard } from '@pulwave/features-style-guide';

export const FormWithRowsDemo = () => {
    return (
        <DemoCard
            title="Form with Rows"
            description="Side-by-side fields using FormRow."
        >
            {() => (
                <Form onSubmit={() => { }}>
                    <FormRow>
                        <Input label="First Name" fullWidth />
                        <Input label="Last Name" fullWidth />
                    </FormRow>
                    <FormRow>
                        <Input label="City" fullWidth />
                        <Input label="State" fullWidth />
                        <Input label="ZIP" fullWidth />
                    </FormRow>
                    <FormActions>
                        <Button type="submit">Submit</Button>
                    </FormActions>
                </Form>
            )}
        </DemoCard>
    );
};
export default FormWithRowsDemo;
