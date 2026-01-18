import React, { useState } from 'react';
import { Drawer, Button, Text } from '@pulwave/ui';
import { DemoCard } from '@pulwave/features-style-guide';

const codeUsage = `<Drawer
    responsive={true} // Automatically switches to bottom sheet on mobile
    position="right"
    isOpen={isOpen}
    onClose={handleClose}
    title="Responsive Drawer"
>
    <Text>
        This drawer will appear on the right for desktop screens
        and slide up from the bottom on mobile devices.
    </Text>
</Drawer>`;

const DrawerResponsiveDemo = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <DemoCard sourceCode={codeUsage} showSourceToggle={true} title="Responsive Drawer" description="Adapts position based on screen size">
            <div style={{ padding: '20px', border: '1px dashed #ccc', borderRadius: '8px' }}>
                <Text>Resize the window to see the drawer switch position.</Text>
                <br />
                <Text size="s" color="info">Desktop: Right Side | Mobile: Bottom Sheet</Text>
                <br />
                <Button kind="primary" onClick={() => setIsOpen(true)}>Open Responsive Drawer</Button>

                <Drawer
                    isOpen={isOpen}
                    onClose={() => setIsOpen(false)}
                    title="Responsive Drawer"
                    responsive={true}
                    position="right"
                    footer={
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                            <Button kind="secondary" variant="outlined" onClick={() => setIsOpen(false)}>Cancel</Button>
                            <Button kind="primary" onClick={() => setIsOpen(false)}>Confirm</Button>
                        </div>
                    }
                >
                    <div style={{ padding: '16px' }}>
                        <Text>
                            This drawer will appear on the <strong>right</strong> for desktop screens
                            and slide up from the <strong>bottom</strong> on mobile devices (width &lt; 768px).
                        </Text>
                        <br />
                        <Text>
                            The <code>responsive</code> prop handles this behavior automatically.
                        </Text>
                    </div>
                </Drawer>
            </div>
        </DemoCard>
    );
};

export default DrawerResponsiveDemo;
