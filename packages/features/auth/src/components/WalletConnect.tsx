import { Button, Mail, Wallet } from '@pulwave/ui';

export interface WalletConnectProps {
    onWalletClick: () => void;
    onEmailClick: () => void;
    loading?: boolean;
}

export const WalletConnect = ({
    onWalletClick,
    onEmailClick,
    loading
}: WalletConnectProps) => {
    return (
        <div className="auth-buttons flex flex-col gap-3">
            <Button
                kind="primary"
                size="l"
                fullWidth
                onClick={onEmailClick}
                disabled={loading}
                leftIcon={<Mail size={18} aria-hidden="true" />}
            >
                Continue with Email
            </Button>

            <Button
                kind="secondary"
                size="l"
                fullWidth
                onClick={onWalletClick}
                loading={loading}
                leftIcon={<Wallet size={18} aria-hidden="true" />}
            >
                Connect Wallet
            </Button>
        </div>
    );
};
