/**
 * Style Guide Page - Assembly Layer
 */
import { type UserData } from '@pulwave/experience-shell';
import { useAuth } from '@pulwave/features-auth';
import { useUser } from '@pulwave/features-user';
import {
    StyleGuideShell,
    getNavigationTree,
    getComponentByPath,
    filterDemos,
    componentRegistry,
    SECTIONS
} from '@pulwave/features-style-guide';

/**
 * StyleGuidePage - Assembly Layer
 * Orchestrates the style guide feature with experience-level data (auth, user)
 */
const StyleGuidePage = () => {
    // Auth & User - Experience Layer Concerns
    const { signOut } = useAuth();
    const { user, displayName, avatarUrl } = useUser();

    const userData: UserData | null = user ? {
        id: user.id,
        email: user.email,
        fullName: displayName,
        avatarUrl: avatarUrl,
    } : null;

    return (
        <StyleGuideShell
            navigationData={getNavigationTree()}
            componentRegistry={componentRegistry}
            getComponentByPath={getComponentByPath}
            filterDemos={filterDemos}
            sections={SECTIONS}
            user={userData}
            onLogout={signOut}
        />
    );
};

export default StyleGuidePage;
