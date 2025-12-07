import React, { useState, useEffect, useCallback } from 'react';
import { ThemeToggle } from '../../../components/navigation/ThemeToggle';
import { Tabs, TabPanel } from '../../../components/ui';
import {
  Colors,
  Contrast,
  Surfaces,
  Typography,
  Scales,
  Components
} from './sections';

const StyleGuide = () => {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved === 'dark';
  });

  const [copiedColor, setCopiedColor] = useState(null);

  useEffect(() => {
    const theme = isDark ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [isDark]);

  const copyToClipboard = useCallback(async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedColor(text);
      setTimeout(() => setCopiedColor(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  }, []);

  const handleThemeToggle = useCallback(() => {
    setIsDark(prev => !prev);
  }, []);

  const triggerAlert = useCallback((type, title, message) => {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert--${type} alert--toast`;
    alertDiv.innerHTML = `
      <div class="alert__icon">${type === 'success' ? '<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="9" stroke="currentColor" stroke-width="1.5"/><path d="M6 10L9 13L14 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>' :
        type === 'info' ? '<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="9" stroke="currentColor" stroke-width="1.5"/><path d="M10 9V14M10 6V6.5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>' :
          type === 'warning' ? '<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 2L18 17H2L10 2Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M10 7V11M10 14V14.5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>' :
            '<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="9" stroke="currentColor" stroke-width="1.5"/><path d="M7 7L13 13M13 7L7 13" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>'
      }</div>
      <div class="alert__content">
        <strong>${title}</strong> ${message}
      </div>
      <button class="alert__close" onclick="this.parentElement.remove()" aria-label="Dismiss alert">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M4 4L12 12M12 4L4 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
      </button>
    `;
    document.body.appendChild(alertDiv);
    setTimeout(() => {
      if (alertDiv.parentElement) alertDiv.remove();
    }, 5000);
  }, []);

  return (
    <div className="styleguide">
      {copiedColor && (
        <div className="styleguide-toast">
          Copied: {copiedColor}
        </div>
      )}

      <div className="styleguide-theme-toggle">
        <ThemeToggle isDark={isDark} onToggle={handleThemeToggle} />
      </div>

      <header className="styleguide-header">
        <h1 className="styleguide-header__title">🎨 Pulwave Design System</h1>
        <p className="styleguide-header__subtitle">Component library and design tokens</p>
      </header>

      <Tabs defaultTab={0}>
        <TabPanel label="Colors">
          <Colors copyToClipboard={copyToClipboard} />
        </TabPanel>

        <TabPanel label="Contrast">
          <Contrast copyToClipboard={copyToClipboard} />
        </TabPanel>

        <TabPanel label="Surfaces">
          <Surfaces />
        </TabPanel>

        <TabPanel label="Typography">
          <Typography />
        </TabPanel>

        <TabPanel label="Scales">
          <Scales />
        </TabPanel>

        <TabPanel label="Components">
          <Components triggerAlert={triggerAlert} />
        </TabPanel>
      </Tabs>
    </div>
  );
};

export default StyleGuide;