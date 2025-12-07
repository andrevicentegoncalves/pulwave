import React from 'react';
import { Card, Divider } from '../../../../components/ui';

export default function Colors({ copyToClipboard }) {
  return (
    <section className="styleguide-section">
      <h2 className="styleguide-section__title">Brand Colors</h2>
      <p className="styleguide-section__description">Primary, secondary, and tertiary brand colors with interaction states</p>

      {/* Primary Colors */}
      <div className="color-category">
        <h3 className="color-category__title">Primary (Emerald Green)</h3>
        <div className="color-swatch-grid color-swatch-grid--brand">
          {[
            { name: 'Primary', token: '--color-primary', hsl: 'hsl(160, 94%, 30%)', star: true },
            { name: 'Primary Subtle', token: '--color-primary-subtle', hsl: 'hsl(160, 94%, 98%)' },
            { name: 'Primary Hover', token: '--color-primary-hover', hsl: 'hsl(160, 94%, 22%)' },
            { name: 'Primary Active', token: '--color-primary-active', hsl: 'hsl(160, 94%, 22%)' },
            { name: 'Primary Pressed', token: '--color-primary-pressed', hsl: 'hsl(160, 94%, 20%)' },
            { name: 'Primary Disabled', token: '--color-primary-disabled', hsl: 'hsl(160, 94%, 88%)' },
          ].map(({ name, token, hsl, star }) => (
            <Card
              key={token}
              variant="elevated"
              noPadding
              className="color-swatch-card"
              onClick={() => copyToClipboard(`var(${token})`)}
            >
              <div
                className="color-swatch-card__preview swatch-dynamic--bg"
                style={{ '--swatch-bg': `var(${token})` }}
              />
              <div className="color-swatch-card__info">
                <h4 className="color-swatch-card__title">
                  {name} {star ? '⭐' : ''}
                </h4>
                <p className="color-swatch-card__value">
                  {hsl}
                </p>
                <p className="color-swatch-card__value color-swatch-card__value--last">
                  var({token})
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Secondary Colors */}
      <div className="color-category">
        <h3 className="color-category__title">Secondary (Golden Yellow)</h3>
        <div className="color-swatch-grid color-swatch-grid--brand">
          {[
            { name: 'Secondary', token: '--color-secondary', hsl: 'hsl(45, 88%, 50%)', star: true },
            { name: 'Secondary Hover', token: '--color-secondary-hover', hsl: 'hsl(45, 88%, 40%)' },
            { name: 'Secondary Active', token: '--color-secondary-active', hsl: 'hsl(45, 88%, 38%)' },
            { name: 'Secondary Pressed', token: '--color-secondary-pressed', hsl: 'hsl(45, 88%, 30%)' },
            { name: 'Secondary Disabled', token: '--color-secondary-disabled', hsl: 'hsl(45, 88%, 88%)' },
          ].map(({ name, token, hsl, star }) => (
            <Card
              key={token}
              variant="elevated"
              noPadding
              className="color-swatch-card"
              onClick={() => copyToClipboard(`var(${token})`)}
            >
              <div
                className="color-swatch-card__preview swatch-dynamic--bg"
                style={{ '--swatch-bg': `var(${token})` }}
              />
              <div className="color-swatch-card__info">
                <h4 className="color-swatch-card__title">
                  {name} {star ? '⭐' : ''}
                </h4>
                <p className="color-swatch-card__value">
                  {hsl}
                </p>
                <p className="color-swatch-card__value color-swatch-card__value--last">
                  var({token})
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Tertiary Colors */}
      <div className="color-category">
        <h3 className="color-category__title">Tertiary (Coral Red)</h3>
        <div className="color-swatch-grid color-swatch-grid--brand">
          {[
            { name: 'Tertiary', token: '--color-tertiary', hsl: 'hsl(12, 88%, 50%)', star: true },
            { name: 'Tertiary Hover', token: '--color-tertiary-hover', hsl: 'hsl(12, 88%, 45%)' },
            { name: 'Tertiary Active', token: '--color-tertiary-active', hsl: 'hsl(12, 88%, 38%)' },
            { name: 'Tertiary Pressed', token: '--color-tertiary-pressed', hsl: 'hsl(12, 88%, 20%)' },
            { name: 'Tertiary Disabled', token: '--color-tertiary-disabled', hsl: 'hsl(12, 88%, 88%)' },
          ].map(({ name, token, hsl, star }) => (
            <Card
              key={token}
              variant="elevated"
              noPadding
              className="color-swatch-card"
              onClick={() => copyToClipboard(`var(${token})`)}
            >
              <div
                className="color-swatch-card__preview swatch-dynamic--bg"
                style={{ '--swatch-bg': `var(${token})` }}
              />
              <div className="color-swatch-card__info">
                <h4 className="color-swatch-card__title">
                  {name} {star ? '⭐' : ''}
                </h4>
                <p className="color-swatch-card__value">
                  {hsl}
                </p>
                <p className="color-swatch-card__value color-swatch-card__value--last">
                  var({token})
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <Divider className="styleguide-divider" />

      {/* Neutral Colors */}
      <h2 className="styleguide-section__title">Neutral Colors</h2>
      <p className="styleguide-section__description">Grayscale palette for UI elements and text</p>

      <div className="color-category">
        <h3 className="color-category__title">Neutral Scale</h3>
        <div className="color-swatch-grid color-swatch-grid--neutral">
          {[0, 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950].map(shade => (
            <Card
              key={shade}
              variant="elevated"
              noPadding
              className="color-swatch-card"
              onClick={() => copyToClipboard(`var(--color-neutral-${shade})`)}
            >
              <div
                className={`color-swatch-card__preview color-swatch-card__preview--small swatch-dynamic--bg ${shade === 0 ? 'color-swatch-card__preview--bordered' : ''}`}
                style={{ '--swatch-bg': `var(--color-neutral-${shade})` }}
              />
              <div className="color-swatch-card__info color-swatch-card__info--compact">
                <p className="color-swatch-card__title color-swatch-card__title--small color-swatch-card__title--centered">
                  {shade}
                </p>
                <p className="color-swatch-card__value color-swatch-card__value--last color-swatch-card__value--centered">
                  var(--color-neutral-{shade})
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <Divider className="styleguide-divider" />

      {/* Feedback Colors */}
      <h2 className="styleguide-section__title">Feedback Colors</h2>
      <p className="styleguide-section__description">Semantic colors for success, warning, info, and error states</p>

      {[
        { family: 'success', label: 'Success', icon: '✓' },
        { family: 'warning', label: 'Warning', icon: '⚠' },
        { family: 'info', label: 'Info', icon: 'ℹ' },
        { family: 'error', label: 'Error', icon: '×' }
      ].map(({ family, label, icon }) => (
        <div key={family} className="color-category">
          <h3 className="color-category__title">{icon} {label}</h3>
          <div className="color-swatch-grid color-swatch-grid--feedback">
            {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950].map(shade => (
              <Card
                key={shade}
                variant="elevated"
                noPadding
                className="color-swatch-card"
                onClick={() => copyToClipboard(`var(--color-feedback-${family}-${shade})`)}
              >
                <div
                  className="color-swatch-card__preview color-swatch-card__preview--small swatch-dynamic--bg"
                  style={{ '--swatch-bg': `var(--color-feedback-${family}-${shade})` }}
                />
                <div className="color-swatch-card__info color-swatch-card__info--compact">
                  <p className="color-swatch-card__title color-swatch-card__title--small color-swatch-card__title--centered">
                    {shade}
                  </p>
                  <p className="color-swatch-card__value color-swatch-card__value--last color-swatch-card__value--centered color-swatch-card__value--break">
                    var(--color-feedback-{family}-{shade})
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}
