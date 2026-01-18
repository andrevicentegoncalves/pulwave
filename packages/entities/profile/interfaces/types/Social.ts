/**
 * Social Profile Types
 */
export interface SocialProfile {
    profile_id: string;
    platform: string;
    url: string;
    organization_id?: string | null;
}

