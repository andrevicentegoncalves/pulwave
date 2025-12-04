import React from 'react';
import { Card } from '../../../../../components/ui';

export default function Cards() {
  return (
    <div className="component-category">
      <h3 className="component-category__title">Cards</h3>
      
      <h4 style={{ 
        marginTop: 'var(--space-6)', 
        marginBottom: 'var(--space-3)',
        fontSize: 'var(--font-size-5xs)',
        fontWeight: 'var(--font-weight-semi-bold)',
        color: 'var(--color-on-surface-default)'
      }}>Card Variants</h4>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 'var(--space-4)' }}>
        <Card variant="default">
          <h4 style={{ margin: '0 0 var(--space-2) 0', fontSize: 'var(--font-size-body-s)' }}>Default Card</h4>
          <p style={{ margin: 0, fontSize: 'var(--font-size-caption-m)', color: 'var(--color-on-surface-subtle)' }}>
            This is a default card with standard styling and subtle shadow.
          </p>
        </Card>

        <Card variant="elevated">
          <h4 style={{ margin: '0 0 var(--space-2) 0', fontSize: 'var(--font-size-body-s)' }}>Elevated Card</h4>
          <p style={{ margin: 0, fontSize: 'var(--font-size-caption-m)', color: 'var(--color-on-surface-subtle)' }}>
            This card has additional elevation and shadow with hover effects.
          </p>
        </Card>

        <Card variant="outlined">
          <h4 style={{ margin: '0 0 var(--space-2) 0', fontSize: 'var(--font-size-body-s)' }}>Outlined Card</h4>
          <p style={{ margin: 0, fontSize: 'var(--font-size-caption-m)', color: 'var(--color-on-surface-subtle)' }}>
            This card has a visible border outline without shadow.
          </p>
        </Card>
      </div>

      <h4 style={{ 
        marginTop: 'var(--space-8)', 
        marginBottom: 'var(--space-3)',
        fontSize: 'var(--font-size-5xs)',
        fontWeight: 'var(--font-weight-semi-bold)',
        color: 'var(--color-on-surface-default)'
      }}>Card with Header and Footer</h4>
      <div style={{ maxWidth: '500px' }}>
        <Card 
          variant="elevated"
          header={<span>Card Header</span>}
          footer={
            <>
              <button className="btn btn--secondary btn--s">Cancel</button>
              <button className="btn btn--primary btn--s">Confirm</button>
            </>
          }
        >
          <p style={{ margin: 0 }}>
            This card demonstrates the header, body, and footer sections that can be used for structured content layouts.
          </p>
        </Card>
      </div>

      <h4 style={{ 
        marginTop: 'var(--space-8)', 
        marginBottom: 'var(--space-3)',
        fontSize: 'var(--font-size-5xs)',
        fontWeight: 'var(--font-weight-semi-bold)',
        color: 'var(--color-on-surface-default)'
      }}>Interactive Card</h4>
      <div style={{ maxWidth: '300px' }}>
        <Card 
          variant="elevated"
          onClick={() => alert('Card clicked!')}
          style={{ cursor: 'pointer' }}
        >
          <h4 style={{ margin: '0 0 var(--space-2) 0', fontSize: 'var(--font-size-body-s)' }}>Clickable Card</h4>
          <p style={{ margin: 0, fontSize: 'var(--font-size-caption-m)', color: 'var(--color-on-surface-subtle)' }}>
            Click this card to trigger an action. Notice the hover effect.
          </p>
        </Card>
      </div>
    </div>
  );
}
