import React from 'react';
import PropTypes from 'prop-types';
import { AlertTriangle, Info, AlertCircle, HelpCircle } from 'lucide-react';
import Modal from './Modal';
import Button from './Button';
import Icon from './Icon';

/**
 * ConfirmationModal - A reusable confirmation dialog
 * 
 * Replaces window.confirm with a styled modal dialog.
 * Supports different variants for different types of confirmations.
 */
const ConfirmationModal = ({
    isOpen,
    onClose,
    onConfirm,
    title = 'Confirm Action',
    message,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    variant = 'warning',
    loading = false,
    children,
}) => {
    const iconMap = {
        danger: AlertCircle,
        warning: AlertTriangle,
        info: Info,
        question: HelpCircle,
    };

    const IconComponent = iconMap[variant] || AlertTriangle;

    const handleConfirm = () => {
        onConfirm();
        if (!loading) {
            onClose();
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="s">
            <div className={`confirmation-modal confirmation-modal--${variant}`}>
                <div className="confirmation-modal__header">
                    <Icon size="l" className={`confirmation-modal__icon confirmation-modal__icon--${variant}`}>
                        <IconComponent />
                    </Icon>
                    <h3 className="confirmation-modal__title">{title}</h3>
                </div>

                <div className="confirmation-modal__body">
                    {message && <p className="confirmation-modal__message">{message}</p>}
                    {children}
                </div>

                <div className="confirmation-modal__actions">
                    <Button
                        variant="secondary"
                        onClick={onClose}
                        disabled={loading}
                    >
                        {cancelText}
                    </Button>
                    <Button
                        variant={variant === 'danger' ? 'danger' : 'primary'}
                        onClick={handleConfirm}
                        loading={loading}
                        disabled={loading}
                    >
                        {confirmText}
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

ConfirmationModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onConfirm: PropTypes.func.isRequired,
    title: PropTypes.string,
    message: PropTypes.string,
    confirmText: PropTypes.string,
    cancelText: PropTypes.string,
    variant: PropTypes.oneOf(['danger', 'warning', 'info', 'question']),
    loading: PropTypes.bool,
    children: PropTypes.node,
};

export default ConfirmationModal;
