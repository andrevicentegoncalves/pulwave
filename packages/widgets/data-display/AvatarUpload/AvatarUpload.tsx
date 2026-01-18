import { useRef, type ChangeEvent } from 'react';
import { classNames } from '@pulwave/utils';
import { User, Camera, Loader, Icon, Skeleton } from '@pulwave/ui';
import {
    avatarUploadVariants,
    type AvatarUploadProps,
    type AvatarUploadSize
} from './types';
import './styles/_index.scss';

// Icon size type from Icon component CVA variants
type IconSize = 'xs' | 's' | 'm' | 'l' | 'xl';

const SIZE_TO_ICON_MAP: Record<AvatarUploadSize, IconSize> = {
    's': 's',
    'default': 'm',
    'm': 'm',
    'l': 'l',
    'xl': 'xl',
    '2xl': 'xl', // Map 2xl avatar to xl icon
};

const SIZE_TO_OVERLAY_ICON_MAP: Record<AvatarUploadSize, IconSize> = {
    's': 's',
    'default': 's',
    'm': 'm',
    'l': 'm',
    'xl': 'l',
    '2xl': 'xl',
};

/**
 * AvatarUpload - Avatar with upload functionality
 */
export const AvatarUpload = ({
    src,
    alt = 'Avatar',
    size = 'default',
    onUpload,
    loading = false,
    className,
    ...props
}: AvatarUploadProps) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleClick = () => {
        if (!loading && fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        onUpload?.(e);
    };

    // Show skeleton during initial loading if no src yet
    if (loading && !src) {
        return (
            <div className={classNames(avatarUploadVariants({ size }), className)} {...props}>
                <Skeleton variant="circular" width="100%" height="100%" />
            </div>
        );
    }

    return (
        <button
            type="button"
            className={classNames(avatarUploadVariants({ size, loading }), className)}
            onClick={handleClick}
            aria-label={loading ? 'Uploading avatar…' : 'Upload avatar image'}
            disabled={loading}
        >
            {src ? (
                <img
                    src={src}
                    alt={alt}
                    className="avatar-upload__image"
                    width={{
                        's': 40,
                        'default': 80,
                        'm': 128,
                        'l': 160,
                        'xl': 224,
                        '2xl': 256,
                    }[size || 'default']}
                    height={{
                        's': 40,
                        'default': 80,
                        'm': 128,
                        'l': 160,
                        'xl': 224,
                        '2xl': 256,
                    }[size || 'default']}
                />
            ) : (
                <span className="avatar-upload__placeholder">
                    <Icon size={SIZE_TO_ICON_MAP[size || 'default']}>
                        <User />
                    </Icon>
                </span>
            )}

            <span className="avatar-upload__overlay" aria-hidden="true">
                {loading ? (
                    <Icon size={SIZE_TO_OVERLAY_ICON_MAP[size || 'default']} className="animate-spin">
                        <Loader />
                    </Icon>
                ) : (
                    <Icon size={SIZE_TO_OVERLAY_ICON_MAP[size || 'default']}>
                        <Camera />
                    </Icon>
                )}
            </span>

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
