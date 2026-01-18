/**
 * User Preferences Types
 */
export interface UserPreferences {
    profile_id: string;
    theme?: string;
    language?: string;
    locale?: string;
    timezone?: string;
    profile_visibility?: string;
    notifications_enabled?: boolean;
    email_notifications?: boolean;
    sms_notifications?: boolean;
    push_notifications?: boolean;
    marketing_emails?: boolean;
    data_processing_consent?: boolean;
    marketing_consent?: boolean;
    ui_layout?: Record<string, any>;
    organization_id?: string | null;
}

