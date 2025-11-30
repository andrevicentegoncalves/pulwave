import React from 'react';

export default function Buttons() {
  return (
    <div className="component-category">
      <h3 className="component-category__title">Buttons</h3>
      
      <h4 style={{ 
        marginTop: 'var(--space-6)', 
        marginBottom: 'var(--space-3)',
        fontSize: 'var(--font-size-5xs)',
        fontWeight: 'var(--font-weight-semi-bold)',
        color: 'var(--color-on-surface-default)'
      }}>Button Sizes</h4>
      <div className="component-demo" style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center', flexWrap: 'wrap' }}>
        <button className="btn btn--primary btn--s">Small</button>
        <button className="btn btn--primary">Medium</button>
        <button className="btn btn--primary btn--l">Large</button>
      </div>

      <h4 style={{ 
        marginTop: 'var(--space-6)', 
        marginBottom: 'var(--space-3)',
        fontSize: 'var(--font-size-5xs)',
        fontWeight: 'var(--font-weight-semi-bold)',
        color: 'var(--color-on-surface-default)'
      }}>Button States - Primary</h4>
      <div className="component-demo" style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
        <button className="btn btn--primary">Enabled</button>
        <button className="btn btn--primary" disabled>Disabled</button>
      </div>

      <h4 style={{ 
        marginTop: 'var(--space-6)', 
        marginBottom: 'var(--space-3)',
        fontSize: 'var(--font-size-5xs)',
        fontWeight: 'var(--font-weight-semi-bold)',
        color: 'var(--color-on-surface-default)'
      }}>Button States - Secondary</h4>
      <div className="component-demo" style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
        <button className="btn btn--secondary">Enabled</button>
        <button className="btn btn--secondary" disabled>Disabled</button>
      </div>

      <h4 style={{ 
        marginTop: 'var(--space-6)', 
        marginBottom: 'var(--space-3)',
        fontSize: 'var(--font-size-5xs)',
        fontWeight: 'var(--font-weight-semi-bold)',
        color: 'var(--color-on-surface-default)'
      }}>Button States - Tertiary</h4>
      <div className="component-demo" style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
        <button className="btn btn--tertiary">Enabled</button>
        <button className="btn btn--tertiary" disabled>Disabled</button>
      </div>

      <h4 style={{ 
        marginTop: 'var(--space-6)', 
        marginBottom: 'var(--space-3)',
        fontSize: 'var(--font-size-5xs)',
        fontWeight: 'var(--font-weight-semi-bold)',
        color: 'var(--color-on-surface-default)'
      }}>Button States - Destructive</h4>
      <div className="component-demo" style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
        <button className="btn btn--destructive">Enabled</button>
        <button className="btn btn--destructive" disabled>Disabled</button>
      </div>

      <h4 style={{ 
        marginTop: 'var(--space-6)', 
        marginBottom: 'var(--space-3)',
        fontSize: 'var(--font-size-5xs)',
        fontWeight: 'var(--font-weight-semi-bold)',
        color: 'var(--color-on-surface-default)'
      }}>Button States - Ghost</h4>
      <div className="component-demo" style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
        <button className="btn btn--ghost">Enabled</button>
        <button className="btn btn--ghost" disabled>Disabled</button>
      </div>
    </div>
  );
}