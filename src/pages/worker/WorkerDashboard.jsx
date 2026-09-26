import React, { useState } from 'react';
import { 
  Bell, Briefcase, CheckCircle, ChevronRight, MapPin, Star
} from 'lucide-react';
import { useApp } from '../../hooks/useApp';
import { 
  Button, StatusBadge, EmptyState, ConfirmDialog, StatCard 
} from '../../components/ui';
import { getGreeting, formatRelativeTime } from '../../utils/formatters';
import { useToast } from '../../hooks/useToast';

export function WorkerDashboard({ onNavigate }) {
  const { workers, requests, activeWorkerId, toggleWorkerAvailability, acceptRequest, rejectRequest } = useApp();
  const { addToast } = useToast();
  
  const worker = workers.find(w => w.id === activeWorkerId);
  const [rejectId, setRejectId] = useState(null);

  if (!worker) return <div>Worker not found</div>;

  const incomingRequests = requests.filter(r => r.assignedWorkerId === activeWorkerId && r.status === 'ASSIGNED');
  const activeJobs = requests.filter(r => r.assignedWorkerId === activeWorkerId && ['ACCEPTED', 'IN_PROGRESS'].includes(r.status));

  const handleAccept = (id) => {
    acceptRequest(id);
    addToast({ title: 'Request Accepted', type: 'success' });
  };

  const handleRejectConfirm = () => {
    if (rejectId) {
      rejectRequest(rejectId);
      addToast({ title: 'Request Rejected', type: 'info' });
      setRejectId(null);
    }
  };

  return (
    <div className="ct-page">
      <div className="ct-page-header ct-flex ct-justify-between ct-items-center">
        <div>
          <h1 className="ct-page-greeting">{getGreeting()}, {worker.name}</h1>
          <p className="ct-page-subtitle">Here is your daily summary</p>
        </div>
        <div className="ct-flex ct-items-center ct-gap-3">
          <span className={`ct-badge ${worker.available ? 'ct-badge-available' : 'ct-badge-busy'}`}>
            {worker.available ? 'Available' : 'Offline'}
          </span>
          <Button 
            variant={worker.available ? 'outline' : 'primary'}
            size="sm"
            onClick={() => toggleWorkerAvailability(activeWorkerId)}
          >
            {worker.available ? 'Go Offline' : 'Go Online'}
          </Button>
        </div>
      </div>

      <div className="ct-stats-grid ct-mt-6">
        <StatCard label="Completed Jobs" value={worker.completedJobs} icon={CheckCircle} iconColor="green" />
        <StatCard label="Active Workload" value={worker.workload} icon={Briefcase} iconColor="blue" />
        <StatCard label="Rating" value={worker.rating} icon={Star} iconColor="amber" />
      </div>

      {incomingRequests.length > 0 && (
        <div className="ct-section ct-mt-6">
          <div className="ct-section-header">
            <h2 className="ct-section-title ct-flex ct-items-center ct-gap-2">
              <Bell className="ct-text-primary" size={20} />
              Incoming Requests
              <span className="ct-badge ct-badge-primary">{incomingRequests.length}</span>
            </h2>
          </div>
          <div className="ct-grid ct-gap-4">
            {incomingRequests.map(req => (
              <div key={req.id} className="ct-card ct-p-4">
                <div className="ct-flex ct-justify-between">
                  <div>
                    <h3 className="ct-font-semibold">{req.serviceType}</h3>
                    <div className="ct-text-sm ct-text-secondary ct-flex ct-items-center ct-gap-1 ct-mt-1">
                      <MapPin size={14} /> {req.area}
                    </div>
                  </div>
                  {req.urgency === 'High' && (
                    <span className="ct-badge ct-bg-red-100 ct-text-red-700">Urgent</span>
                  )}
                </div>
                <div className="ct-mt-4 ct-flex ct-gap-2">
                  <Button variant="primary" size="sm" fullWidth onClick={() => handleAccept(req.id)}>Accept</Button>
                  <Button variant="outline" size="sm" fullWidth onClick={() => setRejectId(req.id)}>Reject</Button>
                  <Button variant="ghost" size="sm" onClick={() => onNavigate('job-detail', { id: req.id })}>Details</Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="ct-section ct-mt-6">
        <div className="ct-section-header ct-flex ct-justify-between ct-items-center">
          <h2 className="ct-section-title ct-flex ct-items-center ct-gap-2">
            <Briefcase size={20} /> Active Jobs
          </h2>
          <Button variant="ghost" size="sm" onClick={() => onNavigate('jobs')}>View All</Button>
        </div>
        
        {activeJobs.length === 0 ? (
          <EmptyState 
            icon={Briefcase} 
            title="No active jobs" 
            description="You don't have any ongoing jobs at the moment."
          />
        ) : (
          <div className="ct-grid ct-gap-4 ct-mt-4">
            {activeJobs.map(job => (
              <div key={job.id} className="ct-card ct-p-4 ct-cursor-pointer ct-hover-bg" onClick={() => onNavigate('job-detail', { id: job.id })}>
                <div className="ct-flex ct-justify-between ct-items-start">
                  <div>
                    <h3 className="ct-font-medium">{job.serviceType}</h3>
                    <div className="ct-text-sm ct-text-muted ct-mt-1">{job.area}</div>
                  </div>
                  <StatusBadge status={job.status} size="sm" />
                </div>
                <div className="ct-flex ct-justify-between ct-items-center ct-mt-4 ct-pt-4 ct-border-t">
                  <span className="ct-text-xs ct-text-muted">{formatRelativeTime(job.timestamps?.created)}</span>
                  <ChevronRight size={16} className="ct-text-muted" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <ConfirmDialog 
        isOpen={!!rejectId}
        onConfirm={handleRejectConfirm}
        onCancel={() => setRejectId(null)}
        title="Reject Request"
        message="Are you sure you want to reject this request? This will impact your acceptance rate."
        confirmText="Yes, Reject"
        cancelText="Cancel"
        variant="danger"
      />
    </div>
  );
}
