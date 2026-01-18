import { useState, useEffect } from 'react';
import { Select } from '@pulwave/ui';

interface Organization {
    id: string;
    name: string;
}

interface AuthService {
    getUser(): Promise<{ id: string } | null>;
}

interface OrgService {
    getUserOrganizations(userId: string): Promise<Organization[]>;
}

interface OrganizationSelectorProps {
    value: string;
    onChange: (value: string) => void;
    className?: string;
    authService: AuthService;
    organizationService: OrgService;
}

export const OrganizationSelector = ({
    value,
    onChange,
    className,
    authService,
    organizationService,
}: OrganizationSelectorProps) => {
    const [organizations, setOrganizations] = useState<Organization[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetch = async () => {
            try {
                const user = await authService.getUser();
                if (!user) return;
                const orgs = await organizationService.getUserOrganizations(user.id);
                setOrganizations(orgs);
                if (!value && orgs.length > 0) {
                    onChange(orgs[0].id);
                }
            } catch {
                // Silent error - component will show empty state
            } finally {
                setLoading(false);
            }
        };
        fetch();
    }, [authService, organizationService, value, onChange]);

    if (loading) return <div className="skeleton skeleton--select" />;
    if (organizations.length <= 1) return null;

    const options = organizations.map(org => ({
        value: org.id,
        label: org.name
    }));

    return (
        <Select
            value={value}
            onChange={onChange}
            className={className}
            options={options}
            fullWidth
            aria-label="Select organization"
        />
    );
};

export default OrganizationSelector;
