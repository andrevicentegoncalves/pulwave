import React from 'react';
import { Alert } from '../Alert';
import { Text } from '../Text';
import type { ToastProps } from './types';

export const Toast = ({ message, variant = 'info', onClose, className }: ToastProps) => (
    <Alert status={variant} variant="solid" dismissible onDismiss={onClose} className={className}>
        {typeof message === 'string' ? <Text>{message}</Text> : message}
    </Alert>
);
Toast.displayName = 'Toast';
