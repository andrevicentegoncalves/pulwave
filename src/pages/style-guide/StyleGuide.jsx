import React, { useState, useEffect, useCallback } from 'react';
import { ThemeToggle } from '../../components/ui';

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
      <div class="alert__icon">${
        type === 'success' ? '✓' : 
        type === 'info' ? 'i' : 
        type === 'warning' ? '!' : '×'
      }</div>
      <div class="alert__content">
        <strong>${title}</strong><br/>
        ${message}
      </div>
    `;
    document.body.appendChild(alertDiv);
    setTimeout(() => alertDiv.remove(), 3000);
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
          <ColorSection copyToClipboard={copyToClipboard} />
        </TabPanel>

        <TabPanel label="Surfaces">
          <SurfaceSection />
        </TabPanel>

        <TabPanel label="Typography">
          <TypographySection />
        </TabPanel>

        <TabPanel label="Scales">
          <ScalesSection />
        </TabPanel>

        <TabPanel label="Components">
          <ComponentsSection triggerAlert={triggerAlert} />
        </TabPanel>
      </Tabs>
    </div>
  );
};

export default StyleGuide;