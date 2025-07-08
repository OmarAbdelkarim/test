import React, { useState, useRef, useEffect } from 'react';
import { Clock, ChevronUp, ChevronDown } from 'lucide-react';

interface TimePickerProps {
  value: string; // Format: "HH:MM:SS"
  onChange: (value: string) => void;
  label: string;
  error?: string;
  placeholder?: string;
  helperText?: string;
  className?: string;
  disabled?: boolean;
  required?: boolean;
}

export const TimePicker: React.FC<TimePickerProps> = ({
  value,
  onChange,
  label,
  error,
  placeholder = "HH:MM:SS",
  helperText,
  className = "",
  disabled = false,
  required = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const [isValid, setIsValid] = useState(true);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Parse time value into components
  useEffect(() => {
    if (value) {
      const timeRegex = /^(\d{1,2}):(\d{2}):(\d{2})$/;
      const match = value.match(timeRegex);
      if (match) {
        setHours(parseInt(match[1], 10));
        setMinutes(parseInt(match[2], 10));
        setSeconds(parseInt(match[3], 10));
        setInputValue(value);
        setIsValid(true);
      } else {
        setInputValue(value);
        setIsValid(false);
      }
    } else {
      setHours(0);
      setMinutes(0);
      setSeconds(0);
      setInputValue('');
      setIsValid(true);
    }
  }, [value]);

  // Format time components into string
  const formatTime = (h: number, m: number, s: number): string => {
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Validate time format
  const validateTime = (timeString: string): boolean => {
    if (!timeString) return true;
    
    const timeRegex = /^(\d{1,2}):(\d{2}):(\d{2})$/;
    const match = timeString.match(timeRegex);
    
    if (!match) return false;
    
    const h = parseInt(match[1], 10);
    const m = parseInt(match[2], 10);
    const s = parseInt(match[3], 10);
    
    return h >= 0 && h <= 23 && m >= 0 && m <= 59 && s >= 0 && s <= 59;
  };

  // Handle manual input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    
    // Allow backspace and delete to work naturally
    if (rawValue.length < inputValue.length) {
      setInputValue(rawValue);
      const isValidFormat = validateTime(rawValue);
      setIsValid(isValidFormat);
      if (isValidFormat || rawValue === '') {
        onChange(rawValue);
      }
      return;
    }

    // Format the input as HH:MM:SS
    const digits = rawValue.replace(/\D/g, '');
    let formatted = '';
    
    if (digits.length >= 1) {
      formatted = digits.slice(0, 2);
      if (digits.length >= 3) {
        formatted += ':' + digits.slice(2, 4);
        if (digits.length >= 5) {
          formatted += ':' + digits.slice(4, 6);
        }
      }
    }
    
    setInputValue(formatted);
    const isValidFormat = validateTime(formatted);
    setIsValid(isValidFormat);
    
    if (isValidFormat || formatted === '') {
      onChange(formatted);
      
      // Update picker values if valid
      if (isValidFormat && formatted) {
        const match = formatted.match(/^(\d{1,2}):(\d{2}):(\d{2})$/);
        if (match) {
          setHours(parseInt(match[1], 10));
          setMinutes(parseInt(match[2], 10));
          setSeconds(parseInt(match[3], 10));
        }
      }
    }
  };

  // Handle picker value changes
  const handlePickerChange = (type: 'hours' | 'minutes' | 'seconds', newValue: number) => {
    let newHours = hours;
    let newMinutes = minutes;
    let newSeconds = seconds;
    
    switch (type) {
      case 'hours':
        newHours = Math.max(0, Math.min(23, newValue));
        setHours(newHours);
        break;
      case 'minutes':
        newMinutes = Math.max(0, Math.min(59, newValue));
        setMinutes(newMinutes);
        break;
      case 'seconds':
        newSeconds = Math.max(0, Math.min(59, newValue));
        setSeconds(newSeconds);
        break;
    }
    
    const formattedTime = formatTime(newHours, newMinutes, newSeconds);
    setInputValue(formattedTime);
    setIsValid(true);
    onChange(formattedTime);
  };

  // Handle input focus
  const handleInputFocus = () => {
    setIsOpen(true);
  };

  // Handle input blur
  const handleInputBlur = (e: React.FocusEvent) => {
    // Don't close if clicking within the picker
    if (containerRef.current?.contains(e.relatedTarget as Node)) {
      return;
    }
    
    setTimeout(() => setIsOpen(false), 150);
    
    // Auto-format partial input
    if (inputValue && !validateTime(inputValue)) {
      const digits = inputValue.replace(/\D/g, '');
      if (digits.length >= 1) {
        const h = parseInt(digits.slice(0, 2) || '0', 10);
        const m = parseInt(digits.slice(2, 4) || '0', 10);
        const s = parseInt(digits.slice(4, 6) || '0', 10);
        
        if (h <= 23 && m <= 59 && s <= 59) {
          const formatted = formatTime(h, m, s);
          setInputValue(formatted);
          setIsValid(true);
          onChange(formatted);
          setHours(h);
          setMinutes(m);
          setSeconds(s);
        }
      }
    }
  };

  // Close picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
      return 'Invalid format. Use HH:MM:SS (e.g., 01:30:45)';
    }
    return null;
  };

  const validationMessage = getValidationMessage();

  // Number input component for picker
  const NumberInput: React.FC<{
    value: number;
    onChange: (value: number) => void;
    min: number;
    max: number;
    label: string;
  }> = ({ value, onChange, min, max, label }) => (
    <div className="flex flex-col items-center space-y-2">
      <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">
        {label}
      </label>
      <div className="flex flex-col items-center space-y-1">
        <button
          type="button"
          onClick={() => onChange(Math.min(max, value + 1))}
          className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors duration-200"
          disabled={value >= max}
        >
          <ChevronUp className="w-4 h-4" />
        </button>
        <div className="w-12 h-10 flex items-center justify-center bg-white border border-gray-200 rounded text-sm font-medium text-gray-900">
          {value.toString().padStart(2, '0')}
        </div>
        <button
          type="button"
          onClick={() => onChange(Math.max(min, value - 1))}
          className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors duration-200"
          disabled={value <= min}
        >
          <ChevronDown className="w-4 h-4" />
        </button>
      </div>
    </div>
  );

  return (
    <div className={className} ref={containerRef}>
      <label 
        htmlFor={`time-picker-${label.replace(/\s+/g, '-').toLowerCase()}`}
        className="block text-sm font-medium text-gray-700 mb-2"
      >
        {label}
      </label>
      
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Clock className={`w-4 h-4 transition-colors duration-200 ${getIconColor()}`} />
        </div>
        
        <input
          ref={inputRef}
          id={`time-picker-${label.replace(/\s+/g, '-').toLowerCase()}`}
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
              ? `time-picker-error-${label.replace(/\s+/g, '-').toLowerCase()}`
              : helperText 
                ? `time-picker-help-${label.replace(/\s+/g, '-').toLowerCase()}`
                : undefined
          }
          autoComplete="off"
          inputMode="numeric"
          pattern="[0-9]{1,2}:[0-5][0-9]:[0-5][0-9]"
          maxLength={8}
        />

        {/* Validation indicator - only show for error states */}
        {(validationState === 'invalid' || validationState === 'error') && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
          </div>
        )}

        {/* Time Picker Dropdown */}
        {isOpen && !disabled && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-50 p-4">
            <div className="flex items-center justify-center space-x-6">
              <NumberInput
                value={hours}
                onChange={(value) => handlePickerChange('hours', value)}
                min={0}
                max={23}
                label="Hours"
              />
              <div className="text-gray-400 text-lg font-medium pt-6">:</div>
              <NumberInput
                value={minutes}
                onChange={(value) => handlePickerChange('minutes', value)}
                min={0}
                max={59}
                label="Minutes"
              />
              <div className="text-gray-400 text-lg font-medium pt-6">:</div>
              <NumberInput
                value={seconds}
                onChange={(value) => handlePickerChange('seconds', value)}
                min={0}
                max={59}
                label="Seconds"
              />
            </div>
            
            <div className="mt-4 pt-3 border-t border-gray-200 flex justify-between items-center">
              <div className="text-xs text-gray-500">
                Selected: <span className="font-mono font-medium">{formatTime(hours, minutes, seconds)}</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setHours(0);
                  setMinutes(0);
                  setSeconds(0);
                  const resetTime = formatTime(0, 0, 0);
                  setInputValue(resetTime);
                  onChange(resetTime);
                }}
                className="text-xs text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200"
              >
                Reset
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Helper Text */}
      {helperText && !validationMessage && (
        <p 
          id={`time-picker-help-${label.replace(/\s+/g, '-').toLowerCase()}`}
          className="text-xs text-gray-500 mt-1"
        >
          {helperText}
        </p>
      )}

      {/* Validation Message */}
      {validationMessage && (
        <p 
          id={`time-picker-error-${label.replace(/\s+/g, '-').toLowerCase()}`}
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