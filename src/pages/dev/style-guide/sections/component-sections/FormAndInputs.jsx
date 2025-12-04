import React, { useState } from 'react';
import { Input, Alert, Select, Button } from '../../../../../components/ui';

export default function FormAndInputs() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    country: '',
    message: ''
  });

  const [errors, setErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    if (!formData.country) newErrors.country = 'Please select a country';
    if (!formData.message.trim()) newErrors.message = 'Message is required';

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validate();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      setShowSuccess(true);
      setErrors({});
      setTimeout(() => setShowSuccess(false), 3000);
    }
  };

  return (
    <div className="component-category">
      <h3 className="component-category__title">Forms & Inputs</h3>

      <div style={{ maxWidth: '500px' }}>
        {showSuccess && (
          <Alert type="success" variant="modal" style={{ marginBottom: 'var(--space-4)' }}>
            <strong style={{ display: 'block', marginBottom: 'var(--space-1)' }}>Success!</strong>
            Form submitted successfully with all validations passed.
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <Input
              label="Full Name"
              name="name"
              placeholder="John Doe"
              type="text"
              value={formData.name}
              onChange={handleChange}
              error={errors.name}
              required
            />

            <Input
              label="Email Address"
              name="email"
              placeholder="john@example.com"
              type="email"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              success={formData.email && !errors.email && /\S+@\S+\.\S+/.test(formData.email) ? 'Email format is valid' : ''}
              required
            />

            <Input
              label="Password"
              name="password"
              placeholder="Enter password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              helperText="Must be at least 8 characters"
              required
            />

            <Input
              label="Confirm Password"
              name="confirmPassword"
              placeholder="Re-enter password"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              error={errors.confirmPassword}
              success={formData.confirmPassword && formData.password === formData.confirmPassword ? 'Passwords match' : ''}
              required
            />

            <div className="input-group">
              <label
                htmlFor="country"
                style={{
                  display: 'block',
                  marginBottom: 'var(--space-2)',
                  fontSize: 'var(--font-size-body-s)',
                  fontWeight: 'var(--font-weight-medium)',
                  color: 'var(--color-on-surface-default)'
                }}
              >
                Country *
              </label>
              <select
                id="country"
                name="country"
                value={formData.country}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: 'var(--space-3)',
                  fontSize: 'var(--font-size-body-s)',
                  fontFamily: 'var(--font-family-sans)',
                  color: 'var(--color-on-surface-default)',
                  backgroundColor: 'var(--color-surface-default)',
                  border: `1px solid ${errors.country ? 'var(--color-feedback-error)' : 'var(--color-border-default)'}`,
                  borderRadius: 'var(--border-radius-s)',
                  cursor: 'pointer',
                  transition: 'border-color var(--duration-fast) var(--easing-standard)',
                  outline: 'none'
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--color-primary)'}
                onBlur={(e) => e.target.style.borderColor = errors.country ? 'var(--color-feedback-error)' : 'var(--color-border-default)'}
              >
                <option value="">Select a country</option>
                <option value="PT">🇵🇹 Portugal</option>
                <option value="ES">🇪🇸 Spain</option>
                <option value="FR">🇫🇷 France</option>
                <option value="DE">🇩🇪 Germany</option>
                <option value="IT">🇮🇹 Italy</option>
                <option value="GB">🇬🇧 United Kingdom</option>
                <option value="US">🇺🇸 United States</option>
              </select>
              {errors.country && (
                <span style={{
                  display: 'block',
                  marginTop: 'var(--space-1)',
                  fontSize: 'var(--font-size-caption-s)',
                  color: 'var(--color-feedback-error)'
                }}>
                  {errors.country}
                </span>
              )}
            </div>

            <div className="input-group">
              <label
                htmlFor="message"
                style={{
                  display: 'block',
                  marginBottom: 'var(--space-2)',
                  fontSize: 'var(--font-size-body-s)',
                  fontWeight: 'var(--font-weight-medium)',
                  color: 'var(--color-on-surface-default)'
                }}
              >
                Message *
              </label>
              <textarea
                id="message"
                name="message"
                placeholder="Your message..."
                rows="5"
                value={formData.message}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: 'var(--space-3)',
                  fontSize: 'var(--font-size-body-s)',
                  fontFamily: 'var(--font-family-sans)',
                  color: 'var(--color-on-surface-default)',
                  backgroundColor: 'var(--color-surface-default)',
                  border: `1px solid ${errors.message ? 'var(--color-feedback-error)' : 'var(--color-border-default)'}`,
                  borderRadius: 'var(--border-radius-s)',
                  resize: 'vertical',
                  minHeight: '120px',
                  transition: 'border-color var(--duration-fast) var(--easing-standard)',
                  outline: 'none'
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--color-primary)'}
                onBlur={(e) => e.target.style.borderColor = errors.message ? 'var(--color-feedback-error)' : 'var(--color-border-default)'}
              />
              {errors.message && (
                <span style={{
                  display: 'block',
                  marginTop: 'var(--space-1)',
                  fontSize: 'var(--font-size-caption-s)',
                  color: 'var(--color-feedback-error)'
                }}>
                  {errors.message}
                </span>
              )}
              {!errors.message && (
                <span style={{
                  display: 'block',
                  marginTop: 'var(--space-1)',
                  fontSize: 'var(--font-size-caption-s)',
                  color: 'var(--color-on-surface-subtle)'
                }}>
                  Maximum 500 characters
                </span>
              )}
            </div>

            <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
              <button
                type="button"
                className="btn btn--secondary"
                onClick={() => {
                  setFormData({ name: '', email: '', password: '', confirmPassword: '', country: '', message: '' });
                  setErrors({});
                  setShowSuccess(false);
                }}
              >
                Reset
              </button>
              <button type="submit" className="btn btn--primary">
                Submit Form
              </button>
            </div>
          </div>
        </form>
      </div>

      <div style={{ marginTop: 'var(--space-8)', maxWidth: '500px' }}>
        <h4 className="component-category__subtitle">Loading States</h4>
        <p className="component-category__description">
          Inputs and Selects support a <code>loading</code> prop to show a skeleton state.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <Input
            label="Username"
            placeholder="Loading..."
            loading={true}
          />

          <Select
            label="Role"
            placeholder="Select role"
            options={[]}
            onChange={() => { }}
            loading={true}
          />
        </div>
      </div>
    </div>
  );
}
