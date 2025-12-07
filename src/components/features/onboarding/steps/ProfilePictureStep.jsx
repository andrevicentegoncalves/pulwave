import React from 'react';
import AvatarUpload from '../../../shared/AvatarUpload';

const ProfilePictureStep = ({ avatarUrl, handleAvatarUpload, uploading }) => {
    return (
        <div className="onboarding-step">
            <h3>Show us your best side! 📸</h3>

            <div className="avatar-upload-center">
                <AvatarUpload
                    src={avatarUrl}
                    alt="Profile"
                    size="l"
                    onUpload={handleAvatarUpload}
                    loading={uploading}
                    className="profile-avatar__preview"
                />
            </div>
        </div>
    );
};

export default ProfilePictureStep;
