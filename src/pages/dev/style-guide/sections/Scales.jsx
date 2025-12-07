import React from 'react';

export default function Scales() {
  return (
    <section className="styleguide-section">
      <h2 className="styleguide-section__title">Spacing Scale</h2>
      <p className="styleguide-section__description">Consistent spacing system based on 4px base unit</p>

      <div className="spacing-samples">
        {[1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24].map(size => (
          <div key={size} className="spacing-sample">
            <div className={`spacing-sample__box spacing-sample__box--${size}`} />
            <span className="spacing-sample__value">--space-{size} ({size * 4}px)</span>
          </div>
        ))}
      </div>

      <h3 className="styleguide-section__title styleguide-section__title--subsection">Border Radius</h3>
      <p className="styleguide-section__description">Rounded corner scale for consistent component styling</p>
      <div className="radius-samples">
        {['none', '2xs', 'xs', 's', 'm', 'l', 'xl', '2xl', 'round'].map(size => (
          <div
            key={size}
            className={`radius-sample radius-sample--${size}`}
          >
            <span>{size.toUpperCase()}</span>
          </div>
        ))}
      </div>

      <h3 className="styleguide-section__title styleguide-section__title--subsection">Shadows</h3>
      <p className="styleguide-section__description">Elevation shadows for depth and hierarchy</p>
      <div className="shadow-samples">
        {['xs', 's', 'm', 'l', 'xl'].map(size => (
          <div
            key={size}
            className={`shadow-sample shadow-sample--${size}`}
          >
            <span>{size.toUpperCase()}</span>
          </div>
        ))}
      </div>

      <h3 className="styleguide-section__title styleguide-section__title--subsection">Border Widths</h3>
      <p className="styleguide-section__description">Standard border width scale</p>
      <div className="border-samples">
        {[1, 2, 4].map(width => (
          <div
            key={width}
            className={`border-sample border-sample--${width}`}
          >
            <span>{width}px</span>
          </div>
        ))}
      </div>
    </section>
  );
}
