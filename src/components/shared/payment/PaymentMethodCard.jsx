// src/components/shared/payment/PaymentMethodCard.jsx
import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { Card, Button, Badge, Tooltip, VerificationBadge } from '../../ui';
import { Dropdown, DropdownItem } from '../../ui/Dropdown';
import {
    Check,
    Clock,
    AlertTriangle,
    MoreVertical,
    Edit2,
    Trash2
} from 'lucide-react';
import { getMethodTypeIcon } from '../../../utils/paymentHelpers.jsx';
import { getCardExpiryStatus, formatLastUsed } from '../../../utils/dateHelpers';

/**
 * PaymentMethodCard Component
 * Displays a single payment method with status, expiry, and actions
 */
const PaymentMethodCard = ({
    method,
    onSetDefault,
    onEdit,
    onDelete,
    isOnlyDefault = false
}) => {
    const expiryStatus = getCardExpiryStatus(method.expiry_month, method.expiry_year);
    const isExpired = expiryStatus?.isExpired ?? false;
    const isExpiringSoon = expiryStatus?.isExpiringSoon ?? false;
    const hasFailures = method.failure_count > 0;

    const handleIconError = (e) => {
        e.target.style.display = 'none';
        if (e.target.nextSibling) {
            e.target.nextSibling.style.display = 'flex';
        }
    };

    return (
        <Card
            className={clsx(
                'payment-method-card',
                isExpired && 'payment-method-card--expired',
                isExpiringSoon && 'payment-method-card--expiring'
            )}
        >
            <div className="payment-method-card__content">
                {/* Icon */}
                <div className="payment-method-card__icon">
                    {method.icon_url ? (
                        <img
                            src={method.icon_url}
                            alt={method.icon_display_name || method.card_brand}
                            className="payment-method-card__brand-icon"
                            onError={handleIconError}
                        />
                    ) : null}
                    <span
                        className={clsx(
                            'payment-method-card__fallback-icon',
                            method.icon_url && 'payment-method-card__fallback-icon--hidden'
                        )}
                    >
                        {getMethodTypeIcon(method.method_type)}
                    </span>
                </div>

                {/* Details */}
                <div className="payment-method-card__details">
                    <div className="payment-method-card__primary">
                        <span className="payment-method-card__name">
                            {method.computed_display_name}
                        </span>
                        {method.is_default && (
                            <Badge variant="solid" type="primary" size="s">
                                <Check size={10} className="margin-right-1" />
                                Default
                            </Badge>
                        )}
                    </div>

                    <div className="payment-method-card__secondary">
                        {/* Expiry for cards */}
                        {method.method_type === 'card' && method.expiry_month && (
                            <span className={clsx(
                                'payment-method-card__expiry',
                                isExpired && 'payment-method-card__expiry--expired',
                                isExpiringSoon && 'payment-method-card__expiry--warning'
                            )}>
                                {isExpired ? (
                                    <>
                                        <AlertTriangle size={12} />
                                        Expired {method.expiry_month}/{method.expiry_year}
                                    </>
                                ) : isExpiringSoon ? (
                                    <>
                                        <Clock size={12} />
                                        Expires {method.expiry_month}/{method.expiry_year}
                                    </>
                                ) : (
                                    `Expires ${method.expiry_month}/${method.expiry_year}`
                                )}
                            </span>
                        )}

                        {/* Last used */}
                        <span className="payment-method-card__last-used">
                            {formatLastUsed(method.last_used_at)}
                        </span>

                        {/* Usage count */}
                        {method.usage_count > 0 && (
                            <span className="payment-method-card__usage">
                                {method.usage_count} payment{method.usage_count !== 1 ? 's' : ''}
                            </span>
                        )}
                    </div>

                    {/* Status badges */}
                    <div className="payment-method-card__badges">
                        <VerificationBadge status={method.verification_status} />

                        {hasFailures && (
                            <Tooltip content={`Last failure: ${method.last_failure_reason || 'Unknown'}`}>
                                <Badge variant="light" type="error" size="s">
                                    <AlertTriangle size={12} className="margin-right-1" />
                                    {method.failure_count} failure{method.failure_count !== 1 ? 's' : ''}
                                </Badge>
                            </Tooltip>
                        )}
                    </div>
                </div>

                {/* Actions */}
                <div className="payment-method-card__actions">
                    {!method.is_default && !isExpired && (
                        <Button
                            variant="outline"
                            size="s"
                            onClick={() => onSetDefault?.(method.id)}
                        >
                            Set Default
                        </Button>
                    )}

                    <Dropdown
                        trigger={
                            <Button
                                variant="ghost"
                                size="s"
                                aria-label="More actions"
                            >
                                <MoreVertical size={16} />
                            </Button>
                        }
                        align="right"
                    >
                        <DropdownItem
                            icon={<Edit2 size={14} />}
                            onClick={() => onEdit?.(method)}
                        >
                            Edit
                        </DropdownItem>
                        <DropdownItem
                            icon={<Trash2 size={14} />}
                            onClick={() => onDelete?.(method)}
                            danger
                            disabled={method.is_default && isOnlyDefault}
                        >
                            Remove
                        </DropdownItem>
                    </Dropdown>
                </div>
            </div>
        </Card>
    );
};

PaymentMethodCard.propTypes = {
    /** Payment method data object */
    method: PropTypes.shape({
        id: PropTypes.string.isRequired,
        method_type: PropTypes.string,
        computed_display_name: PropTypes.string,
        icon_url: PropTypes.string,
        icon_display_name: PropTypes.string,
        card_brand: PropTypes.string,
        expiry_month: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        expiry_year: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        is_default: PropTypes.bool,
        verification_status: PropTypes.string,
        failure_count: PropTypes.number,
        last_failure_reason: PropTypes.string,
        last_used_at: PropTypes.string,
        usage_count: PropTypes.number
    }).isRequired,
    /** Callback when "Set Default" is clicked */
    onSetDefault: PropTypes.func,
    /** Callback when "Edit" is clicked */
    onEdit: PropTypes.func,
    /** Callback when "Remove" is clicked */
    onDelete: PropTypes.func,
    /** Whether this is the only default payment method (prevents deletion) */
    isOnlyDefault: PropTypes.bool
};

export default PaymentMethodCard;
