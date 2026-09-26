import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { AppProvider } from './context/AppContext';
import { ToastProvider } from './hooks/useToast';
import { AppShell } from './components/layout/AppShell';
import { useApp } from './hooks/useApp';
import './styles.css';

// Import all pages
import { CustomerDashboard } from './pages/customer/CustomerDashboard';
import { CustomerRequests } from './pages/customer/CustomerRequests';
import { RequestFlow } from './pages/customer/RequestFlow';
import { RequestDetail } from './pages/customer/RequestDetail';
import { WorkerDashboard } from './pages/worker/WorkerDashboard';
import { WorkerJobs } from './pages/worker/WorkerJobs';
import { WorkerJobDetail } from './pages/worker/WorkerJobDetail';
import { AdminOverview } from './pages/admin/AdminOverview';
import { AdminRequests } from './pages/admin/AdminRequests';
import { AdminWorkers } from './pages/admin/AdminWorkers';
import { AdminAnalytics } from './pages/admin/AdminAnalytics';
import { NotificationsPage } from './pages/shared/NotificationsPage';
import { ProfilePage } from './pages/shared/ProfilePage';

function AppRouter() {
  const { currentRole } = useApp();
  const [activePage, setActivePage] = useState('home');
  const [pageParams, setPageParams] = useState({});

  // Reset to home when role changes
  React.useEffect(() => {
    setActivePage('home');
    setPageParams({});
  }, [currentRole]);

  const navigate = (page, params = {}) => {
    setActivePage(page);
    setPageParams(params);
  };

  const renderPage = () => {
    // Shared pages
    if (activePage === 'notifications') return <NotificationsPage />;
    if (activePage === 'profile') return <ProfilePage />;

    switch (currentRole) {
      case 'customer':
        switch (activePage) {
          case 'home': return <CustomerDashboard onNavigate={navigate} />;
          case 'requests': return <CustomerRequests onNavigate={navigate} />;
          case 'new-request': return <RequestFlow onNavigate={navigate} />;
          case 'request-detail': return <RequestDetail requestId={pageParams.requestId} onNavigate={navigate} />;
          default: return <CustomerDashboard onNavigate={navigate} />;
        }
      case 'worker':
        switch (activePage) {
          case 'home': return <WorkerDashboard onNavigate={navigate} />;
          case 'jobs': return <WorkerJobs onNavigate={navigate} />;
          case 'job-detail': return <WorkerJobDetail requestId={pageParams.requestId} onNavigate={navigate} />;
          case 'availability': return <WorkerDashboard onNavigate={navigate} />;
          default: return <WorkerDashboard onNavigate={navigate} />;
        }
      case 'admin':
        switch (activePage) {
          case 'home': return <AdminOverview onNavigate={navigate} />;
          case 'requests': return <AdminRequests onNavigate={navigate} />;
          case 'workers': return <AdminWorkers onNavigate={navigate} />;
          case 'analytics': return <AdminAnalytics />;
          default: return <AdminOverview onNavigate={navigate} />;
        }
      default:
        return <CustomerDashboard onNavigate={navigate} />;
    }
  };

  return (
    <AppShell activePage={activePage} onNavigate={navigate}>
      {renderPage()}
    </AppShell>
  );
}

function App() {
  return (
    <AppProvider>
      <ToastProvider>
        <AppRouter />
      </ToastProvider>
    </AppProvider>
  );
}

createRoot(document.getElementById('root')).render(<App />);