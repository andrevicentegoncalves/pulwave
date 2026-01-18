import { type FormEvent } from 'react';
import { Input, Button, Icon, KeyRound, ArrowLeft } from '@pulwave/ui';

export interface EmailOtpFormProps {
    email: string;
    onEmailChange: (email: string) => void;
    onSubmit: (e?: FormEvent) => void;
    onBack: () => void;
    loading?: boolean;
}

export const EmailOtpForm = ({
    email,
    onEmailChange,
    onSubmit,
    onBack,
    loading
}: EmailOtpFormProps) => {
    return (
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
            <Input
                id="email"
                name="email"
                label="Email"
                type="email"
                value={email}
                onChange={(e) => onEmailChange(e.target.value)}
                placeholder="you@example.com"
                required
                disabled={loading}
                fullWidth
                autoFocus
                autoComplete="email"
                spellCheck={false}
            />

            <Button
                type="submit"
                kind="primary"
                size="l"
                loading={loading}
                disabled={!email}
                fullWidth
                leftIcon={<KeyRound size={18} aria-hidden="true" />}
            >
                Send Code
            </Button>

            <Button kind="secondary" fullWidth onClick={onBack} disabled={loading}>
                <Icon size="s" aria-hidden="true"><ArrowLeft /></Icon>
                Back
            </Button>
        </form>
    );
};
