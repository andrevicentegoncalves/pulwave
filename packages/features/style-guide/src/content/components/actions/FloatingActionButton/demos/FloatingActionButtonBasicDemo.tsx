import { FloatingActionButton, Box, Text } from '@ui';
import { Mail, Phone, MessageSquare } from '@ui';
import { DemoCard } from '@pulwave/features-style-guide';

const codeUsage = `<FloatingActionButton
    position="bottom-right"
    actions={[
        { icon: <Mail />, label: 'Email', onClick: handleEmail },
        { icon: <MessageSquare />, label: 'Message', onClick: handleMessage },
        { icon: <Phone />, label: 'Call', onClick: handleCall },
    ]}
/>`;

const FloatingActionButtonBasicDemo = () => {
    return (
        <DemoCard sourceCode={codeUsage} showSourceToggle={true} title="Floating Action Button" description="Primary action button">
            <div
                className="relative h-[300px] w-full border border-neutral-200 bg-neutral-50 overflow-hidden rounded-m"
            >
                <div className="p-4">
                    <Text>
                        The FAB is positioned relative to this container for demo purposes.
                        Click the + button to see actions.
                    </Text>
                </div>

                <FloatingActionButton
                    position="bottom-right"
                    strategy="absolute"
                    actions={[
                        {
                            icon: <Mail size={20} />,
                            label: 'Email',
                            onClick: () => alert('Email clicked')
                        },
                        {
                            icon: <MessageSquare size={20} />,
                            label: 'Message',
                            onClick: () => alert('Message clicked')
                        },
                        {
                            icon: <Phone size={20} />,
                            label: 'Call',
                            onClick: () => alert('Call clicked')
                        },
                    ]}
                />
            </div>
        </DemoCard>
    );
};

export default FloatingActionButtonBasicDemo;
