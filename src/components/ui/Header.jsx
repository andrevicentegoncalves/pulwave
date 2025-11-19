// src/components/layouts/Header.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
import Icon from '../ui/Icon';
import { User, LogOut, Menu as MenuIcon } from '../ui/iconLibrary';
import PropTypes from 'prop-types';
import clsx from 'clsx';

/**
 * Header Component
 * Displays user profile with photo, name, and logout button
 * Includes burger menu for mobile sidebar toggle
 * 
 * @param {function} onMenuClick - Callback for mobile menu toggle
 */
const Header = ({ onMenuClick }) => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [profileImageUrl, setProfileImageUrl] = useState(null);
  const [loading, setLoading] = useState(true);

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
      <div className="header">
        <div className="header__content">
          <div className="header__skeleton"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="header">
      <div className="header__content">
        {/* Mobile Menu Button */}
        <button
          className="header__menu-btn"
          onClick={onMenuClick}
          aria-label="Toggle menu"
        >
          <Icon size="m">
            <MenuIcon />
          </Icon>
        </button>

        {/* Profile Section */}
        <div className="header__profile">
          {/* Profile Image */}
          <div 
            className="header__avatar"
            onClick={() => navigate('/profile')}
            role="button"
            tabIndex={0}
            aria-label="Go to profile"
          >
            {profileImageUrl ? (
              <img 
                src={profileImageUrl} 
                alt={getDisplayName()}
                className="header__avatar-img"
              />
            ) : (
              <div className="header__avatar-placeholder">
                <Icon size="m">
                  <User />
                </Icon>
              </div>
            )}
          </div>

          {/* User Name */}
          <div className="header__user-info">
            <span className="header__user-name">{getDisplayName()}</span>
          </div>

          {/* Logout Button */}
          <button
            className="header__logout-btn"
            onClick={handleLogout}
            aria-label="Log out"
            title="Log out"
          >
            <Icon size="s">
              <LogOut />
            </Icon>
            <span className="header__logout-text">Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
};

Header.propTypes = {
  onMenuClick: PropTypes.func,
};

export default Header;