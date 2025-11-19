// src/components/layouts/UserInfo.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
import Icon from '../ui/Icon';
import { User, LogOut, Bell } from '../ui/iconLibrary';
import { Button } from '../ui';

/**
 * UserInfo Component
 * Displays user profile photo, notifications, and logout
 * Profile photo is clickable and redirects to profile page
 */
const UserInfo = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    // Get current user and profile
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
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/auth', { replace: true });
  };

  const handleProfileClick = () => {
    navigate('/profile');
  };

  return (
    <div className="user-info">
      <div className="user-info__actions">
        <button
          className="user-info__notification"
          aria-label="View notifications"
        >
          <Icon size="m">
            <Bell />
          </Icon>
        </button>
      </div>

      <div className="user-info__profile">
        <button
          className="user-info__avatar"
          onClick={handleProfileClick}
          aria-label="View profile"
        >
          {profile?.avatar_url ? (
            <img
              src={profile.avatar_url}
              alt={profile.full_name || user?.email}
              className="user-info__avatar-image"
            />
          ) : (
            <div className="user-info__avatar-placeholder">
              <Icon size="l">
                <User />
              </Icon>
            </div>
          )}
        </button>

        <div className="user-info__details">
          <span className="user-info__name">
            {profile?.full_name || user?.email?.split('@')[0]}
          </span>
          <span className="user-info__email">{user?.email}</span>
        </div>
      </div>

      <Button
        variant="ghost"
        size="s"
        onClick={handleLogout}
        className="user-info__logout"
      >
        <Icon size="s">
          <LogOut />
        </Icon>
        <span>Logout</span>
      </Button>
    </div>
  );
};

export default UserInfo;