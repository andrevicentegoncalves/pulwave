import { useState, useRef, useEffect, useCallback, useMemo, type ReactNode } from 'react';
import { cn } from '@pulwave/utils';
import { Clock, X, ChevronUp, ChevronDown } from '../../icon-library';
import { timePickerVariants, type TimePickerProps, type TimeValue, type TimeFormat } from './types';
import './styles/_index.scss';



// Format time for display
const formatTimeValue = (time: TimeValue | null, format: TimeFormat, showSeconds: boolean): string => {
    if (!time) return '';

    let hours = time.hours;
    const period = time.period || (hours >= 12 ? 'PM' : 'AM');

    if (format === '12h') {
        hours = hours % 12 || 12;
    }

    const parts = [
        String(hours).padStart(2, '0'),
        String(time.minutes).padStart(2, '0'),
    ];

    if (showSeconds && time.seconds !== undefined) {
        parts.push(String(time.seconds).padStart(2, '0'));
    }

    let result = parts.join(':');
    if (format === '12h') {
        result += ` ${period}`;
    }

    return result;
};

// Generate hour options
const getHourOptions = (format: TimeFormat): number[] => {
    if (format === '12h') {
        return Array.from({ length: 12 }, (_, i) => i === 0 ? 12 : i);
    }
    return Array.from({ length: 24 }, (_, i) => i);
};

// Generate minute/second options
const getMinuteOptions = (step: number): number[] => {
    return Array.from({ length: Math.ceil(60 / step) }, (_, i) => i * step);
};

export const TimePicker = ({
    value,
    onChange,
    format = '12h',
    showSeconds = false,
    minuteStep = 1,
    minTime,
    maxTime,
    placeholder = 'Select time',
    size = 'm',
    clearable = true,
    disabled = false,
    required = false,
    error = false,
    errorMessage,
    className,
    label,
}: TimePickerProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [localValue, setLocalValue] = useState<TimeValue>(() => value || {
        hours: format === '12h' ? 12 : 0,
        minutes: 0,
        seconds: 0,
        period: 'AM',
    });

    const containerRef = useRef<HTMLDivElement>(null);
    const hoursRef = useRef<HTMLDivElement>(null);
    const minutesRef = useRef<HTMLDivElement>(null);
    const secondsRef = useRef<HTMLDivElement>(null);

    const hourOptions = useMemo(() => getHourOptions(format), [format]);
    const minuteOptions = useMemo(() => getMinuteOptions(minuteStep), [minuteStep]);
    const secondOptions = useMemo(() => getMinuteOptions(1), []);

    // Close on outside click
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Sync local value with prop
    useEffect(() => {
        if (value) {
            setLocalValue(value);
        }
    }, [value]);

    // Scroll to selected values on open
    useEffect(() => {
        if (isOpen) {
            const scrollToSelected = (ref: React.RefObject<HTMLDivElement | null>, selector: string) => {
                const element = ref.current?.querySelector(selector);
                element?.scrollIntoView({ block: 'center', behavior: 'smooth' });
            };

            setTimeout(() => {
                scrollToSelected(hoursRef, '.time-picker__option--selected');
                scrollToSelected(minutesRef, '.time-picker__option--selected');
                if (showSeconds) {
                    scrollToSelected(secondsRef, '.time-picker__option--selected');
                }
            }, 100);
        }
    }, [isOpen, showSeconds]);

    const updateValue = useCallback((updates: Partial<TimeValue>) => {
        const newValue = { ...localValue, ...updates };
        setLocalValue(newValue);

        // Convert 12h to 24h for storage
        let hours = newValue.hours;
        if (format === '12h') {
            if (newValue.period === 'PM' && hours !== 12) {
                hours += 12;
            } else if (newValue.period === 'AM' && hours === 12) {
                hours = 0;
            }
        }

        onChange?.({
            ...newValue,
            hours,
        });
    }, [localValue, format, onChange]);

    const handleClear = (e: MouseEvent) => {
        e.stopPropagation();
        onChange?.(null);
    };

    const incrementValue = (field: 'hours' | 'minutes' | 'seconds', delta: number) => {
        let newValue: number;
        const max = field === 'hours' ? (format === '12h' ? 12 : 23) : 59;
        const min = field === 'hours' && format === '12h' ? 1 : 0;

        if (field === 'hours') {
            newValue = localValue.hours + delta;
            if (newValue > max) newValue = min;
            if (newValue < min) newValue = max;
        } else if (field === 'minutes') {
            newValue = localValue.minutes + (delta * minuteStep);
            if (newValue > 59) newValue = 0;
            if (newValue < 0) newValue = 60 - minuteStep;
        } else {
            newValue = (localValue.seconds || 0) + delta;
            if (newValue > 59) newValue = 0;
            if (newValue < 0) newValue = 59;
        }

        updateValue({ [field]: newValue });
    };

    return (
        <div className={cn(timePickerVariants({ size, disabled, error, isOpen }), className)} ref={containerRef}>
            {label && (
                <label className="time-picker__label">
                    {label}
                    {required && <span className="time-picker__required">*</span>}
                </label>
            )}

            <button
                type="button"
                className="time-picker__trigger"
                onClick={() => !disabled && setIsOpen(!isOpen)}
                disabled={disabled}
                aria-haspopup="dialog"
                aria-expanded={isOpen}
            >
                <Clock size={16} className="time-picker__icon" aria-hidden="true" />
                <span className={cn('time-picker__value', !value && 'time-picker__placeholder')}>
                    {value ? formatTimeValue(value, format, showSeconds) : placeholder}
                </span>
                {clearable && value && !disabled && (
                    <button
                        type="button"
                        className="time-picker__clear"
                        onClick={handleClear}
                        aria-label="Clear time"
                    >
                        <X size={14} aria-hidden="true" />
                    </button>
                )}
            </button>

            {errorMessage && <span className="time-picker__error-message">{errorMessage}</span>}

            {isOpen && (
                <div className="time-picker__dropdown" role="dialog" aria-modal="true">
                    <div className="time-picker__columns">
                        {/* Hours Column */}
                        <div className="time-picker__column">
                            <button
                                type="button"
                                className="time-picker__arrow"
                                onClick={() => incrementValue('hours', 1)}
                                aria-label="Increase hours"
                            >
                                <ChevronUp size={16} aria-hidden="true" />
                            </button>
                            <div className="time-picker__list" ref={hoursRef}>
                                {hourOptions.map((hour) => (
                                    <button
                                        key={hour}
                                        type="button"
                                        className={cn(
                                            'time-picker__option',
                                            localValue.hours === hour && 'time-picker__option--selected'
                                        )}
                                        onClick={() => updateValue({ hours: hour })}
                                    >
                                        {String(hour).padStart(2, '0')}
                                    </button>
                                ))}
                            </div>
                            <button
                                type="button"
                                className="time-picker__arrow"
                                onClick={() => incrementValue('hours', -1)}
                                aria-label="Decrease hours"
                            >
                                <ChevronDown size={16} aria-hidden="true" />
                            </button>
                        </div>

                        <span className="time-picker__separator">:</span>

                        {/* Minutes Column */}
                        <div className="time-picker__column">
                            <button
                                type="button"
                                className="time-picker__arrow"
                                onClick={() => incrementValue('minutes', 1)}
                                aria-label="Increase minutes"
                            >
                                <ChevronUp size={16} aria-hidden="true" />
                            </button>
                            <div className="time-picker__list" ref={minutesRef}>
                                {minuteOptions.map((minute) => (
                                    <button
                                        key={minute}
                                        type="button"
                                        className={cn(
                                            'time-picker__option',
                                            localValue.minutes === minute && 'time-picker__option--selected'
                                        )}
                                        onClick={() => updateValue({ minutes: minute })}
                                    >
                                        {String(minute).padStart(2, '0')}
                                    </button>
                                ))}
                            </div>
                            <button
                                type="button"
                                className="time-picker__arrow"
                                onClick={() => incrementValue('minutes', -1)}
                                aria-label="Decrease minutes"
                            >
                                <ChevronDown size={16} aria-hidden="true" />
                            </button>
                        </div>

                        {/* Seconds Column */}
                        {showSeconds && (
                            <>
                                <span className="time-picker__separator">:</span>
                                <div className="time-picker__column">
                                    <button
                                        type="button"
                                        className="time-picker__arrow"
                                        onClick={() => incrementValue('seconds', 1)}
                                        aria-label="Increase seconds"
                                    >
                                        <ChevronUp size={16} aria-hidden="true" />
                                    </button>
                                    <div className="time-picker__list" ref={secondsRef}>
                                        {secondOptions.map((second) => (
                                            <button
                                                key={second}
                                                type="button"
                                                className={cn(
                                                    'time-picker__option',
                                                    (localValue.seconds || 0) === second && 'time-picker__option--selected'
                                                )}
                                                onClick={() => updateValue({ seconds: second })}
                                            >
                                                {String(second).padStart(2, '0')}
                                            </button>
                                        ))}
                                    </div>
                                    <button
                                        type="button"
                                        className="time-picker__arrow"
                                        onClick={() => incrementValue('seconds', -1)}
                                        aria-label="Decrease seconds"
                                    >
                                        <ChevronDown size={16} aria-hidden="true" />
                                    </button>
                                </div>
                            </>
                        )}

                        {/* AM/PM Column */}
                        {format === '12h' && (
                            <div className="time-picker__column time-picker__column--period">
                                <button
                                    type="button"
                                    className={cn(
                                        'time-picker__period',
                                        localValue.period === 'AM' && 'time-picker__period--selected'
                                    )}
                                    onClick={() => updateValue({ period: 'AM' })}
                                >
                                    AM
                                </button>
                                <button
                                    type="button"
                                    className={cn(
                                        'time-picker__period',
                                        localValue.period === 'PM' && 'time-picker__period--selected'
                                    )}
                                    onClick={() => updateValue({ period: 'PM' })}
                                >
                                    PM
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

TimePicker.displayName = 'TimePicker';
