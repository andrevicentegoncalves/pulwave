import React, { useState } from 'react';
import { ErrorBoundary, Button, Text, Card } from '@ui';
import { DemoCard } from '@pulwave/features-style-guide';

// Component that will throw an error
const BuggyComponent = ({ shouldThrow }: { shouldThrow: boolean }) => {
    if (shouldThrow) {
        throw new Error('Simulated critical error');
    }
    return <Text>Component is healthy.</Text>;
};

export const ErrorBoundaryWithCallbackDemo = () => {
    const [shouldThrow, setShouldThrow] = useState(false);
    const [key, setKey] = useState(0);
    const [errorLog, setErrorLog] = useState<string[]>([]);

    const handleError = (error: Error, errorInfo: React.ErrorInfo) => {
        // In production, this would send to a monitoring service like Sentry
        const logEntry = `[${new Date().toLocaleTimeString()}] Error: ${error.message}`;
        setErrorLog(prev => [...prev, logEntry]);
        console.error('Error logged:', error, errorInfo);
    };

    const handleTriggerError = () => {
        setShouldThrow(true);
    };

    const handleReset = () => {
        setShouldThrow(false);
        setKey(k => k + 1);
    };

    const handleClearLog = () => {
        setErrorLog([]);
    };

    return (
        <DemoCard
            title="Error Callback for Monitoring"
            description="The onError callback logs errors. In production, use this to send errors to services like Sentry or LogRocket."
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
                        <Button onClick={handleClearLog} variant="ghost">
                            Clear Log
                        </Button>
                    </div>

                    <ErrorBoundary key={key} onError={handleError}>
                        <BuggyComponent shouldThrow={shouldThrow} />
                    </ErrorBoundary>

                    {errorLog.length > 0 && (
                        <Card>
                            <Text weight="semibold" style={{ marginBottom: '0.5rem' }}>Error Log (simulated monitoring):</Text>
                            <div style={{
                                fontFamily: 'monospace',
                                fontSize: '0.875rem',
                                backgroundColor: 'var(--color-surface-subtle)',
                                padding: '0.75rem',
                                borderRadius: 'var(--border-radius-s)',
                            }}>
                                {errorLog.map((log, i) => (
                                    <div key={i}>{log}</div>
                                ))}
                            </div>
                        </Card>
                    )}
                </div>
            )}
        </DemoCard>
    );
};

export default ErrorBoundaryWithCallbackDemo;
