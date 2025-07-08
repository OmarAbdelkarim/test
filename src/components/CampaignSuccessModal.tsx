import React from 'react';
import { CheckCircle, Upload, Clock, X } from 'lucide-react';

interface CampaignSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportNow: () => void;
  onImportLater: () => void;
  campaignName: string;
}

export const CampaignSuccessModal: React.FC<CampaignSuccessModalProps> = ({
  isOpen,
  onClose,
  onImportNow,
  onImportLater,
  campaignName
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <h2 className="text-heading-3 text-gray-900">Campaign Created!</h2>
              <p className="text-sm text-gray-600">Successfully created</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="icon-button"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="mb-6">
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 mb-4">
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-emerald-900 mb-1">
                    "{campaignName}" has been created successfully
                  </h3>
                  <p className="text-sm text-emerald-700">
                    Your campaign is now ready to receive an audience list and begin making calls.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Next Step: Import Audience List</h4>
              <p className="text-sm text-gray-600">
                To start your campaign, you'll need to import a list of contacts to call. You can do this now or come back to it later.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={onImportNow}
              className="w-full btn-primary flex items-center justify-center space-x-2"
            >
              <Upload className="w-4 h-4" />
              <span>Import Audience List Now</span>
            </button>
            
            <button
              onClick={onImportLater}
              className="w-full btn-secondary flex items-center justify-center space-x-2"
            >
              <Clock className="w-4 h-4" />
              <span>Skip and Import Later</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};