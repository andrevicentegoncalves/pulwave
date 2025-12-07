import React from 'react';

export default function Buttons() {
  return (
    <div className="component-category">
      <h3 className="component-category__title">Buttons</h3>

      <h4 className="demo-subsection-title demo-subsection-title--first">Button Sizes</h4>
      <div className="component-demo demo-flex-row demo-flex-row--aligned">
        <button className="btn btn--primary btn--s">Small</button>
        <button className="btn btn--primary">Medium</button>
        <button className="btn btn--primary btn--l">Large</button>
      </div>

      <h4 className="demo-subsection-title demo-subsection-title--first">Button States - Primary</h4>
      <div className="component-demo demo-flex-row">
        <button className="btn btn--primary">Enabled</button>
        <button className="btn btn--primary" disabled>Disabled</button>
      </div>

      <h4 className="demo-subsection-title demo-subsection-title--first">Button States - Secondary</h4>
      <div className="component-demo demo-flex-row">
        <button className="btn btn--secondary">Enabled</button>
        <button className="btn btn--secondary" disabled>Disabled</button>
      </div>

      <h4 className="demo-subsection-title demo-subsection-title--first">Button States - Tertiary</h4>
      <div className="component-demo demo-flex-row">
        <button className="btn btn--tertiary">Enabled</button>
        <button className="btn btn--tertiary" disabled>Disabled</button>
      </div>

      <h4 className="demo-subsection-title demo-subsection-title--first">Button States - Destructive</h4>
      <div className="component-demo demo-flex-row">
        <button className="btn btn--destructive">Enabled</button>
        <button className="btn btn--destructive" disabled>Disabled</button>
      </div>

      <h4 className="demo-subsection-title demo-subsection-title--first">Button States - Ghost</h4>
      <div className="component-demo demo-flex-row">
        <button className="btn btn--ghost">Enabled</button>
        <button className="btn btn--ghost" disabled>Disabled</button>
      </div>
    </div>
  );
}
