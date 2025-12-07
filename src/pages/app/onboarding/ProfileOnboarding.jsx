import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Wizard } from '../../../components/ui';
import ContentLayout from '../../../components/layouts/ContentLayout';
import { useOnboardingForm } from '../../../hooks/useOnboardingForm';
import PersonalInfoStep from '../../../components/features/onboarding/steps/PersonalInfoStep';
import ProfessionalStep from '../../../components/features/onboarding/steps/ProfessionalStep';
import CompanyDetailsStep from '../../../components/features/onboarding/steps/CompanyDetailsStep';
import AddressStep from '../../../components/features/onboarding/steps/AddressStep';
import ProfilePictureStep from '../../../components/features/onboarding/steps/ProfilePictureStep';
import { ONBOARDING_STEPS } from '../../../constants/onboardingConstants';

const ProfileOnboarding = () => {
    const navigate = useNavigate();
    const {
        currentStep,
        steps,
        formData,
        setFormData,
        loading,
        uploading,
        error,
        avatarUrl,
        handleChange,
        handleSelectChange,
        handleNext,
        handleBack,
        handleFinish,
        handleAvatarUpload,
        setError
    } = useOnboardingForm(navigate);

    const renderStep = () => {
        if (!steps[currentStep]) return null;
        const stepTitle = steps[currentStep].title;

        switch (stepTitle) {
            case ONBOARDING_STEPS.PERSONAL_INFO:
                return <PersonalInfoStep formData={formData} handleChange={handleChange} />;
            case ONBOARDING_STEPS.PROFESSIONAL:
                return <ProfessionalStep formData={formData} handleSelectChange={handleSelectChange} handleChange={handleChange} />;
            case ONBOARDING_STEPS.COMPANY_DETAILS:
                return <CompanyDetailsStep formData={formData} handleChange={handleChange} />;
            case ONBOARDING_STEPS.ADDRESS:
                return <AddressStep formData={formData} setFormData={setFormData} />;
            case ONBOARDING_STEPS.PROFILE_PICTURE:
                return <ProfilePictureStep avatarUrl={avatarUrl} handleAvatarUpload={handleAvatarUpload} uploading={uploading} />;
            default:
                return null;
        }
    };

    return (
        <ContentLayout className="onboarding-layout">
            <div className="profile-onboarding">
                <Wizard
                    steps={steps}
                    currentStep={currentStep}
                    onNext={handleNext}
                    onBack={handleBack}
                    onFinish={handleFinish}
                    loading={loading}
                    error={error}
                    onErrorDismiss={() => setError(null)}
                >
                    {renderStep()}
                </Wizard>
            </div>
        </ContentLayout>
    );
};

export default ProfileOnboarding;
