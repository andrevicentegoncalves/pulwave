/**
 * AvatarUpload Component
 *
 * Displays a round avatar with hover edit effect and click-to-upload functionality.
 *
 * @package @pulwave/experience-settings
 */
import { useRef, type ChangeEvent, type KeyboardEvent } from 'react';
import { Icon, Skeleton } from '@pulwave/ui';
import { User, Camera, Loader2 } from '@pulwave/ui';

type AvatarSize = 's' | 'default' | 'm' | 'l' | 'xl' | '2xl';
type IconSize = 'xs' | 's' | 'm' | 'l' | 'xl';

export interface AvatarUploadProps {
    /** Avatar image URL */
    src?: string;
    /** Alt text for avatar */
    alt?: string;
    /** Avatar size */
    size?: AvatarSize;
    /** Upload handler function */
    onUpload?: (e: ChangeEvent<HTMLInputElement>) => void;
    /** Loading state */
    loading?: boolean;
    /** Disabled state */
    disabled?: boolean;
    /** Additional CSS classes */
    className?: string;
}

/**
 * Map avatar sizes to icon sizes
 */
function getIconSize(size: AvatarSize): IconSize {
    switch (size) {
        case 's': return 's';
        case 'default': return 'm';
        case 'm': return 'm';
        case 'l': return 'l';
        case 'xl': return 'xl';
        case '2xl': return 'xl';
        default: return 'l';
    }
}

/**
 * Map avatar sizes to overlay icon sizes (slightly smaller)
 */
function getOverlayIconSize(size: AvatarSize): IconSize {
    switch (size) {
        case 's': return 's';
        case 'default': return 's';
        case 'm': return 'm';
        case 'l': return 'm';
        case 'xl': return 'l';
        case '2xl': return 'xl';
        default: return 'm';
    }
}

/**
 * Map avatar sizes to pixel dimensions for img width/height
 */
const getPixelSize = (size: AvatarSize): number => {
    switch (size) {
        case 's': return 32;
        case 'default': return 48;
        case 'm': return 64;
        case 'l': return 96;
        case 'xl': return 128;
        case '2xl': return 192;
        default: return 48;
    }
};

/**
 * AvatarUpload - Clickable avatar with upload functionality
 */
export const AvatarUpload = ({
    src,
    alt = 'Avatar',
    size = 'default',
    onUpload,
    loading = false,
    disabled = false,
    className = ''
}: AvatarUploadProps) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleClick = () => {
        if (!loading && fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (onUpload) {
            onUpload(e);
        }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
            handleClick();
        }
    };

    // Show skeleton during initial loading (when no src yet)
    if (loading && !src) {
        return (
            <div className={`avatar-upload avatar-upload--${size} ${className}`}>
                <Skeleton
                    variant="circular"
                    width="100%"
                    height="100%"
                />
            </div>
        );
    }

    return (
        <button
            type="button"
            className={`avatar-upload avatar-upload--${size} ${loading ? 'avatar-upload--loading' : ''} ${disabled ? 'avatar-upload--disabled' : ''} ${className}`}
            onClick={handleClick}
            disabled={disabled || loading}
            aria-label={loading ? 'Uploading avatar…' : 'Change avatar'}
        >
            {/* Image or Placeholder */}
            {src ? (
                <img
                    src={src}
                    alt={alt}
                    className="avatar-upload__image"
                    width={getPixelSize(size)}
                    height={getPixelSize(size)}
                />
            ) : (
                <span className="avatar-upload__placeholder" aria-hidden="true">
                    <Icon size={getIconSize(size)}>
                        <User />
                    </Icon>
                </span>
            )}

            {/* Overlay with Icon */}
            <span className="avatar-upload__overlay" aria-hidden="true">
                {loading ? (
                    <Icon size={getOverlayIconSize(size)} className="animate-spin">
                        <Loader2 />
                    </Icon>
                ) : (
                    <Icon size={getOverlayIconSize(size)}>
                        <Camera />
                    </Icon>
                )}
            </span>

            {/* Hidden File Input */}
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                style={{ display: 'none' }}
                aria-hidden="true"
            />
        </button>
    );
};

AvatarUpload.displayName = 'AvatarUpload';

export default AvatarUpload;
