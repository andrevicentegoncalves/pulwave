import React from 'react';
import { Alert } from '../../../../components/ui';

export default function Alerts({ triggerAlert }) {
  return (
    <div className="component-category">      
      <h4 style={{ 
        marginTop: 'var(--space-6)', 
        marginBottom: 'var(--space-3)',
        fontSize: 'var(--font-size-5xs)',
        fontWeight: 'var(--font-weight-semi-bold)',
        color: 'var(--color-on-surface-default)'
      }}>Alerts</h4>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
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


      <h4 style={{ 
        marginTop: 'var(--space-8)', 
        marginBottom: 'var(--space-3)',
        fontSize: 'var(--font-size-5xs)',
        fontWeight: 'var(--font-weight-semi-bold)',
        color: 'var(--color-on-surface-default)'
      }}>Toast Alerts (click to trigger, dismissible)</h4>
      <p style={{
        marginBottom: 'var(--space-4)',
        fontSize: 'var(--font-size-body-s)',
        color: 'var(--color-on-surface-subtle)'
      }}>
        Toast alerts appear at the top of the screen with consistent border width and auto-dismiss after a few seconds.
      </p>
      <div className="component-demo" style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
        <button 
          className="btn btn--primary"
          onClick={() => triggerAlert('info', 'Information', 'This is a triggered info alert with new line layout.')}
        >
          Trigger Info
        </button>

        <button 
          className="btn btn--primary"
          style={{ backgroundColor: 'var(--color-feedback-success-600)' }}
          onClick={() => triggerAlert('success', 'Success!', 'Operation completed successfully.')}
        >
          Trigger Success
        </button>

        <button 
          className="btn btn--primary"
          style={{ backgroundColor: 'var(--color-feedback-warning-600)' }}
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