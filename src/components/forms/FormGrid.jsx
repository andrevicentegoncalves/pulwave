// src/components/forms/FormGrid.jsx
import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';

/**
 * FormGrid Component
 * Container for form fields with consistent spacing
 */
export const FormGrid = ({ children, className }) => (
    <div className={clsx('profile-form-grid', className)}>
        {children}
    </div>
);

FormGrid.propTypes = {
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
};

/**
 * FormRow Component
 * Horizontal row with responsive columns
 */
export const FormRow = ({ columns = 2, children, className }) => {
    const columnClass = {
        1: 'form-item--full',
        2: 'form-row-two',
        3: 'form-row-three',
    }[columns] || 'form-row-two';

    return (
        <div className={clsx(columnClass, className)}>
            {children}
        </div>
    );
};

FormRow.propTypes = {
    columns: PropTypes.oneOf([1, 2, 3]),
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
};

export default FormGrid;
