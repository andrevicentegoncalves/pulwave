/**
 * useSettingsData Partial Hook
 * Manages user preferences (theme, timezone, locale) and notification settings.
 */
import { useState } from 'react';
import { FullProfile } from '../../interfaces/types/FullProfile';

export interface SettingsFormData {
    theme: string;
    timezone: string;
    locale: string;
    notifications_enabled: boolean;
    email_notifications: boolean;
    sms_notifications: boolean;
    push_notifications: boolean;
    marketing_emails: boolean;
    ui_layout: Record<string, any>;
}

export const useSettingsData = () => {
    const [formData, setFormData] = useState<SettingsFormData>({
        theme: 'light',
        timezone: 'UTC',
        locale: 'en-US',
        notifications_enabled: false,
        email_notifications: false,
        sms_notifications: false,
        push_notifications: false,
        marketing_emails: false,
        ui_layout: { style: 'pulwave' },
    });

    const mapProfileToSettingsData = (profile: FullProfile | null) => {
        const prefs = profile?.user_preferences?.[0];
        if (!prefs) return;

        setFormData({
            theme: prefs.theme || 'light',
            timezone: prefs.timezone || 'UTC',
            locale: prefs.locale || 'en-US',
            notifications_enabled: prefs.notifications_enabled ?? false,
            email_notifications: prefs.email_notifications ?? false,
            sms_notifications: prefs.sms_notifications ?? false,
            push_notifications: prefs.push_notifications ?? false,
            marketing_emails: prefs.marketing_emails ?? false,
            ui_layout: prefs.ui_layout || { style: 'pulwave' },
        });
    };

    const handleSettingsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked, type } = e.target;
        if (type === 'checkbox') {
            setFormData(prev => ({ ...prev, [name]: checked }));
        }
    };

    const handleSelectSettingsChange = (name: string, value: string) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    return {
        formData,
        setFormData,
        mapProfileToSettingsData,
        handleSettingsChange,
        handleSelectSettingsChange,
    };
};
