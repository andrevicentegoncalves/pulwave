
import React from 'react';

export default function Surfaces() {
  return (
    <section className="styleguide-section">
      <h2 className="styleguide-section__title">Surface Elevation System</h2>
      <p className="styleguide-section__description">Layered surfaces for visual hierarchy and depth</p>
      
      <div className="surface-grid">
        <div className="surface-item" style={{ backgroundColor: 'var(--color-surface-default)' }}>
          <span className="surface-item__label">Default</span>
          <p className="surface-item__description">Base application background</p>
        </div>
        <div className="surface-item" style={{ backgroundColor: 'var(--color-surface-subtle)' }}>
          <span className="surface-item__label">Subtle</span>
          <p className="surface-item__description">First elevation - cards and panels</p>
        </div>
        <div className="surface-item" style={{ backgroundColor: 'var(--color-surface-strong)' }}>
          <span className="surface-item__label">Strong</span>
          <p className="surface-item__description">Second elevation - modals</p>
        </div>
        <div className="surface-item" style={{ backgroundColor: 'var(--color-surface-hover)' }}>
          <span className="surface-item__label">Hover</span>
          <p className="surface-item__description">Interactive hover state</p>
        </div>
        <div className="surface-item" style={{ backgroundColor: 'var(--color-surface-pressed)' }}>
          <span className="surface-item__label">Pressed</span>
          <p className="surface-item__description">Active/pressed state</p>
        </div>
        <div className="surface-item" style={{ backgroundColor: 'var(--color-surface-disabled)' }}>
          <span className="surface-item__label">Disabled</span>
          <p className="surface-item__description">Disabled elements background</p>
        </div>
      </div>

      <h3 className="styleguide-section__title" style={{ marginTop: 'var(--space-10)' }}>Inverse Surfaces</h3>
      <p className="styleguide-section__description">High contrast inverse surfaces for emphasis</p>
      <div className="surface-grid">
        <div className="surface-item surface-item--dark" style={{ backgroundColor: 'var(--color-surface-inverse-default)' }}>
          <span className="surface-item__label">Inverse Default</span>
          <p className="surface-item__description">High contrast inverted surface</p>
        </div>
        <div className="surface-item surface-item--dark" style={{ backgroundColor: 'var(--color-surface-inverse-subtle)' }}>
          <span className="surface-item__label">Inverse Subtle</span>
          <p className="surface-item__description">Subtle inverse variant</p>
        </div>
        <div className="surface-item surface-item--dark" style={{ backgroundColor: 'var(--color-surface-inverse-hover)' }}>
          <span className="surface-item__label">Inverse Hover</span>
          <p className="surface-item__description">Hover state for inverse</p>
        </div>
      </div>
    </section>
  );
}