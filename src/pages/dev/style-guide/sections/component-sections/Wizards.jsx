import React, { useState } from 'react';
import { Wizard, Input, Select, Card } from '../../../../../components/ui';
import { User, Building, CreditCard } from '../../../../../components/ui/iconLibrary';

export default function Wizards() {
    const [currentStep, setCurrentStep] = useState(0);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        role: '',
        company: '',
        email: '',
        cardNumber: ''
    });

    const steps = [
        { title: 'Account Details', icon: User },
        { title: 'Business Info', icon: Building },
        { title: 'Payment Setup', icon: CreditCard }
    ];

    const handleNext = () => {
        setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
    };

    const handleBack = () => {
        setCurrentStep(prev => Math.max(prev - 1, 0));
    };

    const handleFinish = () => {
        alert('Wizard Completed!');
        setCurrentStep(0);
        setFormData({
            firstName: '',
            lastName: '',
            role: '',
            company: '',
            email: '',
            cardNumber: ''
        });
    };

    const handleChange = (field) => (e) => {
        setFormData(prev => ({ ...prev, [field]: e.target.value }));
    };

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-medium mb-4">Wizard</h3>
                <p className="text-muted-foreground mb-6">
                    Multi-step form wizard with progress tracking and validation support.
                </p>

                <Wizard
                    steps={steps}
                    currentStep={currentStep}
                    onNext={handleNext}
                    onBack={handleBack}
                    onFinish={handleFinish}
                >
                    {currentStep === 0 && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                            <div className="grid grid-cols-2 gap-4">
                                <Input
                                    label="First Name"
                                    placeholder="John"
                                    value={formData.firstName}
                                    onChange={handleChange('firstName')}
                                />
                                <Input
                                    label="Last Name"
                                    placeholder="Doe"
                                    value={formData.lastName}
                                    onChange={handleChange('lastName')}
                                />
                            </div>
                            <Input
                                label="Email Address"
                                placeholder="john.doe@example.com"
                                type="email"
                                value={formData.email}
                                onChange={handleChange('email')}
                            />
                        </div>
                    )}

                    {currentStep === 1 && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                            <Input
                                label="Company Name"
                                placeholder="Acme Inc."
                                value={formData.company}
                                onChange={handleChange('company')}
                            />
                            <Select
                                label="Role"
                                value={formData.role}
                                onChange={handleChange('role')}
                                options={[
                                    { value: 'dev', label: 'Developer' },
                                    { value: 'manager', label: 'Manager' },
                                    { value: 'designer', label: 'Designer' }
                                ]}
                            />
                        </div>
                    )}

                    {currentStep === 2 && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                            <div className="p-4 border rounded-lg bg-muted/50 text-center">
                                <p className="text-sm text-muted-foreground mb-4">
                                    This is a demonstration step. No actual payment processing occurs.
                                </p>
                                <Input
                                    label="Card Number (Demo)"
                                    placeholder="**** **** **** ****"
                                    value={formData.cardNumber}
                                    onChange={handleChange('cardNumber')}
                                />
                            </div>
                        </div>
                    )}
                </Wizard>
            </div>
        </div>
    );
}
