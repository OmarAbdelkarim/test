import React, { useState, useRef, useEffect } from 'react';
import { X, Calendar, Clock, Phone, Globe, ChevronDown, ChevronUp, Info, Workflow, ChevronLeft, ChevronRight, AlertCircle } from 'lucide-react';
import { TimeInput } from './TimeInput';
import { TimePicker } from './TimePicker';
import { DatePicker } from './DatePicker';

interface NewCampaignModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

interface ScheduleDay {
  enabled: boolean;
  startTime: string;
  endTime: string;
}

interface PhoneNumber {
  id: string;
  number: string;
  formatted: string;
  countryCode: string;
  flag: string;
  status: 'active' | 'inactive' | 'unverified';
}

interface FormData {
  name: string;
  phoneNumber: string;
  startDate: string;
  endDate: string;
  schedule: Record<string, ScheduleDay>;
  timezone: string;
  ivr: string;
  maxTries: number;
  retryInterval: string;
  concurrency: number;
}

const WEEKDAYS = [
  { key: 'monday', label: 'Monday', short: 'Mon', dayIndex: 1 },
  { key: 'tuesday', label: 'Tuesday', short: 'Tue', dayIndex: 2 },
  { key: 'wednesday', label: 'Wednesday', short: 'Wed', dayIndex: 3 },
  { key: 'thursday', label: 'Thursday', short: 'Thu', dayIndex: 4 },
  { key: 'friday', label: 'Friday', short: 'Fri', dayIndex: 5 },
  { key: 'saturday', label: 'Saturday', short: 'Sat', dayIndex: 6 },
  { key: 'sunday', label: 'Sunday', short: 'Sun', dayIndex: 0 }
];

const TIMEZONES = [
  { value: 'America/New_York', label: 'Eastern Time (ET)', offset: -5 },
  { value: 'America/Chicago', label: 'Central Time (CT)', offset: -6 },
  { value: 'America/Denver', label: 'Mountain Time (MT)', offset: -7 },
  { value: 'America/Los_Angeles', label: 'Pacific Time (PT)', offset: -8 },
  { value: 'Europe/London', label: 'Greenwich Mean Time (GMT)', offset: 0 },
  { value: 'Europe/Paris', label: 'Central European Time (CET)', offset: 1 },
  { value: 'Asia/Tokyo', label: 'Japan Standard Time (JST)', offset: 9 },
  { value: 'Australia/Sydney', label: 'Australian Eastern Time (AET)', offset: 11 }
];

const IVR_OPTIONS = [
  'DefaultIVR1658315753',
  'PhonebotElevenlabs5',
  'PhonebotElevenlabs3',
  'AccountWorkingHours',
  'DefaultClient'
];

const PHONE_NUMBERS: PhoneNumber[] = [
  {
    id: '1',
    number: '12029514012',
    formatted: '12029514012',
    countryCode: 'US',
    flag: '🇺🇸',
    status: 'active'
  },
  {
    id: '2',
    number: '12134234050',
    formatted: '12134234050',
    countryCode: 'US',
    flag: '🇺🇸',
    status: 'active'
  },
  {
    id: '3',
    number: '20221604225',
    formatted: '20221604225',
    countryCode: 'EG',
    flag: '🇪🇬',
    status: 'active'
  },
  {
    id: '4',
    number: '441617681737',
    formatted: '441617681737',
    countryCode: 'GB',
    flag: '🇬🇧',
    status: 'active'
  },
  {
    id: '5',
    number: '447418319716',
    formatted: '447418319716',
    countryCode: 'GB',
    flag: '🇬🇧',
    status: 'active'
  }
];

// Helper function to get user's timezone
const getUserTimezone = (): string => {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch {
    return 'America/New_York';
  }
};

// Helper function to get current time in a timezone
const getCurrentTimeInTimezone = (timezone: string): string => {
  try {
    const now = new Date();
    return now.toLocaleTimeString('en-US', {
      timeZone: timezone,
      hour12: false,
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch {
    return new Date().toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit'
    });
  }
};

// Helper function to format time to 12-hour format
const formatTo12Hour = (time24: string): string => {
  if (!time24 || !time24.includes(':')) return time24;
  
  const [hours, minutes] = time24.split(':');
  const hour24 = parseInt(hours, 10);
  const hour12 = hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24;
  const period = hour24 >= 12 ? 'PM' : 'AM';
  
  return `${hour12}:${minutes} ${period}`;
};

// Helper function to convert 12-hour to 24-hour format
const convertTo24Hour = (time12: string): string => {
  if (!time12 || !time12.includes(':')) return time12;
  
  const [time, period] = time12.split(' ');
  const [hours, minutes] = time.split(':');
  let hour24 = parseInt(hours, 10);
  
  if (period === 'PM' && hour24 !== 12) {
    hour24 += 12;
  } else if (period === 'AM' && hour24 === 12) {
    hour24 = 0;
  }
  
  return `${hour24.toString().padStart(2, '0')}:${minutes}`;
};

export const NewCampaignModal: React.FC<NewCampaignModalProps> = ({
  isOpen,
  onClose,
  onSubmit
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    phoneNumber: '1', // Default to first phone number
    startDate: '',
    endDate: '',
    schedule: WEEKDAYS.reduce((acc, day) => ({
      ...acc,
      [day.key]: { enabled: true, startTime: '09:00', endTime: '17:00' }
    }), {}),
    timezone: getUserTimezone(),
    ivr: '',
    maxTries: 1,
    retryInterval: '00:00:00',
    concurrency: 1
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [currentTimes, setCurrentTimes] = useState<Record<string, string>>({});
  const [selectedTimezone, setSelectedTimezone] = useState<string>(getUserTimezone());
  const [isTimezoneDropdownOpen, setIsTimezoneDropdownOpen] = useState(false);
  const [isPhoneNumberDropdownOpen, setIsPhoneNumberDropdownOpen] = useState(false);

  // Update current times for timezones
  useEffect(() => {
    const updateTimes = () => {
      const times: Record<string, string> = {};
      TIMEZONES.forEach(tz => {
        times[tz.value] = getCurrentTimeInTimezone(tz.value);
      });
      setCurrentTimes(times);
    };

    updateTimes();
    const interval = setInterval(updateTimes, 60000);

    return () => clearInterval(interval);
  }, []);

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      // Basic Information validation
      if (!formData.name.trim()) {
        newErrors.name = 'Campaign name is required';
      }

      if (!formData.phoneNumber) {
        newErrors.phoneNumber = 'Phone number selection is required';
      }
    }

    if (step === 2) {
      // Schedule Configuration validation
      if (!formData.startDate) {
        newErrors.startDate = 'Start date is required';
      }

      if (!formData.endDate) {
        newErrors.endDate = 'End date is required';
      }

      if (formData.startDate && formData.endDate && formData.startDate >= formData.endDate) {
        newErrors.endDate = 'End date must be after start date';
      }

      const hasEnabledDays = Object.values(formData.schedule).some(day => day.enabled);
      if (!hasEnabledDays) {
        newErrors.schedule = 'At least one day must be selected';
      }

      // Validate time ranges for enabled days
      Object.entries(formData.schedule).forEach(([dayKey, day]) => {
        if (day.enabled) {
          const startTime = new Date(`2000-01-01T${day.startTime}:00`);
          const endTime = new Date(`2000-01-01T${day.endTime}:00`);
          
          if (startTime >= endTime) {
            newErrors[`schedule-${dayKey}`] = 'End time must be after start time';
          }
        }
      });
    }

    if (step === 3) {
      // Configuration validation
      if (!formData.ivr) {
        newErrors.ivr = 'IVR selection is required';
      }

      if (formData.maxTries < 1 || formData.maxTries > 10) {
        newErrors.maxTries = 'Maximum tries must be between 1 and 10';
      }

      if (formData.concurrency < 1 || formData.concurrency > 100) {
        newErrors.concurrency = 'Concurrency must be between 1 and 100';
      }

      // Validate retry interval format (HH:MM:SS)
      const timeRegex = /^([0-1]?[0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])$/;
      if (!timeRegex.test(formData.retryInterval)) {
        newErrors.retryInterval = 'Invalid time format. Use HH:MM:SS (00:00:00 to 23:59:59)';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 3));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateStep(currentStep)) {
      onSubmit(formData);
      onClose();
    }
  };

  const handleScheduleChange = (dayKey: string, field: keyof ScheduleDay, value: boolean | string) => {
    setFormData(prev => ({
      ...prev,
      schedule: {
        ...prev.schedule,
        [dayKey]: {
          ...prev.schedule[dayKey],
          [field]: value
        }
      }
    }));
    
    // Clear any existing error for this day when making changes
    if (errors[`schedule-${dayKey}`]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[`schedule-${dayKey}`];
        return newErrors;
      });
    }
  };

  const handleTimezoneSelect = (timezone: string) => {
    setSelectedTimezone(timezone);
    setFormData(prev => ({ ...prev, timezone }));
    setIsTimezoneDropdownOpen(false);
  };

  const handlePhoneNumberSelect = (phoneNumberId: string) => {
    setFormData(prev => ({ ...prev, phoneNumber: phoneNumberId }));
    setIsPhoneNumberDropdownOpen(false);
  };

  // Get selected phone number
  const selectedPhoneNumber = PHONE_NUMBERS.find(phone => phone.id === formData.phoneNumber);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.timezone-dropdown-container')) {
        setIsTimezoneDropdownOpen(false);
      }
      if (!target.closest('.phone-number-dropdown-container')) {
        setIsPhoneNumberDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Enhanced Time Input Component
  const TimeSlotInput: React.FC<{
    dayKey: string;
    type: 'start' | 'end';
    value: string;
    enabled: boolean;
    onChange: (value: string) => void;
  }> = ({ dayKey, type, value, enabled, onChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    
    const handleTimeChange = (newTime: string) => {
      const time24 = convertTo24Hour(newTime);
      onChange(time24);
      setIsOpen(false);
    };

    const commonTimes = [
      '12:00 AM', '1:00 AM', '2:00 AM', '3:00 AM', '4:00 AM', '5:00 AM',
      '6:00 AM', '7:00 AM', '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM',
      '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM',
      '6:00 PM', '7:00 PM', '8:00 PM', '9:00 PM', '10:00 PM', '11:00 PM'
    ];

    return (
      <div className="relative">
        <button
          type="button"
          onClick={() => enabled && setIsOpen(!isOpen)}
          disabled={!enabled}
          className={`
            w-36 px-4 py-3 text-sm border rounded-lg transition-all duration-200 text-left
            ${enabled 
              ? 'border-gray-300 bg-white text-gray-900 hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 cursor-pointer' 
              : 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed'
            }
            ${errors[`schedule-${dayKey}`] ? 'border-red-300' : ''}
          `}
        >
          <div className="flex items-center justify-between">
            <span className="font-medium">
              {formatTo12Hour(value)}
            </span>
            {enabled && (
              <Clock className="w-4 h-4 text-gray-400" />
            )}
          </div>
        </button>

        {isOpen && enabled && (
          <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-300 rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto">
            <div className="p-2">
              <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2 px-2">
                {type === 'start' ? 'Start Time' : 'End Time'}
              </div>
              <div className="space-y-1">
                {commonTimes.map(time => (
                  <button
                    key={time}
                    type="button"
                    onClick={() => handleTimeChange(time)}
                    className={`
                      w-full px-3 py-2 text-left text-sm rounded hover:bg-blue-50 hover:text-blue-700 transition-colors duration-200
                      ${formatTo12Hour(value) === time ? 'bg-blue-100 text-blue-700 font-medium' : 'text-gray-700'}
                    `}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Step Indicator Component
  const StepIndicator = () => {
    const steps = [
      { number: 1, title: 'Basic Information', description: 'Campaign name and phone number' },
      { number: 2, title: 'Schedule Configuration', description: 'Set campaign timing and schedule' },
      { number: 3, title: 'Configuration', description: 'IVR settings and call parameters' }
    ];

    return (
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.number} className="flex items-center">
              <div className="flex items-center">
                <div className={`
                  w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-200
                  ${currentStep === step.number 
                    ? 'bg-blue-600 text-white shadow-lg' 
                    : currentStep > step.number
                      ? 'bg-emerald-500 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }
                `}>
                  {currentStep > step.number ? '✓' : step.number}
                </div>
                <div className="ml-4">
                  <div className={`text-sm font-medium ${
                    currentStep >= step.number ? 'text-gray-900' : 'text-gray-500'
                  }`}>
                    {step.title}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {step.description}
                  </div>
                </div>
              </div>
              
              {index < steps.length - 1 && (
                <div className={`
                  flex-1 h-0.5 mx-8 transition-all duration-200
                  ${currentStep > step.number ? 'bg-emerald-500' : 'bg-gray-200'}
                `} />
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-heading-2">Create New Campaign</h2>
          <button
            onClick={onClose}
            className="icon-button"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="p-6">
            <StepIndicator />

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Step 1: Basic Information */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <h3 className="text-heading-3 flex items-center">
                    <Phone className="w-5 h-5 mr-2 text-blue-600" />
                    Basic Information
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="campaign-name" className="block text-sm font-medium text-gray-700 mb-2">
                        Campaign Name
                      </label>
                      <input
                        id="campaign-name"
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        className="form-input"
                        placeholder="Enter campaign name"
                        aria-describedby={errors.name ? "name-error" : undefined}
                      />
                      {errors.name && <p id="name-error" className="text-red-500 text-sm mt-1">{errors.name}</p>}
                    </div>

                    {/* Phone Number Selection */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <div className="flex items-center">
                          <Phone className="w-4 h-4 mr-1" />
                          Outbound Caller ID
                          <div className="relative ml-2 group">
                            <Info className="w-4 h-4 text-gray-400 cursor-help" />
                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                              This number will appear as the caller ID to recipients
                              <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                            </div>
                          </div>
                        </div>
                      </label>
                      <div className="relative phone-number-dropdown-container">
                        <button
                          type="button"
                          onClick={() => setIsPhoneNumberDropdownOpen(!isPhoneNumberDropdownOpen)}
                          className={`w-full form-input text-left flex items-center justify-between ${
                            errors.phoneNumber ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''
                          }`}
                          aria-describedby={errors.phoneNumber ? "phone-number-error" : undefined}
                        >
                          <div className="flex items-center">
                            <span className={selectedPhoneNumber ? 'text-gray-900' : 'text-gray-400'}>
                              {selectedPhoneNumber ? (
                                <div className="flex items-center">
                                  <span className="text-lg mr-2">{selectedPhoneNumber.flag}</span>
                                  <span className="font-medium">{selectedPhoneNumber.formatted}</span>
                                </div>
                              ) : (
                                'Select phone number'
                              )}
                            </span>
                          </div>
                          {isPhoneNumberDropdownOpen ? (
                            <ChevronUp className="w-4 h-4 text-gray-400" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-gray-400" />
                          )}
                        </button>

                        {isPhoneNumberDropdownOpen && (
                          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                            {PHONE_NUMBERS.map((phone, index) => (
                              <button
                                key={phone.id}
                                type="button"
                                onClick={() => handlePhoneNumberSelect(phone.id)}
                                className={`w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center justify-between transition-colors duration-200 ${
                                  index !== PHONE_NUMBERS.length - 1 ? 'border-b border-gray-100' : ''
                                } ${
                                  formData.phoneNumber === phone.id ? 'bg-blue-50 text-blue-700' : ''
                                }`}
                              >
                                <div className="flex items-center">
                                  <span className="text-lg mr-3">{phone.flag}</span>
                                  <span className="font-medium">{phone.formatted}</span>
                                </div>
                                {formData.phoneNumber === phone.id && (
                                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                                )}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                      {errors.phoneNumber && <p id="phone-number-error" className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>}
                      <p className="text-xs text-gray-500 mt-1">
                        This number will be displayed to call recipients as the caller ID
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Schedule Configuration */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <h3 className="text-heading-3 flex items-center">
                    <Calendar className="w-5 h-5 mr-2 text-blue-600" />
                    Schedule Configuration
                  </h3>

                  {/* Campaign Duration */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <DatePicker
                      value={formData.startDate}
                      onChange={(value) => setFormData(prev => ({ ...prev, startDate: value }))}
                      label="Start Date"
                      error={errors.startDate}
                      helperText="When the campaign should begin"
                      required
                      minDate={new Date().toISOString().split('T')[0]}
                    />

                    <DatePicker
                      value={formData.endDate}
                      onChange={(value) => setFormData(prev => ({ ...prev, endDate: value }))}
                      label="End Date"
                      error={errors.endDate}
                      helperText="When the campaign should end"
                      required
                      minDate={formData.startDate || new Date().toISOString().split('T')[0]}
                    />
                  </div>

                  {/* Timezone Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Globe className="w-4 h-4 inline mr-1" />
                      Timezone
                    </label>
                    <div className="relative timezone-dropdown-container">
                      <button
                        type="button"
                        onClick={() => setIsTimezoneDropdownOpen(!isTimezoneDropdownOpen)}
                        className="w-full form-input text-left flex items-center justify-between"
                      >
                        <span>
                          {TIMEZONES.find(tz => tz.value === selectedTimezone)?.label || selectedTimezone}
                          {currentTimes[selectedTimezone] && (
                            <span className="ml-2 text-gray-500 font-mono">
                              ({currentTimes[selectedTimezone]})
                            </span>
                          )}
                        </span>
                        {isTimezoneDropdownOpen ? (
                          <ChevronUp className="w-4 h-4 text-gray-400" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-gray-400" />
                        )}
                      </button>

                      {isTimezoneDropdownOpen && (
                        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                          {TIMEZONES.map(timezone => (
                            <button
                              key={timezone.value}
                              type="button"
                              onClick={() => handleTimezoneSelect(timezone.value)}
                              className={`w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center justify-between ${
                                selectedTimezone === timezone.value ? 'bg-blue-50 text-blue-700' : ''
                              }`}
                            >
                              <span>{timezone.label}</span>
                              <span className="text-gray-500 font-mono text-sm">
                                {currentTimes[timezone.value]}
                              </span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Weekly Schedule */}
                  <div className="space-y-4">
                    <label className="block text-sm font-medium text-gray-700">
                      <Calendar className="w-4 h-4 inline mr-1" />
                      Weekly Schedule
                    </label>
                    
                    <div className="bg-gray-50 rounded-lg border border-gray-200 p-6">
                      <div className="space-y-4">
                        {WEEKDAYS.map(day => (
                          <div key={day.key} className="space-y-2">
                            <div className="flex items-center justify-between">
                              {/* Day name and checkbox */}
                              <div className="flex items-center min-w-[120px]">
                                <input
                                  type="checkbox"
                                  id={`schedule-${day.key}`}
                                  checked={formData.schedule[day.key].enabled}
                                  onChange={(e) => handleScheduleChange(day.key, 'enabled', e.target.checked)}
                                  className="w-4 h-4 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 text-blue-600 cursor-pointer"
                                />
                                <label 
                                  htmlFor={`schedule-${day.key}`} 
                                  className={`ml-3 text-sm font-medium select-none cursor-pointer ${
                                    formData.schedule[day.key].enabled
                                      ? 'text-gray-900'
                                      : 'text-gray-600'
                                  }`}
                                >
                                  {day.label}
                                </label>
                              </div>

                              {/* Time range inputs */}
                              <div className="flex items-center space-x-3">
                                <TimeSlotInput
                                  dayKey={day.key}
                                  type="start"
                                  value={formData.schedule[day.key].startTime}
                                  enabled={formData.schedule[day.key].enabled}
                                  onChange={(value) => handleScheduleChange(day.key, 'startTime', value)}
                                />
                                
                                <span className="text-gray-400 text-sm font-medium px-2">to</span>
                                
                                <TimeSlotInput
                                  dayKey={day.key}
                                  type="end"
                                  value={formData.schedule[day.key].endTime}
                                  enabled={formData.schedule[day.key].enabled}
                                  onChange={(value) => handleScheduleChange(day.key, 'endTime', value)}
                                />
                              </div>
                            </div>
                            
                            {/* Error message for this specific day */}
                            {errors[`schedule-${day.key}`] && (
                              <p className="text-red-500 text-xs ml-7">{errors[`schedule-${day.key}`]}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {errors.schedule && <p className="text-red-500 text-sm">{errors.schedule}</p>}
                    <div className="flex items-start space-x-2">
                      <Info className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                      <p className="text-xs text-gray-600">
                        Customize the time slots for each day when the campaign should be active.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Configuration */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <h3 className="text-heading-3 flex items-center">
                    <Clock className="w-5 h-5 mr-2 text-blue-600" />
                    Campaign Configuration
                  </h3>

                  {/* Row 1: IVR (left) and Concurrency (right) */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* IVR Selection */}
                    <div>
                      <label htmlFor="ivr-select" className="block text-sm font-medium text-gray-700 mb-2">
                        <div className="flex items-center">
                          <Workflow className="w-4 h-4 mr-1" />
                          IVR
                        </div>
                      </label>
                      <select
                        id="ivr-select"
                        value={formData.ivr}
                        onChange={(e) => setFormData(prev => ({ ...prev, ivr: e.target.value }))}
                        className="form-select h-12"
                        aria-describedby={errors.ivr ? "ivr-error" : undefined}
                      >
                        <option value="">Select IVR</option>
                        {IVR_OPTIONS.map(ivr => (
                          <option key={ivr} value={ivr}>{ivr}</option>
                        ))}
                      </select>
                      {errors.ivr && <p id="ivr-error" className="text-red-500 text-sm mt-1">{errors.ivr}</p>}
                      <p className="text-xs text-gray-500 mt-1">
                        Interactive Voice Response system for call handling
                      </p>
                    </div>

                    {/* Concurrency */}
                    <div>
                      <label htmlFor="concurrency" className="block text-sm font-medium text-gray-700 mb-2">
                        Concurrency
                      </label>
                      <input
                        id="concurrency"
                        type="number"
                        min="1"
                        max="100"
                        value={formData.concurrency}
                        onChange={(e) => setFormData(prev => ({ ...prev, concurrency: parseInt(e.target.value) || 1 }))}
                        className="form-input h-12"
                        aria-describedby={errors.concurrency ? "concurrency-error" : undefined}
                      />
                      {errors.concurrency && <p id="concurrency-error" className="text-red-500 text-sm mt-1">{errors.concurrency}</p>}
                      <p className="text-xs text-gray-500 mt-1">
                        Maximum simultaneous calls
                      </p>
                    </div>
                  </div>

                  {/* Row 2: Maximum Tries (left) and Retry Interval (right) */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Maximum Tries */}
                    <div>
                      <label htmlFor="max-tries" className="block text-sm font-medium text-gray-700 mb-2">
                        Maximum Tries
                      </label>
                      <input
                        id="max-tries"
                        type="number"
                        min="1"
                        max="10"
                        value={formData.maxTries}
                        onChange={(e) => setFormData(prev => ({ ...prev, maxTries: parseInt(e.target.value) || 1 }))}
                        className="form-input h-12"
                        aria-describedby={errors.maxTries ? "max-tries-error" : undefined}
                      />
                      {errors.maxTries && <p id="max-tries-error" className="text-red-500 text-sm mt-1">{errors.maxTries}</p>}
                      <p className="text-xs text-gray-500 mt-1">
                        Number of call attempts per contact
                      </p>
                    </div>

                    {/* Retry Interval with Time Picker */}
                    <div>
                      <TimePicker
                        value={formData.retryInterval}
                        onChange={(value) => setFormData(prev => ({ ...prev, retryInterval: value }))}
                        label="Retry Interval"
                        error={errors.retryInterval}
                        helperText="Time to wait between retry attempts"
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Form Actions */}
              <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                <div className="flex items-center space-x-4">
                  {currentStep > 1 && (
                    <button
                      type="button"
                      onClick={handlePrevious}
                      className="btn-secondary flex items-center"
                    >
                      <ChevronLeft className="w-4 h-4 mr-1" />
                      Previous
                    </button>
                  )}
                </div>

                <div className="flex items-center space-x-4">
                  <button
                    type="button"
                    onClick={onClose}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                  
                  {currentStep < 3 ? (
                    <button
                      type="button"
                      onClick={handleNext}
                      className="btn-primary flex items-center"
                    >
                      Next
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </button>
                  ) : (
                    <button
                      type="submit"
                      className="btn-primary"
                    >
                      Create Campaign
                    </button>
                  )}
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};