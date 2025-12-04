import React from 'react';
import { Card } from '../../../../components/ui';

export default function Contrast({ copyToClipboard }) {
  return (
    <section className="styleguide-section">
      <h2 className="styleguide-section__title">Contrast & Accessibility</h2>
      <p className="styleguide-section__description">Text colors with WCAG AA/AAA compliant contrast ratios</p>
      
      {/* Text on Brand Colors */}
      <div className="color-category">
        <h3 className="color-category__title">Text on Brand Backgrounds</h3>
        <p style={{ 
          fontSize: 'var(--font-size-7xs)', 
          color: 'var(--color-on-surface-subtle)',
          marginBottom: 'var(--space-4)'
        }}>
          High contrast text colors for use on brand-colored backgrounds
        </p>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', 
          gap: 'var(--space-4)' 
        }}>
          {[
            { name: 'On Primary', token: '--color-on-primary', hsl: 'hsl(215, 16%, 100%)', bgToken: '--color-primary' },
            { name: 'On Secondary', token: '--color-on-secondary', hsl: 'hsl(45, 88%, 12%)', bgToken: '--color-secondary' },
            { name: 'On Tertiary', token: '--color-on-tertiary', hsl: 'hsl(215, 16%, 100%)', bgToken: '--color-tertiary' },
          ].map(({ name, token, hsl, bgToken }) => (
            <Card 
              key={token}
              variant="elevated"
              noPadding
              style={{ cursor: 'pointer' }}
              onClick={() => copyToClipboard(`var(${token})`)}
            >
              <div 
                style={{ 
                  height: '100px', 
                  backgroundColor: `var(${bgToken})`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: `var(${token})`
                }}
              >
                <span style={{ 
                  fontSize: 'var(--font-size-6xs)', 
                  fontWeight: 'var(--font-weight-semi-bold)'
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
                  margin: '0 0 var(--space-1) 0',
                  fontFamily: 'monospace'
                }}>
                  {hsl}
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

      {/* Brand Colors on Surfaces */}
      <div className="color-category" style={{ marginTop: 'var(--space-10)' }}>
        <h3 className="color-category__title">Brand Colors on Surfaces</h3>
        <p style={{ 
          fontSize: 'var(--font-size-7xs)', 
          color: 'var(--color-on-surface-subtle)',
          marginBottom: 'var(--space-4)'
        }}>
          Brand colors optimized for text on neutral surfaces
        </p>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', 
          gap: 'var(--space-4)' 
        }}>
          {[
            { name: 'On Surface Primary', token: '--color-on-surface-primary', hsl: 'hsl(160, 94%, 30%)' },
            { name: 'On Surface Secondary', token: '--color-on-surface-secondary', hsl: 'hsl(45, 88%, 38%)' },
            { name: 'On Surface Tertiary', token: '--color-on-surface-tertiary', hsl: 'hsl(12, 88%, 45%)' },
          ].map(({ name, token, hsl }) => (
            <Card 
              key={token}
              variant="elevated"
              noPadding
              style={{ cursor: 'pointer' }}
              onClick={() => copyToClipboard(`var(${token})`)}
            >
              <div 
                style={{ 
                  height: '100px', 
                  backgroundColor: 'var(--color-surface-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: `var(${token})`
                }}
              >
                <span style={{ 
                  fontSize: 'var(--font-size-6xs)', 
                  fontWeight: 'var(--font-weight-semi-bold)'
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
                  margin: '0 0 var(--space-1) 0',
                  fontFamily: 'monospace'
                }}>
                  {hsl}
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

      {/* Text on Inverse Surfaces */}
      <div className="color-category" style={{ marginTop: 'var(--space-10)' }}>
        <h3 className="color-category__title">Text on Inverse Surfaces</h3>
        <p style={{ 
          fontSize: 'var(--font-size-7xs)', 
          color: 'var(--color-on-surface-subtle)',
          marginBottom: 'var(--space-4)'
        }}>
          High contrast text for inverse (dark) surfaces
        </p>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', 
          gap: 'var(--space-4)' 
        }}>
          {[
            { name: 'On Inverse Default', token: '--color-on-surface-inverse-default', desc: 'Primary text on dark' },
            { name: 'On Inverse Subtle', token: '--color-on-surface-inverse-subtle', desc: 'Secondary text on dark' },
            { name: 'On Inverse Disabled', token: '--color-on-surface-inverse-disabled', desc: 'Disabled text on dark' },
          ].map(({ name, token, desc }) => (
            <Card 
              key={token}
              variant="elevated"
              noPadding
              style={{ cursor: 'pointer' }}
              onClick={() => copyToClipboard(`var(${token})`)}
            >
              <div 
                style={{ 
                  height: '100px', 
                  backgroundColor: 'var(--color-surface-inverse-default)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: `var(${token})`
                }}
              >
                <span style={{ 
                  fontSize: 'var(--font-size-6xs)', 
                  fontWeight: 'var(--font-weight-semi-bold)'
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

      {/* Border Colors */}
      <div className="color-category" style={{ marginTop: 'var(--space-10)' }}>
        <h3 className="color-category__title">Border Colors</h3>
        <p style={{ 
          fontSize: 'var(--font-size-7xs)', 
          color: 'var(--color-on-surface-subtle)',
          marginBottom: 'var(--space-4)'
        }}>
          Subtle border colors for dividers and outlines
        </p>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', 
          gap: 'var(--space-4)' 
        }}>
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
              style={{ cursor: 'pointer' }}
              onClick={() => copyToClipboard(`var(${token})`)}
            >
              <div 
                style={{ 
                  height: '100px', 
                  backgroundColor: 'var(--color-surface-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: `4px solid var(${token})`
                }}
              >
                <span style={{ 
                  fontSize: 'var(--font-size-7xs)', 
                  fontWeight: 'var(--font-weight-semi-bold)',
                  color: 'var(--color-on-surface-default)'
                }}>
                  {name.replace('Border ', '')}
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
