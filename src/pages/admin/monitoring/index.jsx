import React from 'react';
import { Spinner, ToggleLeft } from '../../../components/ui';
import { useAdminFeatureFlags, useToggleFeatureFlag } from '../../../hooks/admin';
import { Button } from '../../../components/ui';

/**
 * Admin Feature Flags
 */
const FeatureFlags = () => {
    const { data, isLoading } = useAdminFeatureFlags();
    const toggleFlag = useToggleFeatureFlag();
    const flags = data || [];

    const handleToggle = async (flag) => {
        await toggleFlag.mutateAsync({ id: flag.id, enabled: !flag.is_enabled });
    };

    if (isLoading) {
        return (
            <div className="admin-loading">
                <Spinner size="lg" />
            </div>
        );
    }

    return (
        <div className="admin-feature-flags">
            <div className="admin-header">
                <div>
                    <h1 className="admin-header__title">Feature Flags</h1>
                    <p className="admin-header__subtitle">Toggle features on/off</p>
                </div>
            </div>

            <div className="admin-table">
                {flags.length > 0 ? (
                    <table>
                        <thead>
                            <tr>
                                <th>Key</th>
                                <th>Name</th>
                                <th>Description</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {flags.map((flag) => (
                                <tr key={flag.id}>
                                    <td><code>{flag.key}</code></td>
                                    <td>{flag.name}</td>
                                    <td>{flag.description || '-'}</td>
                                    <td>
                                        <span className={`admin-badge admin-badge--${flag.is_enabled ? 'active' : 'inactive'}`}>
                                            {flag.is_enabled ? 'Enabled' : 'Disabled'}
                                        </span>
                                    </td>
                                    <td>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleToggle(flag)}
                                            disabled={toggleFlag.isPending}
                                        >
                                            {flag.is_enabled ? 'Disable' : 'Enable'}
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div className="admin-empty">
                        <ToggleLeft className="admin-empty__icon" />
                        <div className="admin-empty__title">No feature flags</div>
                    </div>
                )}
            </div>
        </div >
    );
};

export default FeatureFlags;
