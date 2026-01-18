/**
 * Profile Types
 */
export interface Profile {
    id: string;
    auth_user_id: string;
    email: string;
    first_name: string;
    last_name: string;
    middle_name?: string | null;
    username?: string | null;
    display_name?: string;
    bio?: string | null;
    date_of_birth?: string | null;
    gender?: string | null;
    pronouns?: string | null;
    app_role: string;
    is_active: boolean;
    primary_address_id?: string | null;
    billing_address_id?: string | null;
    avatar_url?: string | null;
    created_at?: string;
    updated_at?: string;
}

export interface ProfileAuthState {
    profile_id: string;
    last_login?: string;
    login_count?: number;
    failed_attempts?: number;
    mfa_enabled: boolean;
    locked_until?: string | null;
    auth_methods?: string[];
    webauthn_enabled?: boolean;
    wallet_address?: string | null;
}

export interface OnboardingStatus {
    profile_id: string;
    completed: boolean;
    step: string;
    metadata?: Record<string, any>;
    updated_at: string;
}

import { ProfessionalProfile } from './Professional';
import { SocialProfile } from './Social';
import { UserPreferences } from './Preferences';
import { Contact } from './Contact';
import type { Address } from '@pulwave/entity-address';

export interface UserExportData {
    profile: Profile;
    preferences?: UserPreferences;
    professional_profiles?: ProfessionalProfile[];
    social_profiles?: SocialProfile[];
    contacts?: Contact[];
    addresses?: Address[];
}

export interface SocialData {
    website?: string;
    linkedin_url?: string;
    twitter_url?: string;
    facebook_url?: string;
}

