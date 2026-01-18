import { useState, useRef, useEffect, useCallback, useMemo, type ReactNode, type MouseEvent } from 'react';
import { cn } from '@pulwave/utils';
import {
    ChevronLeft,
    ChevronRight,
    Calendar as CalendarIcon,
    X,
    ChevronsLeft,
    ChevronsRight
} from '../../icon-library';
import { datePickerVariants, type DatePickerProps, type DatePickerView } from './types';
import './styles/_index.scss';



// Date formatting helper
const formatDate = (date: Date, locale: string = 'en-US'): string => {
    return date.toLocaleDateString(locale, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
};

// Get days in month
const getDaysInMonth = (year: number, month: number): number => {
    return new Date(year, month + 1, 0).getDate();
};

// Get first day of month (0 = Sunday)
const getFirstDayOfMonth = (year: number, month: number): number => {
    return new Date(year, month, 1).getDay();
};

// Check if dates are same day
const isSameDay = (a: Date, b: Date): boolean => {
    return a.getDate() === b.getDate() &&
        a.getMonth() === b.getMonth() &&
        a.getFullYear() === b.getFullYear();
};

// Get month names
const getMonthNames = (locale: string = 'en-US'): string[] => {
    return Array.from({ length: 12 }, (_, i) =>
        new Date(2000, i, 1).toLocaleDateString(locale, { month: 'short' })
    );
};

// Get weekday names
const getWeekdayNames = (locale: string = 'en-US', firstDay: number = 0): string[] => {
    const days = Array.from({ length: 7 }, (_, i) =>
        new Date(2000, 0, 2 + i).toLocaleDateString(locale, { weekday: 'narrow' })
    );
    return [...days.slice(firstDay), ...days.slice(0, firstDay)];
};

export const DatePicker = ({
    value,
    onChange,
    minDate,
    maxDate,
    disabledDates = [],
    placeholder = 'Select date',
    size = 'm',
    clearable = true,
    showToday = true,
    disabled = false,
    required = false,
    error = false,
    errorMessage,
    className,
    label,
    firstDayOfWeek = 0,
    locale = 'en-US',
}: DatePickerProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [view, setView] = useState<DatePickerView>('days');
    const [viewDate, setViewDate] = useState(() => value || new Date());
    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLButtonElement>(null);

    const today = useMemo(() => new Date(), []);
    const monthNames = useMemo(() => getMonthNames(locale), [locale]);
    const weekdayNames = useMemo(() => getWeekdayNames(locale, firstDayOfWeek), [locale, firstDayOfWeek]);

    // Close on outside click
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setIsOpen(false);
                setView('days');
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Check if date is disabled
    const isDateDisabled = useCallback((date: Date): boolean => {
        if (minDate && date < minDate) return true;
        if (maxDate && date > maxDate) return true;
        return disabledDates.some(d => isSameDay(d, date));
    }, [minDate, maxDate, disabledDates]);

    // Navigate months
    const navigateMonth = (delta: number) => {
        setViewDate(prev => new Date(prev.getFullYear(), prev.getMonth() + delta, 1));
    };

    // Navigate years
    const navigateYear = (delta: number) => {
        setViewDate(prev => new Date(prev.getFullYear() + delta, prev.getMonth(), 1));
    };

    // Select date
    const selectDate = (day: number) => {
        const newDate = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
        if (!isDateDisabled(newDate)) {
            onChange?.(newDate);
            setIsOpen(false);
        }
    };

    // Select month
    const selectMonth = (month: number) => {
        setViewDate(new Date(viewDate.getFullYear(), month, 1));
        setView('days');
    };

    // Select year
    const selectYear = (year: number) => {
        setViewDate(new Date(year, viewDate.getMonth(), 1));
        setView('months');
    };

    // Select today
    const selectToday = () => {
        onChange?.(today);
        setViewDate(today);
        setIsOpen(false);
    };

    // Clear selection
    const handleClear = (e: MouseEvent) => {
        e.stopPropagation();
        onChange?.(null);
    };

    // Generate calendar grid
    const renderDaysGrid = () => {
        const year = viewDate.getFullYear();
        const month = viewDate.getMonth();
        const daysInMonth = getDaysInMonth(year, month);
        const firstDay = getFirstDayOfMonth(year, month);
        const firstDayAdjusted = (firstDay - firstDayOfWeek + 7) % 7;

        const days: ReactNode[] = [];

        // Empty cells before first day
        for (let i = 0; i < firstDayAdjusted; i++) {
            days.push(<div key={`empty-${i}`} className="date-picker__day date-picker__day--empty" />);
        }

        // Day cells
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day);
            const isSelected = value && isSameDay(date, value);
            const isToday = isSameDay(date, today);
            const isDisabled = isDateDisabled(date);

            days.push(
                <button
                    key={day}
                    type="button"
                    className={cn(
                        'date-picker__day',
                        isSelected && 'date-picker__day--selected',
                        isToday && 'date-picker__day--today',
                        isDisabled && 'date-picker__day--disabled'
                    )}
                    onClick={() => selectDate(day)}
                    disabled={isDisabled}
                    tabIndex={isDisabled ? -1 : 0}
                >
                    {day}
                </button>
            );
        }

        return days;
    };

    // Generate months grid
    const renderMonthsGrid = () => {
        return monthNames.map((name, index) => (
            <button
                key={name}
                type="button"
                className={cn(
                    'date-picker__month',
                    viewDate.getMonth() === index && 'date-picker__month--selected'
                )}
                onClick={() => selectMonth(index)}
            >
                {name}
            </button>
        ));
    };

    // Generate years grid
    const renderYearsGrid = () => {
        const startYear = Math.floor(viewDate.getFullYear() / 10) * 10 - 1;
        const years = Array.from({ length: 12 }, (_, i) => startYear + i);

        return years.map((year, index) => (
            <button
                key={year}
                type="button"
                className={cn(
                    'date-picker__year',
                    viewDate.getFullYear() === year && 'date-picker__year--selected',
                    (index === 0 || index === 11) && 'date-picker__year--outside'
                )}
                onClick={() => selectYear(year)}
            >
                {year}
            </button>
        ));
    };

    return (
        <div className={cn(datePickerVariants({ size, disabled, error, isOpen }), className)} ref={containerRef}>
            {label && (
                <label className="date-picker__label">
                    {label}
                    {required && <span className="date-picker__required">*</span>}
                </label>
            )}

            <button
                ref={inputRef}
                type="button"
                className="date-picker__trigger"
                onClick={() => !disabled && setIsOpen(!isOpen)}
                disabled={disabled}
                aria-haspopup="dialog"
                aria-expanded={isOpen}
            >
                <CalendarIcon size={16} className="date-picker__icon" aria-hidden="true" />
                <span className={cn('date-picker__value', !value && 'date-picker__placeholder')}>
                    {value ? formatDate(value, locale) : placeholder}
                </span>
                {clearable && value && !disabled && (
                    <button
                        type="button"
                        className="date-picker__clear"
                        onClick={handleClear}
                        aria-label="Clear date"
                    >
                        <X size={14} aria-hidden="true" />
                    </button>
                )}
            </button>

            {errorMessage && <span className="date-picker__error-message">{errorMessage}</span>}

            {isOpen && (
                <div className="date-picker__dropdown" role="dialog" aria-modal="true">
                    <div className="date-picker__header">
                        <button
                            type="button"
                            className="date-picker__nav date-picker__nav--prev-year"
                            onClick={() => view === 'years' ? navigateYear(-10) : navigateYear(-1)}
                            aria-label="Previous year"
                        >
                            <ChevronsLeft size={16} aria-hidden="true" />
                        </button>
                        {view === 'days' && (
                            <button
                                type="button"
                                className="date-picker__nav date-picker__nav--prev"
                                onClick={() => navigateMonth(-1)}
                                aria-label="Previous month"
                            >
                                <ChevronLeft size={16} aria-hidden="true" />
                            </button>
                        )}

                        <button
                            type="button"
                            className="date-picker__title"
                            onClick={() => setView(view === 'days' ? 'months' : view === 'months' ? 'years' : 'days')}
                        >
                            {view === 'days' && `${monthNames[viewDate.getMonth()]} ${viewDate.getFullYear()}`}
                            {view === 'months' && viewDate.getFullYear()}
                            {view === 'years' && `${Math.floor(viewDate.getFullYear() / 10) * 10} - ${Math.floor(viewDate.getFullYear() / 10) * 10 + 9}`}
                        </button>

                        {view === 'days' && (
                            <button
                                type="button"
                                className="date-picker__nav date-picker__nav--next"
                                onClick={() => navigateMonth(1)}
                                aria-label="Next month"
                            >
                                <ChevronRight size={16} aria-hidden="true" />
                            </button>
                        )}
                        <button
                            type="button"
                            className="date-picker__nav date-picker__nav--next-year"
                            onClick={() => view === 'years' ? navigateYear(10) : navigateYear(1)}
                            aria-label="Next year"
                        >
                            <ChevronsRight size={16} aria-hidden="true" />
                        </button>
                    </div>

                    {view === 'days' && (
                        <>
                            <div className="date-picker__weekdays">
                                {weekdayNames.map((name, i) => (
                                    <span key={i} className="date-picker__weekday">{name}</span>
                                ))}
                            </div>
                            <div className="date-picker__grid date-picker__grid--days">
                                {renderDaysGrid()}
                            </div>
                        </>
                    )}

                    {view === 'months' && (
                        <div className="date-picker__grid date-picker__grid--months">
                            {renderMonthsGrid()}
                        </div>
                    )}

                    {view === 'years' && (
                        <div className="date-picker__grid date-picker__grid--years">
                            {renderYearsGrid()}
                        </div>
                    )}

                    {showToday && (
                        <div className="date-picker__footer">
                            <button
                                type="button"
                                className="date-picker__today"
                                onClick={selectToday}
                            >
                                Today
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

DatePicker.displayName = 'DatePicker';

