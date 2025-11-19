// src/components/ui/Header.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { supabase } from '../../lib/supabaseClient';
import Icon from '../ui/Icon';
import { User, LogOut } from '../ui/iconLibrary';

/**
 * Header Component
 * Displays user information and provides logout functionality
 * Clicking on user photo/name navigates to profile page
 * Logout button in top right corner
 */
const Header = ({ className }) => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [profileImageUrl, setProfileImageUrl] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          const { data: profileData } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();
          
          setProfile(profileData);
          
          // Get profile image URL if exists
          if (profileData?.profile_image_path) {
            const { data } = supabase
              .storage
              .from('profile-images')
              .getPublicUrl(profileData.profile_image_path);
            
            setProfileImageUrl(data.publicUrl);
          }
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/auth/login');
  };

  const handleProfileClick = () => {
    navigate('/profile');
  };

  const getDisplayName = () => {
    if (profile?.full_name) return profile.full_name;
    if (profile?.username) return profile.username;
    if (profile?.email) return profile.email.split('@')[0];
    return 'User';
  };

  const getInitials = () => {
    const name = getDisplayName();
    return (name[0] || 'U').toUpperCase();
  };

  if (loading) {
    return (
      <div className={`header ${className || ''}`}>
        <div className="header__loading">Loading...</div>
      </div>
    );
  }

  return (
    <div className={`header ${className || ''}`}>
      {/* Clickable User Area */}
      <button 
        className="header__user"
        onClick={handleProfileClick}
        aria-label="Go to profile"
      >
        {/* User Avatar */}
        <div className="header__avatar">
          {profileImageUrl ? (
            <img 
              src={profileImageUrl} 
              alt={getDisplayName()}
              className="header__avatar-image"
            />
          ) : (
            <div className="header__avatar-placeholder">
              <Icon size="m">
                <User />
              </Icon>
            </div>
          )}
        </div>

        {/* User Info */}
        <div className="header__info">
          <div className="header__name">{getDisplayName()}</div>
          <div className="header__email">{profile?.email}</div>
        </div>
      </button>

      {/* Logout Button */}
      <button
        className="header__logout"
        onClick={handleLogout}
        aria-label="Log out"
        title="Log out"
      >
        <Icon size="m">
          <LogOut />
        </Icon>
      </button>
    </div>
  );
};

Header.propTypes = {
  className: PropTypes.string,
};

export default Header;