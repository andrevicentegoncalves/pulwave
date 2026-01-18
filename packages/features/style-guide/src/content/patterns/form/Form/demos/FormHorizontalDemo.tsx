import { Form, FormGroup, FormRow, FormActions, Input, Button } from '@ui';
import { DemoCard } from '@pulwave/features-style-guide';

export const FormHorizontalDemo = () => {
    return (
        <DemoCard
            title="Horizontal Layout"
            description="Labels aligned to the left of inputs."
        >
            {() => (
                <Form layout="horizontal" onSubmit={() => { }}>
                    <FormGroup>
                        <Input label="Username" autoComplete="username" />
                        <Input label="Password" type="password" autoComplete="current-password" />
                    </FormGroup>
                    <FormActions>
                        <Button type="submit">Login</Button>
                    </FormActions>
                </Form>
            )}
        </DemoCard>
    );
};
export default FormHorizontalDemo;
