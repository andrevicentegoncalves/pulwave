/**
 * Modal Sizes Demo
 */
import { Fragment, useState } from 'react';
import { Modal, Button, Text } from '@pulwave/ui';
import { DemoCard } from '@pulwave/features-style-guide';

const codeUsage = `<Modal size="s" isOpen={isOpen} onClose={handleClose} title="Small Modal">
    <Text>Small modal content</Text>
</Modal>

<Modal size="l" isOpen={isOpen} onClose={handleClose} title="Large Modal">
    <Text>Large modal content</Text>
</Modal>

<Modal size="full" isOpen={isOpen} onClose={handleClose} title="Fullscreen Modal">
    <Text>Fullscreen modal content</Text>
</Modal>`;

const ModalSizesDemo = () => {
    const [openModal, setOpenModal] = useState<string | null>(null);

    const sizes = ['s', 'm', 'l', 'xl', 'full'] as const;

    return (
        <DemoCard sourceCode={codeUsage} showSourceToggle={true} title="Modal Sizes" description="Different modal sizes">
            <div className="demo-row">
                {sizes.map((size) => (
                    <Fragment key={size}>
                        <Button
                            variant="outlined"
                            onClick={() => setOpenModal(size)}
                        >
                            {size === 'full' ? 'Fullscreen' : `Size ${size.toUpperCase()}`}
                        </Button>

                        <Modal
                            isOpen={openModal === size}
                            onClose={() => setOpenModal(null)}
                            title={`Modal Size: ${size}`}
                            size={size}
                        >
                            <Text>This is a {size} modal dialog.</Text>
                            <div style={{ marginTop: 'var(--spacing-4)', display: 'flex', justifyContent: 'flex-end', gap: 'var(--spacing-3)' }}>
                                <Button variant="ghost" onClick={() => setOpenModal(null)}>Cancel</Button>
                                <Button onClick={() => setOpenModal(null)}>Confirm</Button>
                            </div>
                        </Modal>
                    </Fragment>
                ))}
            </div>
        </DemoCard>
    );
};

export default ModalSizesDemo;
