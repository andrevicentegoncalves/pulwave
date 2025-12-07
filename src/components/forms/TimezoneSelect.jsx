import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Clock } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';
import IconSelect from './IconSelect';
import { Icon } from '../ui';

/**
 * TimezoneSelect Component
 * Specialized dropdown for timezone selection with DB fetching and auto-detect
 */
const TimezoneSelect = ({
    label,
    value,
    onChange,
    placeholder = "Select Timezone...",
    disabled = false,
    fullWidth = false,
    className = '',
    name,
    id
}) => {
    const [options, setOptions] = useState([]);
    const [loading, setLoading] = useState(false);

    // Fetch timezones from DB
    useEffect(() => {
        const fetchTimezones = async () => {
            try {
                setLoading(true);
                const { data, error } = await supabase
                    .from('timezones')
                    .select('*')
                    .eq('is_active', true)
                    .order('display_order', { ascending: true });

                if (error) throw error;

                if (data) {
                    setOptions(data);
                }
            } catch (err) {
                console.error('Error fetching timezones:', err);
                // Fallback to basic options if DB fails
                setOptions([
                    { tz_identifier: 'UTC', display_name: 'UTC', utc_offset: '+00:00' }
                ]);
            } finally {
                setLoading(false);
            }
        };

        fetchTimezones();
    }, []);

    // Auto-detect user's timezone
    const handleAutoLocate = async () => {
        try {
            const detectedTz = Intl.DateTimeFormat().resolvedOptions().timeZone;

            // Find exact match
            let match = options.find(o => o.tz_identifier === detectedTz);

            // If no exact match, try to find one with same offset? 
            // For now, just rely on identifier match as it's most accurate

            if (match) {
                onChange(match.tz_identifier);
            } else {
                console.warn('Detected timezone not found in options:', detectedTz);
                // Optional: could try to match by offset here
            }
        } catch (err) {
            console.error('Error auto-detecting timezone:', err);
        }
    };

    return (
        <IconSelect
            label={label}
            value={value}
            onChange={onChange}
            options={options}
            getOptionIcon={() => <Icon size="s"><Clock /></Icon>}
            getOptionLabel={(option) => option.display_name}
            getOptionValue={(option) => option.tz_identifier}
            getSelectedIcon={() => <Icon size="s"><Clock /></Icon>}
            placeholder={loading ? "Loading timezones..." : placeholder}
            searchPlaceholder="Search timezones..."
            showAutoLocate={true}
            onAutoLocate={handleAutoLocate}
            disabled={disabled || loading}
            fullWidth={fullWidth}
            className={className}
            name={name}
            id={id}
        />
    );
};

TimezoneSelect.propTypes = {
    label: PropTypes.string,
    value: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    placeholder: PropTypes.string,
    disabled: PropTypes.bool,
    fullWidth: PropTypes.bool,
    className: PropTypes.string,
    name: PropTypes.string,
    id: PropTypes.string
};

export default TimezoneSelect;
