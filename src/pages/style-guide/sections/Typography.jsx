import React from 'react';

export default function Typography() {
  return (
    <section className="styleguide-section">
      <h2 className="styleguide-section__title">Typography Scale</h2>
      <p className="styleguide-section__description">Responsive font sizes and text styles</p>
      
      <div className="typography-samples">
        <div className="typography-sample" style={{ fontSize: 'var(--font-size-3xl)' }}>
          Display 3XL - The quick brown fox
        </div>
        <div className="typography-sample" style={{ fontSize: 'var(--font-size-2xl)' }}>
          Display 2XL - The quick brown fox jumps
        </div>
        <div className="typography-sample" style={{ fontSize: 'var(--font-size-xl)' }}>
          Display XL - The quick brown fox jumps over
        </div>
        <div className="typography-sample" style={{ fontSize: 'var(--font-size-l)' }}>
          Display L - The quick brown fox jumps over the lazy
        </div>
        <div className="typography-sample" style={{ fontSize: 'var(--font-size-m)' }}>
          Heading M - The quick brown fox jumps over the lazy dog
        </div>
        <div className="typography-sample" style={{ fontSize: 'var(--font-size-s)' }}>
          Heading S - The quick brown fox jumps over the lazy dog
        </div>
        <div className="typography-sample" style={{ fontSize: 'var(--font-size-xs)' }}>
          Body XS - The quick brown fox jumps over the lazy dog and continues running
        </div>
        <div className="typography-sample" style={{ fontSize: 'var(--font-size-2xs)' }}>
          Body 2XS - The quick brown fox jumps over the lazy dog and continues running through the forest
        </div>
      </div>
    </section>
  );
}