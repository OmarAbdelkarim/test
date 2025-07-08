import React, { useState, useRef, useEffect } from 'react';
import { 
  MoreHorizontal, 
  ArrowUpDown, 
  ArrowUp, 
  ArrowDown, 
  Play,
  Pause,
  Edit3,
  Trash2,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { CampaignStatusBadge } from './CampaignStatusBadge';
import { EditCampaignModal } from './EditCampaignModal';

interface Campaign {
  id: string;
  name: string;
  ivr: string;
  status: 'Active' | 'Paused' | 'Ended' | 'Ongoing';
  endDate: string | null;
  maxTries: number;
  audienceCount: number;
  ongoingCalls: number;
  phoneNumber?: string;
  startDate?: string;
  schedule?: Record<string, ScheduleDay>;
  timezone?: string;
  retryInterval?: string;
  concurrency?: number;
  totalCalls?: number;
  answeredCalls?: number;
}

interface ScheduleDay {
  enabled: boolean;
  startTime: string;
  endTime: string;
}

const mockCampaigns: Campaign[] = [
  {
    id: '1822a45276974f73a1b8cae7bfaace28',
    name: 'Dabbas test2',
    ivr: 'PhonebotElevenlabs5',
    status: 'Paused',
    endDate: '2024-12-31',
    maxTries: 1,
    audienceCount: 1250,
    ongoingCalls: 0,
    phoneNumber: '1',
    startDate: '2024-01-15',
    timezone: 'America/New_York',
    retryInterval: '01:30:00',
    concurrency: 5,
    totalCalls: 2847,
    answeredCalls: 1923,
    schedule: {
      monday: { enabled: true, startTime: '09:00', endTime: '17:00' },
      tuesday: { enabled: true, startTime: '09:00', endTime: '17:00' },
      wednesday: { enabled: true, startTime: '09:00', endTime: '17:00' },
      thursday: { enabled: true, startTime: '09:00', endTime: '17:00' },
      friday: { enabled: true, startTime: '09:00', endTime: '17:00' },
      saturday: { enabled: false, startTime: '09:00', endTime: '17:00' },
      sunday: { enabled: false, startTime: '09:00', endTime: '17:00' }
    }
  },
  {
    id: '315e750d5a90468a92d8fabced68af88',
    name: 'omar_test1',
    ivr: 'AccountWorkingHours',
    status: 'Paused',
    endDate: '2025-03-15',
    maxTries: 5,
    audienceCount: 850,
    ongoingCalls: 0,
    phoneNumber: '2',
    startDate: '2024-02-01',
    timezone: 'America/Chicago',
    retryInterval: '02:00:00',
    concurrency: 3,
    totalCalls: 1654,
    answeredCalls: 892,
    schedule: {
      monday: { enabled: true, startTime: '08:00', endTime: '18:00' },
      tuesday: { enabled: true, startTime: '08:00', endTime: '18:00' },
      wednesday: { enabled: true, startTime: '08:00', endTime: '18:00' },
      thursday: { enabled: true, startTime: '08:00', endTime: '18:00' },
      friday: { enabled: true, startTime: '08:00', endTime: '18:00' },
      saturday: { enabled: true, startTime: '10:00', endTime: '16:00' },
      sunday: { enabled: false, startTime: '09:00', endTime: '17:00' }
    }
  },
  {
    id: 'e3e08fdb16d44bdcb47839692fdb5b3a',
    name: 'Testing',
    ivr: 'DefaultIVR1658315753',
    status: 'Paused',
    endDate: '2024-11-15',
    maxTries: 1,
    audienceCount: 2100,
    ongoingCalls: 0,
    phoneNumber: '3',
    startDate: '2024-01-20',
    timezone: 'America/Los_Angeles',
    retryInterval: '00:45:00',
    concurrency: 8,
    totalCalls: 4523,
    answeredCalls: 3187,
    schedule: {
      monday: { enabled: true, startTime: '10:00', endTime: '19:00' },
      tuesday: { enabled: true, startTime: '10:00', endTime: '19:00' },
      wednesday: { enabled: true, startTime: '10:00', endTime: '19:00' },
      thursday: { enabled: true, startTime: '10:00', endTime: '19:00' },
      friday: { enabled: true, startTime: '10:00', endTime: '19:00' },
      saturday: { enabled: false, startTime: '09:00', endTime: '17:00' },
      sunday: { enabled: false, startTime: '09:00', endTime: '17:00' }
    }
  },
  {
    id: '58bac1ca75894036afaf963d6dfce994',
    name: 'Dabbas test',
    ivr: 'PhonebotElevenlabs3',
    status: 'Paused',
    endDate: '2025-06-30',
    maxTries: 1,
    audienceCount: 0,
    ongoingCalls: 0,
    phoneNumber: '4',
    startDate: '2024-03-01',
    timezone: 'Europe/London',
    retryInterval: '01:00:00',
    concurrency: 2,
    totalCalls: 0,
    answeredCalls: 0,
    schedule: {
      monday: { enabled: true, startTime: '09:00', endTime: '17:00' },
      tuesday: { enabled: true, startTime: '09:00', endTime: '17:00' },
      wednesday: { enabled: true, startTime: '09:00', endTime: '17:00' },
      thursday: { enabled: true, startTime: '09:00', endTime: '17:00' },
      friday: { enabled: true, startTime: '09:00', endTime: '17:00' },
      saturday: { enabled: false, startTime: '09:00', endTime: '17:00' },
      sunday: { enabled: false, startTime: '09:00', endTime: '17:00' }
    }
  },
  {
    id: 'e9bc505d110a4b329f176ad4f35843cb',
    name: 'CampaignTest',
    ivr: 'DefaultIVR1658315753',
    status: 'Paused',
    endDate: '2024-10-30',
    maxTries: 1,
    audienceCount: 500,
    ongoingCalls: 0,
    phoneNumber: '5',
    startDate: '2024-02-15',
    timezone: 'America/Denver',
    retryInterval: '00:30:00',
    concurrency: 4,
    totalCalls: 1234,
    answeredCalls: 567,
    schedule: {
      monday: { enabled: true, startTime: '08:30', endTime: '17:30' },
      tuesday: { enabled: true, startTime: '08:30', endTime: '17:30' },
      wednesday: { enabled: true, startTime: '08:30', endTime: '17:30' },
      thursday: { enabled: true, startTime: '08:30', endTime: '17:30' },
      friday: { enabled: true, startTime: '08:30', endTime: '17:30' },
      saturday: { enabled: false, startTime: '09:00', endTime: '17:00' },
      sunday: { enabled: false, startTime: '09:00', endTime: '17:00' }
    }
  },
  {
    id: '35b882dd57f5405fae0f9de2e32ab5da',
    name: 'Test2021',
    ivr: 'DefaultIVR1658315753',
    status: 'Paused',
    endDate: '2025-01-10',
    maxTries: 1,
    audienceCount: 750,
    ongoingCalls: 0,
    phoneNumber: '1',
    startDate: '2024-01-10',
    timezone: 'America/New_York',
    retryInterval: '02:15:00',
    concurrency: 6,
    totalCalls: 1876,
    answeredCalls: 1314,
    schedule: {
      monday: { enabled: true, startTime: '09:00', endTime: '18:00' },
      tuesday: { enabled: true, startTime: '09:00', endTime: '18:00' },
      wednesday: { enabled: true, startTime: '09:00', endTime: '18:00' },
      thursday: { enabled: true, startTime: '09:00', endTime: '18:00' },
      friday: { enabled: true, startTime: '09:00', endTime: '18:00' },
      saturday: { enabled: true, startTime: '10:00', endTime: '15:00' },
      sunday: { enabled: false, startTime: '09:00', endTime: '17:00' }
    }
  },
  {
    id: 'dd87b97516e3410186c9d22985d55492',
    name: 'Test20191029',
    ivr: 'DefaultClient',
    status: 'Paused',
    endDate: '2024-09-20',
    maxTries: 3,
    audienceCount: 1800,
    ongoingCalls: 0,
    phoneNumber: '2',
    startDate: '2024-01-05',
    timezone: 'America/Chicago',
    retryInterval: '01:45:00',
    concurrency: 7,
    totalCalls: 3456,
    answeredCalls: 1987,
    schedule: {
      monday: { enabled: true, startTime: '07:00', endTime: '19:00' },
      tuesday: { enabled: true, startTime: '07:00', endTime: '19:00' },
      wednesday: { enabled: true, startTime: '07:00', endTime: '19:00' },
      thursday: { enabled: true, startTime: '07:00', endTime: '19:00' },
      friday: { enabled: true, startTime: '07:00', endTime: '19:00' },
      saturday: { enabled: true, startTime: '09:00', endTime: '17:00' },
      sunday: { enabled: true, startTime: '11:00', endTime: '16:00' }
    }
  },
  {
    id: 'a485202a11024991867bdf2b7816f060',
    name: 'Test20191028d',
    ivr: 'DefaultClient',
    status: 'Ended',
    endDate: '2024-08-15',
    maxTries: 3,
    audienceCount: 950,
    ongoingCalls: 0,
    phoneNumber: '3',
    startDate: '2024-01-01',
    timezone: 'America/Los_Angeles',
    retryInterval: '03:00:00',
    concurrency: 3,
    totalCalls: 2134,
    answeredCalls: 1456,
    schedule: {
      monday: { enabled: true, startTime: '09:00', endTime: '17:00' },
      tuesday: { enabled: true, startTime: '09:00', endTime: '17:00' },
      wednesday: { enabled: true, startTime: '09:00', endTime: '17:00' },
      thursday: { enabled: true, startTime: '09:00', endTime: '17:00' },
      friday: { enabled: true, startTime: '09:00', endTime: '17:00' },
      saturday: { enabled: false, startTime: '09:00', endTime: '17:00' },
      sunday: { enabled: false, startTime: '09:00', endTime: '17:00' }
    }
  },
  {
    id: '45c873a71b2a4f26998e63a7081565cc',
    name: 'Test20191028c',
    ivr: 'DefaultClient',
    status: 'Ended',
    endDate: '2024-07-10',
    maxTries: 3,
    audienceCount: 1200,
    ongoingCalls: 0,
    phoneNumber: '4',
    startDate: '2023-12-15',
    timezone: 'Europe/London',
    retryInterval: '00:20:00',
    concurrency: 5,
    totalCalls: 2987,
    answeredCalls: 1834,
    schedule: {
      monday: { enabled: true, startTime: '08:00', endTime: '16:00' },
      tuesday: { enabled: true, startTime: '08:00', endTime: '16:00' },
      wednesday: { enabled: true, startTime: '08:00', endTime: '16:00' },
      thursday: { enabled: true, startTime: '08:00', endTime: '16:00' },
      friday: { enabled: true, startTime: '08:00', endTime: '16:00' },
      saturday: { enabled: false, startTime: '09:00', endTime: '17:00' },
      sunday: { enabled: false, startTime: '09:00', endTime: '17:00' }
    }
  },
  {
    id: 'cf48cfd5d5ce4197bc0fe4f31e4fa018',
    name: 'Test20191028b',
    ivr: 'DefaultClient',
    status: 'Ended',
    endDate: '2024-06-05',
    maxTries: 3,
    audienceCount: 680,
    ongoingCalls: 0,
    phoneNumber: '5',
    startDate: '2023-11-20',
    timezone: 'America/Denver',
    retryInterval: '01:15:00',
    concurrency: 4,
    totalCalls: 1567,
    answeredCalls: 823,
    schedule: {
      monday: { enabled: true, startTime: '10:00', endTime: '18:00' },
      tuesday: { enabled: true, startTime: '10:00', endTime: '18:00' },
      wednesday: { enabled: true, startTime: '10:00', endTime: '18:00' },
      thursday: { enabled: true, startTime: '10:00', endTime: '18:00' },
      friday: { enabled: true, startTime: '10:00', endTime: '18:00' },
      saturday: { enabled: true, startTime: '12:00', endTime: '17:00' },
      sunday: { enabled: false, startTime: '09:00', endTime: '17:00' }
    }
  }
];

type SortField = 'name' | 'status' | 'audienceCount' | 'ongoingCalls' | 'responseRate';
type SortDirection = 'asc' | 'desc';

export const CampaignsTable: React.FC = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>(mockCampaigns);
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleIvrClick = (ivrName: string) => {
    // Placeholder function - does nothing as requested
    console.log('IVR clicked:', ivrName);
  };

  // Function to calculate response rate
  const calculateResponseRate = (campaign: Campaign): number => {
    if (!campaign.totalCalls || campaign.totalCalls === 0) {
      return 0;
    }
    return (campaign.answeredCalls || 0) / campaign.totalCalls * 100;
  };

  // Function to format response rate
  const formatResponseRate = (campaign: Campaign): string => {
    const rate = calculateResponseRate(campaign);
    return `${rate.toFixed(2)}%`;
  };

  // Function to update campaign status
  const updateCampaignStatus = async (campaignId: string, newStatus: Campaign['status']) => {
    try {
      // Simulate API call to update campaign status in database
      console.log(`Updating campaign ${campaignId} status to ${newStatus}`);
      
      // In a real application, you would make an API call here:
      // await fetch(`/api/campaigns/${campaignId}`, {
      //   method: 'PATCH',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ status: newStatus })
      // });

      // Update local state immediately for UI responsiveness
      setCampaigns(prevCampaigns => 
        prevCampaigns.map(campaign => 
          campaign.id === campaignId 
            ? { ...campaign, status: newStatus }
            : campaign
        )
      );

      // Close the dropdown
      setOpenDropdown(null);

      // Show success feedback (you could add a toast notification here)
      console.log(`Campaign status successfully updated to ${newStatus}`);
      
    } catch (error) {
      console.error('Failed to update campaign status:', error);
      // In a real application, you would show an error message to the user
      // and potentially revert the optimistic update
    }
  };

  // Function to handle campaign edit
  const handleEditCampaign = (campaign: Campaign) => {
    setEditingCampaign(campaign);
    setIsEditModalOpen(true);
    setOpenDropdown(null);
  };

  // Function to handle campaign edit submission
  const handleEditSubmit = (updatedData: any) => {
    console.log('Updating campaign with data:', updatedData);
    
    // Update the campaign in the local state
    setCampaigns(prevCampaigns => 
      prevCampaigns.map(campaign => 
        campaign.id === updatedData.id 
          ? { ...campaign, ...updatedData }
          : campaign
      )
    );

    // Close the edit modal
    setIsEditModalOpen(false);
    setEditingCampaign(null);
  };

  const sortedCampaigns = [...campaigns].sort((a, b) => {
    let aVal: any;
    let bVal: any;
    
    if (sortField === 'responseRate') {
      aVal = calculateResponseRate(a);
      bVal = calculateResponseRate(b);
    } else {
      aVal = a[sortField];
      bVal = b[sortField];
    }
    
    if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const totalPages = Math.ceil(sortedCampaigns.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedCampaigns = sortedCampaigns.slice(startIndex, startIndex + pageSize);

  const renderSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="w-4 h-4 text-gray-400" />;
    }
    return sortDirection === 'asc' 
      ? <ArrowUp className="w-4 h-4 text-blue-600" />
      : <ArrowDown className="w-4 h-4 text-blue-600" />;
  };

  const formatDate = (dateString: string | null): string => {
    if (!dateString) return '—';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  const formatAudienceCount = (count: number): string => {
    if (count === 0) return '0';
    if (count < 1000) return count.toString();
    if (count < 1000000) return `${(count / 1000).toFixed(1)}K`;
    return `${(count / 1000000).toFixed(1)}M`;
  };

  // Tooltip component for disabled actions
  const DisabledActionTooltip: React.FC<{
    children: React.ReactNode;
    message: string;
  }> = ({ children, message }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const tooltipRef = useRef<HTMLDivElement>(null);

    const handleMouseEnter = (e: React.MouseEvent) => {
      setIsVisible(true);
      const rect = e.currentTarget.getBoundingClientRect();
      setPosition({
        x: rect.left + rect.width / 2,
        y: rect.top - 8
      });
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    return (
      <>
        <div
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className="relative"
        >
          {children}
        </div>
        {isVisible && (
          <div
            ref={tooltipRef}
            className="fixed z-[9999] px-3 py-2 bg-gray-900 text-white text-xs rounded-lg shadow-lg pointer-events-none whitespace-nowrap transform -translate-x-1/2 -translate-y-full"
            style={{
              left: position.x,
              top: position.y,
            }}
          >
            {message}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
          </div>
        )}
      </>
    );
  };

  const ActionDropdown: React.FC<{ campaign: Campaign }> = ({ campaign }) => {
    const isOpen = openDropdown === campaign.id;
    const canStart = campaign.status === 'Paused';
    const canPause = campaign.status === 'Ongoing';
    const isOngoing = campaign.status === 'Ongoing';

    const handleToggle = () => {
      setOpenDropdown(isOpen ? null : campaign.id);
    };

    const handleAction = (action: string) => {
      console.log(`${action} action for campaign:`, campaign.id);
      
      switch (action) {
        case 'start':
          updateCampaignStatus(campaign.id, 'Ongoing');
          break;
        case 'pause':
          updateCampaignStatus(campaign.id, 'Paused');
          break;
        case 'edit':
          handleEditCampaign(campaign);
          break;
        case 'delete':
          // Handle delete action
          console.log('Delete campaign:', campaign.id);
          setOpenDropdown(null);
          break;
        default:
          setOpenDropdown(null);
      }
    };

    // Close dropdown when clicking outside
    React.useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (isOpen && !(event.target as Element).closest('.dropdown-container')) {
          setOpenDropdown(null);
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen]);

    return (
      <div className="relative dropdown-container">
        <button
          onClick={handleToggle}
          className="icon-button"
          title="More Actions"
        >
          <MoreHorizontal className="w-4 h-4" />
        </button>

        {isOpen && (
          <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
            <div className="py-1">
              {canStart && (
                <button
                  onClick={() => handleAction('start')}
                  className="w-full px-4 py-2 text-left text-sm text-emerald-700 hover:bg-emerald-50 flex items-center space-x-2 transition-colors duration-200"
                >
                  <Play className="w-4 h-4" />
                  <span>Start Campaign</span>
                </button>
              )}
              {canPause && (
                <button
                  onClick={() => handleAction('pause')}
                  className="w-full px-4 py-2 text-left text-sm text-amber-700 hover:bg-amber-50 flex items-center space-x-2 transition-colors duration-200"
                >
                  <Pause className="w-4 h-4" />
                  <span>Pause Campaign</span>
                </button>
              )}
              
              {/* Edit Action - Disabled for ongoing campaigns */}
              {isOngoing ? (
                <DisabledActionTooltip message="This campaign cannot be edited while it is ongoing">
                  <div className="w-full px-4 py-2 text-left text-sm text-gray-400 cursor-not-allowed flex items-center space-x-2">
                    <Edit3 className="w-4 h-4" />
                    <span>Edit Campaign</span>
                  </div>
                </DisabledActionTooltip>
              ) : (
                <button
                  onClick={() => handleAction('edit')}
                  className="w-full px-4 py-2 text-left text-sm text-blue-700 hover:bg-blue-50 flex items-center space-x-2 transition-colors duration-200"
                >
                  <Edit3 className="w-4 h-4" />
                  <span>Edit Campaign</span>
                </button>
              )}
              
              <div className="border-t border-gray-100 my-1"></div>
              
              {/* Delete Action - Disabled for ongoing campaigns */}
              {isOngoing ? (
                <DisabledActionTooltip message="This campaign cannot be deleted while it is ongoing">
                  <div className="w-full px-4 py-2 text-left text-sm text-gray-400 cursor-not-allowed flex items-center space-x-2">
                    <Trash2 className="w-4 h-4" />
                    <span>Delete Campaign</span>
                  </div>
                </DisabledActionTooltip>
              ) : (
                <button
                  onClick={() => handleAction('delete')}
                  className="w-full px-4 py-2 text-left text-sm text-red-700 hover:bg-red-50 flex items-center space-x-2 transition-colors duration-200"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete Campaign</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <div className="table-container">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200" style={{ tableLayout: 'fixed' }}>
            <thead className="table-header">
              <tr>
                <th className="table-header-cell whitespace-nowrap" style={{ width: '100px' }}>
                  ID
                </th>
                <th className="table-header-cell whitespace-nowrap" style={{ width: '150px' }}>
                  <button
                    onClick={() => handleSort('name')}
                    className="flex items-center space-x-1 hover:text-gray-800 transition-colors duration-200 whitespace-nowrap"
                  >
                    <span>Name</span>
                    {renderSortIcon('name')}
                  </button>
                </th>
                <th className="table-header-cell whitespace-nowrap" style={{ width: '180px' }}>
                  IVR
                </th>
                <th className="table-header-cell whitespace-nowrap" style={{ width: '100px' }}>
                  <button
                    onClick={() => handleSort('status')}
                    className="flex items-center space-x-1 hover:text-gray-800 transition-colors duration-200 whitespace-nowrap"
                  >
                    <span>Status</span>
                    {renderSortIcon('status')}
                  </button>
                </th>
                <th className="table-header-cell whitespace-nowrap" style={{ width: '130px' }}>
                  End date
                </th>
                <th className="table-header-cell whitespace-nowrap" style={{ width: '140px' }}>
                  <button
                    onClick={() => handleSort('audienceCount')}
                    className="flex items-center space-x-1 hover:text-gray-800 transition-colors duration-200 whitespace-nowrap"
                  >
                    <span>Audience count</span>
                    {renderSortIcon('audienceCount')}
                  </button>
                </th>
                <th className="table-header-cell whitespace-nowrap" style={{ width: '120px' }}>
                  <button
                    onClick={() => handleSort('ongoingCalls')}
                    className="flex items-center space-x-1 hover:text-gray-800 transition-colors duration-200 whitespace-nowrap"
                  >
                    <span>Ongoing calls</span>
                    {renderSortIcon('ongoingCalls')}
                  </button>
                </th>
                <th className="table-header-cell whitespace-nowrap" style={{ width: '130px' }}>
                  <button
                    onClick={() => handleSort('responseRate')}
                    className="flex items-center space-x-1 hover:text-gray-800 transition-colors duration-200 whitespace-nowrap"
                  >
                    <span>Response Rate</span>
                    {renderSortIcon('responseRate')}
                  </button>
                </th>
                <th className="table-header-cell text-right whitespace-nowrap" style={{ width: '80px' }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {paginatedCampaigns.map((campaign, index) => (
                <tr 
                  key={campaign.id} 
                  className="table-row"
                >
                  <td className="table-cell">
                    <a
                      href={`/campaigns/${campaign.id}`}
                      className="text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200 text-mono"
                    >
                      {campaign.id.substring(0, 8)}
                    </a>
                  </td>
                  <td className="table-cell">
                    <div className="font-medium text-gray-900 truncate" title={campaign.name}>
                      {campaign.name}
                    </div>
                  </td>
                  <td className="table-cell">
                    <button
                      onClick={() => handleIvrClick(campaign.ivr)}
                      className="text-gray-600 text-mono truncate hover:text-blue-600 hover:underline transition-colors duration-200 cursor-pointer text-left"
                      title={campaign.ivr}
                    >
                      {campaign.ivr}
                    </button>
                  </td>
                  <td className="table-cell">
                    <CampaignStatusBadge status={campaign.status} />
                  </td>
                  <td className="table-cell text-gray-600 whitespace-nowrap">
                    {formatDate(campaign.endDate)}
                  </td>
                  <td className="table-cell">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full font-medium border ${
                      campaign.audienceCount > 0 
                        ? 'bg-blue-100 text-blue-800 border-blue-200' 
                        : 'bg-gray-100 text-gray-800 border-gray-200'
                    }`} style={{
                      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                      fontSize: '11.9px',
                      fontWeight: 400,
                      lineHeight: 1.4
                    }}>
                      {formatAudienceCount(campaign.audienceCount)}
                    </span>
                  </td>
                  <td className="table-cell">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full font-medium border ${
                      campaign.ongoingCalls > 0 
                        ? 'bg-emerald-100 text-emerald-800 border-emerald-200' 
                        : 'bg-gray-100 text-gray-800 border-gray-200'
                    }`} style={{
                      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                      fontSize: '11.9px',
                      fontWeight: 400,
                      lineHeight: 1.4
                    }}>
                      {campaign.ongoingCalls}
                    </span>
                  </td>
                  <td className="table-cell">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full font-medium border ${
                      calculateResponseRate(campaign) > 0 
                        ? calculateResponseRate(campaign) >= 70
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                          : calculateResponseRate(campaign) >= 50
                            ? 'bg-amber-100 text-amber-800 border-amber-200'
                            : 'bg-red-100 text-red-800 border-red-200'
                        : 'bg-gray-100 text-gray-800 border-gray-200'
                    }`} style={{
                      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                      fontSize: '11.9px',
                      fontWeight: 400,
                      lineHeight: 1.4
                    }}>
                      {formatResponseRate(campaign)}
                    </span>
                  </td>
                  <td className="table-cell text-right">
                    <ActionDropdown campaign={campaign} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Enhanced Pagination */}
        <div className="bg-white px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <div className="flex items-center" style={{
            fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            fontSize: '11.9px',
            fontWeight: 400,
            color: '#374151'
          }}>
            <span>Showing {startIndex + 1}–{Math.min(startIndex + pageSize, sortedCampaigns.length)} of {sortedCampaigns.length} results</span>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="btn-ghost disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Previous
            </button>
            
            <div className="flex items-center space-x-1">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-3 py-2 font-medium rounded-lg transition-colors duration-200 ${
                    currentPage === i + 1
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  style={{
                    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                    fontSize: '11.9px',
                    fontWeight: 500
                  }}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="btn-ghost disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
              <ChevronRight className="w-4 h-4 ml-1" />
            </button>

            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="form-select ml-4 py-2 px-3"
            >
              <option value={10}>10 per page</option>
              <option value={25}>25 per page</option>
              <option value={50}>50 per page</option>
            </select>
          </div>
        </div>
      </div>

      {/* Edit Campaign Modal */}
      <EditCampaignModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingCampaign(null);
        }}
        onSubmit={handleEditSubmit}
        campaign={editingCampaign}
      />
    </>
  );
};