import React from 'react';
import { Card, Divider } from '../../../components/ui';

export default function Colors({ copyToClipboard }) {
  return (
    <section className="styleguide-section">
      <h2 className="styleguide-section__title">Brand Colors</h2>
      <p className="styleguide-section__description">Primary, secondary, and tertiary brand colors with interaction states</p>
      
      {/* Primary Colors */}
      <div className="color-category">
        <h3 className="color-category__title">Primary (Emerald Green)</h3>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', 
          gap: 'var(--space-4)' 
        }}>
          <Card 
            variant="elevated"
            noPadding
            style={{ cursor: 'pointer' }}
            onClick={() => copyToClipboard('var(--color-primary)')}
          >
            <div style={{ 
              height: '120px', 
              backgroundColor: 'var(--color-primary)'
            }} />
            <div style={{ padding: 'var(--space-4)' }}>
              <h4 style={{ 
                fontSize: 'var(--font-size-6xs)', 
                fontWeight: 'var(--font-weight-semi-bold)',
                margin: '0 0 var(--space-1) 0',
                color: 'var(--color-on-surface-default)'
              }}>
                Primary ⭐
              </h4>
              <p style={{ 
                fontSize: 'var(--font-size-8xs)', 
                color: 'var(--color-on-surface-subtle)',
                margin: 0,
                fontFamily: 'monospace'
              }}>
                hsl(160, 94%, 30%)
              </p>
            </div>
          </Card>

          <Card 
            variant="elevated"
            noPadding
            style={{ cursor: 'pointer' }}
            onClick={() => copyToClipboard('var(--color-primary-subtle)')}
          >
            <div style={{ 
              height: '120px', 
              backgroundColor: 'var(--color-primary-subtle)'
            }} />
            <div style={{ padding: 'var(--space-4)' }}>
              <h4 style={{ 
                fontSize: 'var(--font-size-6xs)', 
                fontWeight: 'var(--font-weight-semi-bold)',
                margin: '0 0 var(--space-1) 0',
                color: 'var(--color-on-surface-default)'
              }}>
                Primary Subtle
              </h4>
              <p style={{ 
                fontSize: 'var(--font-size-8xs)', 
                color: 'var(--color-on-surface-subtle)',
                margin: 0,
                fontFamily: 'monospace'
              }}>
                hsl(160, 94%, 98%)
              </p>
            </div>
          </Card>

          <Card 
            variant="elevated"
            noPadding
            style={{ cursor: 'pointer' }}
            onClick={() => copyToClipboard('var(--color-primary-hover)')}
          >
            <div style={{ 
              height: '120px', 
              backgroundColor: 'var(--color-primary-hover)'
            }} />
            <div style={{ padding: 'var(--space-4)' }}>
              <h4 style={{ 
                fontSize: 'var(--font-size-6xs)', 
                fontWeight: 'var(--font-weight-semi-bold)',
                margin: '0 0 var(--space-1) 0',
                color: 'var(--color-on-surface-default)'
              }}>
                Primary Hover
              </h4>
              <p style={{ 
                fontSize: 'var(--font-size-8xs)', 
                color: 'var(--color-on-surface-subtle)',
                margin: 0,
                fontFamily: 'monospace'
              }}>
                hsl(160, 94%, 22%)
              </p>
            </div>
          </Card>

          <Card 
            variant="elevated"
            noPadding
            style={{ cursor: 'pointer' }}
            onClick={() => copyToClipboard('var(--color-primary-active)')}
          >
            <div style={{ 
              height: '120px', 
              backgroundColor: 'var(--color-primary-active)'
            }} />
            <div style={{ padding: 'var(--space-4)' }}>
              <h4 style={{ 
                fontSize: 'var(--font-size-6xs)', 
                fontWeight: 'var(--font-weight-semi-bold)',
                margin: '0 0 var(--space-1) 0',
                color: 'var(--color-on-surface-default)'
              }}>
                Primary Active
              </h4>
              <p style={{ 
                fontSize: 'var(--font-size-8xs)', 
                color: 'var(--color-on-surface-subtle)',
                margin: 0,
                fontFamily: 'monospace'
              }}>
                hsl(160, 94%, 22%)
              </p>
            </div>
          </Card>

          <Card 
            variant="elevated"
            noPadding
            style={{ cursor: 'pointer' }}
            onClick={() => copyToClipboard('var(--color-primary-pressed)')}
          >
            <div style={{ 
              height: '120px', 
              backgroundColor: 'var(--color-primary-pressed)'
            }} />
            <div style={{ padding: 'var(--space-4)' }}>
              <h4 style={{ 
                fontSize: 'var(--font-size-6xs)', 
                fontWeight: 'var(--font-weight-semi-bold)',
                margin: '0 0 var(--space-1) 0',
                color: 'var(--color-on-surface-default)'
              }}>
                Primary Pressed
              </h4>
              <p style={{ 
                fontSize: 'var(--font-size-8xs)', 
                color: 'var(--color-on-surface-subtle)',
                margin: 0,
                fontFamily: 'monospace'
              }}>
                hsl(160, 94%, 20%)
              </p>
            </div>
          </Card>

          <Card 
            variant="elevated"
            noPadding
            style={{ cursor: 'pointer' }}
            onClick={() => copyToClipboard('var(--color-primary-disabled)')}
          >
            <div style={{ 
              height: '120px', 
              backgroundColor: 'var(--color-primary-disabled)'
            }} />
            <div style={{ padding: 'var(--space-4)' }}>
              <h4 style={{ 
                fontSize: 'var(--font-size-6xs)', 
                fontWeight: 'var(--font-weight-semi-bold)',
                margin: '0 0 var(--space-1) 0',
                color: 'var(--color-on-surface-default)'
              }}>
                Primary Disabled
              </h4>
              <p style={{ 
                fontSize: 'var(--font-size-8xs)', 
                color: 'var(--color-on-surface-subtle)',
                margin: 0,
                fontFamily: 'monospace'
              }}>
                hsl(160, 94%, 88%)
              </p>
            </div>
          </Card>
        </div>
      </div>

      {/* Secondary Colors */}
      <div className="color-category">
        <h3 className="color-category__title">Secondary (Golden Yellow)</h3>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', 
          gap: 'var(--space-4)' 
        }}>
          <Card 
            variant="elevated"
            noPadding
            style={{ cursor: 'pointer' }}
            onClick={() => copyToClipboard('var(--color-secondary)')}
          >
            <div style={{ 
              height: '120px', 
              backgroundColor: 'var(--color-secondary)'
            }} />
            <div style={{ padding: 'var(--space-4)' }}>
              <h4 style={{ 
                fontSize: 'var(--font-size-6xs)', 
                fontWeight: 'var(--font-weight-semi-bold)',
                margin: '0 0 var(--space-1) 0',
                color: 'var(--color-on-surface-default)'
              }}>
                Secondary ⭐
              </h4>
              <p style={{ 
                fontSize: 'var(--font-size-8xs)', 
                color: 'var(--color-on-surface-subtle)',
                margin: 0,
                fontFamily: 'monospace'
              }}>
                hsl(45, 88%, 50%)
              </p>
            </div>
          </Card>

          <Card 
            variant="elevated"
            noPadding
            style={{ cursor: 'pointer' }}
            onClick={() => copyToClipboard('var(--color-secondary-hover)')}
          >
            <div style={{ 
              height: '120px', 
              backgroundColor: 'var(--color-secondary-hover)'
            }} />
            <div style={{ padding: 'var(--space-4)' }}>
              <h4 style={{ 
                fontSize: 'var(--font-size-6xs)', 
                fontWeight: 'var(--font-weight-semi-bold)',
                margin: '0 0 var(--space-1) 0',
                color: 'var(--color-on-surface-default)'
              }}>
                Secondary Hover
              </h4>
              <p style={{ 
                fontSize: 'var(--font-size-8xs)', 
                color: 'var(--color-on-surface-subtle)',
                margin: 0,
                fontFamily: 'monospace'
              }}>
                hsl(45, 88%, 40%)
              </p>
            </div>
          </Card>

          <Card 
            variant="elevated"
            noPadding
            style={{ cursor: 'pointer' }}
            onClick={() => copyToClipboard('var(--color-secondary-active)')}
          >
            <div style={{ 
              height: '120px', 
              backgroundColor: 'var(--color-secondary-active)'
            }} />
            <div style={{ padding: 'var(--space-4)' }}>
              <h4 style={{ 
                fontSize: 'var(--font-size-6xs)', 
                fontWeight: 'var(--font-weight-semi-bold)',
                margin: '0 0 var(--space-1) 0',
                color: 'var(--color-on-surface-default)'
              }}>
                Secondary Active
              </h4>
              <p style={{ 
                fontSize: 'var(--font-size-8xs)', 
                color: 'var(--color-on-surface-subtle)',
                margin: 0,
                fontFamily: 'monospace'
              }}>
                hsl(45, 88%, 38%)
              </p>
            </div>
          </Card>

          <Card 
            variant="elevated"
            noPadding
            style={{ cursor: 'pointer' }}
            onClick={() => copyToClipboard('var(--color-secondary-pressed)')}
          >
            <div style={{ 
              height: '120px', 
              backgroundColor: 'var(--color-secondary-pressed)'
            }} />
            <div style={{ padding: 'var(--space-4)' }}>
              <h4 style={{ 
                fontSize: 'var(--font-size-6xs)', 
                fontWeight: 'var(--font-weight-semi-bold)',
                margin: '0 0 var(--space-1) 0',
                color: 'var(--color-on-surface-default)'
              }}>
                Secondary Pressed
              </h4>
              <p style={{ 
                fontSize: 'var(--font-size-8xs)', 
                color: 'var(--color-on-surface-subtle)',
                margin: 0,
                fontFamily: 'monospace'
              }}>
                hsl(45, 88%, 30%)
              </p>
            </div>
          </Card>

          <Card 
            variant="elevated"
            noPadding
            style={{ cursor: 'pointer' }}
            onClick={() => copyToClipboard('var(--color-secondary-disabled)')}
          >
            <div style={{ 
              height: '120px', 
              backgroundColor: 'var(--color-secondary-disabled)'
            }} />
            <div style={{ padding: 'var(--space-4)' }}>
              <h4 style={{ 
                fontSize: 'var(--font-size-6xs)', 
                fontWeight: 'var(--font-weight-semi-bold)',
                margin: '0 0 var(--space-1) 0',
                color: 'var(--color-on-surface-default)'
              }}>
                Secondary Disabled
              </h4>
              <p style={{ 
                fontSize: 'var(--font-size-8xs)', 
                color: 'var(--color-on-surface-subtle)',
                margin: 0,
                fontFamily: 'monospace'
              }}>
                hsl(45, 88%, 88%)
              </p>
            </div>
          </Card>
        </div>
      </div>

      {/* Tertiary Colors */}
      <div className="color-category">
        <h3 className="color-category__title">Tertiary (Coral Red)</h3>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', 
          gap: 'var(--space-4)' 
        }}>
          <Card 
            variant="elevated"
            noPadding
            style={{ cursor: 'pointer' }}
            onClick={() => copyToClipboard('var(--color-tertiary)')}
          >
            <div style={{ 
              height: '120px', 
              backgroundColor: 'var(--color-tertiary)'
            }} />
            <div style={{ padding: 'var(--space-4)' }}>
              <h4 style={{ 
                fontSize: 'var(--font-size-6xs)', 
                fontWeight: 'var(--font-weight-semi-bold)',
                margin: '0 0 var(--space-1) 0',
                color: 'var(--color-on-surface-default)'
              }}>
                Tertiary ⭐
              </h4>
              <p style={{ 
                fontSize: 'var(--font-size-8xs)', 
                color: 'var(--color-on-surface-subtle)',
                margin: 0,
                fontFamily: 'monospace'
              }}>
                hsl(12, 88%, 50%)
              </p>
            </div>
          </Card>

          <Card 
            variant="elevated"
            noPadding
            style={{ cursor: 'pointer' }}
            onClick={() => copyToClipboard('var(--color-tertiary-hover)')}
          >
            <div style={{ 
              height: '120px', 
              backgroundColor: 'var(--color-tertiary-hover)'
            }} />
            <div style={{ padding: 'var(--space-4)' }}>
              <h4 style={{ 
                fontSize: 'var(--font-size-6xs)', 
                fontWeight: 'var(--font-weight-semi-bold)',
                margin: '0 0 var(--space-1) 0',
                color: 'var(--color-on-surface-default)'
              }}>
                Tertiary Hover
              </h4>
              <p style={{ 
                fontSize: 'var(--font-size-8xs)', 
                color: 'var(--color-on-surface-subtle)',
                margin: 0,
                fontFamily: 'monospace'
              }}>
                hsl(12, 88%, 45%)
              </p>
            </div>
          </Card>

          <Card 
            variant="elevated"
            noPadding
            style={{ cursor: 'pointer' }}
            onClick={() => copyToClipboard('var(--color-tertiary-active)')}
          >
            <div style={{ 
              height: '120px', 
              backgroundColor: 'var(--color-tertiary-active)'
            }} />
            <div style={{ padding: 'var(--space-4)' }}>
              <h4 style={{ 
                fontSize: 'var(--font-size-6xs)', 
                fontWeight: 'var(--font-weight-semi-bold)',
                margin: '0 0 var(--space-1) 0',
                color: 'var(--color-on-surface-default)'
              }}>
                Tertiary Active
              </h4>
              <p style={{ 
                fontSize: 'var(--font-size-8xs)', 
                color: 'var(--color-on-surface-subtle)',
                margin: 0,
                fontFamily: 'monospace'
              }}>
                hsl(12, 88%, 38%)
              </p>
            </div>
          </Card>

          <Card 
            variant="elevated"
            noPadding
            style={{ cursor: 'pointer' }}
            onClick={() => copyToClipboard('var(--color-tertiary-pressed)')}
          >
            <div style={{ 
              height: '120px', 
              backgroundColor: 'var(--color-tertiary-pressed)'
            }} />
            <div style={{ padding: 'var(--space-4)' }}>
              <h4 style={{ 
                fontSize: 'var(--font-size-6xs)', 
                fontWeight: 'var(--font-weight-semi-bold)',
                margin: '0 0 var(--space-1) 0',
                color: 'var(--color-on-surface-default)'
              }}>
                Tertiary Pressed
              </h4>
              <p style={{ 
                fontSize: 'var(--font-size-8xs)', 
                color: 'var(--color-on-surface-subtle)',
                margin: 0,
                fontFamily: 'monospace'
              }}>
                hsl(12, 88%, 20%)
              </p>
            </div>
          </Card>

          <Card 
            variant="elevated"
            noPadding
            style={{ cursor: 'pointer' }}
            onClick={() => copyToClipboard('var(--color-tertiary-disabled)')}
          >
            <div style={{ 
              height: '120px', 
              backgroundColor: 'var(--color-tertiary-disabled)'
            }} />
            <div style={{ padding: 'var(--space-4)' }}>
              <h4 style={{ 
                fontSize: 'var(--font-size-6xs)', 
                fontWeight: 'var(--font-weight-semi-bold)',
                margin: '0 0 var(--space-1) 0',
                color: 'var(--color-on-surface-default)'
              }}>
                Tertiary Disabled
              </h4>
              <p style={{ 
                fontSize: 'var(--font-size-8xs)', 
                color: 'var(--color-on-surface-subtle)',
                margin: 0,
                fontFamily: 'monospace'
              }}>
                hsl(12, 88%, 88%)
              </p>
            </div>
          </Card>
        </div>
      </div>

      <Divider style={{ margin: 'var(--space-10) 0' }} />

      {/* On-Surface Colors */}
      <h2 className="styleguide-section__title">Text on Brand Colors</h2>
      <p className="styleguide-section__description">Text colors when used on brand color backgrounds</p>
      
      <div className="color-category">
        <h3 className="color-category__title">On-Surface Brand Colors</h3>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', 
          gap: 'var(--space-4)' 
        }}>
          <Card 
            variant="elevated"
            noPadding
            style={{ cursor: 'pointer' }}
            onClick={() => copyToClipboard('var(--color-on-surface-primary)')}
          >
            <div style={{ 
              height: '120px', 
              backgroundColor: 'var(--color-on-surface-primary)'
            }} />
            <div style={{ padding: 'var(--space-4)' }}>
              <h4 style={{ 
                fontSize: 'var(--font-size-6xs)', 
                fontWeight: 'var(--font-weight-semi-bold)',
                margin: '0 0 var(--space-1) 0',
                color: 'var(--color-on-surface-default)'
              }}>
                On Surface Primary
              </h4>
              <p style={{ 
                fontSize: 'var(--font-size-8xs)', 
                color: 'var(--color-on-surface-subtle)',
                margin: 0,
                fontFamily: 'monospace'
              }}>
                hsl(160, 94%, 30%)
              </p>
            </div>
          </Card>

          <Card 
            variant="elevated"
            noPadding
            style={{ cursor: 'pointer' }}
            onClick={() => copyToClipboard('var(--color-on-surface-secondary)')}
          >
            <div style={{ 
              height: '120px', 
              backgroundColor: 'var(--color-on-surface-secondary)'
            }} />
            <div style={{ padding: 'var(--space-4)' }}>
              <h4 style={{ 
                fontSize: 'var(--font-size-6xs)', 
                fontWeight: 'var(--font-weight-semi-bold)',
                margin: '0 0 var(--space-1) 0',
                color: 'var(--color-on-surface-default)'
              }}>
                On Surface Secondary
              </h4>
              <p style={{ 
                fontSize: 'var(--font-size-8xs)', 
                color: 'var(--color-on-surface-subtle)',
                margin: 0,
                fontFamily: 'monospace'
              }}>
                hsl(45, 88%, 38%)
              </p>
            </div>
          </Card>

          <Card 
            variant="elevated"
            noPadding
            style={{ cursor: 'pointer' }}
            onClick={() => copyToClipboard('var(--color-on-surface-tertiary)')}
          >
            <div style={{ 
              height: '120px', 
              backgroundColor: 'var(--color-on-surface-tertiary)'
            }} />
            <div style={{ padding: 'var(--space-4)' }}>
              <h4 style={{ 
                fontSize: 'var(--font-size-6xs)', 
                fontWeight: 'var(--font-weight-semi-bold)',
                margin: '0 0 var(--space-1) 0',
                color: 'var(--color-on-surface-default)'
              }}>
                On Surface Tertiary
              </h4>
              <p style={{ 
                fontSize: 'var(--font-size-8xs)', 
                color: 'var(--color-on-surface-subtle)',
                margin: 0,
                fontFamily: 'monospace'
              }}>
                hsl(12, 88%, 45%)
              </p>
            </div>
          </Card>
        </div>
      </div>

      <div className="color-category">
        <h3 className="color-category__title">Text on Brand Backgrounds</h3>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', 
          gap: 'var(--space-4)' 
        }}>
          <Card 
            variant="elevated"
            noPadding
            style={{ cursor: 'pointer' }}
            onClick={() => copyToClipboard('var(--color-on-primary)')}
          >
            <div style={{ 
              height: '120px', 
              backgroundColor: 'var(--color-on-primary)'
            }} />
            <div style={{ padding: 'var(--space-4)' }}>
              <h4 style={{ 
                fontSize: 'var(--font-size-6xs)', 
                fontWeight: 'var(--font-weight-semi-bold)',
                margin: '0 0 var(--space-1) 0',
                color: 'var(--color-on-surface-default)'
              }}>
                On Primary
              </h4>
              <p style={{ 
                fontSize: 'var(--font-size-8xs)', 
                color: 'var(--color-on-surface-subtle)',
                margin: 0,
                fontFamily: 'monospace'
              }}>
                hsl(215, 16%, 100%)
              </p>
            </div>
          </Card>

          <Card 
            variant="elevated"
            noPadding
            style={{ cursor: 'pointer' }}
            onClick={() => copyToClipboard('var(--color-on-secondary)')}
          >
            <div style={{ 
              height: '120px', 
              backgroundColor: 'var(--color-on-secondary)'
            }} />
            <div style={{ padding: 'var(--space-4)' }}>
              <h4 style={{ 
                fontSize: 'var(--font-size-6xs)', 
                fontWeight: 'var(--font-weight-semi-bold)',
                margin: '0 0 var(--space-1) 0',
                color: 'var(--color-on-surface-default)'
              }}>
                On Secondary
              </h4>
              <p style={{ 
                fontSize: 'var(--font-size-8xs)', 
                color: 'var(--color-on-surface-subtle)',
                margin: 0,
                fontFamily: 'monospace'
              }}>
                hsl(45, 88%, 12%)
              </p>
            </div>
          </Card>

          <Card 
            variant="elevated"
            noPadding
            style={{ cursor: 'pointer' }}
            onClick={() => copyToClipboard('var(--color-on-tertiary)')}
          >
            <div style={{ 
              height: '120px', 
              backgroundColor: 'var(--color-on-tertiary)'
            }} />
            <div style={{ padding: 'var(--space-4)' }}>
              <h4 style={{ 
                fontSize: 'var(--font-size-6xs)', 
                fontWeight: 'var(--font-weight-semi-bold)',
                margin: '0 0 var(--space-1) 0',
                color: 'var(--color-on-surface-default)'
              }}>
                On Tertiary
              </h4>
              <p style={{ 
                fontSize: 'var(--font-size-8xs)', 
                color: 'var(--color-on-surface-subtle)',
                margin: 0,
                fontFamily: 'monospace'
              }}>
                hsl(215, 16%, 100%)
              </p>
            </div>
          </Card>
        </div>
      </div>

      <Divider style={{ margin: 'var(--space-10) 0' }} />

      {/* Neutral Colors */}
      <h2 className="styleguide-section__title">Neutral Colors</h2>
      <p className="styleguide-section__description">Grayscale palette for UI elements and text</p>
      
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
                  height: '100px', 
                  backgroundColor: `var(--color-neutral-${shade})`,
                  border: shade === 0 ? '1px solid var(--color-border-default)' : 'none'
                }}
              />
              <div style={{ padding: 'var(--space-3)' }}>
                <p style={{ 
                  fontSize: 'var(--font-size-6xs)', 
                  fontWeight: 'var(--font-weight-semi-bold)',
                  margin: 0,
                  color: 'var(--color-on-surface-default)'
                }}>
                  Neutral {shade}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <Divider style={{ margin: 'var(--space-10) 0' }} />

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
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', 
            gap: 'var(--space-3)' 
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
                    height: '80px', 
                    backgroundColor: `var(--color-feedback-${family}-${shade})`
                  }}
                />
                <div style={{ padding: 'var(--space-2)' }}>
                  <p style={{ 
                    fontSize: 'var(--font-size-8xs)', 
                    fontWeight: 'var(--font-weight-semi-bold)',
                    margin: 0,
                    color: 'var(--color-on-surface-default)',
                    textAlign: 'center'
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