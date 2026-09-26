import React from 'react';
import { Home, ClipboardList, Bell, User, Briefcase, BarChart3, Users, ToggleLeft, X, RotateCcw } from 'lucide-react';
import { useApp } from '../../hooks/useApp';

export function Sidebar({ activePage, onNavigate, isOpen, onClose }) {
  const { currentRole, setRole, unreadNotifications, resetDemo } = useApp();
  const unreadCount = unreadNotifications.length;

  const getNavItems = () => {
    switch (currentRole) {
      case 'customer':
        return [
          { id: 'home', label: 'Home', icon: Home },
          { id: 'requests', label: 'My Requests', icon: ClipboardList },
          { id: 'notifications', label: 'Notifications', icon: Bell, badge: unreadCount },
          { id: 'profile', label: 'Profile', icon: User },
        ];
      case 'worker':
        return [
          { id: 'home', label: 'Dashboard', icon: Home },
          { id: 'jobs', label: 'My Jobs', icon: Briefcase },
          { id: 'notifications', label: 'Notifications', icon: Bell, badge: unreadCount },
          { id: 'profile', label: 'Profile', icon: User },
        ];
      case 'admin':
        return [
          { id: 'home', label: 'Overview', icon: BarChart3 },
          { id: 'requests', label: 'Service Requests', icon: ClipboardList },
          { id: 'workers', label: 'Workers', icon: Users },
          { id: 'analytics', label: 'Analytics', icon: BarChart3 },
        ];
      default:
        return [];
    }
  };

  const navItems = getNavItems();

  const handleNavigate = (pageId) => {
    onNavigate(pageId);
    if (onClose) onClose();
  };

  return (
    <aside className={`ct-sidebar ${isOpen ? 'open' : ''}`}>
      <div className="ct-sidebar-brand">
        <div className="ct-sidebar-brand-logo">CT</div>
        <div>
          <div className="ct-sidebar-brand-text">CoopTask</div>
          <div className="ct-sidebar-brand-sub">Cooperative platform</div>
        </div>
        <button
          className="ct-modal-close"
          onClick={onClose}
          style={{ display: isOpen ? 'flex' : 'none', marginLeft: 'auto' }}
          aria-label="Close menu"
        >
          <X size={18} />
        </button>
      </div>

      <nav className="ct-sidebar-nav">
        <div className="ct-sidebar-section">
          <div className="ct-sidebar-section-label">
            {currentRole === 'customer' ? 'Customer' : currentRole === 'worker' ? 'Worker' : 'Admin'}
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                className={`ct-sidebar-link ${activePage === item.id ? 'active' : ''}`}
                onClick={() => handleNavigate(item.id)}
              >
                <Icon size={18} />
                <span>{item.label}</span>
                {item.badge > 0 && <span className="ct-sidebar-badge">{item.badge}</span>}
              </button>
            );
          })}
        </div>
      </nav>

      <div className="ct-sidebar-footer">
        <div className="ct-sidebar-section-label" style={{ padding: '0 0 8px 0' }}>
          Demo Role
        </div>
        <div className="ct-role-switcher">
          {['customer', 'worker', 'admin'].map((role) => (
            <button
              key={role}
              className={`ct-role-option ${currentRole === role ? 'active' : ''}`}
              onClick={() => setRole(role)}
            >
              {role.charAt(0).toUpperCase() + role.slice(1)}
            </button>
          ))}
        </div>
        <button
          className="ct-btn ct-btn-ghost ct-btn-sm"
          onClick={resetDemo}
          style={{ marginTop: 12, width: '100%', opacity: 0.7, fontSize: '0.75rem' }}
        >
          <RotateCcw size={12} />
          Reset demo
        </button>
      </div>
    </aside>
  );
}
