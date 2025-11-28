// src/pages/Settings.jsx
import React, { useState } from 'react';
import { Card } from '../components/ui';
import Icon from '../components/ui/Icon';
import { Sun, Moon, Monitor, Check } from '../components/ui/iconLibrary';
import { useTheme } from '../contexts/ThemeContext';

/**
 * Settings Page
 * Allows user to configure app preferences
 * Currently supports theme selection (light/dark/system)
 */
const Settings = () => {
  const { theme, updateTheme } = useTheme();
  const [saved, setSaved] = useState(false);

  const handleThemeChange = (newTheme) => {
    updateTheme(newTheme);

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
      value: 'system',
      label: 'System',
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