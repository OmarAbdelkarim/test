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

export const NewCampaignModal: React.FC<NewCampaignModalProps> = ({
  isOpen,
  onClose,
  onSubmit
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    type: 'voice',
    phoneNumber: '',
    website: '',
    scheduleType: 'immediate',
    scheduledDate: '',
    scheduledTime: '',
    timezone: 'UTC'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleNext = () => {
    if (currentStep < 2) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const StepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      <div className="flex items-center space-x-4">
        <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
          currentStep >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
        }`}>
          1
        </div>
        <div className={`w-16 h-0.5 ${currentStep >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`} />
        <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
          currentStep >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
        }`}>
          2
        </div>
      </div>
    </div>
  );

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
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Campaign Name
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter campaign name"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Campaign Type
                    </label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="voice">Voice Call</option>
                      <option value="sms">SMS</option>
                      <option value="email">Email</option>
                    </select>
                  </div>

                  {formData.type === 'voice' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={formData.phoneNumber}
                        onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter phone number"
                        required
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Website
                    </label>
                    <input
                      type="url"
                      value={formData.website}
                      onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="https://example.com"
                    />
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Schedule Type
                    </label>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          value="immediate"
                          checked={formData.scheduleType === 'immediate'}
                          onChange={(e) => setFormData({ ...formData, scheduleType: e.target.value })}
                          className="mr-2"
                        />
                        Start Immediately
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          value="scheduled"
                          checked={formData.scheduleType === 'scheduled'}
                          onChange={(e) => setFormData({ ...formData, scheduleType: e.target.value })}
                          className="mr-2"
                        />
                        Schedule for Later
                      </label>
                    </div>
                  </div>

                  {formData.scheduleType === 'scheduled' && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Date
                        </label>
                        <input
                          type="date"
                          value={formData.scheduledDate}
                          onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Time
                        </label>
                        <input
                          type="time"
                          value={formData.scheduledTime}
                          onChange={(e) => setFormData({ ...formData, scheduledTime: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Timezone
                    </label>
                    <select
                      value={formData.timezone}
                      onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="UTC">UTC</option>
                      <option value="EST">Eastern Time</option>
                      <option value="PST">Pacific Time</option>
                      <option value="CST">Central Time</option>
                    </select>
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
                  
                  {currentStep < 2 ? (
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