import React from 'react';
import { Card } from '../../../../components/ui';

export default function Contrast({ copyToClipboard }) {
  return (
    <section className="styleguide-section">
      <h2 className="styleguide-section__title">Contrast &amp; Accessibility</h2>
      <p className="styleguide-section__description">Text colors with WCAG AA/AAA compliant contrast ratios</p>

      {/* Text on Brand Colors */}
      <div className="color-category">
        <h3 className="color-category__title">Text on Brand Backgrounds</h3>
        <p className="color-category__description">
          High contrast text colors for use on brand-colored backgrounds
        </p>
        <div className="token-grid">
          {[
            { name: 'On Primary', token: '--color-on-primary', hsl: 'hsl(215, 16%, 100%)', bgToken: '--color-primary' },
            { name: 'On Secondary', token: '--color-on-secondary', hsl: 'hsl(45, 88%, 12%)', bgToken: '--color-secondary' },
            { name: 'On Tertiary', token: '--color-on-tertiary', hsl: 'hsl(215, 16%, 100%)', bgToken: '--color-tertiary' },
          ].map(({ name, token, hsl, bgToken }) => (
            <Card
              key={token}
              variant="elevated"
              noPadding
              className="token-card"
              onClick={() => copyToClipboard(`var(${token})`)}
            >
              <div
                className="token-card__preview swatch-dynamic--bg-color"
                style={{ '--swatch-bg': `var(${bgToken})`, '--swatch-color': `var(${token})` }}
              >
                <span className="token-card__preview-label contrast-preview__label-inherit">
                  {name}
                </span>
              </div>
              <div className="token-card__info">
                <h4 className="token-card__title">{name}</h4>
                <p className="token-card__token">{hsl}</p>
                <p className="token-card__token">var({token})</p>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Brand Colors on Surfaces */}
      <div className="color-category color-category--spaced-lg">
        <h3 className="color-category__title">Brand Colors on Surfaces</h3>
        <p className="color-category__description">
          Brand colors optimized for text on neutral surfaces
        </p>
        <div className="token-grid">
          {[
            { name: 'On Surface Primary', token: '--color-on-surface-primary', hsl: 'hsl(160, 94%, 30%)' },
            { name: 'On Surface Secondary', token: '--color-on-surface-secondary', hsl: 'hsl(45, 88%, 38%)' },
            { name: 'On Surface Tertiary', token: '--color-on-surface-tertiary', hsl: 'hsl(12, 88%, 45%)' },
          ].map(({ name, token, hsl }) => (
            <Card
              key={token}
              variant="elevated"
              noPadding
              className="token-card"
              onClick={() => copyToClipboard(`var(${token})`)}
            >
              <div
                className="token-card__preview contrast-preview--on-surface-subtle swatch-dynamic--color"
                style={{ '--swatch-color': `var(${token})` }}
              >
                <span className="token-card__preview-label contrast-preview__label-inherit">
                  {name}
                </span>
              </div>
              <div className="token-card__info">
                <h4 className="token-card__title">{name}</h4>
                <p className="token-card__token">{hsl}</p>
                <p className="token-card__token">var({token})</p>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Text on Inverse Surfaces */}
      <div className="color-category color-category--spaced-lg">
        <h3 className="color-category__title">Text on Inverse Surfaces</h3>
        <p className="color-category__description">
          High contrast text for inverse (dark) surfaces
        </p>
        <div className="token-grid">
          {[
            { name: 'On Inverse Default', token: '--color-on-surface-inverse-default', desc: 'Primary text on dark' },
            { name: 'On Inverse Subtle', token: '--color-on-surface-inverse-subtle', desc: 'Secondary text on dark' },
            { name: 'On Inverse Disabled', token: '--color-on-surface-inverse-disabled', desc: 'Disabled text on dark' },
          ].map(({ name, token, desc }) => (
            <Card
              key={token}
              variant="elevated"
              noPadding
              className="token-card"
              onClick={() => copyToClipboard(`var(${token})`)}
            >
              <div
                className="token-card__preview contrast-preview--on-inverse swatch-dynamic--color"
                style={{ '--swatch-color': `var(${token})` }}
              >
                <span className="token-card__preview-label contrast-preview__label-inherit">
                  Text
                </span>
              </div>
              <div className="token-card__info">
                <h4 className="token-card__title">{name}</h4>
                <p className="token-card__desc">{desc}</p>
                <p className="token-card__token">var({token})</p>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Border Colors */}
      <div className="color-category color-category--spaced-lg">
        <h3 className="color-category__title">Border Colors</h3>
        <p className="color-category__description">
          Subtle border colors for dividers and outlines
        </p>
        <div className="token-grid">
          {[
            { name: 'Border Default', token: '--color-border-default', desc: 'Standard borders' },
            { name: 'Border Subtle', token: '--color-border-subtle', desc: 'Subtle dividers' },
            { name: 'Border Strong', token: '--color-border-strong', desc: 'Emphasized borders' },
            { name: 'Border Hover', token: '--color-border-hover', desc: 'Interactive hover' },
            { name: 'Border Focus', token: '--color-border-focus', desc: 'Focus indicators' },
            { name: 'Border Disabled', token: '--color-border-disabled', desc: 'Disabled borders' },
          ].map(({ name, token, desc }) => (
            <Card
              key={token}
              variant="elevated"
              noPadding
              className="token-card"
              onClick={() => copyToClipboard(`var(${token})`)}
            >
              <div
                className="token-card__preview contrast-preview--border-demo swatch-dynamic--border"
                style={{ '--swatch-border': `var(${token})` }}
              >
                <span className="token-card__preview-label">
                  {name.replace('Border ', '')}
                </span>
              </div>
              <div className="token-card__info">
                <h4 className="token-card__title">{name}</h4>
                <p className="token-card__desc">{desc}</p>
                <p className="token-card__token">var({token})</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
