import { useState } from 'react';
import { Wizard, WizardStep } from '@pulwave/widgets';
import { Input, Select, Stack, Box, Text } from '@pulwave/ui';
import { User, CreditCard, CheckCircle } from '@pulwave/ui';
import { DemoCard } from '@pulwave/features-style-guide';

const codeUsage = `<Wizard
    steps={[
        { title: 'Account', icon: User },
        { title: 'Payment', icon: CreditCard },
        { title: 'Confirm', icon: CheckCircle },
    ]}
    currentStep={currentStep}
    onNext={handleNext}
    onBack={handleBack}
    onFinish={handleFinish}
    loading={loading}
>
    {/* Step Content */}
</Wizard>`;

const WizardBasicDemo = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const [loading, setLoading] = useState(false);

    const steps: WizardStep[] = [
        { title: 'Account', icon: User },
        { title: 'Payment', icon: CreditCard },
        { title: 'Confirm', icon: CheckCircle },
    ];

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleFinish = () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            alert('Wizard completed!');
            setCurrentStep(0);
        }, 1500);
    };

    return (
        <DemoCard sourceCode={codeUsage} showSourceToggle={true}
            title="Wizard Flow"
            description="Multi-step wizard with navigation and completion state."
        >
            <Wizard
                steps={steps}
                currentStep={currentStep}
                onNext={handleNext}
                onBack={handleBack}
                onFinish={handleFinish}
                loading={loading}
            >
                <div style={{ padding: 'var(--spacing-4)', minHeight: '200px' }}>
                    {currentStep === 0 && (
                        <Stack gap="4">
                            <Text category="title" size="m">Account Information</Text>
                            <Input label="Full Name" placeholder="John Doe" />
                            <Input label="Email Address" placeholder="john@example.com" />
                        </Stack>
                    )}
                    {currentStep === 1 && (
                        <Stack gap="4">
                            <Text category="title" size="m">Payment Details</Text>
                            <Input label="Card Number" placeholder="0000 0000 0000 0000" />
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <Input label="Expiry" placeholder="MM/YY" />
                                <Input label="CVC" placeholder="123" />
                            </div>
                        </Stack>
                    )}
                    {currentStep === 2 && (
                        <Stack gap="4" align="center" justify="center" style={{ height: '100%' }}>
                            <Box padding={6} background="neutral-subtle" borderRadius="m" style={{ textAlign: 'center' }}>
                                <Text category="title" size="m" style={{ marginBottom: 'var(--spacing-3)' }}>Review & Confirm</Text>
                                <Text color="muted" style={{ marginBottom: '1rem' }}>Please review your information before submitting.</Text>
                                <Stack gap="2">
                                    <Text><Text as="span" weight="bold">Plan:</Text> Pro Plan</Text>
                                    <Text><Text as="span" weight="bold">Total:</Text> $29.00/mo</Text>
                                </Stack>
                            </Box>
                        </Stack>
                    )}
                </div>
            </Wizard>
        </DemoCard>
    );
};

export default WizardBasicDemo;
