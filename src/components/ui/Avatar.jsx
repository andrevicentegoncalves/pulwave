import React from 'react';
import clsx from 'clsx';

/**
 * Avatar Component
 * 
 * Displays a circular avatar image with optional fallback initials
 * 
 * @param {string} src - Image URL
 * @param {string} alt - Alt text for the image
 * @param {string} size - Avatar size: 's' (32px), 'm' (40px), 'l' (56px)
 * @param {string} initials - Fallback initials if image fails to load (e.g., "JD")
 * @param {string} className - Additional CSS classes
 */
const Avatar = ({
    src,
    alt = '',
    size = 'm',
    initials = '',
    className = ''
}) => {
    const [imageError, setImageError] = React.useState(false);

    const handleImageError = () => {
        setImageError(true);
    };

    // Get initials from alt text if not provided
    const getInitials = () => {
        if (initials) return initials;
        if (alt) {
            return alt
                .split(' ')
                .map(word => word[0])
                .join('')
                .toUpperCase()
                .slice(0, 2);
        }
        return '?';
    };

    const avatarClasses = clsx(
        'avatar',
        `avatar--${size}`,
        className
    );

    return (
        <div className={avatarClasses}>
            {src && !imageError ? (
                <img
                    src={src}
                    alt={alt}
                    onError={handleImageError}
                    className="avatar__image"
                />
            ) : (
                <div className="avatar__initials">
                    {getInitials()}
                </div>
            )}
        </div>
    );
};

export default Avatar;
