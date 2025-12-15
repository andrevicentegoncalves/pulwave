// src/components/modals/MergeAccountModal.jsx
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { GitMerge, AlertTriangle, User, Calendar, X, Check } from 'lucide-react';
import { Button, Icon, Alert, Modal } from '../ui';
import { profileMergeService } from '../../services';

/**
 * Modal for handling profile merge requests
 * Shows when a conflict is detected (email or wallet already exists)
 */
const MergeAccountModal = ({
    isOpen,
    onClose,
    conflictType = 'email', // 'email' or 'wallet'
    conflictIdentifier, // Email or wallet address
    conflictProfile, // Profile that owns the conflicting identifier
    currentProfile, // Current user's profile
}) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const handleMergeRequest = async () => {
        setLoading(true);
        setError(null);

        try {
            await profileMergeService.createMergeRequest(conflictProfile.id, {
                requestType: `${conflictType}_conflict`,
                conflictIdentifier,
                conflictType
            });
            setSuccess(true);
        } catch (err) {
            console.error('Merge request error:', err);
            setError(err.message || 'Failed to create merge request');
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return 'Unknown';
        return new Date(dateStr).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const olderProfile = conflictProfile?.createdAt && currentProfile?.createdAt
        ? new Date(conflictProfile.createdAt) < new Date(currentProfile.createdAt)
            ? 'existing'
            : 'current'
        : 'existing';

    if (success) {
        return (
            <Modal isOpen={isOpen} onClose={onClose} title="Merge Request Sent">
                <div className="text-center padding-6">
                    <Icon size="xl" className="color-success margin-bottom-3">
                        <Check />
                    </Icon>
                    <h3 className="h4 margin-bottom-2">Request Sent!</h3>
                    <p className="color-muted margin-bottom-4">
                        The owner of <strong>{conflictIdentifier}</strong> will receive a notification to confirm the merge.
                    </p>
                    <p className="text-s color-muted">
                        Once they confirm, your accounts will be merged and you'll have access to all data.
                    </p>
                    <div className="margin-top-5">
                        <Button variant="primary" onClick={onClose} fullWidth>
                            Got it
                        </Button>
                    </div>
                </div>
            </Modal>
        );
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Account Already Exists">
            <div className="padding-4">
                {/* Warning */}
                <Alert type="warning" className="margin-bottom-4">
                    <Icon size="s"><AlertTriangle /></Icon>
                    <span>
                        This {conflictType === 'email' ? 'email' : 'wallet'} is already linked to another account.
                    </span>
                </Alert>

                {/* Conflict details */}
                <div className="flex flex-column gap-4 margin-bottom-4">
                    {/* Existing account */}
                    <div className="surface-subtle padding-4 border-radius-m">
                        <div className="flex align-items-center gap-3 margin-bottom-2">
                            <Icon size="m" className="color-primary"><User /></Icon>
                            <div>
                                <strong>Existing Account</strong>
                                {olderProfile === 'existing' && (
                                    <span className="badge badge--s badge--info margin-left-2">Older</span>
                                )}
                            </div>
                        </div>
                        <div className="text-s color-muted">
                            <div>{conflictProfile?.email || conflictIdentifier}</div>
                            {conflictProfile?.createdAt && (
                                <div className="flex align-items-center gap-1 margin-top-1">
                                    <Calendar size={12} />
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
                    <div className="surface-subtle padding-4 border-radius-m">
                        <div className="flex align-items-center gap-3 margin-bottom-2">
                            <Icon size="m" className="color-secondary"><User /></Icon>
                            <div>
                                <strong>Your Account</strong>
                                {olderProfile === 'current' && (
                                    <span className="badge badge--s badge--info margin-left-2">Older</span>
                                )}
                            </div>
                        </div>
                        <div className="text-s color-muted">
                            <div>{currentProfile?.email || 'Current session'}</div>
                            {currentProfile?.createdAt && (
                                <div className="flex align-items-center gap-1 margin-top-1">
                                    <Calendar size={12} />
                                    Created {formatDate(currentProfile.createdAt)}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Merge info */}
                <div className="surface-elevated padding-3 border-radius-m margin-bottom-4">
                    <p className="text-s">
                        <strong>How merge works:</strong>
                    </p>
                    <ul className="text-s color-muted margin-top-1" style={{ paddingLeft: '1.2rem' }}>
                        <li>The older account keeps all its data</li>
                        <li>Auth methods (email, wallets) are combined</li>
                        <li>Organization memberships are transferred</li>
                        <li>Both parties must confirm the merge</li>
                    </ul>
                </div>

                {error && (
                    <Alert type="error" className="margin-bottom-4">
                        {error}
                    </Alert>
                )}

                {/* Actions */}
                <div className="flex gap-3">
                    <Button
                        variant="secondary"
                        onClick={onClose}
                        fullWidth
                        disabled={loading}
                    >
                        <Icon size="s"><X /></Icon>
                        Cancel
                    </Button>
                    <Button
                        variant="primary"
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

MergeAccountModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    conflictType: PropTypes.oneOf(['email', 'wallet']),
    conflictIdentifier: PropTypes.string,
    conflictProfile: PropTypes.shape({
        id: PropTypes.string,
        email: PropTypes.string,
        createdAt: PropTypes.string
    }),
    currentProfile: PropTypes.shape({
        id: PropTypes.string,
        email: PropTypes.string,
        createdAt: PropTypes.string
    })
};

export default MergeAccountModal;
