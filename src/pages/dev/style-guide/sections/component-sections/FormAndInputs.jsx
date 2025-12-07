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
      <h3 className="component-category__title">Forms &amp; Inputs</h3>

      <div className="form-demo__container">
        {showSuccess && (
          <Alert type="success" variant="modal" className="form-demo__success-alert">
            <strong className="form-demo__success-title">Success!</strong>
            Form submitted successfully with all validations passed.
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-demo__fields">
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
              <label htmlFor="country" className="form-demo__label">
                Country *
              </label>
              <select
                id="country"
                name="country"
                value={formData.country}
                onChange={handleChange}
                required
                className={`form-demo__select ${errors.country ? 'form-demo__select--error' : ''}`}
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
                <span className="form-demo__helper-text form-demo__helper-text--error">
                  {errors.country}
                </span>
              )}
            </div>

            <div className="input-group">
              <label htmlFor="message" className="form-demo__label">
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
                className={`form-demo__textarea ${errors.message ? 'form-demo__textarea--error' : ''}`}
              />
              {errors.message && (
                <span className="form-demo__helper-text form-demo__helper-text--error">
                  {errors.message}
                </span>
              )}
              {!errors.message && (
                <span className="form-demo__helper-text">
                  Maximum 500 characters
                </span>
              )}
            </div>

            <div className="form-demo__actions">
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

      <div className="form-demo__loading-section">
        <h4 className="component-category__subtitle">Loading States</h4>
        <p className="component-category__description">
          Inputs and Selects support a <code>loading</code> prop to show a skeleton state.
        </p>

        <div className="demo-flex-col">
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
