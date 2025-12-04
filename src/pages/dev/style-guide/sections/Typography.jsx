import React from 'react';

export default function Typography() {
  return (
    <section className="styleguide-section">
      <h2 className="styleguide-section__title">Typography System</h2>
      <p className="styleguide-section__description">Responsive font sizes with semantic naming</p>
      
      {/* Display Sizes */}
      <div className="color-category">
        <h3 className="color-category__title">Display</h3>
        <p style={{ 
          fontSize: 'var(--font-size-7xs)', 
          color: 'var(--color-on-surface-subtle)',
          marginBottom: 'var(--space-4)'
        }}>
          Large hero and landing page headlines
        </p>
        <div className="typography-samples">
          {[
            { size: '3xl', sample: 'Display 3XL' },
            { size: '2xl', sample: 'Display 2XL - Hero headlines' },
            { size: 'xl', sample: 'Display XL - Landing page titles' },
            { size: 'l', sample: 'Display L - Section heroes and featured content' },
          ].map(({ size, sample }) => (
            <div key={size} className="typography-sample" style={{ 
              fontSize: `var(--font-size-${size})`,
              marginBottom: 'var(--space-6)',
              color: 'var(--color-on-surface-default)'
            }}>
              <div>{sample}</div>
              <p style={{ 
                fontSize: 'var(--font-size-8xs)', 
                color: 'var(--color-on-surface-subtle)',
                marginTop: 'var(--space-2)',
                fontFamily: 'monospace'
              }}>
                var(--font-size-{size})
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Headings */}
      <div className="color-category" style={{ marginTop: 'var(--space-8)' }}>
        <h3 className="color-category__title">Headings</h3>
        <p style={{ 
          fontSize: 'var(--font-size-7xs)', 
          color: 'var(--color-on-surface-subtle)',
          marginBottom: 'var(--space-4)'
        }}>
          Page and section headings
        </p>
        <div className="typography-samples">
          {[
            { size: 'm', sample: 'Heading M - Page titles' },
            { size: 's', sample: 'Heading S - Section headers' },
            { size: 'xs', sample: 'Heading XS - Subsection titles and card headers' },
            { size: '2xs', sample: 'Heading 2XS - Component titles and labels' },
            { size: '3xs', sample: 'Heading 3XS - Small headers and emphasis' },
          ].map(({ size, sample }) => (
            <div key={size} className="typography-sample" style={{ 
              fontSize: `var(--font-size-${size})`,
              marginBottom: 'var(--space-4)',
              color: 'var(--color-on-surface-default)',
              fontWeight: 'var(--font-weight-semi-bold)'
            }}>
              <div>{sample}</div>
              <p style={{ 
                fontSize: 'var(--font-size-8xs)', 
                color: 'var(--color-on-surface-subtle)',
                marginTop: 'var(--space-1)',
                fontFamily: 'monospace',
                fontWeight: 'var(--font-weight-regular)'
              }}>
                var(--font-size-{size})
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Body Text */}
      <div className="color-category" style={{ marginTop: 'var(--space-8)' }}>
        <h3 className="color-category__title">Body</h3>
        <p style={{ 
          fontSize: 'var(--font-size-7xs)', 
          color: 'var(--color-on-surface-subtle)',
          marginBottom: 'var(--space-4)'
        }}>
          Primary content and paragraph text
        </p>
        <div className="typography-samples">
          {[
            { size: '4xs', sample: 'Body 4XS - Large body text for emphasis or introductory paragraphs' },
            { size: '5xs', sample: 'Body 5XS - Standard body text for most content and descriptions' },
            { size: '6xs', sample: 'Body 6XS - Default body text for general use and longer form content' },
            { size: '7xs', sample: 'Body 7XS - Compact body text for dense layouts and secondary content' },
          ].map(({ size, sample }) => (
            <div key={size} className="typography-sample" style={{ 
              fontSize: `var(--font-size-${size})`,
              marginBottom: 'var(--space-4)',
              color: 'var(--color-on-surface-default)',
              lineHeight: 1.6
            }}>
              <div>{sample}</div>
              <p style={{ 
                fontSize: 'var(--font-size-8xs)', 
                color: 'var(--color-on-surface-subtle)',
                marginTop: 'var(--space-1)',
                fontFamily: 'monospace'
              }}>
                var(--font-size-{size})
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Captions */}
      <div className="color-category" style={{ marginTop: 'var(--space-8)' }}>
        <h3 className="color-category__title">Caption</h3>
        <p style={{ 
          fontSize: 'var(--font-size-7xs)', 
          color: 'var(--color-on-surface-subtle)',
          marginBottom: 'var(--space-4)'
        }}>
          Small text for labels, captions, and metadata
        </p>
        <div className="typography-samples">
          {[
            { size: '8xs', sample: 'Caption 8XS - Button labels, form labels, and timestamps' },
            { size: '9xs', sample: 'Caption 9XS - Helper text, metadata, and minimum readable size (WCAG)' },
          ].map(({ size, sample }) => (
            <div key={size} className="typography-sample" style={{ 
              fontSize: `var(--font-size-${size})`,
              marginBottom: 'var(--space-4)',
              color: 'var(--color-on-surface-subtle)'
            }}>
              <div>{sample}</div>
              <p style={{ 
                fontSize: 'var(--font-size-9xs)', 
                color: 'var(--color-on-surface-subtle)',
                marginTop: 'var(--space-1)',
                fontFamily: 'monospace'
              }}>
                var(--font-size-{size})
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Font Weights */}
      <div className="color-category" style={{ marginTop: 'var(--space-10)' }}>
        <h3 className="color-category__title">Font Weights</h3>
        <p style={{ 
          fontSize: 'var(--font-size-7xs)', 
          color: 'var(--color-on-surface-subtle)',
          marginBottom: 'var(--space-4)'
        }}>
          Available weight variations for emphasis
        </p>
        <div className="typography-samples">
          {[
            { weight: 'regular', value: '400', sample: 'Regular (400) - Default body text weight' },
            { weight: 'medium', value: '500', sample: 'Medium (500) - Subtle emphasis and UI elements' },
            { weight: 'semi-bold', value: '600', sample: 'Semi Bold (600) - Headings and important text' },
            { weight: 'bold', value: '700', sample: 'Bold (700) - Strong emphasis and titles' },
          ].map(({ weight, value, sample }) => (
            <div key={weight} className="typography-sample" style={{ 
              fontSize: 'var(--font-size-4xs)', 
              fontWeight: `var(--font-weight-${weight})`,
              marginBottom: 'var(--space-3)',
              color: 'var(--color-on-surface-default)'
            }}>
              <div>{sample}</div>
              <p style={{ 
                fontSize: 'var(--font-size-8xs)', 
                color: 'var(--color-on-surface-subtle)',
                marginTop: 'var(--space-1)',
                fontFamily: 'monospace',
                fontWeight: 'var(--font-weight-regular)'
              }}>
                var(--font-weight-{weight}) = {value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
