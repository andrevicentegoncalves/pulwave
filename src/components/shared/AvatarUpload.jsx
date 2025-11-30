import React, { useRef } from 'react';
import Icon from '../ui/Icon';
import { User, Camera, Spinner } from '../ui/iconLibrary';

/**
 * AvatarUpload Component
 * Displays a round avatar with hover edit effect and click-to-upload functionality.
 * 
 * @param {string} src - Avatar image URL
 * @param {string} alt - Alt text for avatar
 * @param {'s'|'default'|'m'|'l'|'xl'|'2xl'} size - Avatar size
 * @param {function} onUpload - Upload handler function
 * @param {boolean} loading - Loading state
 * @param {string} className - Additional CSS classes
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

    // Map avatar sizes to icon sizes
    const getIconSize = () => {
        switch (size) {
            case 's':
                return 's';
            case 'default':
                return 'default';
            case 'm':
                return 'm';
            case 'l':
                return 'l';
            case 'xl':
                return 'xl';
            case '2xl':
                return '2xl';
            default:
                return 'l';
        }
    };

    // Map avatar sizes to overlay icon sizes (slightly smaller)
    const getOverlayIconSize = () => {
        switch (size) {
            case 's':
                return 's';
            case 'default':
                return 's';
            case 'm':
                return 'm';
            case 'l':
                return 'm';
            case 'xl':
                return 'l';
            case '2xl':
                return 'xl';
            default:
                return 'm';
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
                    <Icon size={getIconSize()}>
                        <User />
                    </Icon>
                </div>
            )}

            {/* Overlay with Icon */}
            <div className="avatar-upload__overlay">
                {loading ? (
                    <Icon size={getOverlayIconSize()} className="animate-spin">
                        <Spinner />
                    </Icon>
                ) : (
                    <Icon size={getOverlayIconSize()}>
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

export default AvatarUpload;