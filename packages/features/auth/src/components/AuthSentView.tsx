import { Card, Button, Icon, CheckCircle, ArrowLeft } from '@pulwave/ui';

export interface AuthSentViewProps {
    email: string;
    onBack: () => void;
}

export const AuthSentView = ({
    email,
    onBack
}: AuthSentViewProps) => {
    return (
        <div className="text-center">
            <Icon size="xl" className="color-success mb-3" aria-hidden="true">
                <CheckCircle />
            </Icon>
            <h1 className="h3">Check Your Email</h1>
            <p className="color-muted margin-top-2">
                We sent a link to <strong>{email}</strong>
            </p>
            <div className="mt-4">
                <Button kind="secondary" fullWidth onClick={onBack}>
                    <Icon size="s" aria-hidden="true"><ArrowLeft /></Icon>
                    Back to Sign In
                </Button>
            </div>
        </div>
    );
};
