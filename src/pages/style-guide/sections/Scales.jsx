import React from 'react';

export default function Scales() {
  return (
    <section className="styleguide-section">
      <h2 className="styleguide-section__title">Spacing Scale</h2>
      <p className="styleguide-section__description">Consistent spacing system based on 4px base unit</p>
      
      <div className="spacing-samples">
        {[1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24].map(size => (
          <div key={size} className="spacing-sample">
            <div 
              className="spacing-sample__box" 
              style={{ width: `${size * 4}px`, height: `${size * 4}px`, backgroundColor: 'var(--color-primary)' }}
            />
            <span className="spacing-sample__value">--space-{size} ({size * 4}px)</span>
          </div>
        ))}
      </div>

      <h3 className="styleguide-section__title" style={{ marginTop: 'var(--space-10)' }}>Border Radius</h3>
      <div className="radius-samples">
        {['none', '2xs', 'xs', 's', 'm', 'l', 'xl', '2xl', 'round'].map(size => (
          <div 
            key={size} 
            className="radius-sample" 
            style={{ borderRadius: `var(--border-radius-${size})` }}
          >
            <span>{size.toUpperCase()}</span>
          </div>
        ))}
      </div>

      <h3 className="styleguide-section__title" style={{ marginTop: 'var(--space-10)' }}>Shadows</h3>
      <p className="styleguide-section__description">Elevation shadows for depth and hierarchy</p>
      <div className="shadow-samples">
        {['xs', 's', 'm', 'l', 'xl'].map(size => (
          <div 
            key={size} 
            className="shadow-sample" 
            style={{ boxShadow: `var(--shadow-${size})` }}
          >
            <span>{size.toUpperCase()}</span>
          </div>
        ))}
      </div>
    </section>
  );
}