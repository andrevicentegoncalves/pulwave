import React from 'react';

export default function Dividers() {
  return (
    <div className="component-category">
      <h3 className="component-category__title">Dividers</h3>

      <div className="divider-demo__container">
        <div>
          <h4 className="divider-demo__section-title">Solid Divider</h4>
          <p className="divider-demo__content-text">
            Content above divider
          </p>

          <div className="divider-demo__line divider-demo__line--solid" />

          <p className="divider-demo__content-text divider-demo__content-text--after">
            Content below divider
          </p>
        </div>

        <div>
          <h4 className="divider-demo__section-title">Dashed Divider</h4>
          <p className="divider-demo__content-text">
            Content above divider
          </p>

          <div className="divider-demo__line divider-demo__line--dashed" />

          <p className="divider-demo__content-text divider-demo__content-text--after">
            Content below divider
          </p>
        </div>

        <div>
          <h4 className="divider-demo__section-title">Dotted Divider</h4>
          <p className="divider-demo__content-text">
            Content above divider
          </p>

          <div className="divider-demo__line divider-demo__line--dotted" />

          <p className="divider-demo__content-text divider-demo__content-text--after">
            Content below divider
          </p>
        </div>
      </div>
    </div>
  );
}
