import React, { useState } from 'react';
import { ConfirmationModal, Button, Stack } from '@pulwave/ui';
import { DemoCard } from '@pulwave/features-style-guide';

const codeUsage = `<ConfirmationModal
    isOpen={isOpen}
    onClose={handleClose}
    onConfirm={handleConfirm}
    title="Delete Item?"
    message="Are you sure you want to delete this item?"
    variant="danger"
    confirmText="Delete"
/>`;

const ConfirmationModalBasicDemo = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [variant, setVariant] = useState<'danger' | 'warning' | 'info' | 'question'>('warning');

    const handleOpen = (v: 'danger' | 'warning' | 'info' | 'question') => {
        setVariant(v);
        setIsOpen(true);
    };

    const handleConfirm = () => {
        console.log('Confirmed!');
        setIsOpen(false);
    };

    return (
        <DemoCard sourceCode={codeUsage} showSourceToggle={true}
            title="Confirmation Modal"
            description="Pre-built modal for confirmations with variants."
        >
            <Stack direction="row" spacing="4">
                <Button kind="error" variant="filled" onClick={() => handleOpen('danger')}>Delete Item (Danger)</Button>
                <Button kind="warning" variant="filled" onClick={() => handleOpen('warning')}>Archive Item (Warning)</Button>
                <Button kind="primary" variant="filled" onClick={() => handleOpen('info')}>Publish Item (Info)</Button>
                <Button kind="secondary" variant="filled" onClick={() => handleOpen('question')}>Unsubscribe? (Question)</Button>
            </Stack>

            <ConfirmationModal
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                onConfirm={handleConfirm}
                title={
                    variant === 'danger' ? 'Delete Item?' :
                        variant === 'warning' ? 'Archive Item?' :
                            variant === 'info' ? 'Publish Item?' :
                                'Unsubscribe?'
                }
                message={
                    variant === 'danger' ? 'Are you sure you want to delete this item? This action cannot be undone.' :
                        variant === 'warning' ? 'This item will be moved to archives. You can restore it later.' :
                            variant === 'info' ? 'This item will be visible to all users.' :
                                'Are you sure you want to unsubscribe from our newsletter?'
                }
                variant={variant}
                confirmText={variant === 'danger' ? 'Delete' : 'Confirm'}
            />
        </DemoCard>
    );
};

export default ConfirmationModalBasicDemo;
