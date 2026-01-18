/**
 * SettingsPage - Restaurant App (Thin Wrapper)
 * Uses SettingsShell + ProfileSection + PaymentSection from settings package
 * @package @pulwave/apps/restaurant
 */
// import { SettingsShell, ProfileSection, SecuritySection, PaymentSection } from '@pulwave/features-settings';

export const SettingsPage = () => {
    // return <SettingsShell><ProfileSection /><PaymentSection /></SettingsShell>;
    return <div className="settings-page"><h1>Restaurant Settings</h1></div>;
};

export default SettingsPage;
