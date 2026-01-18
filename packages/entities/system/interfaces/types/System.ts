/**
 * System Types
 */
export interface SystemSetting {
    id?: string;
    setting_key: string;
    value: unknown;
    category?: string;
    description?: string;
    updated_at?: string;
}

export interface SystemFeatureFlag {
    id: string;
    name: string;
    is_enabled: boolean;
    description?: string;
    created_at?: string;
    updated_at?: string;
}

export interface RetentionPolicy {
    id: string;
    policy_name: string;
    retention_days: number;
    is_active: boolean;
}

export interface ActivityLog {
    id: string;
    actor_id?: string;
    action: string;
    entity_type?: string;
    entity_id?: string;
    metadata?: Record<string, unknown>;
    created_at: string;
}

export interface DashboardStats {
    totalUsers: number;
    totalOrganizations: number;
    activeUsersLast7Days: number;
}


