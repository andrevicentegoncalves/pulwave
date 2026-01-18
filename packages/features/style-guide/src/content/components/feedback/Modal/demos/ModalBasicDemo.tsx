/**
 * Modal Basic Demo
 */
import { useState } from 'react';
import { Modal, Button, Text } from '@ui';
import { DemoCard } from '@pulwave/features-style-guide';

const codeUsage = `import { Modal, Button, Text } from '@ui';
import { useState } from 'react';

const [isOpen, setIsOpen] = useState(false);

// Basic modal usage
<Button onClick={() => setIsOpen(true)}>Open Modal</Button>
<Modal
    isOpen={isOpen}
    onClose={() => setIsOpen(false)}
    title="Example Modal"
>
    <Text>Modal content goes here.</Text>
</Modal>

// With footer actions
<Modal
    isOpen={isOpen}
    onClose={() => setIsOpen(false)}
    title="Confirm Action"
    footer={<Button onClick={handleConfirm}>Confirm</Button>}
>
    <Text>Are you sure?</Text>
</Modal>

// Props: isOpen, onClose, title, footer, size (xs/s/m/l/xl/2xl),
// closeOnBackdropClick, closeOnEscape, showCloseButton, scrollableBody`;

const ModalBasicDemo = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <DemoCard sourceCode={codeUsage} showSourceToggle={true} title="Basic Modal" description="Simple modal dialog with trigger">
            <Button onClick={() => setIsOpen(true)}>Open Modal</Button>
            <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Example Modal">
                <Text>This is a modal dialog. Click outside or press Escape to close.</Text>
            </Modal>
        </DemoCard>
    );
};

export default ModalBasicDemo;
