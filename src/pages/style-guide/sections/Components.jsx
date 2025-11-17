import React from 'react';
import Card from '../../Card';
import Input from '../../Input';
import { Divider } from '../../Divider';
import { Dropdown, DropdownItem, DropdownDivider, DropdownLabel } from '../../Dropdown';

export default function Components({ triggerAlert }) {
  return (
    <section className="styleguide-section">
      <h2 className="styleguide-section__title">UI Components</h2>
      <p className="styleguide-section__description">Production-ready component library</p>

      {/* Badges */}
      <div className="component-category">
        <h3 className="component-category__title">Badges</h3>
        
        <h4 style={{ 
          marginTop: 'var(--space-6)', 
          marginBottom: 'var(--space-3)',
          fontSize: 'var(--font-size-5xs)',
          fontWeight: 'var(--font-weight-semi-bold)',
          color: 'var(--color-on-surface-default)'
        }}>Heavy</h4>
        <div className="component-demo" style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
          <div className="badge badge--info badge--heavy">
            <span className="badge__icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="16" x2="12" y2="12" />
                <line x1="12" y1="8" x2="12.01" y2="8" />
              </svg>
            </span>
            Badge label
          </div>
          <div className="badge badge--success badge--heavy">
            <span className="badge__icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </span>
            Badge label
          </div>
          <div className="badge badge--warning badge--heavy">
            <span className="badge__icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
            </span>
            Badge label
          </div>
          <div className="badge badge--danger badge--heavy">
            <span className="badge__icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="15" y1="9" x2="9" y2="15" />
                <line x1="9" y1="9" x2="15" y2="15" />
              </svg>
            </span>
            Badge label
          </div>
          <div className="badge badge--neutral badge--heavy">Badge label</div>
        </div>

        <h4 style={{ 
          marginTop: 'var(--space-6)', 
          marginBottom: 'var(--space-3)',
          fontSize: 'var(--font-size-5xs)',
          fontWeight: 'var(--font-weight-semi-bold)',
          color: 'var(--color-on-surface-default)'
        }}>Medium</h4>
        <div className="component-demo" style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
          <div className="badge badge--info badge--medium">
            <span className="badge__icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="16" x2="12" y2="12" />
                <line x1="12" y1="8" x2="12.01" y2="8" />
              </svg>
            </span>
            Badge label
          </div>
          <div className="badge badge--success badge--medium">
            <span className="badge__icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </span>
            Badge label
          </div>
          <div className="badge badge--warning badge--medium">
            <span className="badge__icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
            </span>
            Badge label
          </div>
          <div className="badge badge--danger badge--medium">
            <span className="badge__icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="15" y1="9" x2="9" y2="15" />
                <line x1="9" y1="9" x2="15" y2="15" />
              </svg>
            </span>
            Badge label
          </div>
          <div className="badge badge--neutral badge--medium">Badge label</div>
        </div>

        <h4 style={{ 
          marginTop: 'var(--space-6)', 
          marginBottom: 'var(--space-3)',
          fontSize: 'var(--font-size-5xs)',
          fontWeight: 'var(--font-weight-semi-bold)',
          color: 'var(--color-on-surface-default)'
        }}>Light</h4>
        <div className="component-demo" style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
          <div className="badge badge--info badge--light">
            <span className="badge__icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="16" x2="12" y2="12" />
                <line x1="12" y1="8" x2="12.01" y2="8" />
              </svg>
            </span>
            Badge label
          </div>
          <div className="badge badge--success badge--light">
            <span className="badge__icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </span>
            Badge label
          </div>
          <div className="badge badge--warning badge--light">
            <span className="badge__icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
            </span>
            Badge label
          </div>
          <div className="badge badge--danger badge--light">
            <span className="badge__icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="15" y1="9" x2="9" y2="15" />
                <line x1="9" y1="9" x2="15" y2="15" />
              </svg>
            </span>
            Badge label
          </div>
          <div className="badge badge--neutral badge--light">Badge label</div>
        </div>
      </div>

      <Divider style={{ margin: 'var(--space-10) 0' }} />

      {/* Alerts */}
      <div className="component-category">
        <h3 className="component-category__title">Alerts</h3>
        
        <h4 style={{ 
          marginTop: 'var(--space-6)', 
          marginBottom: 'var(--space-3)',
          fontSize: 'var(--font-size-5xs)',
          fontWeight: 'var(--font-weight-semi-bold)',
          color: 'var(--color-on-surface-default)'
        }}>Inline Alerts</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <div className="alert alert--info">
            <div className="alert__icon">i</div>
            <div className="alert__content">
              <strong>Information</strong><br />
              This is an informational alert message.
            </div>
          </div>

          <div className="alert alert--success">
            <div className="alert__icon">✓</div>
            <div className="alert__content">
              <strong>Success</strong><br />
              Your action was completed successfully.
            </div>
          </div>

          <div className="alert alert--warning">
            <div className="alert__icon">!</div>
            <div className="alert__content">
              <strong>Warning</strong><br />
              Please review this important warning.
            </div>
          </div>

          <div className="alert alert--error">
            <div className="alert__icon">×</div>
            <div className="alert__content">
              <strong>Error</strong><br />
              An error occurred. Please try again.
            </div>
          </div>
        </div>

        <h4 style={{ 
          marginTop: 'var(--space-8)', 
          marginBottom: 'var(--space-3)',
          fontSize: 'var(--font-size-5xs)',
          fontWeight: 'var(--font-weight-semi-bold)',
          color: 'var(--color-on-surface-default)'
        }}>Alert Triggers (Toast Style)</h4>
        <div className="component-demo" style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
          <button 
            className="btn btn--primary"
            onClick={() => triggerAlert('info', 'Information', 'This is a triggered info alert.')}
          >
            Trigger Info Alert
          </button>

          <button 
            className="btn btn--primary"
            style={{ backgroundColor: 'var(--color-feedback-success-600)' }}
            onClick={() => triggerAlert('success', 'Success!', 'Operation completed successfully.')}
          >
            Trigger Success Alert
          </button>

          <button 
            className="btn btn--primary"
            style={{ backgroundColor: 'var(--color-feedback-warning-600)' }}
            onClick={() => triggerAlert('warning', 'Warning', 'Please be aware of this warning.')}
          >
            Trigger Warning Alert
          </button>

          <button 
            className="btn btn--destructive"
            onClick={() => triggerAlert('error', 'Error', 'An error has occurred.')}
          >
            Trigger Error Alert
          </button>
        </div>
      </div>

      <Divider style={{ margin: 'var(--space-10) 0' }} />

      {/* Buttons */}
      <div className="component-category">
        <h3 className="component-category__title">Buttons</h3>
        
        <h4 style={{ 
          marginTop: 'var(--space-6)', 
          marginBottom: 'var(--space-3)',
          fontSize: 'var(--font-size-5xs)',
          fontWeight: 'var(--font-weight-semi-bold)',
          color: 'var(--color-on-surface-default)'
        }}>Button Variants</h4>
        <div className="component-demo" style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
          <button className="btn btn--primary">Primary</button>
          <button className="btn btn--secondary">Secondary</button>
          <button className="btn btn--tertiary">Tertiary</button>
          <button className="btn btn--destructive">Destructive</button>
          <button className="btn btn--ghost">Ghost</button>
        </div>

        <h4 style={{ 
          marginTop: 'var(--space-6)', 
          marginBottom: 'var(--space-3)',
          fontSize: 'var(--font-size-5xs)',
          fontWeight: 'var(--font-weight-semi-bold)',
          color: 'var(--color-on-surface-default)'
        }}>Button Sizes</h4>
        <div className="component-demo" style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center', flexWrap: 'wrap' }}>
          <button className="btn btn--primary btn--s">Small</button>
          <button className="btn btn--primary">Medium (Default)</button>
          <button className="btn btn--primary btn--l">Large</button>
        </div>

        <h4 style={{ 
          marginTop: 'var(--space-6)', 
          marginBottom: 'var(--space-3)',
          fontSize: 'var(--font-size-5xs)',
          fontWeight: 'var(--font-weight-semi-bold)',
          color: 'var(--color-on-surface-default)'
        }}>Button States</h4>
        <div className="component-demo" style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
          <button className="btn btn--primary">Default</button>
          <button className="btn btn--primary" disabled>Disabled</button>
          <button className="btn btn--secondary" disabled>Disabled Secondary</button>
        </div>

        <h4 style={{ 
          marginTop: 'var(--space-6)', 
          marginBottom: 'var(--space-3)',
          fontSize: 'var(--font-size-5xs)',
          fontWeight: 'var(--font-weight-semi-bold)',
          color: 'var(--color-on-surface-default)'
        }}>Full Width Button</h4>
        <div className="component-demo">
          <button className="btn btn--primary" style={{ width: '100%' }}>
            Full Width Button
          </button>
        </div>
      </div>

      <Divider style={{ margin: 'var(--space-10) 0' }} />

      {/* Form Inputs */}
      <div className="component-category">
        <h3 className="component-category__title">Form Inputs</h3>
        
        <h4 style={{ 
          marginTop: 'var(--space-6)', 
          marginBottom: 'var(--space-3)',
          fontSize: 'var(--font-size-5xs)',
          fontWeight: 'var(--font-weight-semi-bold)',
          color: 'var(--color-on-surface-default)'
        }}>Text Inputs</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', maxWidth: '400px' }}>
          <Input
            label="Default Input"
            placeholder="Enter text..."
            type="text"
          />
          
          <Input
            label="Email Input"
            placeholder="your.email@example.com"
            type="email"
          />
          
          <Input
            label="Password Input"
            placeholder="Enter password"
            type="password"
          />
          
          <Input
            label="Required Input"
            placeholder="This field is required"
            type="text"
            required
          />
          
          <Input
            label="Disabled Input"
            placeholder="Cannot edit this"
            type="text"
            disabled
            value="Disabled value"
          />
        </div>

        <h4 style={{ 
          marginTop: 'var(--space-8)', 
          marginBottom: 'var(--space-3)',
          fontSize: 'var(--font-size-5xs)',
          fontWeight: 'var(--font-weight-semi-bold)',
          color: 'var(--color-on-surface-default)'
        }}>Validation States</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', maxWidth: '400px' }}>
          <Input
            label="Success State"
            placeholder="Validated input"
            type="text"
            value="valid@email.com"
            helperText="✓ This looks good!"
          />
          
          <Input
            label="Error State"
            placeholder="Enter valid email"
            type="email"
            value="invalid-email"
            error="Please enter a valid email address"
          />
          
          <Input
            label="Warning State"
            placeholder="Check this input"
            type="text"
            value="Warning example"
            helperText="⚠ Please verify this information"
          />
        </div>

        <h4 style={{ 
          marginTop: 'var(--space-8)', 
          marginBottom: 'var(--space-3)',
          fontSize: 'var(--font-size-5xs)',
          fontWeight: 'var(--font-weight-semi-bold)',
          color: 'var(--color-on-surface-default)'
        }}>Textarea</h4>
        <div style={{ maxWidth: '400px' }}>
          <div className="input-group">
            <label className="input__label" htmlFor="textarea-demo">
              Message
            </label>
            <textarea
              id="textarea-demo"
              className="input__field"
              placeholder="Enter your message..."
              rows="4"
              style={{
                resize: 'vertical',
                minHeight: '100px'
              }}
            />
            <span className="input__helper-text">Maximum 500 characters</span>
          </div>
        </div>
      </div>

      <Divider style={{ margin: 'var(--space-10) 0' }} />

      {/* Cards */}
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
            <div style={{ padding: 'var(--space-4)' }}>
              <h4 style={{ margin: '0 0 var(--space-2) 0', fontSize: 'var(--font-size-5xs)' }}>Default Card</h4>
              <p style={{ margin: 0, fontSize: 'var(--font-size-7xs)', color: 'var(--color-on-surface-subtle)' }}>
                This is a default card with standard styling.
              </p>
            </div>
          </Card>

          <Card variant="elevated">
            <div style={{ padding: 'var(--space-4)' }}>
              <h4 style={{ margin: '0 0 var(--space-2) 0', fontSize: 'var(--font-size-5xs)' }}>Elevated Card</h4>
              <p style={{ margin: 0, fontSize: 'var(--font-size-7xs)', color: 'var(--color-on-surface-subtle)' }}>
                This card has additional elevation and shadow.
              </p>
            </div>
          </Card>

          <Card variant="outlined">
            <div style={{ padding: 'var(--space-4)' }}>
              <h4 style={{ margin: '0 0 var(--space-2) 0', fontSize: 'var(--font-size-5xs)' }}>Outlined Card</h4>
              <p style={{ margin: 0, fontSize: 'var(--font-size-7xs)', color: 'var(--color-on-surface-subtle)' }}>
                This card has a visible border outline.
              </p>
            </div>
          </Card>
        </div>

        <h4 style={{ 
          marginTop: 'var(--space-8)', 
          marginBottom: 'var(--space-3)',
          fontSize: 'var(--font-size-5xs)',
          fontWeight: 'var(--font-weight-semi-bold)',
          color: 'var(--color-on-surface-default)'
        }}>Card with Header and Footer</h4>
        <Card variant="elevated" style={{ maxWidth: '400px' }}>
          <div className="card__header">Card Header</div>
          <div className="card__body">
            <p style={{ margin: 0 }}>
              This card demonstrates the header, body, and footer sections that can be used for structured content layouts.
            </p>
          </div>
          <div className="card__footer">
            <button className="btn btn--secondary btn--s">Cancel</button>
            <button className="btn btn--primary btn--s">Confirm</button>
          </div>
        </Card>
      </div>

      <Divider style={{ margin: 'var(--space-10) 0' }} />

      {/* Dividers */}
      <div className="component-category">
        <h3 className="component-category__title">Dividers</h3>
        
        <h4 style={{ 
          marginTop: 'var(--space-6)', 
          marginBottom: 'var(--space-3)',
          fontSize: 'var(--font-size-5xs)',
          fontWeight: 'var(--font-weight-semi-bold)',
          color: 'var(--color-on-surface-default)'
        }}>Horizontal Divider</h4>
        <div style={{ padding: 'var(--space-4)', backgroundColor: 'var(--color-surface-subtle)', borderRadius: 'var(--border-radius-m)' }}>
          <p style={{ margin: 0 }}>Content above divider</p>
          <Divider style={{ margin: 'var(--space-4) 0' }} />
          <p style={{ margin: 0 }}>Content below divider</p>
        </div>
      </div>

      <Divider style={{ margin: 'var(--space-10) 0' }} />

      {/* Dropdown */}
      <div className="component-category">
        <h3 className="component-category__title">Dropdown</h3>
        
        <h4 style={{ 
          marginTop: 'var(--space-6)', 
          marginBottom: 'var(--space-3)',
          fontSize: 'var(--font-size-5xs)',
          fontWeight: 'var(--font-weight-semi-bold)',
          color: 'var(--color-on-surface-default)'
        }}>Dropdown Menu</h4>
        <div style={{ maxWidth: '300px' }}>
          <Dropdown trigger={<button className="btn btn--secondary">Open Dropdown</button>}>
            <DropdownLabel>Actions</DropdownLabel>
            <DropdownItem onClick={() => alert('Edit clicked')}>Edit</DropdownItem>
            <DropdownItem onClick={() => alert('Duplicate clicked')}>Duplicate</DropdownItem>
            <DropdownDivider />
            <DropdownLabel>Danger Zone</DropdownLabel>
            <DropdownItem onClick={() => alert('Delete clicked')} variant="danger">Delete</DropdownItem>
          </Dropdown>
        </div>
      </div>
    </section>
  );
}