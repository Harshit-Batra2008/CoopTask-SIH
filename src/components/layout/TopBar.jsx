import React from 'react';
import { Menu, Bell } from 'lucide-react';
import { useApp } from '../../hooks/useApp';

export function TopBar({ title, onMenuClick, onNotificationsClick }) {
  const { unreadNotifications, customer, currentRole, workers, activeWorkerId } = useApp();
  const unreadCount = unreadNotifications.length;

  const displayName = currentRole === 'worker'
    ? (workers.find(w => w.id === activeWorkerId)?.name || 'Worker')
    : currentRole === 'admin'
    ? 'Admin'
    : (customer?.name || 'User');

  const initials = 'CC'; // CodeCooperatives

  return (
    <header className="ct-topbar">
      <button className="ct-topbar-menu" onClick={onMenuClick} aria-label="Open menu">
        <Menu size={20} />
      </button>
      <div className="ct-topbar-title">{title || 'CoopTask'}</div>
      <div className="ct-topbar-actions">
        <button
          className="ct-topbar-icon-btn"
          onClick={onNotificationsClick}
          aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ''}`}
        >
          <Bell size={18} />
          {unreadCount > 0 && <span className="ct-notif-dot" />}
        </button>
        <div
          className="ct-avatar ct-avatar-sm"
          style={{ background: '#1B5E3B', cursor: 'default', fontSize: '0.7rem' }}
          title={displayName}
        >
          {initials}
        </div>
      </div>
    </header>
  );
}
