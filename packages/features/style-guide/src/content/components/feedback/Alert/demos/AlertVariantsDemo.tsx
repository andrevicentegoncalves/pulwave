import React from 'react';
import { Alert, Stack, Text } from '@pulwave/ui';
import { DemoCard } from '@pulwave/features-style-guide';

const codeUsage = `import { Alert } from '@ui';

// Status options: success, warning, error, info
// Variant options: inline, toast, modal

// Inline variant (standard)
<Alert status="success" variant="inline">
    Operation completed successfully.
</Alert>

// Toast variant (notification style)
<Alert status="warning" variant="toast">
    Please review your input.
</Alert>

// Modal/Banner variant (prominent)
<Alert status="error" variant="modal">
    An error occurred. Please try again.
</Alert>

// Dismissible alert
<Alert status="info" dismissible onDismiss={() => {}}>
    Click the X to dismiss this alert.
</Alert>

// Props: status, variant, dismissible, onDismiss, className`;

const AlertVariantsDemo = () => {
    return (
        <DemoCard sourceCode={codeUsage} showSourceToggle={true} title="Alert Variants" description="Different styling variants">
            <Stack gap="m">
                <Alert status="success" variant="outlined">
                    <Text><Text as="span" weight="bold">Inline Variant:</Text> Standard appearance for page content.</Text>
                </Alert>

                <Alert status="warning" variant="subtle">
                    <Text><Text as="span" weight="bold">Toast Variant:</Text> Styled like a toast notification.</Text>
                </Alert>

                <Alert status="error" variant="solid">
                    <Text><Text as="span" weight="bold">Modal/Banner Variant:</Text> Prominent style for important messages.</Text>
                </Alert>
            </Stack>
        </DemoCard>
    );
};

export default AlertVariantsDemo;
