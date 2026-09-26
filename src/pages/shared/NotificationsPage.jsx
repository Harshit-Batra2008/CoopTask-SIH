import React, { useState } from 'react';
import { useApp } from '../../hooks/useApp';
import { EmptyState, Button } from '../../components/ui';
import { 
  Bell, ClipboardList, UserCheck, CheckCircle, Play, 
  CheckCircle2, Star, XCircle, Info, AlertTriangle, Check
} from 'lucide-react';
import { formatRelativeTime } from '../../utils/formatters';

const getNotificationIcon = (type) => {
  switch (type) {
    case 'request_created':
    case 'new_request': return ClipboardList;
    case 'worker_assigned':
    case 'job_assigned': return UserCheck;
    case 'request_accepted': return CheckCircle;
    case 'job_started': return Play;
    case 'job_completed': return CheckCircle2;
    case 'new_review': return Star;
    case 'worker_rejected':
    case 'request_cancelled': return XCircle;
    case 'new_job': return Bell;
    case 'SUCCESS': return CheckCircle;
    case 'WARNING': return AlertTriangle;
    case 'INFO':
    default: return Info;
  }
};

export function NotificationsPage() {
  const { 
    notifications, currentRole, activeWorkerId, customer, 
    markNotificationRead, clearNotifications 
  } = useApp();
  
  const [filter, setFilter] = useState('All');

  const myNotifications = notifications.filter(n => {
    return n.role === currentRole || 
           (n.userId === customer?.id && currentRole === 'customer') || 
           (n.userId === activeWorkerId && currentRole === 'worker');
  }).sort((a, b) => b.timestamp - a.timestamp);

  const filteredNotifications = myNotifications.filter(n => {
    if (filter === 'Unread' && n.read) return false;
    return true;
  });

  const handleMarkAllRead = () => {
    myNotifications.filter(n => !n.read).forEach(n => markNotificationRead(n.id));
  };

  const handleClearAll = () => {
    clearNotifications(currentRole);
  };

  return (
    <div className="ct-section max-w-3xl mx-auto">
      <div className="ct-page-header flex justify-between items-end">
        <h1 className="ct-page-title">Notifications</h1>
        {myNotifications.length > 0 && (
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={handleMarkAllRead}>Mark all read</Button>
            <Button variant="outline" size="sm" onClick={handleClearAll}>Clear all</Button>
          </div>
        )}
      </div>

      <div className="ct-filter-tabs ct-mb-6">
        <button className={`ct-filter-tab ${filter === 'All' ? 'active' : ''}`} onClick={() => setFilter('All')}>
          All
        </button>
        <button className={`ct-filter-tab ${filter === 'Unread' ? 'active' : ''}`} onClick={() => setFilter('Unread')}>
          Unread
        </button>
      </div>

      <div className="space-y-3">
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map(notif => {
            const Icon = getNotificationIcon(notif.type);
            return (
              <div 
                key={notif.id} 
                className={`ct-notif ${!notif.read ? 'unread' : ''}`}
                onClick={() => !notif.read && markNotificationRead(notif.id)}
              >
                <div className="p-3 bg-gray-50 rounded-full shrink-0">
                  <Icon size={20} className={!notif.read ? 'text-primary' : 'text-gray-500'} />
                </div>
                <div className="ct-notif-content flex-1">
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <h4 className="ct-notif-title">{notif.title}</h4>
                      <p className="ct-notif-msg">{notif.message}</p>
                    </div>
                    <span className="ct-notif-time shrink-0">{formatRelativeTime(notif.timestamp)}</span>
                  </div>
                </div>
                {!notif.read && (
                  <div className="w-2 h-2 rounded-full bg-primary shrink-0"></div>
                )}
              </div>
            );
          })
        ) : (
          <EmptyState 
            icon={Bell} 
            title="All caught up!" 
            description={filter === 'Unread' ? "You have no unread notifications." : "You don't have any notifications yet."} 
          />
        )}
      </div>
    </div>
  );
}
