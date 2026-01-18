/**
 * EmptyState Basic Demo
 */
import { EmptyState, Button } from '@ui';
import { FileText } from '@ui';
import { DemoCard } from '@pulwave/features-style-guide';

const codeUsage = `<EmptyState
    icon={<FileText size={48} />}
    title="No documents found"
    description="Get started by creating a new document."
    action={<Button>Create Document</Button>}
/>`;

const EmptyStateBasicDemo = () => (
    <DemoCard sourceCode={codeUsage} showSourceToggle={true} title="EmptyState" description="Placeholder for empty content">
        <EmptyState
            icon={<FileText size={48} />}
            title="No documents found"
            description="Get started by creating a new document."
            action={<Button>Create Document</Button>}
        />
    </DemoCard>
);

export default EmptyStateBasicDemo;
