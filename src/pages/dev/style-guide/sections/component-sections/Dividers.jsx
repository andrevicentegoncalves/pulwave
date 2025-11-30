import React from 'react';

export default function Dividers() {
  return (
    <div className="component-category">
      <h3 className="component-category__title">Dividers</h3>
      
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: 'var(--space-8)',
        padding: 'var(--space-6)', 
        backgroundColor: 'var(--color-surface-default)', 
        borderRadius: 'var(--border-radius-m)',
        border: '1px solid var(--color-border-default)'
      }}>
        <div>
          <h4 style={{ 
            fontSize: 'var(--font-size-body-s)',
            fontWeight: 'var(--font-weight-semi-bold)',
            color: 'var(--color-on-surface-default)',
            margin: '0 0 var(--space-3) 0'
          }}>Solid Divider</h4>
          <p style={{ margin: '0 0 var(--space-3) 0', fontSize: 'var(--font-size-caption-m)', color: 'var(--color-on-surface-subtle)' }}>
            Content above divider
          </p>
          
          <div style={{
            height: '2px',
            width: '100%',
            backgroundColor: 'var(--color-neutral-300)',
            margin: 'var(--space-4) 0'
          }} />
          
          <p style={{ margin: 'var(--space-3) 0 0 0', fontSize: 'var(--font-size-caption-m)', color: 'var(--color-on-surface-subtle)' }}>
            Content below divider
          </p>
        </div>

        <div>
          <h4 style={{ 
            fontSize: 'var(--font-size-body-s)',
            fontWeight: 'var(--font-weight-semi-bold)',
            color: 'var(--color-on-surface-default)',
            margin: '0 0 var(--space-3) 0'
          }}>Dashed Divider</h4>
          <p style={{ margin: '0 0 var(--space-3) 0', fontSize: 'var(--font-size-caption-m)', color: 'var(--color-on-surface-subtle)' }}>
            Content above divider
          </p>
          
          <div style={{
            height: '0',
            width: '100%',
            borderTop: '2px dashed var(--color-neutral-300)',
            margin: 'var(--space-4) 0'
          }} />
          
          <p style={{ margin: 'var(--space-3) 0 0 0', fontSize: 'var(--font-size-caption-m)', color: 'var(--color-on-surface-subtle)' }}>
            Content below divider
          </p>
        </div>

        <div>
          <h4 style={{ 
            fontSize: 'var(--font-size-body-s)',
            fontWeight: 'var(--font-weight-semi-bold)',
            color: 'var(--color-on-surface-default)',
            margin: '0 0 var(--space-3) 0'
          }}>Dotted Divider</h4>
          <p style={{ margin: '0 0 var(--space-3) 0', fontSize: 'var(--font-size-caption-m)', color: 'var(--color-on-surface-subtle)' }}>
            Content above divider
          </p>
          
          <div style={{
            height: '0',
            width: '100%',
            borderTop: '2px dotted var(--color-neutral-300)',
            margin: 'var(--space-4) 0'
          }} />
          
          <p style={{ margin: 'var(--space-3) 0 0 0', fontSize: 'var(--font-size-caption-m)', color: 'var(--color-on-surface-subtle)' }}>
            Content below divider
          </p>
        </div>
      </div>
    </div>
  );
}