// src/components/ui/Header.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
import Icon from './Icon';
import { User, LogOut } from './iconLibrary';
import PropTypes from 'prop-types';

/**
 * Header Component
 * Displays user profile with photo, name, and quick actions
 * 
 * @param {string} className - Additional CSS classes
 */
const Header = ({ className }) => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [profileImageUrl, setProfileImageUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

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

        // Fetch profile image if exists
        if (profileData?.profile_image_url) {
          const { data } = supabase.storage
            .from('profile-images')
            .getPublicUrl(profileData.profile_image_url);
          
          setProfileImageUrl(data.publicUrl);
        }
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/auth', { replace: true });
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const getDisplayName = () => {
    if (!profile) return 'User';
    
    const firstName = profile.first_name || '';
    const lastName = profile.last_name || '';
    
    if (firstName && lastName) {
      return `${firstName} ${lastName}`;
    }
    
    return firstName || lastName || profile.email?.split('@')[0] || 'User';
  };

  const getInitials = () => {
    if (!profile) return 'U';
    
    const firstName = profile.first_name || '';
    const lastName = profile.last_name || '';
    
    if (firstName && lastName) {
      return `${firstName[0]}${lastName[0]}`.toUpperCase();
    }
    
    if (firstName) return firstName[0].toUpperCase();
    if (lastName) return lastName[0].toUpperCase();
    
    return (profile.email?.[0] || 'U').toUpperCase();
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
      <div className="header__user">
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

        {/* Actions Dropdown Toggle */}
        <button
          className="header__dropdown-toggle"
          onClick={() => setShowDropdown(!showDropdown)}
          aria-label="User menu"
          aria-expanded={showDropdown}
        >
          <Icon size="s">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Icon>
        </button>

        {/* Dropdown Menu */}
        {showDropdown && (
          <>
            <div 
              className="header__dropdown-overlay"
              onClick={() => setShowDropdown(false)}
            />
            <div className="header__dropdown">
              <button
                className="header__dropdown-item"
                onClick={() => {
                  navigate('/profile');
                  setShowDropdown(false);
                }}
              >
                <Icon size="s">
                  <User />
                </Icon>
                <span>Profile Settings</span>
              </button>
              
              <div className="header__dropdown-divider" />
              
              <button
                className="header__dropdown-item header__dropdown-item--danger"
                onClick={handleLogout}
              >
                <Icon size="s">
                  <LogOut />
                </Icon>
                <span>Log Out</span>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

Header.propTypes = {
  className: PropTypes.string,
};

export default Header;