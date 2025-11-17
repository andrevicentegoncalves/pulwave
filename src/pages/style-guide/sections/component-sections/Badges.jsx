import React from 'react';
import { Badge } from '../../../../components/ui';

export default function Badges() {
  return (
    <div className="component-category">
      <h3 className="component-category__title">Badges</h3>
      
      <h4 style={{ 
        marginTop: 'var(--space-6)', 
        marginBottom: 'var(--space-3)',
        fontSize: 'var(--font-size-5xs)',
        fontWeight: 'var(--font-weight-semi-bold)',
        color: 'var(--color-on-surface-default)'
      }}>Badge Variants - Heavy</h4>
      <div className="component-demo" style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
        <Badge variant="heavy" type="info">Info Badge</Badge>
        <Badge variant="heavy" type="success">Success Badge</Badge>
        <Badge variant="heavy" type="warning">Warning Badge</Badge>
        <Badge variant="heavy" type="error">Error Badge</Badge>
        <Badge variant="heavy" type="neutral">Neutral Badge</Badge>
      </div>

      <h4 style={{ 
        marginTop: 'var(--space-6)', 
        marginBottom: 'var(--space-3)',
        fontSize: 'var(--font-size-5xs)',
        fontWeight: 'var(--font-weight-semi-bold)',
        color: 'var(--color-on-surface-default)'
      }}>Badge Variants - Medium</h4>
      <div className="component-demo" style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
        <Badge variant="medium" type="info">Info Badge</Badge>
        <Badge variant="medium" type="success">Success Badge</Badge>
        <Badge variant="medium" type="warning">Warning Badge</Badge>
        <Badge variant="medium" type="error">Error Badge</Badge>
        <Badge variant="medium" type="neutral">Neutral Badge</Badge>
      </div>

      <h4 style={{ 
        marginTop: 'var(--space-6)', 
        marginBottom: 'var(--space-3)',
        fontSize: 'var(--font-size-5xs)',
        fontWeight: 'var(--font-weight-semi-bold)',
        color: 'var(--color-on-surface-default)'
      }}>Badge Variants - Light</h4>
      <div className="component-demo" style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
        <Badge variant="light" type="info">Info Badge</Badge>
        <Badge variant="light" type="success">Success Badge</Badge>
        <Badge variant="light" type="warning">Warning Badge</Badge>
        <Badge variant="light" type="error">Error Badge</Badge>
        <Badge variant="light" type="neutral">Neutral Badge</Badge>
      </div>
    </div>
  );
}