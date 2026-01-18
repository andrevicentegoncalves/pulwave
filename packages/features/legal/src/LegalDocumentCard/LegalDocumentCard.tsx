/**
 * LegalDocumentCard
 * 
 * Displays legal document acceptance status with view action.
 * 
 * @package @pulwave/experience
 */
import { Button, Badge, Text } from '@pulwave/ui';

export interface LegalDocumentCardProps {
    /** Document title */
    title: string;
    /** Version number */
    version?: string;
    /** Acceptance date */
    acceptedAt?: string;
    /** View button handler */
    onView: () => void;
}

/**
 * LegalDocumentCard - Legal document status display
 */
export const LegalDocumentCard = ({
    title,
    version,
    acceptedAt,
    onView,
}: LegalDocumentCardProps) => {
    const isAccepted = !!version;

    const formatDate = (dateString?: string) => {
        if (!dateString) return '';
        return new Intl.DateTimeFormat(undefined, {
            dateStyle: 'medium'
        }).format(new Date(dateString));
    };

    return (
        <div className="privacy-document__header">
            <div className="privacy-document__info">
                <Text className="privacy-document__title" weight="medium">{title}</Text>
                <Text className="privacy-document__meta" category="body" size="s" color="muted">
                    {isAccepted ? (
                        <>Version {version} • Accepted {formatDate(acceptedAt)}</>
                    ) : (
                        'Not accepted'
                    )}
                </Text>
            </div>
            <div className="privacy-document__actions">
                <Badge variant="light" status={isAccepted ? "success" : "neutral"}>
                    {isAccepted ? "Accepted" : "Not Accepted"}
                </Badge>
                <Button variant="ghost" size="s" onClick={onView}>
                    View
                </Button>
            </div>
        </div>
    );
};

LegalDocumentCard.displayName = 'LegalDocumentCard';

export default LegalDocumentCard;
