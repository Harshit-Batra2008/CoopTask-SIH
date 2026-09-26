import React, { useState } from 'react';
import { Info } from 'lucide-react';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { MobileNav } from './MobileNav';
import { useApp } from '../../hooks/useApp';

export function AppShell({ activePage, onNavigate, children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { currentRole } = useApp();

  const getPageTitle = () => {
    const titles = {
      home: currentRole === 'admin' ? 'Overview' : currentRole === 'worker' ? 'Dashboard' : 'Home',
      requests: 'Service Requests',
      'new-request': 'New Request',
      'request-detail': 'Request Details',
      jobs: 'My Jobs',
      'job-detail': 'Job Details',
      availability: 'Availability',
      workers: 'Workers',
      analytics: 'Analytics',
      notifications: 'Notifications',
      profile: 'Profile',
    };
    return titles[activePage] || 'CoopTask';
  };

  return (
    <>
      <div className="ct-demo-banner">
        <Info size={14} />
        <span>You are exploring a simulated CoopTask environment.</span>
      </div>

      <div className="ct-app">
        <Sidebar
          activePage={activePage}
          onNavigate={onNavigate}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        {isSidebarOpen && (
          <div
            className="ct-sidebar-overlay visible"
            onClick={() => setIsSidebarOpen(false)}
            aria-hidden="true"
          />
        )}

        <div className="ct-app-content">
          <TopBar
            title={getPageTitle()}
            onMenuClick={() => setIsSidebarOpen(true)}
            onNotificationsClick={() => onNavigate('notifications')}
          />

          <main className="ct-page">{children}</main>

          <footer className="ct-footer">
            <span>CoopTask · Cooperative workforce coordination</span>
            <span>Powered by CodeCooperatives · Demo environment</span>
          </footer>

          <MobileNav activePage={activePage} onNavigate={onNavigate} />
        </div>
      </div>
    </>
  );
}
