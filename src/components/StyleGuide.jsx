// src/components/StyleGuide.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Badge from './Badge';
import Alert from './Alert';
import Card from './Card';
import Modal from './Modal';
import Input from './Input';
import Dropdown, { DropdownItem, DropdownDivider } from './Dropdown';
import Form, { FormGroup, FormRow, FormActions } from './Form';
import Divider from './Divider';

export default function StyleGuide() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [modalSize, setModalSize] = useState('md');
  const [showToast, setShowToast] = useState(false);
  const [toastType, setToastType] = useState('success');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleShowToast = (type) => {
    setToastType(type);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 5000);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    handleShowToast('success');
  };

  const handleOpenModal = (size) => {
    setModalSize(size);
    setShowModal(true);
  };

  const BadgeRow = ({ variant }) => (
    <div className="badge-row">
      <Badge variant={variant} type="info">Badge label</Badge>
      <Badge variant={variant} type="success">Badge label</Badge>
      <Badge variant={variant} type="warning">Badge label</Badge>
      <Badge variant={variant} type="error">Badge label</Badge>
      <Badge variant={variant} type="neutral">Badge label</Badge>
    </div>
  );

  const ButtonRow = ({ variant }) => (
    <div className="button-row">
      <button className={`btn ${variant ? `btn--${variant}` : ''}`}>
        {variant || 'Default'} M
      </button>
      <button className={`btn btn--s ${variant ? `btn--${variant}` : ''}`}>
        {variant || 'Default'} S
      </button>
      <button className={`btn btn--l ${variant ? `btn--${variant}` : ''}`}>
        {variant || 'Default'} L
      </button>
      <button disabled className={`btn ${variant ? `btn--${variant}` : ''}`}>
        {variant || 'Default'} Disabled
      </button>
    </div>
  );

  return (
    <div className="style-guide-container">
      {/* TOAST ALERTS */}
      {showToast && (
        <Alert 
          type={toastType} 
          variant="toast"
          dismissible
          onDismiss={() => setShowToast(false)}
        >
          This is a {toastType} toast notification!
        </Alert>
      )}

      {/* HEADER */}
      <header className="style-guide-header">
        <button 
          className="btn btn--ghost" 
          onClick={() => navigate('/')}
          style={{ marginBottom: 'var(--scale-4)' }}
        >
          ← Back to Home
        </button>
        <h1>Pulwave Style Guide</h1>
        <p className="style-guide-subtitle">
          Complete component library showcase with all variants and states
        </p>
      </header>

      <hr style={{ margin: 'var(--scale-8) 0', border: 'none', borderTop: '1px solid #e0e0e0' }} />

      {/* TABLE OF CONTENTS */}
      <Card>
        <h2>Components</h2>
        <nav className="style-guide-nav">
          <a href="#alerts">Alerts</a>
          <a href="#badges">Badges</a>
          <a href="#buttons">Buttons</a>
          <a href="#cards">Cards</a>
          <a href="#modals">Modals</a>
          <a href="#inputs">Inputs</a>
          <a href="#dropdowns">Dropdowns</a>
          <a href="#forms">Forms</a>
          <a href="#dividers">Dividers</a>
        </nav>
      </Card>

      <hr style={{ margin: 'var(--scale-8) 0', border: 'none', borderTop: '1px solid #e0e0e0' }} />

      {/* ALERTS SECTION */}
      <section id="alerts" className="style-guide-section">
        <h2>Alerts</h2>
        <p className="section-description">
          Display feedback messages in two modes: inline (embedded in content) or toast (floating notifications).
        </p>

        <Card>
          <h3>Inline Alerts</h3>
          <Alert type="info">
            This is an informational message for the user.
          </Alert>
          <Alert type="success">
            Action successful! Your data has been saved.
          </Alert>
          <Alert type="warning">
            Warning: Proceed with caution.
          </Alert>
          <Alert type="error">
            Error: Something went wrong.
          </Alert>
        </Card>

        <Card>
          <h3>Toast Alerts (Floating)</h3>
          <p>Click buttons to trigger floating toast notifications:</p>
          <div className="button-row">
            <button className="btn btn--primary" onClick={() => handleShowToast('success')}>
              Success Toast
            </button>
            <button className="btn btn--primary" onClick={() => handleShowToast('info')}>
              Info Toast
            </button>
            <button className="btn btn--primary" onClick={() => handleShowToast('warning')}>
              Warning Toast
            </button>
            <button className="btn btn--destructive" onClick={() => handleShowToast('error')}>
              Error Toast
            </button>
          </div>
        </Card>
      </section>

      <hr style={{ margin: 'var(--scale-8) 0', border: 'none', borderTop: '1px solid #e0e0e0' }} />

      {/* BADGES SECTION */}
      <section id="badges" className="style-guide-section">
        <h2>Badges</h2>
        <p className="section-description">
          Status indicators with three emphasis levels (heavy, medium, light) and five types.
        </p>

        <Card>
          <div className="variant-group">
            <h3>Heavy (Solid)</h3>
            <BadgeRow variant="heavy" />
          </div>

          <hr style={{ margin: 'var(--scale-5) 0', border: 'none', borderTop: '1px solid #e0e0e0' }} />

          <div className="variant-group">
            <h3>Medium (With Border)</h3>
            <BadgeRow variant="medium" />
          </div>

          <hr style={{ margin: 'var(--scale-5) 0', border: 'none', borderTop: '1px solid #e0e0e0' }} />

          <div className="variant-group">
            <h3>Light (Subtle)</h3>
            <BadgeRow variant="light" />
          </div>
        </Card>

        <Card>
          <h3>Badge Sizes & Icons</h3>
          <div style={{ display: 'flex', gap: 'var(--scale-3)', alignItems: 'center', flexWrap: 'wrap' }}>
            <Badge variant="heavy" type="success" icon="✓">With Icon</Badge>
            <Badge variant="medium" type="info">Default Size</Badge>
            <Badge variant="light" type="warning" onClick={() => alert('Badge clicked!')}>
              Clickable Badge
            </Badge>
          </div>
        </Card>
      </section>

      <hr style={{ margin: 'var(--scale-8) 0', border: 'none', borderTop: '1px solid #e0e0e0' }} />

      {/* BUTTONS SECTION */}
      <section id="buttons" className="style-guide-section">
        <h2>Buttons</h2>
        <p className="section-description">
          Action buttons with multiple variants and three size options.
        </p>

        <Card>
          <h3>Primary Buttons</h3>
          <ButtonRow variant="primary" />
        </Card>

        <Card>
          <h3>Secondary Buttons</h3>
          <ButtonRow variant="secondary" />
        </Card>

        <Card>
          <h3>Tertiary Buttons</h3>
          <ButtonRow variant="tertiary" />
        </Card>

        <Card>
          <h3>Destructive Buttons</h3>
          <ButtonRow variant="destructive" />
        </Card>

        <Card>
          <h3>Ghost Buttons</h3>
          <ButtonRow variant="ghost" />
        </Card>
      </section>

      <hr style={{ margin: 'var(--scale-8) 0', border: 'none', borderTop: '1px solid #e0e0e0' }} />

      {/* CARDS SECTION */}
      <section id="cards" className="style-guide-section">
        <h2>Cards</h2>
        <p className="section-description">
          Content containers with optional header and footer sections.
        </p>

        <div style={{ display: 'grid', gap: 'var(--scale-4)', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
          <Card>
            <p>Basic card with body content only.</p>
          </Card>

          <Card header={<strong>Card with Header</strong>}>
            <p>This card includes a header section.</p>
          </Card>

          <Card 
            header={<strong>Full Card</strong>}
            footer={
              <>
                <button className="btn btn--ghost btn--s">Cancel</button>
                <button className="btn btn--primary btn--s">Save</button>
              </>
            }
          >
            <p>This card has header, body, and footer sections.</p>
          </Card>
        </div>
      </section>

      <hr style={{ margin: 'var(--scale-8) 0', border: 'none', borderTop: '1px solid #e0e0e0' }} />

      {/* MODALS SECTION */}
      <section id="modals" className="style-guide-section">
        <h2>Modals</h2>
        <p className="section-description">
          Dialog overlays with backdrop, keyboard support (ESC to close), and click-outside-to-close. Available in 4 sizes.
        </p>

        <Card>
          <h3>All Modal Sizes</h3>
          <p style={{ marginBottom: 'var(--scale-4)', fontSize: 'var(--font-size-body-s)', color: '#666' }}>
            Click buttons to see different modal sizes:
          </p>
          <div className="button-row">
            <button className="btn btn--primary" onClick={() => handleOpenModal('sm')}>
              Small Modal
            </button>
            <button className="btn btn--primary" onClick={() => handleOpenModal('md')}>
              Medium Modal
            </button>
            <button className="btn btn--primary" onClick={() => handleOpenModal('lg')}>
              Large Modal
            </button>
            <button className="btn btn--primary" onClick={() => handleOpenModal('xl')}>
              XL Modal
            </button>
          </div>
        </Card>
      </section>

      <hr style={{ margin: 'var(--scale-8) 0', border: 'none', borderTop: '1px solid #e0e0e0' }} />

      {/* INPUTS SECTION */}
      <section id="inputs" className="style-guide-section">
        <h2>Inputs</h2>
        <p className="section-description">
          Form input fields with validation states, icons, and helper text. Borders are visible with proper contrast.
        </p>

        <Card style={{ backgroundColor: '#ffffff' }}>
          <h3>Input States</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--scale-4)' }}>
            <Input
              label="Default Input"
              name="default"
              placeholder="Enter text here..."
            />
            
            <Input
              label="Input with Success State"
              name="success"
              success="Looks good!"
              value="valid@email.com"
              readOnly
            />
            
            <Input
              label="Input with Error State"
              name="error"
              error="This field is required"
              required
            />
            
            <Input
              label="Disabled Input"
              name="disabled"
              disabled
              value="Disabled value"
            />
            
            <Input
              label="Input with Left Icon"
              name="leftIcon"
              leftIcon="🔍"
              placeholder="Search..."
            />

            <Input
              label="Input with Helper Text"
              name="helper"
              helperText="We'll never share your information"
              placeholder="Enter your email"
            />
          </div>
        </Card>

        <Card style={{ backgroundColor: '#ffffff' }}>
          <h3>Input Sizes</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--scale-4)' }}>
            <Input
              label="Small Input"
              name="small"
              size="sm"
              placeholder="Small size input"
            />
            <Input
              label="Medium Input (Default)"
              name="medium"
              size="md"
              placeholder="Medium size input"
            />
            <Input
              label="Large Input"
              name="large"
              size="lg"
              placeholder="Large size input"
            />
          </div>
        </Card>
      </section>

      <hr style={{ margin: 'var(--scale-8) 0', border: 'none', borderTop: '1px solid #e0e0e0' }} />

      {/* DROPDOWNS SECTION */}
      <section id="dropdowns" className="style-guide-section">
        <h2>Dropdowns</h2>
        <p className="section-description">
          Menu dropdowns with keyboard navigation and mobile-responsive bottom sheets. Click buttons to open menus.
        </p>

        <Card>
          <h3>Dropdown Variants</h3>
          <p style={{ marginBottom: 'var(--scale-4)', fontSize: 'var(--font-size-body-s)', color: '#666' }}>
            Click buttons to open dropdown menus:
          </p>
          <div style={{ display: 'flex', gap: 'var(--scale-4)', flexWrap: 'wrap' }}>
            <Dropdown trigger={<button className="btn btn--primary">Options Menu</button>}>
              <DropdownItem icon="📝" onClick={() => alert('Edit clicked')}>
                Edit
              </DropdownItem>
              <DropdownItem icon="📋" onClick={() => alert('Duplicate clicked')}>
                Duplicate
              </DropdownItem>
              <DropdownItem icon="👁️" onClick={() => alert('View clicked')}>
                View Details
              </DropdownItem>
              <DropdownDivider />
              <DropdownItem icon="🗑️" danger onClick={() => alert('Delete clicked')}>
                Delete
              </DropdownItem>
            </Dropdown>

            <Dropdown 
              trigger={<button className="btn btn--secondary">User Actions</button>}
              align="right"
            >
              <DropdownItem icon="👤" onClick={() => alert('Profile clicked')}>
                Profile
              </DropdownItem>
              <DropdownItem icon="⚙️" onClick={() => alert('Settings clicked')}>
                Settings
              </DropdownItem>
              <DropdownItem icon="❓" onClick={() => alert('Help clicked')}>
                Help
              </DropdownItem>
              <DropdownDivider />
              <DropdownItem icon="🚪" onClick={() => alert('Sign out clicked')}>
                Sign Out
              </DropdownItem>
            </Dropdown>

            <Dropdown 
              trigger={<button className="btn btn--ghost">More Options</button>}
            >
              <DropdownItem icon="📊" onClick={() => alert('Analytics clicked')}>
                Analytics
              </DropdownItem>
              <DropdownItem icon="📈" onClick={() => alert('Reports clicked')}>
                Reports
              </DropdownItem>
              <DropdownItem icon="⬇️" onClick={() => alert('Export clicked')}>
                Export Data
              </DropdownItem>
            </Dropdown>
          </div>
        </Card>
      </section>

      <hr style={{ margin: 'var(--scale-8) 0', border: 'none', borderTop: '1px solid #e0e0e0' }} />

      {/* FORMS SECTION */}
      <section id="forms" className="style-guide-section">
        <h2>Forms</h2>
        <p className="section-description">
          Form layouts with validation support and organized field groups.
        </p>

        <Card style={{ backgroundColor: '#ffffff' }}>
          <h3>Contact Form Example</h3>
          <Form onSubmit={handleFormSubmit}>
            <FormGroup>
              <Input
                label="Full Name"
                name="name"
                required
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="Enter your name"
              />
            </FormGroup>

            <FormRow>
              <Input
                label="Email Address"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                placeholder="your@email.com"
              />
              <Input
                label="Phone Number"
                name="phone"
                type="tel"
                placeholder="+351 900 000 000"
              />
            </FormRow>

            <FormGroup>
              <Input
                label="Message"
                name="message"
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
                placeholder="Your message here..."
                helperText="Maximum 500 characters"
              />
            </FormGroup>

            <FormActions align="right">
              <button type="button" className="btn btn--ghost">
                Cancel
              </button>
              <button type="submit" className="btn btn--primary">
                Submit Form
              </button>
            </FormActions>
          </Form>
        </Card>
      </section>

      <hr style={{ margin: 'var(--scale-8) 0', border: 'none', borderTop: '1px solid #e0e0e0' }} />

      {/* DIVIDERS SECTION */}
      <section id="dividers" className="style-guide-section">
        <h2>Dividers</h2>
        <p className="section-description">
          Visual separators for organizing content sections. Shown with background to make them visible.
        </p>

        <Card>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--scale-8)' }}>
            <div>
              <p style={{ marginBottom: 'var(--scale-3)', fontWeight: '600' }}>
                Solid (Default)
              </p>
              <div style={{ 
                padding: 'var(--scale-4)', 
                backgroundColor: '#f5f5f5',
                borderRadius: '8px'
              }}>
                <p>Content above divider</p>
                <hr style={{ margin: 'var(--scale-5) 0', border: 'none', borderTop: '1px solid #cbd5e1' }} />
                <p>Content below divider</p>
              </div>
            </div>

            <div>
              <p style={{ marginBottom: 'var(--scale-3)', fontWeight: '600' }}>
                Dashed
              </p>
              <div style={{ 
                padding: 'var(--scale-4)', 
                backgroundColor: '#f5f5f5',
                borderRadius: '8px'
              }}>
                <p>Content above divider</p>
                <hr style={{ margin: 'var(--scale-5) 0', border: 'none', borderTop: '1px dashed #cbd5e1' }} />
                <p>Content below divider</p>
              </div>
            </div>

            <div>
              <p style={{ marginBottom: 'var(--scale-3)', fontWeight: '600' }}>
                Dotted
              </p>
              <div style={{ 
                padding: 'var(--scale-4)', 
                backgroundColor: '#f5f5f5',
                borderRadius: '8px'
              }}>
                <p>Content above divider</p>
                <hr style={{ margin: 'var(--scale-5) 0', border: 'none', borderTop: '1px dotted #cbd5e1' }} />
                <p>Content below divider</p>
              </div>
            </div>

            <div>
              <p style={{ marginBottom: 'var(--scale-3)', fontWeight: '600' }}>
                With Text (Center)
              </p>
              <div style={{ 
                padding: 'var(--scale-4)', 
                backgroundColor: '#f5f5f5',
                borderRadius: '8px'
              }}>
                <p>Content above divider</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: 'var(--scale-5) 0' }}>
                  <hr style={{ flex: 1, border: 'none', borderTop: '1px solid #cbd5e1' }} />
                  <span style={{ fontSize: '14px', color: '#64748b', fontWeight: '500' }}>Section Break</span>
                  <hr style={{ flex: 1, border: 'none', borderTop: '1px solid #cbd5e1' }} />
                </div>
                <p>Content below divider</p>
              </div>
            </div>

            <div>
              <p style={{ marginBottom: 'var(--scale-3)', fontWeight: '600' }}>
                Different Spacing Options
              </p>
              <div style={{ 
                padding: 'var(--scale-4)', 
                backgroundColor: '#f5f5f5',
                borderRadius: '8px'
              }}>
                <p>Content with small spacing</p>
                <hr style={{ margin: 'var(--scale-3) 0', border: 'none', borderTop: '1px solid #cbd5e1' }} />
                <p>Small spacing above and below</p>
                <hr style={{ margin: 'var(--scale-5) 0', border: 'none', borderTop: '1px solid #cbd5e1' }} />
                <p>Medium spacing above and below</p>
                <hr style={{ margin: 'var(--scale-8) 0', border: 'none', borderTop: '1px solid #cbd5e1' }} />
                <p>Large spacing above and below</p>
              </div>
            </div>
          </div>
        </Card>
      </section>

      <hr style={{ margin: 'var(--scale-8) 0', border: 'none', borderTop: '1px solid #e0e0e0' }} />

      {/* FOOTER */}
      <footer className="style-guide-footer">
        <button 
          className="btn btn--primary" 
          onClick={() => navigate('/')}
        >
          ← Back to Home
        </button>
      </footer>

      {/* MODAL EXAMPLE */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={`${modalSize.toUpperCase()} Modal Example`}
        size={modalSize}
        footer={
          <>
            <button className="btn btn--ghost" onClick={() => setShowModal(false)}>
              Cancel
            </button>
            <button className="btn btn--primary" onClick={() => setShowModal(false)}>
              Confirm Action
            </button>
          </>
        }
      >
        <p>This is a <strong>{modalSize}</strong> size modal dialog.</p>
        <p>Modal size: <code style={{ 
          padding: '2px 6px', 
          backgroundColor: '#f1f5f9', 
          borderRadius: '4px',
          fontSize: '14px',
          fontFamily: 'monospace'
        }}>{modalSize}</code></p>
        <p>You can close it by:</p>
        <ul style={{ marginLeft: 'var(--scale-5)', marginTop: 'var(--scale-2)' }}>
          <li>Clicking the X button in the header</li>
          <li>Pressing the Escape key</li>
          <li>Clicking outside the modal (on the backdrop)</li>
          <li>Clicking the Cancel button</li>
        </ul>
        {modalSize === 'xl' && (
          <>
            <p style={{ marginTop: 'var(--scale-4)' }}>
              This extra-large modal has more space for complex content like detailed forms, data tables, or rich media.
            </p>
            <div style={{ 
              padding: 'var(--scale-4)', 
              backgroundColor: '#f5f5f5', 
              borderRadius: '8px',
              marginTop: 'var(--scale-3)'
            }}>
              <strong>Tip:</strong> Use XL modals for content that needs maximum screen space while maintaining the dialog experience.
            </div>
          </>
        )}
      </Modal>
    </div>
  );
}