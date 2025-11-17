import React from 'react';
import Card from '../../Card';
import { Divider } from '../../Divider';

export default function Colors({ copyToClipboard }) {
  return (
    <section className="styleguide-section">
      <h2 className="styleguide-section__title">Brand Colors</h2>
      <p className="styleguide-section__description">Primary, secondary, and tertiary brand colors with interaction states</p>
      
      <div className="color-category">
        <h3 className="color-category__title">Primary (Emerald Green)</h3>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', 
          gap: 'var(--space-4)' 
        }}>
          {[
            { shade: 50, lightness: '93%' },
            { shade: 100, lightness: '90%' },
            { shade: 200, lightness: '80%' },
            { shade: 300, lightness: '70%' },
            { shade: 400, lightness: '55%' },
            { shade: 500, lightness: '30%', star: true },
            { shade: 600, lightness: '27%' },
            { shade: 700, lightness: '22%' },
            { shade: 800, lightness: '17%' },
            { shade: 900, lightness: '10%' },
            { shade: 950, lightness: '5%' }
          ].map(({ shade, lightness, star }) => (
            <Card 
              key={shade}
              variant="elevated"
              noPadding
              style={{ cursor: 'pointer' }}
              onClick={() => copyToClipboard(`var(--color-primary-${shade})`)}
            >
              <div 
                style={{ 
                  height: '120px', 
                  backgroundColor: `var(--color-primary-${shade})`
                }}
              />
              <div style={{ padding: 'var(--space-4)' }}>
                <h4 style={{ 
                  fontSize: 'var(--font-size-6xs)', 
                  fontWeight: 'var(--font-weight-semi-bold)',
                  margin: '0 0 var(--space-1) 0',
                  color: 'var(--color-on-surface-default)'
                }}>
                  Primary {shade} {star ? '⭐' : ''}
                </h4>
                <p style={{ 
                  fontSize: 'var(--font-size-8xs)', 
                  color: 'var(--color-on-surface-subtle)',
                  margin: 0,
                  fontFamily: 'monospace'
                }}>
                  hsl(160, 94%, {lightness})
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <div className="color-category">
        <h3 className="color-category__title">Secondary (Golden Yellow)</h3>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', 
          gap: 'var(--space-4)' 
        }}>
          {[
            { shade: 50, lightness: '93%' },
            { shade: 100, lightness: '90%' },
            { shade: 200, lightness: '80%' },
            { shade: 300, lightness: '70%' },
            { shade: 400, lightness: '60%' },
            { shade: 500, lightness: '50%', star: true },
            { shade: 600, lightness: '45%' },
            { shade: 700, lightness: '40%' },
            { shade: 800, lightness: '30%' },
            { shade: 900, lightness: '13%' },
            { shade: 950, lightness: '5%' }
          ].map(({ shade, lightness, star }) => (
            <Card 
              key={shade}
              variant="elevated"
              noPadding
              style={{ cursor: 'pointer' }}
              onClick={() => copyToClipboard(`var(--color-secondary-${shade})`)}
            >
              <div 
                style={{ 
                  height: '120px', 
                  backgroundColor: `var(--color-secondary-${shade})`
                }}
              />
              <div style={{ padding: 'var(--space-4)' }}>
                <h4 style={{ 
                  fontSize: 'var(--font-size-6xs)', 
                  fontWeight: 'var(--font-weight-semi-bold)',
                  margin: '0 0 var(--space-1) 0',
                  color: 'var(--color-on-surface-default)'
                }}>
                  Secondary {shade} {star ? '⭐' : ''}
                </h4>
                <p style={{ 
                  fontSize: 'var(--font-size-8xs)', 
                  color: 'var(--color-on-surface-subtle)',
                  margin: 0,
                  fontFamily: 'monospace'
                }}>
                  hsl(45, 88%, {lightness})
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <div className="color-category">
        <h3 className="color-category__title">Tertiary (Coral Red)</h3>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', 
          gap: 'var(--space-4)' 
        }}>
          {[
            { shade: 50, lightness: '93%' },
            { shade: 100, lightness: '90%' },
            { shade: 200, lightness: '80%' },
            { shade: 300, lightness: '70%' },
            { shade: 400, lightness: '60%' },
            { shade: 500, lightness: '50%', star: true },
            { shade: 600, lightness: '45%' },
            { shade: 700, lightness: '40%' },
            { shade: 800, lightness: '30%' },
            { shade: 900, lightness: '13%' },
            { shade: 950, lightness: '5%' }
          ].map(({ shade, lightness, star }) => (
            <Card 
              key={shade}
              variant="elevated"
              noPadding
              style={{ cursor: 'pointer' }}
              onClick={() => copyToClipboard(`var(--color-tertiary-${shade})`)}
            >
              <div 
                style={{ 
                  height: '120px', 
                  backgroundColor: `var(--color-tertiary-${shade})`
                }}
              />
              <div style={{ padding: 'var(--space-4)' }}>
                <h4 style={{ 
                  fontSize: 'var(--font-size-6xs)', 
                  fontWeight: 'var(--font-weight-semi-bold)',
                  margin: '0 0 var(--space-1) 0',
                  color: 'var(--color-on-surface-default)'
                }}>
                  Tertiary {shade} {star ? '⭐' : ''}
                </h4>
                <p style={{ 
                  fontSize: 'var(--font-size-8xs)', 
                  color: 'var(--color-on-surface-subtle)',
                  margin: 0,
                  fontFamily: 'monospace'
                }}>
                  hsl(12, 88%, {lightness})
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <div className="color-category">
        <h3 className="color-category__title">Neutral Scale</h3>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', 
          gap: 'var(--space-4)' 
        }}>
          {[0, 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950].map(shade => (
            <Card 
              key={shade}
              variant="elevated"
              noPadding
              style={{ cursor: 'pointer' }}
              onClick={() => copyToClipboard(`var(--color-neutral-${shade})`)}
            >
              <div 
                style={{ 
                  height: '120px', 
                  backgroundColor: `var(--color-neutral-${shade})`
                }}
              />
              <div style={{ padding: 'var(--space-4)' }}>
                <p style={{ 
                  fontSize: 'var(--font-size-6xs)', 
                  fontWeight: 'var(--font-weight-semi-bold)',
                  margin: 0,
                  color: 'var(--color-on-surface-default)'
                }}>
                  {shade}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <Divider style={{ margin: 'var(--space-10) 0' }} />

      <h2 className="styleguide-section__title">Feedback Colors</h2>
      <p className="styleguide-section__description">Semantic colors for success, warning, info, and error states</p>
      
      {[
        { family: 'success', label: 'Success', hue: 142, sat: 76 },
        { family: 'warning', label: 'Warning', hue: 45, sat: 100 },
        { family: 'info', label: 'Info', hue: 202, sat: 100 },
        { family: 'error', label: 'Error', hue: 0, sat: 84 }
      ].map(({ family, label, hue, sat }) => (
        <div key={family} className="color-category">
          <h3 className="color-category__title">{label}</h3>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', 
            gap: 'var(--space-4)' 
          }}>
            {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950].map(shade => (
              <Card 
                key={shade}
                variant="elevated"
                noPadding
                style={{ cursor: 'pointer' }}
                onClick={() => copyToClipboard(`var(--color-feedback-${family}-${shade})`)}
              >
                <div 
                  style={{ 
                    height: '100px', 
                    backgroundColor: `var(--color-feedback-${family}-${shade})`
                  }}
                />
                <div style={{ padding: 'var(--space-3)' }}>
                  <p style={{ 
                    fontSize: 'var(--font-size-7xs)', 
                    fontWeight: 'var(--font-weight-semi-bold)',
                    margin: 0,
                    color: 'var(--color-on-surface-default)'
                  }}>
                    {shade}
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