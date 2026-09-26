import React, { useState } from 'react';
import { Search, Briefcase, ChevronRight, Star } from 'lucide-react';
import { useApp } from '../../hooks/useApp';
import { StatusBadge, EmptyState } from '../../components/ui';
import { formatDate } from '../../utils/formatters';

export function WorkerJobs({ onNavigate }) {
  const { requests, activeWorkerId } = useApp();
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');

  const workerRequests = requests.filter(r => r.assignedWorkerId === activeWorkerId);
  
  const filteredJobs = workerRequests.filter(job => {
    if (filter === 'Active' && !['ASSIGNED', 'ACCEPTED', 'IN_PROGRESS'].includes(job.status)) return false;
    if (filter === 'Completed' && job.status !== 'COMPLETED') return false;
    if (filter === 'Rejected' && job.status !== 'REJECTED') return false;
    if (search && !job.serviceType.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="ct-page">
      <div className="ct-page-header">
        <h1 className="ct-font-bold ct-text-xl">My Jobs</h1>
        <p className="ct-text-muted ct-text-sm">Manage your past and current jobs</p>
      </div>

      <div className="ct-mt-4">
        <div className="ct-search ct-mb-4">
          <Search className="ct-search-icon" size={18} />
          <input 
            type="text" 
            className="ct-search-input" 
            placeholder="Search by service type..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="ct-filter-tabs ct-mb-4">
          {['All', 'Active', 'Completed', 'Rejected'].map(t => (
            <button 
              key={t}
              className={`ct-filter-tab ${filter === t ? 'active' : ''}`}
              onClick={() => setFilter(t)}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="ct-flex ct-flex-col ct-gap-4">
        {filteredJobs.length === 0 ? (
          <EmptyState 
            icon={Briefcase}
            title={`No ${filter !== 'All' ? filter.toLowerCase() : ''} jobs found`}
            description="You don't have any jobs matching the current filters."
          />
        ) : (
          filteredJobs.map(job => (
            <div 
              key={job.id} 
              className="ct-card ct-p-4 ct-cursor-pointer"
              onClick={() => onNavigate('job-detail', { id: job.id })}
            >
              <div className="ct-flex ct-justify-between ct-items-start">
                <div>
                  <h3 className="ct-font-semibold">{job.serviceType}</h3>
                  <div className="ct-text-sm ct-text-muted ct-mt-1">{job.area}</div>
                </div>
                <StatusBadge status={job.status} size="sm" />
              </div>
              
              <div className="ct-flex ct-justify-between ct-items-center ct-mt-4 ct-pt-3 ct-border-t ct-text-sm">
                <span className="ct-text-muted">{formatDate(job.timestamps?.created)}</span>
                {job.reviewed && (
                  <div className="ct-flex ct-items-center ct-text-amber-500">
                    <Star size={14} className="ct-fill-amber-500 ct-mr-1" />
                    <span>Reviewed</span>
                  </div>
                )}
                {!job.reviewed && <ChevronRight size={16} className="ct-text-muted" />}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
