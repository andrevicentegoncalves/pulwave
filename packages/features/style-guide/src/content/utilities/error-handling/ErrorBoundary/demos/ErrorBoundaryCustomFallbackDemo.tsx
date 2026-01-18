import React, { useState } from 'react';
import { ErrorBoundary, Button, Text, Alert } from '@ui';
import { DemoCard } from '@pulwave/features-style-guide';

// Component that will throw an error
const BuggyWidget = ({ shouldThrow }: { shouldThrow: boolean }) => {
    if (shouldThrow) {
        throw new Error('Widget failed to load');
    }
    return <Text>Widget loaded successfully!</Text>;
};

// Custom fallback component
const CustomErrorFallback = () => (
    <Alert status="error" title="Widget Error">
        This widget encountered an error and couldn't load. Please try refreshing the page.
    </Alert>
);

export const ErrorBoundaryCustomFallbackDemo = () => {
    const [shouldThrow, setShouldThrow] = useState(false);
    const [key, setKey] = useState(0);

    const handleTriggerError = () => {
        setShouldThrow(true);
    };

    const handleReset = () => {
        setShouldThrow(false);
        setKey(k => k + 1);
    };

    return (
        <DemoCard
            title="Custom Fallback UI"
            description="ErrorBoundary with a custom Alert component as the fallback instead of the default UI."
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

                    <ErrorBoundary key={key} fallback={<CustomErrorFallback />}>
                        <BuggyWidget shouldThrow={shouldThrow} />
                    </ErrorBoundary>
                </div>
            )}
        </DemoCard>
    );
};

export default ErrorBoundaryCustomFallbackDemo;
