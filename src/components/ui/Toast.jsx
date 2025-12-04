import React from 'react';
import PropTypes from 'prop-types';
import Icon from './Icon';
import { XClose, CheckCircle, AlertCircle, Info, AlertTriangle } from './iconLibrary';

const Toast = ({ message, type = 'info', onClose }) => {
    const icons = {
        success: CheckCircle,
        error: AlertCircle,
        warning: AlertTriangle,
        info: Info,
    };

    const IconComponent = icons[type] || Info;

    return (
        <div className={`toast toast--${type}`}>
            <div className="toast__icon">
                <Icon size="m">
                    <IconComponent />
                </Icon>
            </div>
            <div className="toast__message">{message}</div>
            <button
                className="toast__close"
                onClick={onClose}
                aria-label="Close notification"
            >
                <XClose />
            </button>
        </div>
    );
};

Toast.propTypes = {
    message: PropTypes.string.isRequired,
    type: PropTypes.oneOf(['success', 'error', 'warning', 'info']),
    onClose: PropTypes.func.isRequired,
};

export default Toast;
