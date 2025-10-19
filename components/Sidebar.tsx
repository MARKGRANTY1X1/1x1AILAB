import React, { useContext } from 'react';
import { DashboardIcon, SettingsIcon, UsersIcon, LogoIcon, QuestionMarkCircleIcon, ArrowLeftOnRectangleIcon, UserGroupIcon, BeakerIcon } from './Icons';
import { AppContext } from '../App';

type ViewType = 'dashboard' | 'staking' | 'settings' | 'referrals' | 'guide' | 'roadmap' | 'users';

interface SidebarProps {
  activeView: ViewType;
  setActiveView: (view: ViewType) => void;
  onLogout: () => void;
}

interface NavItem {
  id: ViewType;
  label: string;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeView, setActiveView, onLogout }) => {
  const { currentUser } = useContext(AppContext);

  const navItems: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: DashboardIcon },
    { id: 'referrals', label: 'Referrals', icon: UsersIcon },
    { id: 'guide', label: 'Setup Guide', icon: QuestionMarkCircleIcon },
    { id: 'roadmap', label: 'Roadmap', icon: BeakerIcon },
    { id: 'settings', label: 'Settings', icon: SettingsIcon },
  ];

  if (currentUser.role === 'admin') {
    navItems.push({ id: 'users', label: 'User Management', icon: UserGroupIcon });
  }

  return (
    <div className="flex flex-col w-64 bg-light-card dark:bg-dark-card border-r border-light-border dark:border-dark-border">
      <div className="flex items-center justify-center h-20 border-b border-light-border dark:border-dark-border">
          <LogoIcon className="h-8 w-auto text-primary" />
          <h1 className="text-xl font-bold ml-2">MineHub</h1>
      </div>
      <div className="flex-1 flex flex-col justify-between">
        <nav className="flex-1 px-4 py-4 space-y-2">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={`flex items-center px-4 py-2.5 text-sm font-medium rounded-lg w-full text-left transition-colors duration-200 ${
                activeView === item.id
                  ? 'bg-primary text-primary-content'
                  : 'text-light-text-secondary dark:text-dark-text-secondary hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              <item.icon className="mr-3 h-6 w-6" />
              {item.label}
            </button>
          ))}
        </nav>
        <div className="px-4 py-4 border-t border-light-border dark:border-dark-border">
            <button
              onClick={onLogout}
              className="flex items-center px-4 py-2.5 text-sm font-medium rounded-lg w-full text-left transition-colors duration-200 text-light-text-secondary dark:text-dark-text-secondary hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              <ArrowLeftOnRectangleIcon className="mr-3 h-6 w-6" />
              Logout & Lock
            </button>
        </div>
      </div>
    </div>
  );
};