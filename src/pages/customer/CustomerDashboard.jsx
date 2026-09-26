import React from 'react';
import { useApp } from '../../hooks/useApp';
import { 
  Plus, 
  Clock, 
  CheckCircle2, 
  MapPin, 
  ChevronRight,
  Zap,
  Droplets,
  Hammer,
  Sparkles,
  Paintbrush,
  Wrench
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { EmptyState } from '../../components/ui/EmptyState';
import { Avatar } from '../../components/ui/Avatar';
import { getGreeting, formatRelativeTime } from '../../utils/formatters';

const SERVICE_ICONS = { 
  Electrician: Zap, 
  Plumber: Droplets, 
  Carpenter: Hammer, 
  Cleaner: Sparkles, 
  Painter: Paintbrush, 
  'Appliance Repair': Wrench 
};

export function CustomerDashboard({ onNavigate }) {
  const { customer, requests, getWorkerById } = useApp();

  const activeRequests = requests.filter(r => !['COMPLETED', 'CANCELLED', 'REJECTED'].includes(r.status));
  const recentCompleted = requests
    .filter(r => ['COMPLETED', 'CANCELLED'].includes(r.status))
    .sort((a, b) => (b.timestamps?.created || 0) - (a.timestamps?.created || 0))
    .slice(0, 5);

  return (
    <div className="ct-page">
      <div className="ct-page-header">
        <h1 className="ct-page-greeting">{getGreeting()}, {customer?.name?.split(' ')[0]}</h1>
        <p className="ct-page-subtitle">Need a reliable worker today?</p>
      </div>

      <div className="ct-card ct-mb-6">
        <div className="ct-card-header ct-flex ct-justify-between ct-items-center">
          <div>
            <h2 className="ct-card-title">Book a Service</h2>
            <p className="ct-text-muted">FairMatch™ will find the best worker for you</p>
          </div>
          <Button 
            variant="primary" 
            icon={Plus} 
            onClick={() => onNavigate('new-request')}
          >
            New Request
          </Button>
        </div>
      </div>

      <div className="ct-section ct-mb-6">
        <div className="ct-section-header ct-flex ct-justify-between ct-items-center ct-mb-4">
          <h2 className="ct-section-title">Active Requests</h2>
          <Button variant="ghost" size="sm" onClick={() => onNavigate('requests')}>
            View All
          </Button>
        </div>
        
        {activeRequests.length === 0 ? (
          <EmptyState 
            icon={Clock} 
            title="No active requests" 
            description="You don't have any ongoing service requests at the moment."
            actionText="Book a Service"
            onAction={() => onNavigate('new-request')}
          />
        ) : (
          <div className="ct-flex-col ct-gap-4">
            {activeRequests.map(req => {
              const Icon = SERVICE_ICONS[req.serviceType] || Zap;
              const worker = req.assignedWorkerId ? getWorkerById(req.assignedWorkerId) : null;
              
              return (
                <div 
                  key={req.id} 
                  className="ct-card ct-cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => onNavigate('request-detail', { id: req.id })}
                >
                  <div className="ct-flex ct-justify-between ct-items-center ct-mb-3">
                    <div className="ct-flex ct-items-center ct-gap-3">
                      <div className="ct-service-icon bg-green-100 text-green-700 p-2 rounded-lg">
                        <Icon size={24} />
                      </div>
                      <div>
                        <h3 className="ct-font-semibold">{req.serviceType}</h3>
                        <div className="ct-flex ct-items-center ct-text-sm ct-text-muted ct-mt-1">
                          <Clock size={14} className="ct-mr-1" />
                          {formatRelativeTime(req.timestamps?.created)}
                        </div>
                      </div>
                    </div>
                    <StatusBadge status={req.status} />
                  </div>
                  
                  {worker && (
                    <div className="ct-divider ct-my-3"></div>
                  )}
                  
                  {worker && (
                    <div className="ct-flex ct-justify-between ct-items-center">
                      <div className="ct-flex ct-items-center ct-gap-2">
                        <Avatar name={worker.name} size="sm" verified={worker.verified} />
                        <span className="ct-text-sm ct-font-medium">{worker.name}</span>
                      </div>
                      <span className="ct-text-xs ct-text-secondary ct-flex ct-items-center">
                        <ChevronRight size={16} />
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="ct-section">
        <h2 className="ct-section-title ct-mb-4">Recent History</h2>
        
        {recentCompleted.length === 0 ? (
          <div className="ct-text-center ct-py-6 ct-text-muted ct-bg-gray-50 ct-rounded-xl">
            No completed requests yet.
          </div>
        ) : (
          <div className="ct-flex-col ct-gap-3">
            {recentCompleted.map(req => {
              const Icon = SERVICE_ICONS[req.serviceType] || CheckCircle2;
              return (
                <div 
                  key={req.id} 
                  className="ct-card ct-cursor-pointer ct-flex ct-justify-between ct-items-center"
                  onClick={() => onNavigate('request-detail', { id: req.id })}
                >
                  <div className="ct-flex ct-items-center ct-gap-3">
                    <div className="ct-service-icon bg-gray-100 p-2 rounded-lg text-gray-500">
                      <Icon size={20} />
                    </div>
                    <div>
                      <h4 className="ct-font-medium">{req.serviceType}</h4>
                      <p className="ct-text-xs ct-text-muted">{formatRelativeTime(req.timestamps?.created)}</p>
                    </div>
                  </div>
                  <StatusBadge status={req.status} size="sm" />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
