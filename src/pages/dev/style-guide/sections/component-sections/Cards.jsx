import React from 'react';
import { Card } from '../../../../../components/ui';

export default function Cards() {
  return (
    <div className="component-category">
      <h3 className="component-category__title">Cards</h3>

      <h4 className="demo-subsection-title demo-subsection-title--first">Card Variants</h4>
      <div className="demo-grid">
        <Card variant="default">
          <h4 className="card-demo__card-title">Default Card</h4>
          <p className="card-demo__card-text">
            This is a default card with standard styling and subtle shadow.
          </p>
        </Card>

        <Card variant="elevated">
          <h4 className="card-demo__card-title">Elevated Card</h4>
          <p className="card-demo__card-text">
            This card has additional elevation and shadow with hover effects.
          </p>
        </Card>

        <Card variant="outlined">
          <h4 className="card-demo__card-title">Outlined Card</h4>
          <p className="card-demo__card-text">
            This card has a visible border outline without shadow.
          </p>
        </Card>
      </div>

      <h4 className="demo-subsection-title">Card with Header and Footer</h4>
      <div className="demo-max-width--500">
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
          <p className="card-demo__card-text">
            This card demonstrates the header, body, and footer sections that can be used for structured content layouts.
          </p>
        </Card>
      </div>

      <h4 className="demo-subsection-title">Interactive Card</h4>
      <div className="demo-max-width--300">
        <Card
          variant="elevated"
          onClick={() => alert('Card clicked!')}
          className="card-demo__clickable"
        >
          <h4 className="card-demo__card-title">Clickable Card</h4>
          <p className="card-demo__card-text">
            Click this card to trigger an action. Notice the hover effect.
          </p>
        </Card>
      </div>
    </div>
  );
}
