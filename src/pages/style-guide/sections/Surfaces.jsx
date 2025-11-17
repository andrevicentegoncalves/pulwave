import React from 'react';
import { Card } from '../../../components/ui';

export default function Surfaces() {
  return (
    <section className="styleguide-section">
      <h2 className="styleguide-section__title">Surface Elevation System</h2>
      <p className="styleguide-section__description">Layered surfaces for visual hierarchy and depth</p>
      
      <div className="color-category">
        <h3 className="color-category__title">Surface Layers</h3>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', 
          gap: 'var(--space-4)' 
        }}>
          <Card 
            variant="elevated"
            noPadding
            style={{ cursor: 'pointer' }}
          >
            <div 
              style={{ 
                height: '120px', 
                backgroundColor: 'var(--color-surface-default)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <span style={{ 
                fontSize: 'var(--font-size-6xs)', 
                fontWeight: 'var(--font-weight-semi-bold)',
                color: 'var(--color-on-surface-default)'
              }}>
                Default
              </span>
            </div>
            <div style={{ padding: 'var(--space-4)' }}>
              <h4 style={{ 
                fontSize: 'var(--font-size-6xs)', 
                fontWeight: 'var(--font-weight-semi-bold)',
                margin: '0 0 var(--space-1) 0',
                color: 'var(--color-on-surface-default)'
              }}>
                Surface Default
              </h4>
              <p style={{ 
                fontSize: 'var(--font-size-8xs)', 
                color: 'var(--color-on-surface-subtle)',
                margin: 0
              }}>
                Base application background
              </p>
            </div>
          </Card>

          <Card 
            variant="elevated"
            noPadding
            style={{ cursor: 'pointer' }}
          >
            <div 
              style={{ 
                height: '120px', 
                backgroundColor: 'var(--color-surface-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <span style={{ 
                fontSize: 'var(--font-size-6xs)', 
                fontWeight: 'var(--font-weight-semi-bold)',
                color: 'var(--color-on-surface-default)'
              }}>
                Subtle
              </span>
            </div>
            <div style={{ padding: 'var(--space-4)' }}>
              <h4 style={{ 
                fontSize: 'var(--font-size-6xs)', 
                fontWeight: 'var(--font-weight-semi-bold)',
                margin: '0 0 var(--space-1) 0',
                color: 'var(--color-on-surface-default)'
              }}>
                Surface Subtle
              </h4>
              <p style={{ 
                fontSize: 'var(--font-size-8xs)', 
                color: 'var(--color-on-surface-subtle)',
                margin: 0
              }}>
                First elevation - cards and panels
              </p>
            </div>
          </Card>

          <Card 
            variant="elevated"
            noPadding
            style={{ cursor: 'pointer' }}
          >
            <div 
              style={{ 
                height: '120px', 
                backgroundColor: 'var(--color-surface-strong)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <span style={{ 
                fontSize: 'var(--font-size-6xs)', 
                fontWeight: 'var(--font-weight-semi-bold)',
                color: 'var(--color-on-surface-default)'
              }}>
                Strong
              </span>
            </div>
            <div style={{ padding: 'var(--space-4)' }}>
              <h4 style={{ 
                fontSize: 'var(--font-size-6xs)', 
                fontWeight: 'var(--font-weight-semi-bold)',
                margin: '0 0 var(--space-1) 0',
                color: 'var(--color-on-surface-default)'
              }}>
                Surface Strong
              </h4>
              <p style={{ 
                fontSize: 'var(--font-size-8xs)', 
                color: 'var(--color-on-surface-subtle)',
                margin: 0
              }}>
                Second elevation - modals
              </p>
            </div>
          </Card>
        </div>
      </div>

      <div className="color-category">
        <h3 className="color-category__title">Interactive States</h3>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', 
          gap: 'var(--space-4)' 
        }}>
          <Card 
            variant="elevated"
            noPadding
            style={{ cursor: 'pointer' }}
          >
            <div 
              style={{ 
                height: '120px', 
                backgroundColor: 'var(--color-surface-hover)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <span style={{ 
                fontSize: 'var(--font-size-6xs)', 
                fontWeight: 'var(--font-weight-semi-bold)',
                color: 'var(--color-on-surface-default)'
              }}>
                Hover
              </span>
            </div>
            <div style={{ padding: 'var(--space-4)' }}>
              <h4 style={{ 
                fontSize: 'var(--font-size-6xs)', 
                fontWeight: 'var(--font-weight-semi-bold)',
                margin: '0 0 var(--space-1) 0',
                color: 'var(--color-on-surface-default)'
              }}>
                Surface Hover
              </h4>
              <p style={{ 
                fontSize: 'var(--font-size-8xs)', 
                color: 'var(--color-on-surface-subtle)',
                margin: 0
              }}>
                Interactive hover state
              </p>
            </div>
          </Card>

          <Card 
            variant="elevated"
            noPadding
            style={{ cursor: 'pointer' }}
          >
            <div 
              style={{ 
                height: '120px', 
                backgroundColor: 'var(--color-surface-pressed)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <span style={{ 
                fontSize: 'var(--font-size-6xs)', 
                fontWeight: 'var(--font-weight-semi-bold)',
                color: 'var(--color-on-surface-default)'
              }}>
                Pressed
              </span>
            </div>
            <div style={{ padding: 'var(--space-4)' }}>
              <h4 style={{ 
                fontSize: 'var(--font-size-6xs)', 
                fontWeight: 'var(--font-weight-semi-bold)',
                margin: '0 0 var(--space-1) 0',
                color: 'var(--color-on-surface-default)'
              }}>
                Surface Pressed
              </h4>
              <p style={{ 
                fontSize: 'var(--font-size-8xs)', 
                color: 'var(--color-on-surface-subtle)',
                margin: 0
              }}>
                Active/pressed state
              </p>
            </div>
          </Card>

          <Card 
            variant="elevated"
            noPadding
            style={{ cursor: 'pointer' }}
          >
            <div 
              style={{ 
                height: '120px', 
                backgroundColor: 'var(--color-surface-disabled)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <span style={{ 
                fontSize: 'var(--font-size-6xs)', 
                fontWeight: 'var(--font-weight-semi-bold)',
                color: 'var(--color-on-surface-disabled)'
              }}>
                Disabled
              </span>
            </div>
            <div style={{ padding: 'var(--space-4)' }}>
              <h4 style={{ 
                fontSize: 'var(--font-size-6xs)', 
                fontWeight: 'var(--font-weight-semi-bold)',
                margin: '0 0 var(--space-1) 0',
                color: 'var(--color-on-surface-default)'
              }}>
                Surface Disabled
              </h4>
              <p style={{ 
                fontSize: 'var(--font-size-8xs)', 
                color: 'var(--color-on-surface-subtle)',
                margin: 0
              }}>
                Disabled elements background
              </p>
            </div>
          </Card>
        </div>
      </div>

      <div className="color-category" style={{ marginTop: 'var(--space-10)' }}>
        <h3 className="color-category__title">Inverse Surfaces</h3>
        <p style={{ 
          fontSize: 'var(--font-size-7xs)', 
          color: 'var(--color-on-surface-subtle)',
          marginBottom: 'var(--space-4)'
        }}>
          High contrast inverse surfaces for emphasis
        </p>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', 
          gap: 'var(--space-4)' 
        }}>
          <Card 
            variant="elevated"
            noPadding
            style={{ cursor: 'pointer' }}
          >
            <div 
              style={{ 
                height: '120px', 
                backgroundColor: 'var(--color-surface-inverse-default)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <span style={{ 
                fontSize: 'var(--font-size-6xs)', 
                fontWeight: 'var(--font-weight-semi-bold)',
                color: 'var(--color-on-surface-inverse-default)'
              }}>
                Inverse Default
              </span>
            </div>
            <div style={{ padding: 'var(--space-4)' }}>
              <h4 style={{ 
                fontSize: 'var(--font-size-6xs)', 
                fontWeight: 'var(--font-weight-semi-bold)',
                margin: '0 0 var(--space-1) 0',
                color: 'var(--color-on-surface-default)'
              }}>
                Surface Inverse Default
              </h4>
              <p style={{ 
                fontSize: 'var(--font-size-8xs)', 
                color: 'var(--color-on-surface-subtle)',
                margin: 0
              }}>
                High contrast inverted surface
              </p>
            </div>
          </Card>

          <Card 
            variant="elevated"
            noPadding
            style={{ cursor: 'pointer' }}
          >
            <div 
              style={{ 
                height: '120px', 
                backgroundColor: 'var(--color-surface-inverse-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <span style={{ 
                fontSize: 'var(--font-size-6xs)', 
                fontWeight: 'var(--font-weight-semi-bold)',
                color: 'var(--color-on-surface-inverse-default)'
              }}>
                Inverse Subtle
              </span>
            </div>
            <div style={{ padding: 'var(--space-4)' }}>
              <h4 style={{ 
                fontSize: 'var(--font-size-6xs)', 
                fontWeight: 'var(--font-weight-semi-bold)',
                margin: '0 0 var(--space-1) 0',
                color: 'var(--color-on-surface-default)'
              }}>
                Surface Inverse Subtle
              </h4>
              <p style={{ 
                fontSize: 'var(--font-size-8xs)', 
                color: 'var(--color-on-surface-subtle)',
                margin: 0
              }}>
                Subtle inverse variant
              </p>
            </div>
          </Card>

          <Card 
            variant="elevated"
            noPadding
            style={{ cursor: 'pointer' }}
          >
            <div 
              style={{ 
                height: '120px', 
                backgroundColor: 'var(--color-surface-inverse-hover)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <span style={{ 
                fontSize: 'var(--font-size-6xs)', 
                fontWeight: 'var(--font-weight-semi-bold)',
                color: 'var(--color-on-surface-inverse-default)'
              }}>
                Inverse Hover
              </span>
            </div>
            <div style={{ padding: 'var(--space-4)' }}>
              <h4 style={{ 
                fontSize: 'var(--font-size-6xs)', 
                fontWeight: 'var(--font-weight-semi-bold)',
                margin: '0 0 var(--space-1) 0',
                color: 'var(--color-on-surface-default)'
              }}>
                Surface Inverse Hover
              </h4>
              <p style={{ 
                fontSize: 'var(--font-size-8xs)', 
                color: 'var(--color-on-surface-subtle)',
                margin: 0
              }}>
                Hover state for inverse surfaces
              </p>
            </div>
          </Card>

          <Card 
            variant="elevated"
            noPadding
            style={{ cursor: 'pointer' }}
          >
            <div 
              style={{ 
                height: '120px', 
                backgroundColor: 'var(--color-surface-inverse-pressed)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <span style={{ 
                fontSize: 'var(--font-size-6xs)', 
                fontWeight: 'var(--font-weight-semi-bold)',
                color: 'var(--color-on-surface-inverse-default)'
              }}>
                Inverse Pressed
              </span>
            </div>
            <div style={{ padding: 'var(--space-4)' }}>
              <h4 style={{ 
                fontSize: 'var(--font-size-6xs)', 
                fontWeight: 'var(--font-weight-semi-bold)',
                margin: '0 0 var(--space-1) 0',
                color: 'var(--color-on-surface-default)'
              }}>
                Surface Inverse Pressed
              </h4>
              <p style={{ 
                fontSize: 'var(--font-size-8xs)', 
                color: 'var(--color-on-surface-subtle)',
                margin: 0
              }}>
                Pressed state for inverse surfaces
              </p>
            </div>
          </Card>
        </div>
      </div>

      <div className="color-category" style={{ marginTop: 'var(--space-10)' }}>
        <h3 className="color-category__title">Text on Surfaces</h3>
        <p style={{ 
          fontSize: 'var(--font-size-7xs)', 
          color: 'var(--color-on-surface-subtle)',
          marginBottom: 'var(--space-4)'
        }}>
          Text color tokens for use on surface backgrounds
        </p>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', 
          gap: 'var(--space-4)' 
        }}>
          <Card 
            variant="elevated"
            noPadding
            style={{ cursor: 'pointer' }}
          >
            <div 
              style={{ 
                height: '120px', 
                backgroundColor: 'var(--color-on-surface-default)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <span style={{ 
                fontSize: 'var(--font-size-6xs)', 
                fontWeight: 'var(--font-weight-semi-bold)',
                color: 'var(--color-surface-default)'
              }}>
                Default Text
              </span>
            </div>
            <div style={{ padding: 'var(--space-4)' }}>
              <h4 style={{ 
                fontSize: 'var(--font-size-6xs)', 
                fontWeight: 'var(--font-weight-semi-bold)',
                margin: '0 0 var(--space-1) 0',
                color: 'var(--color-on-surface-default)'
              }}>
                On Surface Default
              </h4>
              <p style={{ 
                fontSize: 'var(--font-size-8xs)', 
                color: 'var(--color-on-surface-subtle)',
                margin: 0
              }}>
                Primary text on surfaces
              </p>
            </div>
          </Card>

          <Card 
            variant="elevated"
            noPadding
            style={{ cursor: 'pointer' }}
          >
            <div 
              style={{ 
                height: '120px', 
                backgroundColor: 'var(--color-on-surface-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <span style={{ 
                fontSize: 'var(--font-size-6xs)', 
                fontWeight: 'var(--font-weight-semi-bold)',
                color: 'var(--color-surface-default)'
              }}>
                Subtle Text
              </span>
            </div>
            <div style={{ padding: 'var(--space-4)' }}>
              <h4 style={{ 
                fontSize: 'var(--font-size-6xs)', 
                fontWeight: 'var(--font-weight-semi-bold)',
                margin: '0 0 var(--space-1) 0',
                color: 'var(--color-on-surface-default)'
              }}>
                On Surface Subtle
              </h4>
              <p style={{ 
                fontSize: 'var(--font-size-8xs)', 
                color: 'var(--color-on-surface-subtle)',
                margin: 0
              }}>
                Secondary text, captions
              </p>
            </div>
          </Card>

          <Card 
            variant="elevated"
            noPadding
            style={{ cursor: 'pointer' }}
          >
            <div 
              style={{ 
                height: '120px', 
                backgroundColor: 'var(--color-on-surface-disabled)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <span style={{ 
                fontSize: 'var(--font-size-6xs)', 
                fontWeight: 'var(--font-weight-semi-bold)',
                color: 'var(--color-surface-default)'
              }}>
                Disabled Text
              </span>
            </div>
            <div style={{ padding: 'var(--space-4)' }}>
              <h4 style={{ 
                fontSize: 'var(--font-size-6xs)', 
                fontWeight: 'var(--font-weight-semi-bold)',
                margin: '0 0 var(--space-1) 0',
                color: 'var(--color-on-surface-default)'
              }}>
                On Surface Disabled
              </h4>
              <p style={{ 
                fontSize: 'var(--font-size-8xs)', 
                color: 'var(--color-on-surface-subtle)',
                margin: 0
              }}>
                Disabled text state
              </p>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}