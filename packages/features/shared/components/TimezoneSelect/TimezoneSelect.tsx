/**
 * TimezoneSelect
 * 
 * Specialized dropdown for timezone selection.
 * Requires lookupService injection.
 * Now using Select with custom renderValue/renderOption.
 * 
 * @package @pulwave/features-forms
 */
import { useEffect, useState, useCallback, useMemo } from 'react';
import { Select, Icon, Skeleton, Clock, MapPin, Input } from '@pulwave/ui';
import type { SelectOption } from '@pulwave/ui';

export interface TimezoneOption {
    value: string;
    label: string;
    tz_identifier: string;
    display_name: string;
    utcOffset: string;
}

export interface LookupServiceInterface {
    fetchTimezones: () => Promise<TimezoneOption[]>;
}

// Static fallback data for common timezones
const STATIC_TIMEZONES: TimezoneOption[] = [
    { value: 'UTC', label: '(UTC+00:00) Coordinated Universal Time', tz_identifier: 'UTC', display_name: 'UTC', utcOffset: '+00:00' },
    { value: 'America/New_York', label: '(UTC-05:00) Eastern Time', tz_identifier: 'America/New_York', display_name: 'Eastern Time', utcOffset: '-05:00' },
    { value: 'America/Chicago', label: '(UTC-06:00) Central Time', tz_identifier: 'America/Chicago', display_name: 'Central Time', utcOffset: '-06:00' },
    { value: 'America/Denver', label: '(UTC-07:00) Mountain Time', tz_identifier: 'America/Denver', display_name: 'Mountain Time', utcOffset: '-07:00' },
    { value: 'America/Los_Angeles', label: '(UTC-08:00) Pacific Time', tz_identifier: 'America/Los_Angeles', display_name: 'Pacific Time', utcOffset: '-08:00' },
    { value: 'Europe/London', label: '(UTC+00:00) London', tz_identifier: 'Europe/London', display_name: 'London', utcOffset: '+00:00' },
    { value: 'Europe/Paris', label: '(UTC+01:00) Paris', tz_identifier: 'Europe/Paris', display_name: 'Paris', utcOffset: '+01:00' },
    { value: 'Europe/Berlin', label: '(UTC+01:00) Berlin', tz_identifier: 'Europe/Berlin', display_name: 'Berlin', utcOffset: '+01:00' },
    { value: 'Europe/Lisbon', label: '(UTC+00:00) Lisbon', tz_identifier: 'Europe/Lisbon', display_name: 'Lisbon', utcOffset: '+00:00' },
    { value: 'Europe/Madrid', label: '(UTC+01:00) Madrid', tz_identifier: 'Europe/Madrid', display_name: 'Madrid', utcOffset: '+01:00' },
    { value: 'Asia/Tokyo', label: '(UTC+09:00) Tokyo', tz_identifier: 'Asia/Tokyo', display_name: 'Tokyo', utcOffset: '+09:00' },
    { value: 'Asia/Shanghai', label: '(UTC+08:00) Shanghai', tz_identifier: 'Asia/Shanghai', display_name: 'Shanghai', utcOffset: '+08:00' },
    { value: 'Asia/Dubai', label: '(UTC+04:00) Dubai', tz_identifier: 'Asia/Dubai', display_name: 'Dubai', utcOffset: '+04:00' },
    { value: 'Australia/Sydney', label: '(UTC+11:00) Sydney', tz_identifier: 'Australia/Sydney', display_name: 'Sydney', utcOffset: '+11:00' },
];

export interface TimezoneSelectProps {
    /** Label */
    label?: string;
    /** Selected timezone identifier */
    value?: string;
    /** Change handler */
    onChange: (value: string) => void;
    /** Placeholder */
    placeholder?: string;
    /** Disabled state */
    disabled?: boolean;
    /** Full width */
    fullWidth?: boolean;
    /** Additional class */
    className?: string;
    /** Input name */
    name?: string;
    /** Input ID */
    id?: string;
    /** Lookup service instance (optional - uses static fallback if not provided) */
    lookupService?: LookupServiceInterface;
    /** Size variant */
    size?: 'xs' | 's' | 'm' | 'l';
}

/**
 * TimezoneSelect Component using Select
 */
export const TimezoneSelect = ({
    label,
    value,
    onChange,
    placeholder = "Select Timezone…",
    disabled = false,
    fullWidth = false,
    className = '',
    name,
    id,
    lookupService,
    size = 'm'
}: TimezoneSelectProps) => {
    const [timezones, setTimezones] = useState<TimezoneOption[]>(STATIC_TIMEZONES);
    const [loading, setLoading] = useState(!!lookupService);
    const [error, setError] = useState<string | null>(null);
    const [locating, setLocating] = useState(false);

    // Fetch timezones from DB via service (if provided)
    useEffect(() => {
        if (!lookupService) {
            setLoading(false);
            return;
        }
        const fetchTimezones = async () => {
            try {
                setLoading(true);
                const data = await lookupService.fetchTimezones();
                if (data && data.length > 0) {
                    setTimezones(data);
                }
            } catch {
                // Silent fallback to static data
            } finally {
                setLoading(false);
            }
        };

        fetchTimezones();
    }, [lookupService]);

    // Convert timezones to Select options format
    const options: SelectOption<string>[] = useMemo(() => {
        return timezones.map(tz => ({
            value: tz.value || tz.tz_identifier,
            label: tz.label || tz.display_name,
            icon: <Icon size="s"><Clock /></Icon>,
            searchTerms: [tz.tz_identifier, tz.utcOffset]
        }));
    }, [timezones]);

    // Auto-detect user's timezone
    const handleAutoLocate = useCallback(async () => {
        try {
            setLocating(true);
            const detectedTz = Intl.DateTimeFormat().resolvedOptions().timeZone;
            const match = timezones.find(o => o.tz_identifier === detectedTz);

            if (match) {
                onChange(match.tz_identifier);
            }
            // Silent handling if timezone not found in options
        } catch {
            // Silent error handling for auto-detect failure
        } finally {
            setLocating(false);
        }
    }, [timezones, onChange]);

    if (loading) {
        return (
            <div className={`form-item ${fullWidth ? 'form-item--full-width' : ''} ${className}`}>
                {label && <Skeleton variant="text" width="30%" height={20} />}
                <Skeleton variant="rectangular" height={40} width="100%" />
            </div>
        );
    }

    if (error) {
        return (
            <div className={`form-item ${fullWidth ? 'form-item--full-width' : ''} ${className}`}>
                {label && <label className="form-label">{label}</label>}
                <Input value="Error loading timezones" disabled fullWidth />
            </div>
        );
    }

    // Custom render for trigger value - show only UTC offset
    const utcOffsetMap = useMemo(() => {
        return timezones.reduce((acc, tz) => {
            acc[tz.value || tz.tz_identifier] = tz.utcOffset;
            return acc;
        }, {} as Record<string, string>);
    }, [timezones]);

    const renderValue = (selected: SelectOption<string> | SelectOption<string>[] | null) => {
        if (!selected || (Array.isArray(selected) && selected.length === 0)) {
            return <span className="select__placeholder">{placeholder}</span>;
        }
        const option = Array.isArray(selected) ? selected[0] : selected;
        const utcOffset = utcOffsetMap[option.value] || '';
        return (
            <span>{`UTC${utcOffset}`}</span>
        );
    };

    // Custom render for options
    const renderOption = (option: SelectOption<string>, isSelected: boolean) => (
        <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
                {option.icon}
                <span>{option.label}</span>
            </span>
            {isSelected && <span className="icon--primary">✓</span>}
        </span>
    );

    return (
        <Select<string>
            label={label}
            value={value}
            onChange={onChange}
            options={options}
            placeholder={placeholder}
            disabled={disabled}
            fullWidth={fullWidth}
            name={name}
            id={id}
            size={size}
            className={className}
            searchable
            searchPlaceholder="Search timezones…"
            renderValue={renderValue}
            renderOption={renderOption}
            onAutoLocate={handleAutoLocate}
            autoLocating={locating}
            autoLocateLabel="Get Current Timezone"
            triggerIcon={<Icon size="s"><Clock /></Icon>}
            persistTriggerIcon
        />
    );
};

TimezoneSelect.displayName = 'TimezoneSelect';
export default TimezoneSelect;
