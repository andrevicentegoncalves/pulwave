import React, { useState, useEffect } from 'react';
import { Select } from '../ui';
import { authService, organizationService } from '../../services';

/**
 * OrganizationSelector Component
 * Dropdown to select organization for multi-org users
 * Auto-hides if user only belongs to one organization
 */
const OrganizationSelector = ({ value, onChange, className }) => {
    const [organizations, setOrganizations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUserOrganizations();
    }, []);

    const fetchUserOrganizations = async () => {
        try {
            const user = await authService.getUser();
            if (!user) return;

            const orgs = await organizationService.getUserOrganizations(user.id);
            setOrganizations(orgs);

            // Auto-select first org if none selected
            if (!value && orgs.length > 0) {
                onChange(orgs[0].id);
            }
        } catch (error) {
            console.error('Error fetching organizations:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="skeleton skeleton--select" />;
    }

    // Don't show selector if user only has one organization
    if (organizations.length <= 1) {
        return null;
    }

    return (
        <Select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={className}
        >
            {organizations.map(org => (
                <option key={org.id} value={org.id}>
                    {org.name}
                </option>
            ))}
        </Select>
    );
};

export default OrganizationSelector;
