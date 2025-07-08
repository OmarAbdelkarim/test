import React from 'react';
import { Play, Pause, Square } from 'lucide-react';

interface CampaignStatusBadgeProps {
  status: 'Active' | 'Paused' | 'Ended' | 'Ongoing';
}

export const CampaignStatusBadge: React.FC<CampaignStatusBadgeProps> = ({ status }) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'Active':
        return {
          icon: <Play className="w-3 h-3" />,
          className: 'status-badge status-active',
          label: 'Active'
        };
      case 'Ongoing':
        return {
          icon: <Play className="w-3 h-3" />,
          className: 'status-badge status-ongoing',
          label: 'Ongoing'
        };
      case 'Paused':
        return {
          icon: <Pause className="w-3 h-3" />,
          className: 'status-badge status-paused',
          label: 'Paused'
        };
      case 'Ended':
        return {
          icon: <Square className="w-3 h-3" />,
          className: 'status-badge status-ended',
          label: 'Ended'
        };
      default:
        return {
          icon: <Pause className="w-3 h-3" />,
          className: 'status-badge status-ended',
          label: status
        };
    }
  };

  const config = getStatusConfig();

  return (
    <span className={config.className}>
      {config.icon}
      <span className="ml-1">{config.label}</span>
    </span>
  );
};