import React from 'react';
import PropTypes from 'prop-types';
import Icon from './Icon';
import Button from './Button';
import Card from './Card';
import Alert from './Alert';
import { ArrowLeft, ArrowRight, CheckCircle } from './iconLibrary';

const Wizard = ({
    steps,
    currentStep,
    onNext,
    onBack,
    onFinish,
    loading = false,
    error = null,
    onErrorDismiss,
    children,
    className = ''
}) => {
    return (
        <div className={`wizard-container ${className}`}>
            {/* Progress Bar */}
            <div className="wizard-progress">
                <div className="wizard-progress__steps">
                    {steps.map((step, index) => (
                        <div
                            key={index}
                            className={`wizard-progress__step ${index <= currentStep ? 'active' : ''} ${index < currentStep ? 'completed' : ''}`}
                        >
                            <div className="wizard-progress__circle">
                                <Icon size="s">{React.createElement(step.icon)}</Icon>
                            </div>
                            <span className="wizard-progress__title">{step.title}</span>
                        </div>
                    ))}
                </div>
                <div className="wizard-progress__bar">
                    <div
                        className="wizard-progress__fill"
                        style={{ '--progress': `${(currentStep / (steps.length - 1)) * 100}%` }}
                    />
                </div>
            </div>

            {/* Content Card */}
            <Card className="wizard-card">
                {error && (
                    <Alert type="error" dismissible onDismiss={onErrorDismiss}>
                        {error}
                    </Alert>
                )}

                <div className="wizard-content">
                    {children}
                </div>

                {/* Navigation Buttons */}
                <div className="wizard-actions">
                    {currentStep > 0 && (
                        <Button
                            variant="secondary"
                            size="l"
                            onClick={onBack}
                            className="wizard-actions__btn-back"
                        >
                            <Icon size="s" className="wizard-actions__icon-back"><ArrowLeft /></Icon>
                            Back
                        </Button>
                    )}

                    {currentStep < steps.length - 1 ? (
                        <Button
                            variant="primary"
                            size="l"
                            onClick={onNext}
                            className="wizard-actions__btn-next"
                        >
                            Next
                            <Icon size="s" className="wizard-actions__icon-next"><ArrowRight /></Icon>
                        </Button>
                    ) : (
                        <Button
                            variant="primary"
                            size="l"
                            onClick={onFinish}
                            disabled={loading}
                            className="wizard-actions__btn-finish"
                        >
                            <Icon size="s" className="wizard-actions__icon-finish"><CheckCircle /></Icon>
                            {loading ? 'Saving...' : 'Finish'}
                        </Button>
                    )}
                </div>
            </Card>
        </div>
    );
};

Wizard.propTypes = {
    steps: PropTypes.arrayOf(PropTypes.shape({
        title: PropTypes.string.isRequired,
        icon: PropTypes.elementType.isRequired
    })).isRequired,
    currentStep: PropTypes.number.isRequired,
    onNext: PropTypes.func.isRequired,
    onBack: PropTypes.func,
    onFinish: PropTypes.func,
    loading: PropTypes.bool,
    error: PropTypes.string,
    onErrorDismiss: PropTypes.func,
    children: PropTypes.node,
    className: PropTypes.string
};

export default Wizard;
