import React from 'react';
import { Alert } from '../../../../../components/ui';

export default function Alerts({ triggerAlert }) {
  return (
    <div className="component-category">
      <h4 className="demo-subsection-title demo-subsection-title--first">Alerts</h4>
      <div className="demo-flex-col">
        <Alert type="info" variant="modal">
          <strong>Information</strong>
          This is an informational alert message that appears on a new line.
        </Alert>

        <Alert type="success" variant="modal">
          <strong>Success</strong>
          Operation completed successfully. Your changes have been saved.
        </Alert>

        <Alert type="warning" variant="modal">
          <strong>Warning</strong>
          Please review this important warning before proceeding.
        </Alert>

        <Alert type="error" variant="modal">
          <strong>Error</strong>
          An error occurred. Please try again or contact support.
        </Alert>
      </div>


      <h4 className="demo-subsection-title">Toast Alerts (click to trigger, dismissible)</h4>
      <p className="alert-demo__description">
        Toast alerts appear at the top of the screen with consistent border width and auto-dismiss after a few seconds.
      </p>
      <div className="component-demo demo-flex-row">
        <button
          className="btn btn--primary"
          onClick={() => triggerAlert('info', 'Information', 'This is a triggered info alert with new line layout.')}
        >
          Trigger Info
        </button>

        <button
          className="btn btn--primary alert-demo__btn-success"
          onClick={() => triggerAlert('success', 'Success!', 'Operation completed successfully.')}
        >
          Trigger Success
        </button>

        <button
          className="btn btn--primary alert-demo__btn-warning"
          onClick={() => triggerAlert('warning', 'Warning', 'Please be aware of this warning.')}
        >
          Trigger Warning
        </button>

        <button
          className="btn btn--destructive"
          onClick={() => triggerAlert('error', 'Error', 'An error has occurred. Please try again.')}
        >
          Trigger Error
        </button>
      </div>
    </div>
  );
}
