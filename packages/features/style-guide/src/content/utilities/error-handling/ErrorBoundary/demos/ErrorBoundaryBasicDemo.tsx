import React, { useState } from 'react';
import { ErrorBoundary, Button, Text, Card } from '@ui';
import { DemoCard } from '@pulwave/features-style-guide';

// Component that will throw an error
const BuggyComponent = ({ shouldThrow }: { shouldThrow: boolean }) => {
    if (shouldThrow) {
        throw new Error('This is a simulated error for demonstration purposes');
    }
    return (
        <Card>
            <Text>This component is working correctly.</Text>
        </Card>
    );
};

export const ErrorBoundaryBasicDemo = () => {
    const [shouldThrow, setShouldThrow] = useState(false);
    const [key, setKey] = useState(0);

    const handleTriggerError = () => {
        setShouldThrow(true);
    };

    const handleReset = () => {
        setShouldThrow(false);
        setKey(k => k + 1); // Force remount
    };

    return (
        <DemoCard
            title="Basic Error Boundary"
            description="Click the button to trigger an error. The ErrorBoundary catches it and shows a fallback UI."
        >
            {() => (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <Button onClick={handleTriggerError} kind="error" disabled={shouldThrow}>
                            Trigger Error
                        </Button>
                        <Button onClick={handleReset} variant="outlined">
                            Reset
                        </Button>
                    </div>

                    <ErrorBoundary key={key}>
                        <BuggyComponent shouldThrow={shouldThrow} />
                    </ErrorBoundary>
                </div>
            )}
        </DemoCard>
    );
};

export default ErrorBoundaryBasicDemo;
