import { Timeline } from '@ui';
import { DemoCard } from '@pulwave/features-style-guide';

const codeUsage = `<Timeline
    items={[
        { id: '1', title: 'Order placed', timestamp: '10:30 AM', variant: 'success' },
        { id: '2', title: 'Processing', timestamp: '11:15 AM' },
        { id: '3', title: 'Shipped', timestamp: '2:00 PM', variant: 'info' },
        { id: '4', title: 'Delivered', timestamp: 'Pending', variant: 'default' },
    ]}
/>`;

const TimelineDemo = () => (
    <DemoCard sourceCode={codeUsage} showSourceToggle={true} title="Timeline" description="Chronological event display">
        <Timeline
            items={[
                { id: '1', title: 'Order placed', timestamp: '10:30 AM', content: 'Your order has been confirmed.', variant: 'success' },
                { id: '2', title: 'Processing', timestamp: '11:15 AM', content: 'Payment verified and processing started.' },
                { id: '3', title: 'Shipped', timestamp: '2:00 PM', content: 'Package has been shipped.', variant: 'info' },
                { id: '4', title: 'Delivered', timestamp: 'Pending', content: 'Awaiting delivery.', variant: 'default' },
            ]}
        />
    </DemoCard>
);

export default TimelineDemo;
