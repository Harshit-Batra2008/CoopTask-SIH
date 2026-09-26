import React from 'react';
import { Home, ClipboardList, Bell, User, Briefcase, BarChart3, Users } from 'lucide-react';
import { useApp } from '../../hooks/useApp';

export function MobileNav({ activePage, onNavigate }) {
  const { currentRole, unreadNotifications } = useApp();
  const unreadCount = unreadNotifications.length;

  const getNavItems = () => {
    switch (currentRole) {
      case 'customer':
        return [
          { id: 'home', label: 'Home', icon: Home },
          { id: 'requests', label: 'Requests', icon: ClipboardList },
          { id: 'notifications', label: 'Alerts', icon: Bell, badge: unreadCount },
          { id: 'profile', label: 'Profile', icon: User },
        ];
      case 'worker':
        return [
          { id: 'home', label: 'Home', icon: Home },
          { id: 'jobs', label: 'Jobs', icon: Briefcase },
          { id: 'notifications', label: 'Alerts', icon: Bell, badge: unreadCount },
          { id: 'profile', label: 'Profile', icon: User },
        ];
      case 'admin':
        return [
          { id: 'home', label: 'Overview', icon: BarChart3 },
          { id: 'requests', label: 'Requests', icon: ClipboardList },
          { id: 'workers', label: 'Workers', icon: Users },
          { id: 'analytics', label: 'Analytics', icon: BarChart3 },
        ];
      default:
        return [];
    }
  };

  const navItems = getNavItems();

  return (
    <nav className="ct-mobile-nav" aria-label="Mobile navigation">
      {navItems.map((item) => {
        const Icon = item.icon;
        return (
          <button
            key={item.id}
            className={`ct-mobile-nav-item ${activePage === item.id ? 'active' : ''}`}
            onClick={() => onNavigate(item.id)}
            aria-label={item.label}
            aria-current={activePage === item.id ? 'page' : undefined}
          >
            <Icon size={20} />
            {item.badge > 0 && <span className="ct-notif-dot" />}
            <span>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
