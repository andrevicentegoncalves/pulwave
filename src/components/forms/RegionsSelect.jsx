import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { Select } from '../ui';

const RegionsSelect = ({
    countryId,
    value,
    onChange,
    name = 'region_id',
    label = 'State/Province',
    required = false,
    disabled = false,
    ...props
}) => {
    const [regions, setRegions] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (countryId) {
            fetchRegions(countryId);
        } else {
            setRegions([]);
        }
    }, [countryId]);

    const fetchRegions = async (countryId) => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('regions')
                .select('id, name, code')
                .eq('country_id', countryId)
                .order('name');

            if (error) throw error;
            setRegions(data || []);
        } catch (error) {
            console.error('Error fetching regions:', error);
        } finally {
            setLoading(false);
        }
    };

    const options = regions.map(region => ({
        value: region.id,
        label: `${region.name} (${region.code})`,
    }));

    return (
        <Select
            name={name}
            label={label}
            value={value}
            onChange={onChange}
            options={options}
            required={required}
            disabled={disabled || loading || !countryId}
            placeholder={
                !countryId ? 'Select a country first' :
                    loading ? 'Loading regions...' :
                        'Select a state/province'
            }
            {...props}
        />
    );
};

export default RegionsSelect;
