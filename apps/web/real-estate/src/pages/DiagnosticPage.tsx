/**
 * Diagnostic Page
 * Shows current user and profile data for debugging
 */
import { useUser } from '@pulwave/features-user';
import { useAuth } from '@pulwave/features-auth';

export const DiagnosticPage = () => {
    const { user, profile, loading, error, isAuthenticated } = useUser();
    const { user: authUser } = useAuth();

    return (
        <div style={{ padding: '2rem', fontFamily: 'monospace' }}>
            <h1>🔍 User Diagnostic</h1>

            <h2>Loading State</h2>
            <pre>{JSON.stringify({ loading, isAuthenticated }, null, 2)}</pre>

            <h2>Auth User (from useAuth)</h2>
            <pre>{JSON.stringify(authUser, null, 2)}</pre>

            <h2>User (from useUser)</h2>
            <pre>{JSON.stringify(user, null, 2)}</pre>

            <h2>Profile (from useUser)</h2>
            <pre style={{ backgroundColor: '#f0f0f0', padding: '1rem', borderRadius: '4px' }}>
                {JSON.stringify(profile, null, 2)}
            </pre>

            {profile && (
                <>
                    <h2>Admin Access Check</h2>
                    <div style={{ padding: '1rem', backgroundColor: profile.app_role === 'admin' || profile.app_role === 'super_admin' ? '#d4edda' : '#f8d7da', borderRadius: '4px' }}>
                        <p><strong>app_role:</strong> {profile.app_role}</p>
                        <p><strong>Has Admin Access:</strong> {profile.app_role === 'admin' || profile.app_role === 'super_admin' ? '✅ YES' : '❌ NO'}</p>
                        <p><strong>Expected values:</strong> 'admin' or 'super_admin'</p>
                    </div>
                </>
            )}

            {error && (
                <>
                    <h2>Error</h2>
                    <pre style={{ color: 'red' }}>{JSON.stringify(error, null, 2)}</pre>
                </>
            )}
        </div>
    );
};

export default DiagnosticPage;
