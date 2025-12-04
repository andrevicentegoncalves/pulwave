import React from 'react';
import { Card } from '../../../../components/ui';

export default function Surfaces() {
  return (
    <section className="styleguide-section">
      <h2 className="styleguide-section__title">Surface Elevation System</h2>
      <p className="styleguide-section__description">Layered surfaces for visual hierarchy and depth</p>
      
      <div className="color-category">
        <h3 className="color-category__title">Surface Layers</h3>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', 
          gap: 'var(--space-4)' 
        }}>
          {[
            { name: 'Default', token: '--color-surface-default', desc: 'Base application background' },
            { name: 'Subtle', token: '--color-surface-subtle', desc: 'First elevation - cards' },
            { name: 'Strong', token: '--color-surface-strong', desc: 'Second elevation - modals' },
            { name: 'Hover', token: '--color-surface-hover', desc: 'Interactive hover state' },
            { name: 'Pressed', token: '--color-surface-pressed', desc: 'Active/pressed state' },
            { name: 'Disabled', token: '--color-surface-disabled', desc: 'Disabled background' },
          ].map(({ name, token, desc }) => (
            <Card 
              key={token}
              variant="elevated"
              noPadding
              style={{ cursor: 'pointer' }}
            >
              <div 
                style={{ 
                  height: '100px', 
                  backgroundColor: `var(${token})`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: name === 'Default' ? '1px solid var(--color-border-default)' : 'none'
                }}
              >
                <span style={{ 
                  fontSize: 'var(--font-size-7xs)', 
                  fontWeight: 'var(--font-weight-semi-bold)',
                  color: 'var(--color-on-surface-default)'
                }}>
                  {name}
                </span>
              </div>
              <div style={{ padding: 'var(--space-3)' }}>
                <h4 style={{ 
                  fontSize: 'var(--font-size-7xs)', 
                  fontWeight: 'var(--font-weight-semi-bold)',
                  margin: '0 0 var(--space-1) 0',
                  color: 'var(--color-on-surface-default)'
                }}>
                  Surface {name}
                </h4>
                <p style={{ 
                  fontSize: 'var(--font-size-9xs)', 
                  color: 'var(--color-on-surface-subtle)',
                  margin: '0 0 var(--space-1) 0'
                }}>
                  {desc}
                </p>
                <p style={{ 
                  fontSize: 'var(--font-size-9xs)', 
                  color: 'var(--color-on-surface-subtle)',
                  margin: 0,
                  fontFamily: 'monospace'
                }}>
                  var({token})
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <div className="color-category" style={{ marginTop: 'var(--space-10)' }}>
        <h3 className="color-category__title">Inverse Surfaces</h3>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', 
          gap: 'var(--space-4)' 
        }}>
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
              style={{ cursor: 'pointer' }}
            >
              <div 
                style={{ 
                  height: '100px', 
                  backgroundColor: `var(${token})`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <span style={{ 
                  fontSize: 'var(--font-size-7xs)', 
                  fontWeight: 'var(--font-weight-semi-bold)',
                  color: 'var(--color-on-surface-inverse-default)'
                }}>
                  {name}
                </span>
              </div>
              <div style={{ padding: 'var(--space-3)' }}>
                <h4 style={{ 
                  fontSize: 'var(--font-size-7xs)', 
                  fontWeight: 'var(--font-weight-semi-bold)',
                  margin: '0 0 var(--space-1) 0',
                  color: 'var(--color-on-surface-default)'
                }}>
                  {name}
                </h4>
                <p style={{ 
                  fontSize: 'var(--font-size-9xs)', 
                  color: 'var(--color-on-surface-subtle)',
                  margin: '0 0 var(--space-1) 0'
                }}>
                  {desc}
                </p>
                <p style={{ 
                  fontSize: 'var(--font-size-9xs)', 
                  color: 'var(--color-on-surface-subtle)',
                  margin: 0,
                  fontFamily: 'monospace'
                }}>
                  var({token})
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <div className="color-category" style={{ marginTop: 'var(--space-10)' }}>
        <h3 className="color-category__title">Text on Surfaces</h3>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', 
          gap: 'var(--space-4)' 
        }}>
          {[
            { name: 'On Surface Default', token: '--color-on-surface-default', desc: 'Primary text' },
            { name: 'On Surface Subtle', token: '--color-on-surface-subtle', desc: 'Secondary text' },
            { name: 'On Surface Disabled', token: '--color-on-surface-disabled', desc: 'Disabled text' },
          ].map(({ name, token, desc }) => (
            <Card 
              key={token}
              variant="elevated"
              noPadding
              style={{ cursor: 'pointer' }}
            >
              <div 
                style={{ 
                  height: '100px', 
                  backgroundColor: `var(${token})`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <span style={{ 
                  fontSize: 'var(--font-size-7xs)', 
                  fontWeight: 'var(--font-weight-semi-bold)',
                  color: 'var(--color-surface-default)'
                }}>
                  Text
                </span>
              </div>
              <div style={{ padding: 'var(--space-3)' }}>
                <h4 style={{ 
                  fontSize: 'var(--font-size-7xs)', 
                  fontWeight: 'var(--font-weight-semi-bold)',
                  margin: '0 0 var(--space-1) 0',
                  color: 'var(--color-on-surface-default)'
                }}>
                  {name}
                </h4>
                <p style={{ 
                  fontSize: 'var(--font-size-9xs)', 
                  color: 'var(--color-on-surface-subtle)',
                  margin: '0 0 var(--space-1) 0'
                }}>
                  {desc}
                </p>
                <p style={{ 
                  fontSize: 'var(--font-size-9xs)', 
                  color: 'var(--color-on-surface-subtle)',
                  margin: 0,
                  fontFamily: 'monospace'
                }}>
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
