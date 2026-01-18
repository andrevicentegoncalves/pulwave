export interface UserData {
    id?: string;
    email?: string;
    first_name?: string;
    last_name?: string;
    avatarUrl?: string;
    fullName?: string;
    role?: string;
    app_role?: string;
    [key: string]: any;
}
