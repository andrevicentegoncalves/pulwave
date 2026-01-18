/**
 * OnboardingPage Wrapper
 * 
 * For now, shows a placeholder until onboarding is rebuilt.
 * (Onboarding was deprecated per user)
 * 
 * @package @pulwave/experience/onboarding
 */

export interface OnboardingPageProps {
    /** Redirect path after completion */
    onComplete?: string;
}

/**
 * OnboardingPage - Profile onboarding wizard
 * NOTE: This feature is being deprecated/rebuilt
 */
export const OnboardingPage = () => {
    return (
        <div className="onboarding-page">
            <h1>Onboarding</h1>
            <p>Onboarding feature is being rebuilt...</p>
        </div>
    );
};

OnboardingPage.displayName = 'OnboardingPage';

export default OnboardingPage;
