// src/pages/Settings.jsx
import React, { useState, useEffect } from 'react';
import { Card, Button } from '../components/ui';
import Icon from '../components/ui/Icon';
import { Sun, Moon, Monitor, Check } from '../components/ui/iconLibrary';

/**
 * Settings Page
 * Allows user to configure app preferences
 * Currently supports theme selection (light/dark/auto)
 */
const Settings = () => {
  const [theme, setTheme] = useState('auto');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    // Load saved theme preference
    const savedTheme = localStorage.getItem('theme-preference') || 'auto';
    setTheme(savedTheme);
    applyTheme(savedTheme);
  }, []);

  const applyTheme = (selectedTheme) => {
    const root = document.documentElement;
    
    if (selectedTheme === 'auto') {
      // Use system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
    } else {
      // Use selected theme
      root.setAttribute('data-theme', selectedTheme);
    }
  };

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    applyTheme(newTheme);
    localStorage.setItem('theme-preference', newTheme);
    
    // Show save confirmation
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const themeOptions = [
    {
      value: 'light',
      label: 'Light',
      description: 'Light theme for bright environments',
      icon: <Sun />,
    },
    {
      value: 'dark',
      label: 'Dark',
      description: 'Dark theme for low-light environments',
      icon: <Moon />,
    },
    {
      value: 'auto',
      label: 'Auto',
      description: 'Automatically matches your system settings',
      icon: <Monitor />,
    },
  ];

  return (
    <div className="settings-page">
      <div className="settings-page__header">
        <h1 className="settings-page__title">Settings</h1>
        <p className="settings-page__subtitle">
          Manage your application preferences and appearance
        </p>
      </div>

      {/* Appearance Section */}
      <Card variant="elevated" className="settings-section">
        <div className="settings-section__header">
          <h2 className="settings-section__title">Appearance</h2>
          <p className="settings-section__description">
            Customize how the application looks on your device
          </p>
        </div>

        <div className="theme-selector">
          {themeOptions.map((option) => (
            <button
              key={option.value}
              className={`theme-option ${theme === option.value ? 'theme-option--active' : ''}`}
              onClick={() => handleThemeChange(option.value)}
              aria-pressed={theme === option.value}
            >
              <div className="theme-option__icon-wrapper">
                <Icon size="l" className="theme-option__icon">
                  {option.icon}
                </Icon>
                {theme === option.value && (
                  <div className="theme-option__check">
                    <Icon size="s">
                      <Check />
                    </Icon>
                  </div>
                )}
              </div>
              <div className="theme-option__content">
                <span className="theme-option__label">{option.label}</span>
                <span className="theme-option__description">{option.description}</span>
              </div>
            </button>
          ))}
        </div>

        {saved && (
          <div className="settings-save-message">
            <Icon size="s"><Check /></Icon>
            <span>Theme preference saved</span>
          </div>
        )}
      </Card>

      {/* Future sections can be added here */}
      <Card variant="elevated" className="settings-section settings-section--upcoming">
        <div className="settings-section__header">
          <h2 className="settings-section__title">More Settings</h2>
          <p className="settings-section__description">
            Additional preferences coming soon...
          </p>
        </div>
        
        <div className="settings-placeholder">
          <p>• Notification preferences</p>
          <p>• Language selection</p>
          <p>• Data management</p>
          <p>• Privacy settings</p>
        </div>
      </Card>
    </div>
  );
};

export default Settings;