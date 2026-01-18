import type {
    User,
    UserData,
    UserQueryParams,
    Permission,
    PermissionGrant,
    Session,
    AuthResult
} from './types/User';
import type { IVersionedRepository } from '../../_infrastructure/interfaces';

export type { User, Session, AuthResult };

/**
 * IUserRepository
 * Provider-agnostic interface for user/auth operations
 */
export interface IUserRepository extends IVersionedRepository {
    readonly version: '1.0.0';

    // Auth Methods
    getSession(): Promise<AuthResult<{ session: Session | null; user: User | null }>>;
    getCurrentUser(): Promise<AuthResult<{ user: User | null }>>;
    signOut(): Promise<AuthResult<void>>;
    resetPasswordForEmail(email: string, options?: Record<string, any>): Promise<AuthResult<void>>;
    signInWithOtp(params: { email: string; options?: Record<string, any> }): Promise<AuthResult<void>>;
    verifyOtp(params: { email: string; token: string; type: string }): Promise<AuthResult<{ session: Session; user: User }>>;
    onAuthStateChange(callback: (event: string, session: Session | null) => void): { unsubscribe: () => void };

    // User Data Methods
    getUsers(params: UserQueryParams): Promise<{ data: UserData[]; count: number | null }>;
    getUserById(id: string): Promise<UserData | null>;
    createUser(userData: Partial<UserData>): Promise<UserData>;
    updateUser(id: string, updates: Partial<UserData>): Promise<UserData>;
    updateAuthState(profileId: string, updates: Record<string, unknown>): Promise<void>;

    // User Permissions
    getUserPermissions(userId: string): Promise<string[]>;
    checkUserHasPermission(userId: string, permissionName: string): Promise<boolean>;
    getUserPermissionGrants(userId: string): Promise<PermissionGrant[]>;
    grantUserPermission(userId: string, permissionId: string, grantedBy: string, reason?: string | null, expiresAt?: string | null): Promise<PermissionGrant>;
    revokeUserPermission(userId: string, permissionId: string): Promise<void>;
    getAllPermissions(): Promise<Permission[]>;
}

