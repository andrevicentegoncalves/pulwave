import React, { useState, useEffect, useCallback } from 'react';
import { ThemeToggle } from './ThemeToggle';
import { Tabs, TabPanel } from './Tabs';
import { Divider } from './Divider';
import { Dropdown, DropdownItem, DropdownDivider, DropdownLabel } from './Dropdown';

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

  return (
    <div className="styleguide">
      {/* Toast Notification */}
      {copiedColor && (
        <div className="styleguide-toast">
          Copied: {copiedColor}
        </div>
      )}

      {/* Sticky Theme Toggle */}
      <div className="styleguide-theme-toggle">
        <ThemeToggle isDark={isDark} onToggle={handleThemeToggle} />
      </div>

      {/* Header */}
      <header className="styleguide-header">
        <h1 className="styleguide-header__title">🎨 Pulwave Design System</h1>
        <p className="styleguide-header__subtitle">Component library and design tokens</p>
      </header>

      {/* Main Tabs */}
      <Tabs defaultTab={0}>
        {/* Tab 1: Color Palettes */}
        <TabPanel label="Colors">
          <section className="styleguide-section">
            <h2 className="styleguide-section__title">Brand Colors</h2>
            <p className="styleguide-section__description">Primary, secondary, and tertiary brand colors with interaction states</p>
            
            <div className="color-category">
              <h3 className="color-category__title">Primary (Emerald Green)</h3>
              <div className="color-palette">
                <div className="color-swatch" style={{ backgroundColor: 'var(--color-primary-subtle)' }} onClick={() => copyToClipboard('var(--color-primary-subtle)')}>
                  <span className="color-swatch__label">Subtle</span>
                </div>
                <div className="color-swatch" style={{ backgroundColor: 'var(--color-primary)' }} onClick={() => copyToClipboard('var(--color-primary)')}>
                  <span className="color-swatch__label">Primary ⭐</span>
                </div>
                <div className="color-swatch" style={{ backgroundColor: 'var(--color-primary-hover)' }} onClick={() => copyToClipboard('var(--color-primary-hover)')}>
                  <span className="color-swatch__label">Hover</span>
                </div>
                <div className="color-swatch" style={{ backgroundColor: 'var(--color-primary-active)' }} onClick={() => copyToClipboard('var(--color-primary-active)')}>
                  <span className="color-swatch__label">Active</span>
                </div>
                <div className="color-swatch" style={{ backgroundColor: 'var(--color-primary-pressed)' }} onClick={() => copyToClipboard('var(--color-primary-pressed)')}>
                  <span className="color-swatch__label">Pressed</span>
                </div>
              </div>
            </div>

            <div className="color-category">
              <h3 className="color-category__title">Secondary & Tertiary</h3>
              <div className="color-palette">
                <div className="color-swatch" style={{ backgroundColor: 'var(--color-secondary)' }} onClick={() => copyToClipboard('var(--color-secondary)')}>
                  <span className="color-swatch__label">Secondary</span>
                </div>
                <div className="color-swatch" style={{ backgroundColor: 'var(--color-secondary-hover)' }} onClick={() => copyToClipboard('var(--color-secondary-hover)')}>
                  <span className="color-swatch__label">Sec Hover</span>
                </div>
                <div className="color-swatch" style={{ backgroundColor: 'var(--color-tertiary)' }} onClick={() => copyToClipboard('var(--color-tertiary)')}>
                  <span className="color-swatch__label">Tertiary</span>
                </div>
                <div className="color-swatch" style={{ backgroundColor: 'var(--color-tertiary-hover)' }} onClick={() => copyToClipboard('var(--color-tertiary-hover)')}>
                  <span className="color-swatch__label">Ter Hover</span>
                </div>
              </div>
            </div>

            {/* Feedback Colors */}
            <div className="color-category">
              <h3 className="color-category__title">Success (Green)</h3>
              <div className="color-palette">
                {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950].map(shade => (
                  <div 
                    key={shade} 
                    className="color-swatch" 
                    style={{ backgroundColor: `var(--color-feedback-success-${shade})` }}
                    onClick={() => copyToClipboard(`var(--color-feedback-success-${shade})`)}
                  >
                    <span className="color-swatch__label">{shade}{shade === 500 ? ' ⭐' : ''}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="color-category">
              <h3 className="color-category__title">Error (Red)</h3>
              <div className="color-palette">
                {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950].map(shade => (
                  <div 
                    key={shade} 
                    className="color-swatch" 
                    style={{ backgroundColor: `var(--color-feedback-error-${shade})` }}
                    onClick={() => copyToClipboard(`var(--color-feedback-error-${shade})`)}
                  >
                    <span className="color-swatch__label">{shade}{shade === 500 ? ' ⭐' : ''}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="color-category">
              <h3 className="color-category__title">Warning (Yellow)</h3>
              <div className="color-palette">
                {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950].map(shade => (
                  <div 
                    key={shade} 
                    className="color-swatch" 
                    style={{ backgroundColor: `var(--color-feedback-warning-${shade})` }}
                    onClick={() => copyToClipboard(`var(--color-feedback-warning-${shade})`)}
                  >
                    <span className="color-swatch__label">{shade}{shade === 500 ? ' ⭐' : ''}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="color-category">
              <h3 className="color-category__title">Info (Blue)</h3>
              <div className="color-palette">
                {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950].map(shade => (
                  <div 
                    key={shade} 
                    className="color-swatch" 
                    style={{ backgroundColor: `var(--color-feedback-info-${shade})` }}
                    onClick={() => copyToClipboard(`var(--color-feedback-info-${shade})`)}
                  >
                    <span className="color-swatch__label">{shade}{shade === 500 ? ' ⭐' : ''}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="color-category">
              <h3 className="color-category__title">Neutral Scale</h3>
              <div className="color-palette">
                {[0, 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950].map(shade => (
                  <div 
                    key={shade} 
                    className="color-swatch" 
                    style={{ backgroundColor: `var(--color-neutral-${shade})` }}
                    onClick={() => copyToClipboard(`var(--color-neutral-${shade})`)}
                  >
                    <span className="color-swatch__label">{shade}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </TabPanel>

        {/* Tab 2: Surfaces */}
        <TabPanel label="Surfaces">
          <section className="styleguide-section">
            <h2 className="styleguide-section__title">Surface Elevation System</h2>
            <p className="styleguide-section__description">Layered surfaces for visual hierarchy and depth</p>
            
            <div className="surface-grid">
              <div className="surface-item" style={{ backgroundColor: 'var(--color-surface-default)' }}>
                <span className="surface-item__label">Default</span>
                <p className="surface-item__description">Base application background with maximum contrast</p>
              </div>
              <div className="surface-item" style={{ backgroundColor: 'var(--color-surface-subtle)' }}>
                <span className="surface-item__label">Subtle</span>
                <p className="surface-item__description">First elevation - cards and panels</p>
              </div>
              <div className="surface-item" style={{ backgroundColor: 'var(--color-surface-strong)' }}>
                <span className="surface-item__label">Strong</span>
                <p className="surface-item__description">Second elevation - modals and popovers</p>
              </div>
              <div className="surface-item" style={{ backgroundColor: 'var(--color-surface-hover)' }}>
                <span className="surface-item__label">Hover</span>
                <p className="surface-item__description">Interactive hover state</p>
              </div>
              <div className="surface-item" style={{ backgroundColor: 'var(--color-surface-pressed)' }}>
                <span className="surface-item__label">Pressed</span>
                <p className="surface-item__description">Active/pressed state</p>
              </div>
              <div className="surface-item" style={{ backgroundColor: 'var(--color-surface-disabled)' }}>
                <span className="surface-item__label">Disabled</span>
                <p className="surface-item__description">Disabled elements background</p>
              </div>
            </div>

            <h3 className="styleguide-section__title" style={{ marginTop: 'var(--space-10)' }}>Inverse Surfaces</h3>
            <p className="styleguide-section__description">High contrast inverse surfaces for emphasis</p>
            <div className="surface-grid">
              <div className="surface-item surface-item--dark" style={{ backgroundColor: 'var(--color-surface-inverse-default)' }}>
                <span className="surface-item__label">Inverse Default</span>
                <p className="surface-item__description">High contrast inverted surface</p>
              </div>
              <div className="surface-item surface-item--dark" style={{ backgroundColor: 'var(--color-surface-inverse-subtle)' }}>
                <span className="surface-item__label">Inverse Subtle</span>
                <p className="surface-item__description">Subtle inverse variant</p>
              </div>
              <div className="surface-item surface-item--dark" style={{ backgroundColor: 'var(--color-surface-inverse-hover)' }}>
                <span className="surface-item__label">Inverse Hover</span>
                <p className="surface-item__description">Hover state for inverse surfaces</p>
              </div>
            </div>
          </section>
        </TabPanel>

        {/* Tab 3: Typography */}
        <TabPanel label="Typography">
          <section className="styleguide-section">
            <h2 className="styleguide-section__title">Typography Scale</h2>
            <p className="styleguide-section__description">Responsive font sizes and text styles</p>
            
            <div className="typography-samples">
              {['3xl', '2xl', 'xl', 'l', 'm', 's', 'xs', '2xs', '3xs', '4xs', '5xs', '6xs', '7xs', '8xs', '9xs'].map(size => (
                <div key={size} className="typography-sample" style={{ fontSize: `var(--font-size-${size})` }}>
                  <span className="typography-sample__label">{size.toUpperCase()}</span>
                  <span className="typography-sample__text">The quick brown fox jumps over the lazy dog</span>
                </div>
              ))}
            </div>

            <h3 className="styleguide-section__title" style={{ marginTop: 'var(--space-10)' }}>Font Weights</h3>
            <div className="typography-samples">
              {[
                { name: 'Thin', weight: 'var(--font-weight-thin)' },
                { name: 'Light', weight: 'var(--font-weight-light)' },
                { name: 'Regular', weight: 'var(--font-weight-regular)' },
                { name: 'Medium', weight: 'var(--font-weight-medium)' },
                { name: 'Semi Bold', weight: 'var(--font-weight-semi-bold)' },
                { name: 'Bold', weight: 'var(--font-weight-bold)' },
              ].map(({ name, weight }) => (
                <div key={name} className="typography-sample">
                  <span className="typography-sample__label">{name}</span>
                  <span className="typography-sample__text" style={{ fontWeight: weight }}>
                    The quick brown fox jumps over the lazy dog
                  </span>
                </div>
              ))}
            </div>
          </section>
        </TabPanel>

        {/* Tab 4: Scales */}
        <TabPanel label="Scales">
          <section className="styleguide-section">
            <h2 className="styleguide-section__title">Spacing Scale</h2>
            <p className="styleguide-section__description">4px base spacing system for consistent layouts</p>
            
            <div className="spacing-samples">
              {[1, 2, 3, 4, 5, 6, 8, 10, 12, 14, 16, 20, 24].map(size => (
                <div key={size} className="spacing-sample">
                  <span className="spacing-sample__label">space-{size}</span>
                  <div 
                    className="spacing-sample__box" 
                    style={{ width: `var(--space-${size})`, height: `var(--space-${size})` }}
                  />
                  <span className="spacing-sample__value">{size * 4}px</span>
                </div>
              ))}
            </div>

            <h3 className="styleguide-section__title" style={{ marginTop: 'var(--space-10)' }}>Border Radius</h3>
            <div className="radius-samples">
              {['none', '2xs', 'xs', 's', 'm', 'l', 'xl', '2xl', 'round'].map(size => (
                <div 
                  key={size} 
                  className="radius-sample" 
                  style={{ borderRadius: `var(--border-radius-${size})` }}
                >
                  <span>{size.toUpperCase()}</span>
                </div>
              ))}
            </div>

            <h3 className="styleguide-section__title" style={{ marginTop: 'var(--space-10)' }}>Shadows</h3>
            <p className="styleguide-section__description">Elevation shadows for depth and hierarchy</p>
            <div className="shadow-samples">
              {['xs', 's', 'm', 'l', 'xl'].map(size => (
                <div 
                  key={size} 
                  className="shadow-sample" 
                  style={{ boxShadow: `var(--shadow-${size})` }}
                >
                  <span>{size.toUpperCase()}</span>
                </div>
              ))}
            </div>
          </section>
        </TabPanel>

        {/* Tab 5: Components */}
        <TabPanel label="Components">
          <section className="styleguide-section">
            <h2 className="styleguide-section__title">UI Components</h2>
            <p className="styleguide-section__description">Production-ready component library</p>

            {/* Badges */}
            <div className="component-category">
              <h3 className="component-category__title">Badges</h3>
              <div className="component-demo">
                <div className="badge badge--success badge--heavy">Success Heavy</div>
                <div className="badge badge--success badge--medium">Success Medium</div>
                <div className="badge badge--success badge--light">Success Light</div>
                <div className="badge badge--info badge--heavy">Info Heavy</div>
                <div className="badge badge--warning badge--medium">Warning Medium</div>
                <div className="badge badge--error badge--light">Error Light</div>
                <div className="badge badge--neutral badge--medium">Neutral</div>
              </div>
            </div>

            {/* Buttons */}
            <div className="component-category">
              <h3 className="component-category__title">Buttons</h3>
              <div className="component-demo">
                <button className="btn btn--primary">Primary</button>
                <button className="btn btn--secondary">Secondary</button>
                <button className="btn btn--tertiary">Tertiary</button>
                <button className="btn btn--destructive">Destructive</button>
                <button className="btn btn--ghost">Ghost</button>
                <button className="btn btn--primary" disabled>Disabled</button>
              </div>
              <div className="component-demo" style={{ marginTop: 'var(--space-4)' }}>
                <button className="btn btn--primary btn--s">Small</button>
                <button className="btn btn--primary">Medium</button>
                <button className="btn btn--primary btn--l">Large</button>
              </div>
            </div>

            {/* Alerts */}
            <div className="component-category">
              <h3 className="component-category__title">Alerts</h3>
              <div className="component-demo" style={{ flexDirection: 'column', alignItems: 'stretch' }}>
                <div className="alert alert--success">
                  <div className="alert__icon">✓</div>
                  <div className="alert__content">Your changes have been saved successfully</div>
                </div>
                <div className="alert alert--info">
                  <div className="alert__icon">i</div>
                  <div className="alert__content">You have 5 new notifications waiting</div>
                </div>
                <div className="alert alert--warning">
                  <div className="alert__icon">!</div>
                  <div className="alert__content">Your subscription will expire in 3 days</div>
                </div>
                <div className="alert alert--error">
                  <div className="alert__icon">×</div>
                  <div className="alert__content">Unable to process your request. Please try again</div>
                </div>
              </div>
            </div>

            {/* Form Inputs */}
            <div className="component-category">
              <h3 className="component-category__title">Form Inputs</h3>
              <div className="component-demo" style={{ flexDirection: 'column', alignItems: 'stretch', maxWidth: '400px' }}>
                <div className="form-field">
                  <label htmlFor="input-default">Text Input</label>
                  <input type="text" id="input-default" placeholder="Enter text..." />
                </div>
                <div className="form-field">
                  <label htmlFor="input-email">Email Input</label>
                  <input type="email" id="input-email" placeholder="email@example.com" />
                </div>
                <div className="form-field">
                  <label htmlFor="input-password">Password Input</label>
                  <input type="password" id="input-password" placeholder="Enter password" />
                </div>
              </div>
            </div>

            {/* Card */}
            <div className="component-category">
              <h3 className="component-category__title">Card</h3>
              <div className="component-demo">
                <div className="card" style={{ maxWidth: '400px' }}>
                  <div className="card__header">Dashboard Card</div>
                  <div className="card__body">
                    Cards provide a flexible container for grouping related content and actions.
                  </div>
                  <div className="card__footer">
                    <button className="btn btn--ghost btn--s">Cancel</button>
                    <button className="btn btn--primary btn--s">Confirm</button>
                  </div>
                </div>
              </div>
            </div>

            {/* Dropdown */}
            <div className="component-category">
              <h3 className="component-category__title">Dropdown</h3>
              <div className="component-demo">
                <Dropdown trigger="Select Country">
                  <DropdownLabel>Europe</DropdownLabel>
                  <DropdownItem onClick={() => alert('Portugal')}>Portugal</DropdownItem>
                  <DropdownItem onClick={() => alert('Spain')}>Spain</DropdownItem>
                  <DropdownItem onClick={() => alert('France')}>France</DropdownItem>
                  <DropdownDivider />
                  <DropdownLabel>Asia</DropdownLabel>
                  <DropdownItem onClick={() => alert('Japan')}>Japan</DropdownItem>
                  <DropdownItem onClick={() => alert('China')}>China</DropdownItem>
                  <DropdownDivider variant="dashed" />
                  <DropdownItem danger onClick={() => alert('Clear')}>Clear Selection</DropdownItem>
                </Dropdown>
              </div>
            </div>

            {/* Dividers */}
            <div className="component-category">
              <h3 className="component-category__title">Dividers</h3>
              <div className="component-demo" style={{ flexDirection: 'column', alignItems: 'stretch' }}>
                <div className="divider-example">
                  <p>Content above solid divider</p>
                  <Divider variant="solid" />
                  <p>Content below solid divider</p>
                </div>
                <div className="divider-example">
                  <p>Content above dashed divider</p>
                  <Divider variant="dashed" />
                  <p>Content below dashed divider</p>
                </div>
                <div className="divider-example">
                  <p>Content above dotted divider</p>
                  <Divider variant="dotted" />
                  <p>Content below dotted divider</p>
                </div>
              </div>
            </div>
          </section>
        </TabPanel>
      </Tabs>
    </div>
  );
};

export default StyleGuide;