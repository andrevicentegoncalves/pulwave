import { useState } from 'react';
import { GitMerge, AlertTriangle, User, Calendar, X, Check } from '@pulwave/ui';
import { Button, Icon, Alert, Modal } from '@pulwave/ui';

export interface MergeAccountModalProps {
    isOpen: boolean;
    onClose: () => void;
    conflictType?: 'email' | 'wallet';
    conflictIdentifier?: string;
    conflictProfile?: {
        id: string;
        email?: string;
        createdAt?: string;
    };
    currentProfile?: {
        id: string;
        email?: string;
        createdAt?: string;
    };
    onMergeRequest: (conflictProfileId: string, type: 'email' | 'wallet', identifier: string) => Promise<void>;
}

export const MergeAccountModal = ({
    isOpen,
    onClose,
    conflictType = 'email',
    conflictIdentifier,
    conflictProfile,
    currentProfile,
    onMergeRequest
}: MergeAccountModalProps) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleMergeRequest = async () => {
        if (!conflictProfile?.id || !conflictIdentifier) return;

        setLoading(true);
        setError(null);

        try {
            await onMergeRequest(conflictProfile.id, conflictType, conflictIdentifier);
            setSuccess(true);
        } catch (err: any) {
            // Silent error handling - display error message to user
            setError(err.message || 'Failed to create merge request');
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateStr?: string) => {
        if (!dateStr) return 'Unknown';
        return new Intl.DateTimeFormat(undefined, {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        }).format(new Date(dateStr));
    };

    const olderProfile = conflictProfile?.createdAt && currentProfile?.createdAt
        ? new Date(conflictProfile.createdAt) < new Date(currentProfile.createdAt)
            ? 'existing'
            : 'current'
        : 'existing';

    if (success) {
        return (
            <Modal isOpen={isOpen} onClose={onClose} title="Merge Request Sent">
                <div className="text-center p-6">
                    <Icon size="xl" className="color-success mb-3">
                        <Check />
                    </Icon>
                    <h3 className="h4 mb-2">Request Sent!</h3>
                    <p className="color-muted mb-4">
                        The owner of <strong>{conflictIdentifier}</strong> will receive a notification to confirm the merge.
                    </p>
                    <p className="text-s color-muted">
                        Once they confirm, your accounts will be merged and you'll have access to all data.
                    </p>
                    <div className="mt-5">
                        <Button kind="primary" onClick={onClose} fullWidth>
                            Got it
                        </Button>
                    </div>
                </div>
            </Modal>
        );
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Account Already Exists">
            <div className="p-4">
                {/* Warning */}
                <Alert status="warning" className="mb-4">
                    <Icon size="s"><AlertTriangle /></Icon>
                    <span>
                        This {conflictType === 'email' ? 'email' : 'wallet'} is already linked to another account.
                    </span>
                </Alert>

                {/* Conflict details */}
                <div className="flex flex-col gap-4 mb-4">
                    {/* Existing account */}
                    <div className="bg-surface-subtle p-4 rounded-m">
                        <div className="flex items-center gap-3 mb-2">
                            <Icon size="m" className="color-primary"><User /></Icon>
                            <div>
                                <strong>Existing Account</strong>
                                {olderProfile === 'existing' && (
                                    <span className="badge badge--s badge--info ml-2">Older</span>
                                )}
                            </div>
                        </div>
                        <div className="text-s color-muted">
                            <div>{conflictProfile?.email || conflictIdentifier}</div>
                            {conflictProfile?.createdAt && (
                                <div className="flex items-center gap-1 mt-1">
                                    <Calendar size={12} aria-hidden="true" />
                                    Created {formatDate(conflictProfile.createdAt)}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Merge arrow */}
                    <div className="text-center">
                        <Icon size="l" className="color-primary">
                            <GitMerge />
                        </Icon>
                    </div>

                    {/* Current account */}
                    <div className="bg-surface-subtle p-4 rounded-m">
                        <div className="flex items-center gap-3 mb-2">
                            <Icon size="m" className="color-secondary"><User /></Icon>
                            <div>
                                <strong>Your Account</strong>
                                {olderProfile === 'current' && (
                                    <span className="badge badge--s badge--info ml-2">Older</span>
                                )}
                            </div>
                        </div>
                        <div className="text-s color-muted">
                            <div>{currentProfile?.email || 'Current session'}</div>
                            {currentProfile?.createdAt && (
                                <div className="flex items-center gap-1 mt-1">
                                    <Calendar size={12} aria-hidden="true" />
                                    Created {formatDate(currentProfile.createdAt)}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Merge info */}
                <div className="surface-elevated p-3 rounded-m mb-4">
                    <p className="text-s">
                        <strong>How merge works:</strong>
                    </p>
                    <ul className="text-s color-muted mt-1" style={{ paddingLeft: '1.2rem' }}>
                        <li>The older account keeps all its data</li>
                        <li>Auth methods (email, wallets) are combined</li>
                        <li>Organization memberships are transferred</li>
                        <li>Both parties must confirm the merge</li>
                    </ul>
                </div>

                {error && (
                    <Alert status="error" className="mb-4">
                        {error}
                    </Alert>
                )}

                {/* Actions */}
                <div className="flex gap-3">
                    <Button
                        kind="secondary"
                        variant="outlined"
                        onClick={onClose}
                        fullWidth
                        disabled={loading}
                    >
                        <Icon size="s"><X /></Icon>
                        Cancel
                    </Button>
                    <Button
                        kind="primary"
                        onClick={handleMergeRequest}
                        loading={loading}
                        fullWidth
                    >
                        <Icon size="s"><GitMerge /></Icon>
                        Request Merge
                    </Button>
                </div>
            </div>
        </Modal>
    );
};
