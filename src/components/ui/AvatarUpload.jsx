import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import Icon from './Icon';
import { User, Camera, Spinner } from './iconLibrary';

/**
 * AvatarUpload Component
 * Displays a round avatar with hover edit effect and click-to-upload functionality.
 */
const AvatarUpload = ({
    src,
    alt = 'Avatar',
    size = 'default',
    onUpload,
    loading = false,
    className = ''
}) => {
    const fileInputRef = useRef(null);

    const handleClick = () => {
        if (!loading && fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleFileChange = (e) => {
        if (onUpload) {
            onUpload(e);
        }
    };

    return (
        <div
            className={`avatar-upload avatar-upload--${size} ${loading ? 'avatar-upload--loading' : ''} ${className}`}
            onClick={handleClick}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    handleClick();
                }
            }}
        >
            {/* Image or Placeholder */}
            {src ? (
                <img src={src} alt={alt} className="avatar-upload__image" />
            ) : (
                <div className="avatar-upload__placeholder">
                    <Icon size={size === 's' ? 's' : size === 'l' ? '2xl' : 'xl'}>
                        <User />
                    </Icon>
                </div>
            )}

            {/* Overlay with Icon */}
            <div className="avatar-upload__overlay">
                {loading ? (
                    <Icon size={size === 's' ? 's' : 'l'} className="animate-spin">
                        <Spinner />
                    </Icon>
                ) : (
                    <Icon size={size === 's' ? 's' : 'l'}>
                        <Camera />
                    </Icon>
                )}
            </div>

            {/* Hidden File Input */}
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                style={{ display: 'none' }}
            />
        </div>
    );
};

AvatarUpload.propTypes = {
    src: PropTypes.string,
    alt: PropTypes.string,
    size: PropTypes.oneOf(['s', 'default', 'l']),
    onUpload: PropTypes.func,
    loading: PropTypes.bool,
    className: PropTypes.string,
};

export default AvatarUpload;
