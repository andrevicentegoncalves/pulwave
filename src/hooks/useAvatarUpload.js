import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';

/**
 * useAvatarUpload Hook
 * Manages avatar upload, resize, and storage operations.
 * 
 * @param {object} options - Hook options
 * @param {object} options.user - Current user object
 * @param {object} options.profile - Current profile object
 * @param {function} options.onProfileUpdate - Callback when profile is updated
 * @param {function} options.onSuccess - Callback on successful upload
 * @param {function} options.onError - Callback on error
 * @returns {object} Upload state and handlers
 */
export const useAvatarUpload = ({
    user,
    profile,
    onProfileUpdate,
    onSuccess,
    onError
}) => {
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(null);

    /**
     * Resize image to max dimensions while maintaining aspect ratio
     */
    const resizeImage = (file, maxWidth = 800, maxHeight = 800) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    let width = img.width;
                    let height = img.height;

                    if (width > height) {
                        if (width > maxWidth) {
                            height *= maxWidth / width;
                            width = maxWidth;
                        }
                    } else {
                        if (height > maxHeight) {
                            width *= maxHeight / height;
                            height = maxHeight;
                        }
                    }

                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');

                    // Fill with white background to handle PNG transparency
                    ctx.fillStyle = '#FFFFFF';
                    ctx.fillRect(0, 0, width, height);

                    ctx.drawImage(img, 0, 0, width, height);

                    canvas.toBlob((blob) => {
                        if (blob) {
                            resolve(new File([blob], file.name, {
                                type: 'image/jpeg',
                                lastModified: Date.now(),
                            }));
                        } else {
                            reject(new Error('Failed to create image blob'));
                        }
                    }, 'image/jpeg', 0.85);
                };
                img.onerror = () => reject(new Error('Failed to load image'));
                img.src = e.target.result;
            };
            reader.onerror = () => reject(new Error('Failed to read file'));
            reader.readAsDataURL(file);
        });
    };

    /**
     * Handle avatar file upload
     */
    const handleAvatarUpload = async (e) => {
        try {
            setUploading(true);
            setError(null);

            const file = e.target.files && e.target.files[0];
            if (!file) return;

            // Validate file
            if (!file.type.startsWith('image/')) {
                throw new Error('Please upload an image file');
            }
            if (file.size > 5 * 1024 * 1024) {
                throw new Error('Image size must be less than 5MB');
            }

            // Resize image
            let fileToUpload = file;
            try {
                fileToUpload = await resizeImage(file);
            } catch (resizeErr) {
                console.warn('Image resizing failed, falling back to original file:', resizeErr);
            }

            // Delete old avatar if exists
            if (profile?.avatar_url) {
                try {
                    const urlParts = profile.avatar_url.split('/storage/v1/object/public/profile-images/');
                    if (urlParts.length > 1) {
                        await supabase.storage.from('profile-images').remove([urlParts[1]]);
                    }
                } catch (e) {
                    console.warn('Failed to delete old avatar:', e);
                }
            }

            // Upload new avatar
            const fileName = `${user.id}-${Date.now()}.jpg`;
            const { error: uploadError } = await supabase.storage
                .from('profile-images')
                .upload(`avatars/${fileName}`, fileToUpload, {
                    cacheControl: '3600',
                    upsert: false
                });

            if (uploadError) throw uploadError;

            // Get public URL
            const { data: { publicUrl } } = supabase.storage
                .from('profile-images')
                .getPublicUrl(`avatars/${fileName}`);

            // Update profile with new avatar URL
            const { error: updateError } = await supabase
                .from('profiles')
                .update({
                    avatar_url: publicUrl,
                    updated_at: new Date().toISOString(),
                })
                .eq('auth_user_id', user.id);

            if (updateError) throw updateError;

            // Notify parent of update
            onProfileUpdate?.({ ...profile, avatar_url: publicUrl });
            onSuccess?.('Avatar updated successfully!');

        } catch (err) {
            setError(err.message);
            onError?.(err.message);
            console.error('Avatar upload error:', err);
        } finally {
            setUploading(false);
            if (e.target) e.target.value = '';
        }
    };

    return {
        uploading,
        error,
        handleAvatarUpload,
        resizeImage,
    };
};

export default useAvatarUpload;
