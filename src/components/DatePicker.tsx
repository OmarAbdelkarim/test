import React, { useState, useRef, useEffect } from 'react';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

interface DatePickerProps {
  value: string; // Format: YYYY-MM-DD
  onChange: (value: string) => void;
  label: string;
  error?: string;
  placeholder?: string;
  helperText?: string;
  className?: string;
  disabled?: boolean;
  required?: boolean;
  minDate?: string; // Format: YYYY-MM-DD
  maxDate?: string; // Format: YYYY-MM-DD
}

export const DatePicker: React.FC<DatePickerProps> = ({
  value,
  onChange,
  label,
  error,
  placeholder = "MM/DD/YYYY",
  helperText,
  className = "",
  disabled = false,
  required = false,
  minDate,
  maxDate
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isValid, setIsValid] = useState(true);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Convert YYYY-MM-DD to MM/DD/YYYY for display
  const formatDisplayDate = (dateString: string): string => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString + 'T00:00:00');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      const year = date.getFullYear();
      return `${month}/${day}/${year}`;
    } catch {
      return '';
    }
  };

  // Convert MM/DD/YYYY to YYYY-MM-DD for storage
  const formatStorageDate = (displayDate: string): string => {
    if (!displayDate) return '';
    const match = displayDate.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
    if (!match) return '';
    
    const month = match[1].padStart(2, '0');
    const day = match[2].padStart(2, '0');
    const year = match[3];
    
    return `${year}-${month}-${day}`;
  };

  // Initialize input value from prop
  useEffect(() => {
    const displayDate = formatDisplayDate(value);
    if (displayDate !== inputValue) {
      setInputValue(displayDate);
      setIsValid(true);
    }
    
    // Set current month to the selected date or today
    if (value) {
      try {
        const date = new Date(value + 'T00:00:00');
        setCurrentMonth(new Date(date.getFullYear(), date.getMonth(), 1));
      } catch {
        // Invalid date, keep current month
      }
    }
  }, [value]);

  // Validate date
  const validateDate = (dateString: string): boolean => {
    if (!dateString) return true;
    
    const match = dateString.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
    if (!match) return false;
    
    const month = parseInt(match[1], 10);
    const day = parseInt(match[2], 10);
    const year = parseInt(match[3], 10);
    
    // Basic validation
    if (month < 1 || month > 12 || day < 1 || day > 31 || year < 1900 || year > 2100) {
      return false;
    }
    
    // Create date and check if it's valid
    const date = new Date(year, month - 1, day);
    if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
      return false;
    }
    
    // Check min/max dates
    const storageDate = formatStorageDate(dateString);
    if (minDate && storageDate < minDate) return false;
    if (maxDate && storageDate > maxDate) return false;
    
    return true;
  };

  // Handle manual input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    
    // Allow backspace and delete to work naturally
    if (rawValue.length < inputValue.length) {
      setInputValue(rawValue);
      const isValidFormat = validateDate(rawValue);
      setIsValid(isValidFormat);
      if (isValidFormat || rawValue === '') {
        onChange(formatStorageDate(rawValue));
      }
      return;
    }

    // Format the input as MM/DD/YYYY
    const digits = rawValue.replace(/\D/g, '');
    let formatted = '';
    
    if (digits.length >= 1) {
      formatted = digits.slice(0, 2);
      if (digits.length >= 3) {
        formatted += '/' + digits.slice(2, 4);
        if (digits.length >= 5) {
          formatted += '/' + digits.slice(4, 8);
        }
      }
    }
    
    setInputValue(formatted);
    const isValidFormat = validateDate(formatted);
    setIsValid(isValidFormat);
    
    if (isValidFormat || formatted === '') {
      onChange(formatStorageDate(formatted));
    }
  };

  // Handle date selection from calendar
  const handleDateSelect = (date: Date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    
    const storageDate = `${year}-${month}-${day}`;
    const displayDate = formatDisplayDate(storageDate);
    
    setInputValue(displayDate);
    setIsValid(true);
    onChange(storageDate);
    setIsOpen(false);
  };

  // Handle input focus
  const handleInputFocus = () => {
    setIsOpen(true);
  };

  // Handle input blur
  const handleInputBlur = (e: React.FocusEvent) => {
    // Don't close if clicking within the calendar
    if (containerRef.current?.contains(e.relatedTarget as Node)) {
      return;
    }
    
    setTimeout(() => setIsOpen(false), 150);
    
    // Auto-format partial input
    if (inputValue && !validateDate(inputValue)) {
      const digits = inputValue.replace(/\D/g, '');
      if (digits.length >= 6) {
        const month = digits.slice(0, 2);
        const day = digits.slice(2, 4);
        const year = digits.slice(4, 8);
        
        const formatted = `${month}/${day}/${year}`;
        if (validateDate(formatted)) {
          setInputValue(formatted);
          setIsValid(true);
          onChange(formatStorageDate(formatted));
        }
      }
    }
  };

  // Close calendar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Calendar navigation
  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      if (direction === 'prev') {
        newMonth.setMonth(newMonth.getMonth() - 1);
      } else {
        newMonth.setMonth(newMonth.getMonth() + 1);
      }
      return newMonth;
    });
  };

  // Generate calendar days
  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      
      const isCurrentMonth = date.getMonth() === month;
      const isToday = date.getTime() === today.getTime();
      const isSelected = value && date.getTime() === new Date(value + 'T00:00:00').getTime();
      
      // Check if date is disabled
      let isDisabled = false;
      if (minDate) {
        const minDateTime = new Date(minDate + 'T00:00:00').getTime();
        isDisabled = date.getTime() < minDateTime;
      }
      if (maxDate) {
        const maxDateTime = new Date(maxDate + 'T00:00:00').getTime();
        isDisabled = isDisabled || date.getTime() > maxDateTime;
      }
      
      days.push({
        date,
        isCurrentMonth,
        isToday,
        isSelected,
        isDisabled
      });
    }
    
    return days;
  };

  const getValidationState = () => {
    if (error) return 'error';
    if (!isValid && inputValue) return 'invalid';
    return 'default';
  };

  const validationState = getValidationState();

  const getBorderColor = () => {
    switch (validationState) {
      case 'error':
      case 'invalid':
        return 'border-red-300 focus:border-red-500 focus:ring-red-500';
      default:
        return 'border-gray-300 focus:border-blue-500 focus:ring-blue-500';
    }
  };

  const getIconColor = () => {
    switch (validationState) {
      case 'error':
      case 'invalid':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  const getValidationMessage = () => {
    if (error) return error;
    if (!isValid && inputValue) {
      return 'Invalid date format. Use MM/DD/YYYY';
    }
    return null;
  };

  const validationMessage = getValidationMessage();
  const calendarDays = generateCalendarDays();

  return (
    <div className={className} ref={containerRef}>
      <label 
        htmlFor={`date-picker-${label.replace(/\s+/g, '-').toLowerCase()}`}
        className="block text-sm font-medium text-gray-700 mb-2"
      >
        {label}
      </label>
      
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Calendar className={`w-4 h-4 transition-colors duration-200 ${getIconColor()}`} />
        </div>
        
        <input
          ref={inputRef}
          id={`date-picker-${label.replace(/\s+/g, '-').toLowerCase()}`}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          placeholder={placeholder}
          disabled={disabled}
          className={`
            block w-full pl-10 pr-4 py-3 text-base border rounded-lg shadow-sm bg-white
            placeholder-gray-400 transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-opacity-20
            disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
            ${getBorderColor()}
          `}
          aria-invalid={validationState === 'invalid' || validationState === 'error'}
          aria-describedby={
            validationMessage 
              ? `date-picker-error-${label.replace(/\s+/g, '-').toLowerCase()}`
              : helperText 
                ? `date-picker-help-${label.replace(/\s+/g, '-').toLowerCase()}`
                : undefined
          }
          autoComplete="off"
          inputMode="numeric"
          maxLength={10}
        />

        {/* Calendar Dropdown */}
        {isOpen && !disabled && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-50 p-4">
            {/* Calendar Header */}
            <div className="flex items-center justify-between mb-4">
              <button
                type="button"
                onClick={() => navigateMonth('prev')}
                className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors duration-200"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              
              <h3 className="text-sm font-medium text-gray-900">
                {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </h3>
              
              <button
                type="button"
                onClick={() => navigateMonth('next')}
                className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors duration-200"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1">
              {/* Day headers */}
              {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                <div key={day} className="text-center text-xs font-medium text-gray-500 py-2">
                  {day}
                </div>
              ))}
              
              {/* Calendar days */}
              {calendarDays.map((day, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => !day.isDisabled && handleDateSelect(day.date)}
                  disabled={day.isDisabled}
                  className={`
                    w-8 h-8 text-sm rounded transition-colors duration-200 flex items-center justify-center
                    ${day.isCurrentMonth 
                      ? day.isDisabled
                        ? 'text-gray-300 cursor-not-allowed'
                        : day.isSelected
                          ? 'bg-blue-600 text-white font-medium'
                          : day.isToday
                            ? 'bg-blue-100 text-blue-700 font-medium hover:bg-blue-200'
                            : 'text-gray-900 hover:bg-gray-100'
                      : 'text-gray-400'
                    }
                  `}
                >
                  {day.date.getDate()}
                </button>
              ))}
            </div>

            {/* Today button */}
            <div className="mt-4 pt-3 border-t border-gray-200 flex justify-between items-center">
              <button
                type="button"
                onClick={() => handleDateSelect(new Date())}
                className="text-xs text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200"
              >
                Today
              </button>
              <button
                type="button"
                onClick={() => {
                  setInputValue('');
                  onChange('');
                  setIsOpen(false);
                }}
                className="text-xs text-gray-500 hover:text-gray-700 font-medium transition-colors duration-200"
              >
                Clear
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Helper Text */}
      {helperText && !validationMessage && (
        <p 
          id={`date-picker-help-${label.replace(/\s+/g, '-').toLowerCase()}`}
          className="text-xs text-gray-500 mt-1"
        >
          {helperText}
        </p>
      )}

      {/* Validation Message */}
      {validationMessage && (
        <p 
          id={`date-picker-error-${label.replace(/\s+/g, '-').toLowerCase()}`}
          className={`text-sm mt-1 ${
            validationState === 'error' || validationState === 'invalid' 
              ? 'text-red-600' 
              : 'text-gray-600'
          }`}
          role="alert"
          aria-live="polite"
        >
          {validationMessage}
        </p>
      )}
    </div>
  );
};