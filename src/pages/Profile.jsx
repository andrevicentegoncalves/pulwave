// src/pages/Profile.jsx
import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Card, Button, Input, Alert, Form } from '../components/ui';
import Icon from '../components/ui/Icon';
import { User, Camera, CheckCircle } from '../components/ui/iconLibrary';

/**
 * Profile Page
 * ✅ UPDATED: Now includes automatic image resizing and old image deletion
 */
const Profile = () => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
  });

  useEffect(() => {
    const fetchUserData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        
        setProfile(profileData);
        if (profileData) {
          setFormData({
            full_name: profileData.full_name || '',
            phone: profileData.phone || '',
          });
        }
      }
    };

    fetchUserData();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          full_name: formData.full_name,
          phone: formData.phone,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (updateError) throw updateError;

      setSuccess('Profile updated successfully!');
      
      // Refresh profile data
      const { data: updatedProfile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      setProfile(updatedProfile);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  /**
   * ✅ NEW: Resize image before upload to optimize storage
   * Maintains aspect ratio and converts to JPEG for better compression
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

          // Calculate new dimensions maintaining aspect ratio
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
          ctx.drawImage(img, 0, 0, width, height);

          // Convert to blob with compression
          canvas.toBlob((blob) => {
            if (blob) {
              resolve(new File([blob], file.name, {
                type: 'image/jpeg',
                lastModified: Date.now(),
              }));
            } else {
              reject(new Error('Failed to create image blob'));
            }
          }, 'image/jpeg', 0.85); // 85% quality
        };
        img.onerror = () => reject(new Error('Failed to load image'));
        img.src = e.target.result;
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
  };

  /**
   * ✅ UPDATED: Now includes automatic resizing and old image deletion
   */
  const handleAvatarUpload = async (e) => {
    try {
      setUploading(true);
      setError(null);

      const file = e.target.files[0];
      if (!file) return;

      // Validate file type
      if (!file.type.startsWith('image/')) {
        throw new Error('Please upload an image file');
      }

      // Validate file size (before resizing)
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('Image size must be less than 5MB');
      }

      // ✅ RESIZE IMAGE for better performance
      console.log('Resizing image...');
      const resizedFile = await resizeImage(file);
      console.log(`Original size: ${(file.size / 1024).toFixed(2)}KB, Resized: ${(resizedFile.size / 1024).toFixed(2)}KB`);

      // ✅ DELETE OLD AVATAR if it exists
      if (profile?.avatar_url) {
        try {
          // Extract file path from URL
          const urlParts = profile.avatar_url.split('/storage/v1/object/public/profile-images/');
          if (urlParts.length > 1) {
            const oldFilePath = urlParts[1];
            console.log('Deleting old avatar:', oldFilePath);
            await supabase.storage
              .from('profile-images')
              .remove([oldFilePath]);
          }
        } catch (deleteError) {
          // Log but don't fail the upload if deletion fails
          console.warn('Failed to delete old avatar:', deleteError);
        }
      }

      // Generate unique filename
      const fileExt = 'jpg'; // Always use jpg since we converted it
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('profile-images')
        .upload(filePath, resizedFile, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('profile-images')
        .getPublicUrl(filePath);

      // Update profile with new avatar URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ 
          avatar_url: publicUrl,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (updateError) throw updateError;

      setProfile({ ...profile, avatar_url: publicUrl });
      setSuccess('Avatar updated successfully!');
    } catch (err) {
      setError(err.message);
      console.error('Avatar upload error:', err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="profile-page">
      <div className="profile-page__header">
        <h1 className="profile-page__title">Profile Settings</h1>
        <p className="profile-page__subtitle">
          Manage your account information and preferences
        </p>
      </div>

      {success && (
        <Alert type="success" dismissible onDismiss={() => setSuccess(null)}>
          {success}
        </Alert>
      )}

      {error && (
        <Alert type="error" dismissible onDismiss={() => setError(null)}>
          {error}
        </Alert>
      )}

      <div className="profile-page__content">
        <Card variant="elevated" className="profile-page__avatar-card">
          <h2 className="profile-page__section-title">Profile Photo</h2>
          
          <div className="profile-avatar">
            <div className="profile-avatar__preview">
              {profile?.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt={formData.full_name || user?.email}
                  className="profile-avatar__image"
                />
              ) : (
                <div className="profile-avatar__placeholder">
                  <Icon size="2xl">
                    <User />
                  </Icon>
                </div>
              )}
            </div>

            <div className="profile-avatar__actions">
              <label htmlFor="avatar-upload" className="profile-avatar__upload-btn">
                <Icon size="s">
                  <Camera />
                </Icon>
                <span>{uploading ? 'Uploading...' : 'Change Photo'}</span>
              </label>
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                disabled={uploading}
                style={{ display: 'none' }}
              />
              <p style={{ 
                fontSize: 'var(--font-size-caption-s)', 
                color: 'var(--color-on-surface-subtle)',
                margin: '0'
              }}>
                JPG, PNG or WebP • Max 5MB • Auto-optimized
              </p>
            </div>
          </div>
        </Card>

        <Card variant="elevated" className="profile-page__info-card">
          <h2 className="profile-page__section-title">Personal Information</h2>
          
          <Form layout="vertical" onSubmit={handleSubmit}>
            <Input
              label="Email Address"
              type="email"
              value={user?.email || ''}
              disabled
              helperText="Email cannot be changed"
              fullWidth
            />

            <Input
              label="Full Name"
              type="text"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              placeholder="Enter your full name"
              fullWidth
            />

            <Input
              label="Phone Number"
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+1 (555) 000-0000"
              fullWidth
            />

            <Button
              type="submit"
              variant="primary"
              size="l"
              disabled={loading}
              fullWidth
            >
              {loading ? (
                <>
                  <Icon size="s">
                    <CheckCircle />
                  </Icon>
                  <span>Saving...</span>
                </>
              ) : (
                <span>Save Changes</span>
              )}
            </Button>
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default Profile;