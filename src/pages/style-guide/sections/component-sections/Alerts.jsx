import React from 'react';
import { Alert } from '../../../../components/ui';

export default function Alerts({ triggerAlert }) {
  return (
    <div className="component-category">
      <h3 className="component-category__title">Alerts</h3>
      
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
      }}>Inline Alerts (with left border accent)</h4>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        <Alert type="info" variant="inline">
          <strong>Did you know?</strong>
          You can customize your profile settings at any time.
        </Alert>

        <Alert type="success" variant="inline">
          <strong>Profile Updated</strong>
          Your profile information has been updated successfully.
        </Alert>

        <Alert type="warning" variant="inline">
          <strong>Session Expiring</strong>
          Your session will expire in 5 minutes. Please save your work.
        </Alert>

        <Alert type="error" variant="inline">
          <strong>Upload Failed</strong>
          The file you tried to upload exceeds the maximum size limit.
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

      <h4 style={{ 
        marginTop: 'var(--space-8)', 
        marginBottom: 'var(--space-3)',
        fontSize: 'var(--font-size-5xs)',
        fontWeight: 'var(--font-weight-semi-bold)',
        color: 'var(--color-on-surface-default)'
      }}>Alert Structure Guidelines</h4>
      <div style={{
        padding: 'var(--space-4)',
        backgroundColor: 'var(--color-neutral-50)',
        borderRadius: 'var(--border-radius-m)',
        fontSize: 'var(--font-size-body-s)',
        lineHeight: 'var(--line-height-body)'
      }}>
        <p style={{ marginBottom: 'var(--space-2)' }}>
          <strong>Best Practices:</strong>
        </p>
        <ul style={{ 
          marginLeft: 'var(--space-5)',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-2)'
        }}>
          <li>
            Use <code>&lt;strong&gt;</code> tags for the alert title - it will display on its own line
          </li>
          <li>
            Place descriptive text after the strong tag for the message body
          </li>
          <li>
            Use <strong>modal</strong> variant for in-page alerts without border emphasis
          </li>
          <li>
            Use <strong>inline</strong> variant for alerts that need visual prominence with left border
          </li>
          <li>
            Use <strong>toast</strong> variant for temporary notifications that dismiss automatically
          </li>
          <li>
            Keep alert messages concise and actionable
          </li>
        </ul>
      </div>

      <h4 style={{ 
        marginTop: 'var(--space-8)', 
        marginBottom: 'var(--space-3)',
        fontSize: 'var(--font-size-5xs)',
        fontWeight: 'var(--font-weight-semi-bold)',
        color: 'var(--color-on-surface-default)'
      }}>Code Example</h4>
      <div style={{
        padding: 'var(--space-4)',
        backgroundColor: 'var(--color-neutral-900)',
        borderRadius: 'var(--border-radius-m)',
        color: 'var(--color-neutral-50)',
        fontSize: 'var(--font-size-caption-m)',
        fontFamily: 'monospace',
        overflow: 'auto'
      }}>
        <pre style={{ margin: 0 }}>{`<Alert type="info" variant="modal">
  <strong>Information</strong>
  This text appears on a new line below the title.
</Alert>

<Alert type="error" variant="inline">
  <strong>Error</strong>
  This alert has a prominent left border accent.
</Alert>

<Alert type="success" variant="toast" dismissible onDismiss={handleDismiss}>
  <strong>Success!</strong>
  Changes saved successfully.
</Alert>`}</pre>
      </div>
    </div>
  );
}