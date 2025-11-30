import React from 'react';
import { Badge } from '../../../../components/ui';

export default function Badges() {
  return (
    <div className="component-category">
      <h3 className="component-category__title">Badges</h3>
      
      {/* SIZE VARIANTS */}
      <h4 style={{ 
        marginTop: 'var(--space-6)', 
        marginBottom: 'var(--space-3)',
        fontSize: 'var(--font-size-5xs)',
        fontWeight: 'var(--font-weight-semi-bold)',
        color: 'var(--color-on-surface-default)'
      }}>Badge Sizes</h4>
      <div className="component-demo" style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center', flexWrap: 'wrap' }}>
        <Badge variant="heavy" type="info" size="s">Small Badge</Badge>
        <Badge variant="heavy" type="info" size="m">Medium Badge</Badge>
        <Badge variant="heavy" type="info" size="l">Large Badge</Badge>
      </div>

      {/* HEAVY VARIANTS */}
      <h4 style={{ 
        marginTop: 'var(--space-8)', 
        marginBottom: 'var(--space-3)',
        fontSize: 'var(--font-size-5xs)',
        fontWeight: 'var(--font-weight-semi-bold)',
        color: 'var(--color-on-surface-default)'
      }}>Badge Variants - Heavy</h4>
      
      <div style={{ marginBottom: 'var(--space-4)' }}>
        <p style={{ 
          fontSize: 'var(--font-size-body-s)', 
          color: 'var(--color-on-surface-subtle)',
          marginBottom: 'var(--space-2)'
        }}>Small (S)</p>
        <div className="component-demo" style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
          <Badge variant="heavy" type="info" size="s">Info</Badge>
          <Badge variant="heavy" type="success" size="s">Success</Badge>
          <Badge variant="heavy" type="warning" size="s">Warning</Badge>
          <Badge variant="heavy" type="error" size="s">Error</Badge>
          <Badge variant="heavy" type="neutral" size="s">Neutral</Badge>
        </div>
      </div>

      <div style={{ marginBottom: 'var(--space-4)' }}>
        <p style={{ 
          fontSize: 'var(--font-size-body-s)', 
          color: 'var(--color-on-surface-subtle)',
          marginBottom: 'var(--space-2)'
        }}>Medium (M) - Default</p>
        <div className="component-demo" style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
          <Badge variant="heavy" type="info">Info Badge</Badge>
          <Badge variant="heavy" type="success">Success Badge</Badge>
          <Badge variant="heavy" type="warning">Warning Badge</Badge>
          <Badge variant="heavy" type="error">Error Badge</Badge>
          <Badge variant="heavy" type="neutral">Neutral Badge</Badge>
        </div>
      </div>

      <div style={{ marginBottom: 'var(--space-4)' }}>
        <p style={{ 
          fontSize: 'var(--font-size-body-s)', 
          color: 'var(--color-on-surface-subtle)',
          marginBottom: 'var(--space-2)'
        }}>Large (L)</p>
        <div className="component-demo" style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
          <Badge variant="heavy" type="info" size="l">Info Badge</Badge>
          <Badge variant="heavy" type="success" size="l">Success Badge</Badge>
          <Badge variant="heavy" type="warning" size="l">Warning Badge</Badge>
          <Badge variant="heavy" type="error" size="l">Error Badge</Badge>
          <Badge variant="heavy" type="neutral" size="l">Neutral Badge</Badge>
        </div>
      </div>

      {/* MEDIUM VARIANTS */}
      <h4 style={{ 
        marginTop: 'var(--space-8)', 
        marginBottom: 'var(--space-3)',
        fontSize: 'var(--font-size-5xs)',
        fontWeight: 'var(--font-weight-semi-bold)',
        color: 'var(--color-on-surface-default)'
      }}>Badge Variants - Medium</h4>
      <div className="component-demo" style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
        <Badge variant="medium" type="info" size="s">Small</Badge>
        <Badge variant="medium" type="info">Medium</Badge>
        <Badge variant="medium" type="info" size="l">Large</Badge>
      </div>
      <div className="component-demo" style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap', marginTop: 'var(--space-3)' }}>
        <Badge variant="medium" type="success">Success Badge</Badge>
        <Badge variant="medium" type="warning">Warning Badge</Badge>
        <Badge variant="medium" type="error">Error Badge</Badge>
        <Badge variant="medium" type="neutral">Neutral Badge</Badge>
      </div>

      {/* LIGHT VARIANTS */}
      <h4 style={{ 
        marginTop: 'var(--space-8)', 
        marginBottom: 'var(--space-3)',
        fontSize: 'var(--font-size-5xs)',
        fontWeight: 'var(--font-weight-semi-bold)',
        color: 'var(--color-on-surface-default)'
      }}>Badge Variants - Light</h4>
      <div className="component-demo" style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
        <Badge variant="light" type="info" size="s">Small</Badge>
        <Badge variant="light" type="info">Medium</Badge>
        <Badge variant="light" type="info" size="l">Large</Badge>
      </div>
      <div className="component-demo" style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap', marginTop: 'var(--space-3)' }}>
        <Badge variant="light" type="success">Success Badge</Badge>
        <Badge variant="light" type="warning">Warning Badge</Badge>
        <Badge variant="light" type="error">Error Badge</Badge>
        <Badge variant="light" type="neutral">Neutral Badge</Badge>
      </div>

      {/* INTERACTIVE BADGES */}
      <h4 style={{ 
        marginTop: 'var(--space-8)', 
        marginBottom: 'var(--space-3)',
        fontSize: 'var(--font-size-5xs)',
        fontWeight: 'var(--font-weight-semi-bold)',
        color: 'var(--color-on-surface-default)'
      }}>Interactive Badges</h4>
      <div className="component-demo" style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
        <Badge 
          variant="heavy" 
          type="info"
          onClick={() => alert('Badge clicked!')}
        >
          Clickable
        </Badge>
        <Badge 
          variant="medium" 
          type="success"
          removable
          onRemove={() => alert('Remove clicked!')}
        >
          Removable
        </Badge>
        <Badge 
          variant="light" 
          type="warning"
          icon={
            <svg viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 2a6 6 0 100 12A6 6 0 008 2zM7 5a1 1 0 112 0v3a1 1 0 11-2 0V5zm1 7a1 1 0 100-2 1 1 0 000 2z"/>
            </svg>
          }
        >
          With Icon
        </Badge>
      </div>
    </div>
  );
}