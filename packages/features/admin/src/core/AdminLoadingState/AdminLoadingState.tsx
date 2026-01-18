import { Spinner } from '@pulwave/ui';

interface AdminLoadingStateProps {
    size?: 's' | 'm' | 'l' | 'xl';
}

/**
 * AdminLoadingState - Consistent loading spinner for admin pages
 * Replaces duplicate loading markup across all admin pages
 */
export const AdminLoadingState = ({ size = 'l' }: AdminLoadingStateProps) => (
    <div className="admin-loading">
        <Spinner size={size} />
    </div>
);
