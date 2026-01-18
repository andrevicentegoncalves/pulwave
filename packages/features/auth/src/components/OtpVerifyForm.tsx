import { type FormEvent } from 'react';
import { Input, Button, Icon, ArrowLeft } from '@pulwave/ui';

export interface OtpVerifyFormProps {
    email: string;
    otpCode: string;
    onOtpChange: (code: string) => void;
    onSubmit: (e?: FormEvent) => void;
    onBack: () => void;
    loading?: boolean;
}

export const OtpVerifyForm = ({
    email,
    otpCode,
    onOtpChange,
    onSubmit,
    onBack,
    loading
}: OtpVerifyFormProps) => {
    return (
        <form onSubmit={onSubmit}>
            <p className="color-muted mb-4 text-center">
                We sent a 6-digit code to <strong>{email}</strong>
            </p>
            <Input
                id="otp-code"
                name="otp-code"
                label="Verification Code"
                type="text"
                inputMode="numeric"
                value={otpCode}
                onChange={(e) => onOtpChange(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="123456"
                maxLength={6}
                required
                disabled={loading}
                fullWidth
                autoFocus
                autoComplete="one-time-code"
                className="text-center text-xl tracking-widest"
            />

            <div className="mt-4">
                <Button
                    type="submit"
                    kind="primary"
                    size="l"
                    loading={loading}
                    disabled={otpCode.length < 6}
                    fullWidth
                >
                    Verify & Sign In
                </Button>
            </div>

            <div className="mt-4">
                <Button kind="secondary" fullWidth onClick={onBack} disabled={loading}>
                    <Icon size="s" aria-hidden="true"><ArrowLeft /></Icon>
                    Back
                </Button>
            </div>
        </form>
    );
};
