/**
 * User Types
 */
export interface User {
    id: string;
    aud: string;
    role?: string;
    email?: string;
    email_confirmed_at?: string;
    phone?: string;
    confirmed_at?: string;
    last_sign_in_at?: string;
    app_metadata: {
        provider?: string;
        [key: string]: any;
    };
    user_metadata: Record<string, any>;
    identities?: {
        id: string;
        user_id: string;
        identity_data?: {
            [key: string]: any;
        };
        provider: string;
        created_at?: string;
        last_sign_in_at?: string;
        updated_at?: string;
    }[];
    created_at: string;
    updated_at: string;
}

export interface UserData {
    id: string;
    email: string;
    first_name?: string;
    last_name?: string;
    display_name?: string;
    app_role: string;
    is_active: boolean;
    created_at?: string;
    updated_at?: string;
    [key: string]: unknown;
}

export interface UserQueryParams {
    page?: number;
    limit?: number;
    search?: string;
    role?: string;
    is_active?: boolean;
}

export interface Permission {
    id: string;
    permission_name: string;
    permission_category: string;
    description?: string;
    is_active: boolean;
}

export interface PermissionGrant {
    id: string;
    user_id: string;
    permission_id: string;
    granted_by: string;
    reason?: string;
    expires_at?: string;
    created_at: string;
}

export interface AuthResult<T = any> {
    data?: T;
    error?: {
        message: string;
        code?: string;
        status?: number;
    };
    success: boolean;
}

export interface Session {
    access_token: string;
    refresh_token: string;
    expires_in: number;
    expires_at?: number;
    token_type: string;
    user: User | null;
}

