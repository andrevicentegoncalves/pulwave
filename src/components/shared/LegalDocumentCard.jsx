// src/components/shared/LegalDocumentCard.jsx
import React from 'react';
import PropTypes from 'prop-types';
import { Button, Badge } from '../ui';

/**
 * LegalDocumentCard Component
 * Displays legal document acceptance status with view action
 */
const LegalDocumentCard = ({
    title,
    version,
    acceptedAt,
    onView,
}) => {
    const isAccepted = !!version;

    const formatDate = (dateString) => {
        if (!dateString) return '';
        return new Date(dateString).toLocaleDateString();
    };

    return (
        <div className="privacy-document__header">
            <div className="privacy-document__info">
                <div className="privacy-document__title">{title}</div>
                <div className="privacy-document__meta">
                    {isAccepted ? (
                        <>Version {version} • Accepted {formatDate(acceptedAt)}</>
                    ) : (
                        'Not accepted'
                    )}
                </div>
            </div>
            <div className="privacy-document__actions">
                <Badge variant="light" type={isAccepted ? "success" : "neutral"}>
                    {isAccepted ? "Accepted" : "Not Accepted"}
                </Badge>
                <Button variant="outline" size="s" onClick={onView}>
                    View
                </Button>
            </div>
        </div>
    );
};

LegalDocumentCard.propTypes = {
    title: PropTypes.string.isRequired,
    version: PropTypes.string,
    acceptedAt: PropTypes.string,
    onView: PropTypes.func.isRequired,
};

export default LegalDocumentCard;
