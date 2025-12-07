import React from 'react';
import { Card } from '../../../../components/ui';

export default function Surfaces() {
  return (
    <section className="styleguide-section">
      <h2 className="styleguide-section__title">Surface Elevation System</h2>
      <p className="styleguide-section__description">Layered surfaces for visual hierarchy and depth</p>

      <div className="color-category">
        <h3 className="color-category__title">Surface Layers</h3>
        <div className="token-grid">
          {[
            { name: 'Default', token: '--color-surface-default', desc: 'Base application background', bordered: true },
            { name: 'Subtle', token: '--color-surface-subtle', desc: 'First elevation - cards' },
            { name: 'Strong', token: '--color-surface-strong', desc: 'Second elevation - modals' },
            { name: 'Hover', token: '--color-surface-hover', desc: 'Interactive hover state' },
            { name: 'Pressed', token: '--color-surface-pressed', desc: 'Active/pressed state' },
            { name: 'Disabled', token: '--color-surface-disabled', desc: 'Disabled background' },
          ].map(({ name, token, desc, bordered }) => (
            <Card
              key={token}
              variant="elevated"
              noPadding
              className="token-card"
            >
              <div
                className={`token-card__preview swatch-dynamic--bg ${bordered ? 'token-card__preview--bordered' : ''}`}
                style={{ '--swatch-bg': `var(${token})` }}
              >
                <span className="token-card__preview-label">
                  {name}
                </span>
              </div>
              <div className="token-card__info">
                <h4 className="token-card__title">
                  Surface {name}
                </h4>
                <p className="token-card__desc">
                  {desc}
                </p>
                <p className="token-card__token">
                  var({token})
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <div className="color-category color-category--spaced-lg">
        <h3 className="color-category__title">Inverse Surfaces</h3>
        <div className="token-grid">
          {[
            { name: 'Inverse Default', token: '--color-surface-inverse-default', desc: 'High contrast inverted' },
            { name: 'Inverse Subtle', token: '--color-surface-inverse-subtle', desc: 'Subtle inverse variant' },
            { name: 'Inverse Hover', token: '--color-surface-inverse-hover', desc: 'Inverse hover state' },
            { name: 'Inverse Pressed', token: '--color-surface-inverse-pressed', desc: 'Inverse pressed state' },
          ].map(({ name, token, desc }) => (
            <Card
              key={token}
              variant="elevated"
              noPadding
              className="token-card"
            >
              <div
                className="token-card__preview swatch-dynamic--bg"
                style={{ '--swatch-bg': `var(${token})` }}
              >
                <span className="token-card__preview-label token-card__preview-label--inverse">
                  {name}
                </span>
              </div>
              <div className="token-card__info">
                <h4 className="token-card__title">
                  {name}
                </h4>
                <p className="token-card__desc">
                  {desc}
                </p>
                <p className="token-card__token">
                  var({token})
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <div className="color-category color-category--spaced-lg">
        <h3 className="color-category__title">Text on Surfaces</h3>
        <div className="token-grid">
          {[
            { name: 'On Surface Default', token: '--color-on-surface-default', desc: 'Primary text' },
            { name: 'On Surface Subtle', token: '--color-on-surface-subtle', desc: 'Secondary text' },
            { name: 'On Surface Disabled', token: '--color-on-surface-disabled', desc: 'Disabled text' },
          ].map(({ name, token, desc }) => (
            <Card
              key={token}
              variant="elevated"
              noPadding
              className="token-card"
            >
              <div
                className="token-card__preview swatch-dynamic--bg"
                style={{ '--swatch-bg': `var(${token})` }}
              >
                <span className="token-card__preview-label token-card__preview-label--on-color">
                  Text
                </span>
              </div>
              <div className="token-card__info">
                <h4 className="token-card__title">
                  {name}
                </h4>
                <p className="token-card__desc">
                  {desc}
                </p>
                <p className="token-card__token">
                  var({token})
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
