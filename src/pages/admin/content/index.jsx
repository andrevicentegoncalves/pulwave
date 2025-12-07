import React from 'react';
import { Spinner, Database } from '../../../components/ui';
import { useAdminRetentionPolicies } from '../../../hooks/admin';

/**
 * Admin Data Retention Policies
 */
const RetentionPolicies = () => {
    const { data, isLoading } = useAdminRetentionPolicies();
    const policies = data || [];

    if (isLoading) {
        return (
            <div className="admin-loading">
                <Loader2 className="admin-loading__spinner" size={32} />
            </div>
        );
    }

    return (
        <div className="admin-retention">
            <div className="admin-header">
                <div>
                    <h1 className="admin-header__title">Data Retention</h1>
                    <p className="admin-header__subtitle">Manage data retention policies</p>
                </div>
            </div>

            <div className="admin-table">
                {policies.length > 0 ? (
                    <table>
                        <thead>
                            <tr>
                                <th>Category</th>
                                <th>Table</th>
                                <th>Active (days)</th>
                                <th>Soft Delete (days)</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {policies.map((policy) => (
                                <tr key={policy.id}>
                                    <td>{policy.data_category}</td>
                                    <td><code>{policy.table_name}</code></td>
                                    <td>{policy.active_retention_days}</td>
                                    <td>{policy.soft_delete_retention_days}</td>
                                    <td>
                                        <span className={`admin-badge admin-badge--${policy.is_enabled ? 'active' : 'inactive'}`}>
                                            {policy.is_enabled ? 'Enabled' : 'Disabled'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div className="admin-empty">
                        <Database className="admin-empty__icon" />
                        <div className="admin-empty__title">No retention policies</div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RetentionPolicies;
