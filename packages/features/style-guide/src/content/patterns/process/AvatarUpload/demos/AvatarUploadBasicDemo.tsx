import { useState } from 'react';
import { AvatarUpload } from '@pulwave/widgets';
import { Stack, Toast } from '@pulwave/ui';
import { DemoCard } from '@pulwave/features-style-guide';

const codeUsage = `<AvatarUpload
    size="xl"
    src={avatarSrc}
    onUpload={handleUpload}
    loading={loading}
/>`;

const AvatarUploadBasicDemo = () => {
    const [avatarSrc, setAvatarSrc] = useState<string | undefined>(undefined);
    const [loading, setLoading] = useState(false);
    const [toastOpen, setToastOpen] = useState(false);

    const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setLoading(true);

            // Simulate upload delay
            setTimeout(() => {
                const reader = new FileReader();
                reader.onload = (e) => {
                    setAvatarSrc(e.target?.result as string);
                    setLoading(false);
                    setToastOpen(true);
                };
                reader.readAsDataURL(file);
            }, 1000);
        }
    };

    return (
        <DemoCard sourceCode={codeUsage} showSourceToggle={true}
            title="Avatar Upload"
            description="Interactive avatar with upload simulation."
        >
            <Stack gap={6} align="center">
                <Stack direction="row" gap={4} align="center">
                    <Stack align="center" gap={2}>
                        <AvatarUpload size="s" src={avatarSrc} onUpload={handleUpload} loading={loading} />
                        <span style={{ fontSize: '12px' }}>S</span>
                    </Stack>
                    <Stack align="center" gap={2}>
                        <AvatarUpload size="m" src={avatarSrc} onUpload={handleUpload} loading={loading} />
                        <span style={{ fontSize: '12px' }}>M</span>
                    </Stack>
                    <Stack align="center" gap={2}>
                        <AvatarUpload size="l" src={avatarSrc} onUpload={handleUpload} loading={loading} />
                        <span style={{ fontSize: '12px' }}>L</span>
                    </Stack>
                    <Stack align="center" gap={2}>
                        <AvatarUpload size="xl" src={avatarSrc} onUpload={handleUpload} loading={loading} />
                        <span style={{ fontSize: '12px' }}>XL</span>
                    </Stack>
                </Stack>

                {toastOpen && (
                    <div style={{ position: 'fixed', bottom: 20, right: 20 }}>
                        <Toast
                            message="Avatar updated successfully!"
                            variant="success"
                            onClose={() => setToastOpen(false)}
                        />
                    </div>
                )}
            </Stack>
        </DemoCard>
    );
};

export default AvatarUploadBasicDemo;
