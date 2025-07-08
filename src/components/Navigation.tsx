import React from 'react';
import { 
  BarChart3, 
  Radio, 
  Phone, 
  PhoneOff, 
  MessageSquare, 
  Users, 
  UsersRound, 
  FileText, 
  BookOpen, 
  Workflow, 
  Megaphone, 
  HelpCircle, 
  Video 
} from 'lucide-react';

interface NavItem {
  icon: React.ReactNode;
  label: string;
  href: string;
  active?: boolean;
  badge?: number;
}

const navItems: NavItem[] = [
  { icon: <BarChart3 className="w-5 h-5" />, label: 'Dashboard', href: '/' },
  { icon: <Radio className="w-5 h-5" />, label: 'Live', href: '/live' },
  { icon: <Phone className="w-5 h-5" />, label: 'Calls', href: '/instances' },
  { icon: <PhoneOff className="w-5 h-5" />, label: 'Unserviced Calls', href: '/instances?unserviced=true' },
  { icon: <MessageSquare className="w-5 h-5" />, label: 'Conversations', href: '/conversations' },
  { icon: <Users className="w-5 h-5" />, label: 'Users', href: '/users' },
  { icon: <UsersRound className="w-5 h-5" />, label: 'Groups', href: '/groups' },
  { icon: <FileText className="w-5 h-5" />, label: 'Reports', href: '/reports' },
  { icon: <BookOpen className="w-5 h-5" />, label: 'Phonebook', href: '/phonebook' },
  { icon: <Workflow className="w-5 h-5" />, label: 'IVR', href: '/graphs' },
  { icon: <Megaphone className="w-5 h-5" />, label: 'Campaigns', href: '/campaigns', active: true },
  { icon: <HelpCircle className="w-5 h-5" />, label: 'Inquiries', href: '/inquiries' },
  { icon: <Video className="w-5 h-5" />, label: 'Conferences', href: '/conferences' },
];

export const Navigation: React.FC = () => {
  return (
    <nav className="nav-container">
      <div className="main-container" style={{ padding: '0 2rem' }}>
        <div className="flex space-x-1 overflow-x-auto scrollbar-hide">
          {navItems.map((item, index) => (
            <a
              key={index}
              href={item.href}
              className={`nav-item group ${item.active ? 'active' : ''}`}
            >
              <span className={`transition-colors duration-200 ${
                item.active ? 'text-blue-600' : 'text-slate-500 group-hover:text-slate-700'
              }`}>
                {item.icon}
              </span>
              <span className="text-sm font-medium">{item.label}</span>
              {item.badge && (
                <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] h-5 flex items-center justify-center font-medium">
                  {item.badge}
                </span>
              )}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
};