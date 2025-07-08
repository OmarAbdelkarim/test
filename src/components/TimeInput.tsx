import React, { useState, useRef, useEffect } from 'react';
import { Clock } from 'lucide-react';

interface TimeInputProps {
  value: string; // Format: "HH:MM"
  onChange: (value: string) => void;
  label: string;
  error?: string;
  placeholder?: string;
  helperText?: string;
  className?: string;
  disabled?: boolean;
  maxHours?: number;
  required?: boolean;
}

export const TimeInput: React.FC<TimeInputProps> = ({
  value,
  onChange,
  label,
  error,
  placeholder = "HH:MM",
  helperText,
  className = "",
  disabled = false,
  maxHours = 23,
  required = false
}) => {
  const [inputValue, setInputValue] = useState('');
  const [isValid, setIsValid] = useState(true);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize input value from prop
  useEffect(() => {
    if (value && value !== inputValue) {
      setInputValue(value);
      validateTime(value);
    }
  }, [value]);

  const validateTime = (timeString: string): boolean => {
    if (!timeString) {
      setIsValid(true);
      return true;
    }

    // Check format: HH:MM
    const timeRegex = /^(\d{1,2}):(\d{2})$/;
    const match = timeString.match(timeRegex);
    
    if (!match) {
      setIsValid(false);
      return false;
    }

    const hours = parseInt(match[1], 10);
    const minutes = parseInt(match[2], 10);

    // Validate ranges
    const isValidTime = hours >= 0 && hours <= maxHours && minutes >= 0 && minutes <= 59;
    setIsValid(isValidTime);
    return isValidTime;
  };

  const formatTimeInput = (input: string): string => {
    // Remove all non-digits
    const digits = input.replace(/\D/g, '');
    
    if (digits.length === 0) return '';
    if (digits.length <= 2) return digits;
    if (digits.length <= 4) {
      const hours = digits.slice(0, 2);
      const minutes = digits.slice(2);
      return `${hours}:${minutes}`;
    }
    
    // Limit to 4 digits max (HHMM)
    const hours = digits.slice(0, 2);
    const minutes = digits.slice(2, 4);
    return `${hours}:${minutes}`;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    
    // Allow backspace and delete to work naturally
    if (rawValue.length < inputValue.length) {
      setInputValue(rawValue);
      validateTime(rawValue);
      onChange(rawValue);
      return;
    }

    // Format the input
    const formatted = formatTimeInput(rawValue);
    setInputValue(formatted);
    validateTime(formatted);
    onChange(formatted);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Prevent arrow key number incrementing/decrementing
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      e.preventDefault();
      return;
    }

    // Allow navigation keys
    const allowedKeys = [
      'Backspace', 'Delete', 'Tab', 'Escape', 'Enter',
      'ArrowLeft', 'ArrowRight', 'Home', 'End'
    ];

    if (allowedKeys.includes(e.key)) {
      return;
    }

    // Allow digits and colon
    if (!/[\d:]/.test(e.key)) {
      e.preventDefault();
    }
  };

  const handleWheel = (e: React.WheelEvent<HTMLInputElement>) => {
    // Prevent scroll from changing the input value
    e.preventDefault();
  };

  const handleBlur = () => {
    setIsFocused(false);
    
    if (inputValue) {
      // Auto-format on blur if valid partial input
      const digits = inputValue.replace(/\D/g, '');
      if (digits.length === 1 || digits.length === 2) {
        // Add leading zero for hours and default minutes
        const hours = digits.padStart(2, '0');
        const formatted = `${hours}:00`;
        setInputValue(formatted);
        validateTime(formatted);
        onChange(formatted);
      } else if (digits.length === 3) {
        // Format as H:MM
        const hours = digits.slice(0, 1).padStart(2, '0');
        const minutes = digits.slice(1);
        const formatted = `${hours}:${minutes}`;
        setInputValue(formatted);
        validateTime(formatted);
        onChange(formatted);
      }
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const getValidationState = () => {
    if (error) return 'error';
    if (!isValid && inputValue) return 'invalid';
    if (isValid && inputValue) return 'valid';
    return 'default';
  };

  const validationState = getValidationState();

  const getBorderColor = () => {
    switch (validationState) {
      case 'error':
        return 'border-red-300 focus:border-red-500 focus:ring-red-500';
      case 'invalid':
        return 'border-red-300 focus:border-red-500 focus:ring-red-500';
      case 'valid':
        return 'border-green-300 focus:border-green-500 focus:ring-green-500';
      default:
        return 'border-gray-300 focus:border-blue-500 focus:ring-blue-500';
    }
  };

  const getIconColor = () => {
    switch (validationState) {
      case 'error':
      case 'invalid':
        return 'text-red-400';
      case 'valid':
        return 'text-green-400';
      default:
        return 'text-gray-400';
    }
  };

  const getValidationMessage = () => {
    if (error) return error;
    if (!isValid && inputValue) {
      const digits = inputValue.replace(/\D/g, '');
      if (digits.length === 0) return 'Please enter a valid time';
      
      const timeRegex = /^(\d{1,2}):(\d{2})$/;
      const match = inputValue.match(timeRegex);
      
      if (!match) return 'Invalid format. Use HH:MM (e.g., 01:30)';
      
      const hours = parseInt(match[1], 10);
      const minutes = parseInt(match[2], 10);
      
      if (hours > maxHours) return `Hours must be between 00-${maxHours.toString().padStart(2, '0')}`;
      if (minutes > 59) return 'Minutes must be between 00-59';
      
      return 'Invalid time format';
    }
    return null;
  };

  const validationMessage = getValidationMessage();

  return (
    <div className={className}>
      <label 
        htmlFor={`time-input-${label.replace(/\s+/g, '-').toLowerCase()}`}
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
          id={`time-input-${label.replace(/\s+/g, '-').toLowerCase()}`}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onWheel={handleWheel}
          onBlur={handleBlur}
          onFocus={handleFocus}
          placeholder={placeholder}
          disabled={disabled}
          className={`
            block w-full pl-10 pr-4 py-3 text-base border rounded-lg shadow-sm
            placeholder-gray-400 transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-opacity-20
            disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
            ${getBorderColor()}
            ${validationState === 'valid' ? 'bg-green-50' : ''}
            ${validationState === 'invalid' || validationState === 'error' ? 'bg-red-50' : ''}
          `}
          aria-invalid={validationState === 'invalid' || validationState === 'error'}
          aria-describedby={
            validationMessage 
              ? `time-input-error-${label.replace(/\s+/g, '-').toLowerCase()}`
              : helperText 
                ? `time-input-help-${label.replace(/\s+/g, '-').toLowerCase()}`
                : undefined
          }
          aria-label={`${label}. Format: hours and minutes separated by colon. Hours: 0 to ${maxHours}, Minutes: 0 to 59`}
          autoComplete="off"
          inputMode="numeric"
          pattern="[0-9]{1,2}:[0-5][0-9]"
          maxLength={5}
        />

        {/* Validation indicator */}
        {validationState === 'valid' && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          </div>
        )}
        
        {(validationState === 'invalid' || validationState === 'error') && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
          </div>
        )}
      </div>

      {/* Helper Text */}
      {helperText && !validationMessage && (
        <p 
          id={`time-input-help-${label.replace(/\s+/g, '-').toLowerCase()}`}
          className="text-xs text-gray-500 mt-1"
        >
          {helperText}
        </p>
      )}

      {/* Validation Message */}
      {validationMessage && (
        <p 
          id={`time-input-error-${label.replace(/\s+/g, '-').toLowerCase()}`}
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

      {/* Format examples */}
      {isFocused && !validationMessage && (
        <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded text-xs text-blue-700">
          <div className="font-medium mb-1">Valid formats:</div>
          <div className="space-y-1">
            <div>• <code className="bg-blue-100 px-1 rounded">01:30</code> - 1 hour 30 minutes</div>
            <div>• <code className="bg-blue-100 px-1 rounded">00:15</code> - 15 minutes</div>
            <div>• <code className="bg-blue-100 px-1 rounded">12:00</code> - 12 hours</div>
          </div>
        </div>
      )}
    </div>
  );
};