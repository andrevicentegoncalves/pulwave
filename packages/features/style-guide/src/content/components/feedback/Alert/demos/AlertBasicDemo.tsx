import React from 'react';
import { Alert } from '@ui';
import { DemoCard } from '@pulwave/features-style-guide';

const codeUsage = `<Alert status="info">
    This is a basic info alert. It provides contextual feedback to the user.
</Alert>`;

const AlertBasicDemo = () => {
    return (
        <DemoCard sourceCode={codeUsage} showSourceToggle={true} title="Basic Alert" description="Standard alert component">
            <Alert status="info">
                This is a basic info alert. It provides contextual feedback to the user.
            </Alert>
        </DemoCard>
    );
};

export default AlertBasicDemo;
