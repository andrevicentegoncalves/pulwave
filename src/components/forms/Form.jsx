// src/components/Form.jsx
import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';

const Form = ({
  children,
  onSubmit,
  className,
  layout = 'vertical',
  ...rest
}) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit?.(e);
  };

  return (
    <form
      className={clsx(
        'form',
        `form--${layout}`,
        className
      )}
      onSubmit={handleSubmit}
      noValidate
      {...rest}
    >
      {children}
    </form>
  );
};

Form.propTypes = {
  children: PropTypes.node.isRequired,
  onSubmit: PropTypes.func,
  className: PropTypes.string,
  layout: PropTypes.oneOf(['vertical', 'horizontal', 'inline']),
};

// Form Group Component for organizing form fields
export const FormGroup = ({ children, className }) => {
  return (
    <div className={clsx('form-group', className)}>
      {children}
    </div>
  );
};

FormGroup.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

// Form Row Component for horizontal layouts
export const FormRow = ({ children, className, gap = 'md' }) => {
  return (
    <div className={clsx('form-row', `form-row--gap-${gap}`, className)}>
      {children}
    </div>
  );
};

FormRow.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  gap: PropTypes.oneOf(['sm', 'md', 'lg']),
};

// Form Actions Component for submit/cancel buttons
export const FormActions = ({ 
  children, 
  className,
  align = 'right' 
}) => {
  return (
    <div className={clsx(
      'form-actions',
      `form-actions--${align}`,
      className
    )}>
      {children}
    </div>
  );
};

FormActions.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  align: PropTypes.oneOf(['left', 'center', 'right', 'space-between']),
};

export default Form;