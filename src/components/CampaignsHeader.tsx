import React, { useState } from 'react';
import { Filter, Plus, TrendingUp, Play, Pause, Phone } from 'lucide-react';
import { NewCampaignModal } from './NewCampaignModal';
import { CampaignSuccessModal } from './CampaignSuccessModal';

export const CampaignsHeader: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [createdCampaignName, setCreatedCampaignName] = useState('');
  // Set showStats to false by default to hide the cards immediately
  const [showStats, setShowStats] = useState(false);

  const handleCreateCampaign = (data: any) => {
    console.log('Creating campaign with data:', data);
    // Here you would typically send the data to your API
    
    // Store the campaign name for the success modal
    setCreatedCampaignName(data.name);
    
    // Close the create modal and show success modal
    setIsModalOpen(false);
    setIsSuccessModalOpen(true);
  };

  const handleImportNow = () => {
    console.log('Redirecting to audience import for campaign:', createdCampaignName);
    // Here you would typically navigate to the audience import page
    // For now, we'll just close the modal
    setIsSuccessModalOpen(false);
    setCreatedCampaignName('');
  };

  const handleImportLater = () => {
    console.log('User chose to import audience later for campaign:', createdCampaignName);
    // Here you would typically navigate back to the campaigns list
    // For now, we'll just close the modal
    setIsSuccessModalOpen(false);
    setCreatedCampaignName('');
  };

  const handleCloseSuccessModal = () => {
    setIsSuccessModalOpen(false);
    setCreatedCampaignName('');
  };

  // Function to hide campaign statistics
  const hideCampaignStats = () => {
    setShowStats(false);
  };

  // Function to show campaign statistics (for completeness)
  const showCampaignStats = () => {
    setShowStats(true);
  };

  // Make the function globally accessible for external calls
  React.useEffect(() => {
    // Attach the function to the window object for global access
    (window as any).hideCampaignStats = hideCampaignStats;
    (window as any).showCampaignStats = showCampaignStats;
    
    // Cleanup function to remove global references
    return () => {
      delete (window as any).hideCampaignStats;
      delete (window as any).showCampaignStats;
    };
  }, []);

  return (
    <div className="mb-8 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-heading-1">Campaigns</h1>
          <p className="text-body-small mt-2">Manage and monitor your calling campaigns</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <button className="btn-secondary">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </button>
          
          <button 
            className="btn-primary"
            onClick={() => setIsModalOpen(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            New Campaign
          </button>
        </div>
      </div>

      {/* Enhanced Stats Cards - Conditionally Rendered */}
      {showStats && (
        <div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6 animate-fade-in"
          id="campaign-stats-container"
        >
          <div className="card" id="total-campaigns-card">
            <div className="card-body">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-caption uppercase tracking-wide font-medium" style={{ color: '#64748b' }}>Total Campaigns</p>
                  <p className="text-3xl font-bold mt-1" style={{ color: '#1e293b' }}>15</p>
                  <p className="text-body-small mt-1">All time</p>
                </div>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#dbeafe' }}>
                  <TrendingUp className="w-6 h-6" style={{ color: '#2563eb' }} />
                </div>
              </div>
            </div>
          </div>
          
          <div className="card" id="ongoing-campaigns-card">
            <div className="card-body">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-caption uppercase tracking-wide font-medium" style={{ color: '#64748b' }}>Ongoing</p>
                  <p className="text-3xl font-bold text-emerald-600 mt-1">0</p>
                  <p className="text-body-small mt-1">Currently running</p>
                </div>
                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                  <Play className="w-6 h-6 text-emerald-600" />
                </div>
              </div>
            </div>
          </div>
          
          <div className="card" id="paused-campaigns-card">
            <div className="card-body">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-caption uppercase tracking-wide font-medium" style={{ color: '#64748b' }}>Paused</p>
                  <p className="text-3xl font-bold text-amber-600 mt-1">12</p>
                  <p className="text-body-small mt-1">Temporarily stopped</p>
                </div>
                <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                  <Pause className="w-6 h-6 text-amber-600" />
                </div>
              </div>
            </div>
          </div>
          
          <div className="card" id="ongoing-calls-card">
            <div className="card-body">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-caption uppercase tracking-wide font-medium" style={{ color: '#64748b' }}>Ongoing Calls</p>
                  <p className="text-3xl font-bold mt-1" style={{ color: '#1e293b' }}>0</p>
                  <p className="text-body-small mt-1">Live connections</p>
                </div>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#f1f5f9' }}>
                  <Phone className="w-6 h-6" style={{ color: '#64748b' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <NewCampaignModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateCampaign}
      />

      <CampaignSuccessModal
        isOpen={isSuccessModalOpen}
        onClose={handleCloseSuccessModal}
        onImportNow={handleImportNow}
        onImportLater={handleImportLater}
        campaignName={createdCampaignName}
      />
    </div>
  );
};