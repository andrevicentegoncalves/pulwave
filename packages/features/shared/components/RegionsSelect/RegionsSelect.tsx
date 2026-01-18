/**
 * RegionsSelect
 * 
 * Specialized dropdown for selecting regions/administrative divisions.
 * Requires a lookupService to be injected.
 * 
 * @package @pulwave/features-forms
 */
import { useState, useEffect } from 'react';
import { Select, Skeleton, Input } from '@pulwave/ui';

export interface AdministrativeDivision {
    value: string;
    label: string;
    code?: string;
    type?: string;
}

export interface LookupServiceInterface {
    fetchAdministrativeDivisions: (countryId: string) => Promise<AdministrativeDivision[]>;
}

export interface RegionsSelectProps {
    countryId?: string;
    value?: string;
    onChange: (value: string) => void;
    name?: string;
    label?: string;
    required?: boolean;
    disabled?: boolean;
    className?: string;
    lookupService: LookupServiceInterface;
}

export const RegionsSelect = ({
    countryId,
    value,
    onChange,
    name = 'region_id',
    label = 'State/Province',
    required = false,
    disabled = false,
    className,
    lookupService
}: RegionsSelectProps) => {
    const [regions, setRegions] = useState<AdministrativeDivision[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchRegions = async () => {
            if (!countryId) {
                setRegions([]);
                return;
            }

            try {
                setLoading(true);
                const data = await lookupService.fetchAdministrativeDivisions(countryId);
                setRegions(data || []);
            } catch {
                // Silent error handling
                setError('Failed to load regions');
            } finally {
                setLoading(false);
            }
        };

        fetchRegions();
    }, [countryId, lookupService]);

    const options = regions.map(region => ({
        value: region.value,
        label: region.code ? `${region.label} (${region.code})` : region.label,
    }));

    if (loading) {
        return (
            <div className={`form-item ${className}`}>
                {label && <Skeleton variant="text" width="30%" height={20} />}
                <Skeleton variant="rectangular" height={40} width="100%" />
            </div>
        );
    }

    if (error) {
        return (
            <div className={`form-item ${className}`}>
                {label && <label className="form-label">{label}</label>}
                <Input value="Error loading regions" disabled fullWidth />
            </div>
        );
    }

    return (
        <Select
            name={name}
            label={label}
            value={value}
            onChange={onChange}
            options={options}
            disabled={disabled || loading || !countryId}
            placeholder={
                !countryId ? 'Select a country first' :
                    loading ? 'Loading regions…' :
                        'Select a state/province'
            }
            fullWidth
            className={className}
        />
    );
};

RegionsSelect.displayName = 'RegionsSelect';
export default RegionsSelect;
