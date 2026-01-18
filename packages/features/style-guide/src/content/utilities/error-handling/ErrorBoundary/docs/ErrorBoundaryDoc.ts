/**
 * ErrorBoundaryDoc - Documentation for ErrorBoundary utility component
 *
 * ErrorBoundary catches JavaScript errors in child components and displays a fallback UI.
 *
 * @version 1.0.0
 */
import * as ErrorBoundaryDemos from '../demos';

const ErrorBoundaryDoc = {
    name: 'ErrorBoundary',
    description: 'React error boundary component that catches JavaScript errors anywhere in the child component tree, logs errors, and displays a fallback UI instead of crashing.',
    status: 'stable' as const,
    version: '1.0.0',
    lastUpdated: '2026-01-14',

    // Accessibility Testing Status
    accessibilityStatus: {
        keyboard: 'pass' as const,
        focusManagement: 'pass' as const,
        colorContrast: 'pass' as const,
        screenReader: 'pass' as const,
    },

    // When to Use
    whenToUse: [
        'At route boundaries to prevent full app crashes',
        'Around third-party components that may throw errors',
        'Wrapping complex feature sections',
        'Near data fetching components that may fail',
    ],

    whenNotToUse: [
        { text: 'Event handlers', alternative: 'Use try/catch directly' },
        { text: 'Async code', alternative: 'Use async error handling patterns' },
        { text: 'Server-side rendering errors', alternative: 'Use SSR-specific error handling' },
    ],

    // Overview
    overview: {
        description: 'ErrorBoundary is a class component that uses React\'s error boundary lifecycle methods to catch errors during rendering, in lifecycle methods, and in constructors of the whole tree below them. Provides a default error UI with retry capability or accepts a custom fallback.',
        variants: [],
        demos: [
            {
                name: 'Basic Error Boundary',
                description: 'Default error UI with retry button',
                component: ErrorBoundaryDemos.ErrorBoundaryBasicDemo,
            },
            {
                name: 'Custom Fallback',
                description: 'Using a custom fallback component',
                component: ErrorBoundaryDemos.ErrorBoundaryCustomFallbackDemo,
            },
            {
                name: 'With Error Callback',
                description: 'Logging errors to a monitoring service',
                component: ErrorBoundaryDemos.ErrorBoundaryWithCallbackDemo,
            }
        ]
    },

    // Props
    props: [
        { name: 'children', type: 'ReactNode', required: true, description: 'Components to wrap and protect from crashes' },
        { name: 'fallback', type: 'ReactNode', description: 'Custom UI to display when an error occurs. If not provided, uses default error UI.' },
        { name: 'onError', type: '(error: Error, errorInfo: ErrorInfo) => void', description: 'Callback fired when an error is caught. Use for logging to monitoring services.' },
    ],

    // Key Features
    keyFeatures: [
        'Catches render errors in child component tree',
        'Default error UI with retry functionality',
        'Custom fallback support',
        'Error callback for monitoring/logging',
        'Development mode shows error details',
        'Retry button resets error state',
    ],

    // Accessibility
    accessibility: {
        keyboard: [
            { key: 'Tab', action: 'Navigate to retry button' },
            { key: 'Enter/Space', action: 'Activate retry button' },
        ],
        aria: [
            { attribute: 'role="alert"', usage: 'Applied to error container for screen reader announcement' },
        ],
        wcagCompliance: [
            '4.1.3 Status Messages - Error state announced to assistive technologies',
        ],
    },

    // In Use (Do/Don't)
    inUse: {
        dos: [
            'Place at strategic boundaries (routes, features, third-party integrations)',
            'Provide meaningful error messages to users',
            'Use onError callback to log errors to monitoring services',
            'Test error boundaries by intentionally throwing errors in development',
        ],
        donts: [
            'Don\'t wrap every single component - use strategically',
            'Don\'t use for handling async/API errors - use proper async error handling',
            'Don\'t rely on error boundaries for expected error states',
            'Don\'t forget to provide a way to recover or retry',
        ],
        examples: [
            {
                name: 'Route-level Error Boundary',
                description: 'Wrap route content to prevent full app crashes',
                code: `<ErrorBoundary onError={logToSentry}>
  <Routes>
    <Route path="/dashboard" element={<Dashboard />} />
  </Routes>
</ErrorBoundary>`
            },
            {
                name: 'Custom Fallback UI',
                description: 'Provide contextual error UI',
                code: `<ErrorBoundary
  fallback={
    <Alert variant="error">
      Failed to load widget. Please refresh.
    </Alert>
  }
>
  <ComplexWidget />
</ErrorBoundary>`
            },
        ]
    },

    // Related Components
    relatedComponents: [
        { name: 'Alert', description: 'Can be used as custom fallback UI' },
        { name: 'EmptyState', description: 'Can be used for error empty states' },
        { name: 'Toast', description: 'For transient error notifications' },
    ],
};

export default ErrorBoundaryDoc;
