import { Avatar, AvatarGroup, Stack } from '@ui';

export default function AvatarGroupBasic() {
    return (
        <Stack gap="xl">
            <AvatarGroup size="m" limit={3}>
                <Avatar src="https://i.pravatar.cc/150?u=1" alt="User 1" />
                <Avatar src="https://i.pravatar.cc/150?u=2" alt="User 2" />
                <Avatar src="https://i.pravatar.cc/150?u=3" alt="User 3" />
                <Avatar src="https://i.pravatar.cc/150?u=4" alt="User 4" />
                <Avatar src="https://i.pravatar.cc/150?u=5" alt="User 5" />
            </AvatarGroup>

            <AvatarGroup size="l" limit={4}>
                <Avatar fallback="JD" />
                <Avatar fallback="AB" />
                <Avatar fallback="CD" />
                <Avatar fallback="EF" />
                <Avatar fallback="GH" />
            </AvatarGroup>
        </Stack>
    );
}
