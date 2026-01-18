import React from 'react';
import { createElement } from 'react';
import { ArrowLeft, ArrowRight, Check } from '@pulwave/ui';
import { classNames } from '@pulwave/utils';
import { Icon, Button, Card, Alert } from '@pulwave/ui';
import {
    wizardContainerVariants,
    wizardProgressVariants,
    wizardStepVariants,
    type WizardProps
} from './types';
import './styles/_index.scss';

export const Wizard = ({
    steps,
    currentStep,
    onNext,
    onBack,
    onFinish,
    loading = false,
    error = null,
    onErrorDismiss,
    children,
    className
}: WizardProps) => (
    <div className={classNames(wizardContainerVariants(), className)}>
        <div className={classNames(wizardProgressVariants())}>
            <div className="wizard-progress__steps">
                {steps.map((step, index) => (
                    <div
                        key={step.title || `step-${index}`}
                        className={classNames(wizardStepVariants({
                            active: index === currentStep,
                            completed: index < currentStep
                        }))}
                    >
                        <div className="wizard-progress__circle" aria-hidden="true">
                            <Icon size="s">{createElement(step.icon)}</Icon>
                        </div>
                        <span className="wizard-progress__title">{step.title}</span>
                    </div>
                ))}
            </div>
            <div className="wizard-progress__bar">
                <div
                    className="wizard-progress__fill"
                    style={{ '--progress': `${(currentStep / (Math.max(steps.length - 1, 1))) * 100}%` } as React.CSSProperties}
                />
            </div>
        </div>
        <Card className="wizard-card">
            {error && <Alert status="error" dismissible onDismiss={onErrorDismiss}>{error}</Alert>}
            <div className="wizard-content">{children}</div>
            <div className="wizard-actions">
                {currentStep > 0 && (
                    <Button kind="secondary" variant="outlined" size="l" onClick={onBack} className="wizard-actions__btn-back">
                        <ArrowLeft size={16} aria-hidden="true" /> Back
                    </Button>
                )}
                {currentStep < steps.length - 1 ? (
                    <Button kind="primary" size="l" onClick={onNext} className="wizard-actions__btn-next">
                        Next <ArrowRight size={16} aria-hidden="true" />
                    </Button>
                ) : (
                    <Button kind="primary" size="l" onClick={onFinish} disabled={loading} className="wizard-actions__btn-finish">
                        {loading ? 'Saving…' : <><Check size={16} aria-hidden="true" /> Finish</>}
                    </Button>
                )}
            </div>
        </Card>
    </div>
);
Wizard.displayName = 'Wizard';
