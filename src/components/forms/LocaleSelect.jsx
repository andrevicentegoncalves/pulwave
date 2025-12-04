import React from 'react';
import PropTypes from 'prop-types';
import * as flags from 'country-flag-icons/react/3x2';
import IconSelect from './IconSelect';

/**
 * Helper function to get flag component by ISO code
 */
const getFlag = (isoCode) => {
    if (!isoCode) return null;
    const FlagComponent = flags[isoCode.toUpperCase()];
    return FlagComponent || null;
};

/**
 * Helper to render flag icon
 */
const renderFlagIcon = (countryCode) => {
    const FlagComponent = getFlag(countryCode);
    if (!FlagComponent) return null;

    return (
        <div className="country-flag-circle" style={{
            width: '20px',
            height: '20px',
            borderRadius: '50%',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            flexShrink: 0
        }}>
            <FlagComponent
                style={{
                    width: '150%',
                    height: 'auto',
                    minHeight: '100%',
                    objectFit: 'cover',
                    display: 'block',
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)'
                }}
            />
        </div>
    );
};

/**
 * LocaleSelect Component
 * Specialized dropdown for locale/language selection with flag display
 */
const LocaleSelect = ({
    label,
    value,
    onChange,
    options = [],
    placeholder = "Select...",
    disabled = false,
    fullWidth = false,
    className = '',
    name,
    id
}) => {
    // Auto-locate user's locale based on country
    const handleAutoLocate = async () => {
        const { getUserCountry } = await import('../../utils/geolocation');
        const countryCode = await getUserCountry();

        if (countryCode) {
            // Find locale matching the country code
            const matchingOption = options.find(o => o.countryCode === countryCode);

            if (matchingOption) {
                onChange(matchingOption.value);
            } else {
                console.warn('No locale found for country:', countryCode);
            }
        }
    };

    return (
        <IconSelect
            label={label}
            value={value}
            onChange={onChange}
            options={options}
            getOptionIcon={(option) => renderFlagIcon(option.countryCode)}
            getOptionLabel={(option) => option.label}
            getOptionValue={(option) => option.value}
            getSelectedIcon={(option) => renderFlagIcon(option.countryCode)}
            placeholder={placeholder}
            searchPlaceholder="Search..."
            showAutoLocate={true}
            onAutoLocate={handleAutoLocate}
            disabled={disabled}
            fullWidth={fullWidth}
            className={className}
            name={name}
            id={id}
        />
    );
};

LocaleSelect.propTypes = {
    label: PropTypes.string,
    value: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    options: PropTypes.arrayOf(PropTypes.shape({
        value: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
        countryCode: PropTypes.string
    })),
    placeholder: PropTypes.string,
    disabled: PropTypes.bool,
    fullWidth: PropTypes.bool,
    className: PropTypes.string,
    name: PropTypes.string,
    id: PropTypes.string
};

export default LocaleSelect;
