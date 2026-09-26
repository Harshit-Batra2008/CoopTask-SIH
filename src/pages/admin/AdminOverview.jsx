import React from 'react';
import { useApp } from '../../hooks/useApp';
import { StatCard, MatchScoreBar, StarRating, StatusBadge } from '../../components/ui';
import { Users, UserCheck, Briefcase, CheckCircle } from 'lucide-react';
import { formatDate, formatRelativeTime } from '../../utils/formatters';

export function AdminOverview({ onNavigate }) {
  const { workers, requests, workerStats, requestStats, averageMatchScore, averageRating, getWorkerById } = useApp();

  const activeWorkers = workers.filter(w => w.available && w.verified).length;
  const highWorkloadWorkers = workers.filter(w => w.workload >= 3);
  
  const recentRequests = [...requests]
    .sort((a, b) => {
      const timeA = a.timestamps?.created || new Date(a.timestamp).getTime();
      const timeB = b.timestamps?.created || new Date(b.timestamp).getTime();
      return timeB - timeA;
    })
    .slice(0, 10);

  return (
    <div className="ct-section">
      <div className="ct-page-header">
        <h1 className="ct-page-greeting">Cooperative overview</h1>
        <p className="ct-page-subtitle">{formatDate(new Date())}</p>
      </div>

      <div className="ct-stats-grid">
        <StatCard label="Verified workers" value={workerStats.verified} icon={Users} iconColor="green" />
        <StatCard label="Available now" value={workerStats.available} icon={UserCheck} iconColor="blue" />
        <StatCard label="Active jobs" value={requestStats.active} icon={Briefcase} iconColor="amber" />
        <StatCard label="Completed jobs" value={requestStats.completed} icon={CheckCircle} iconColor="green" />
      </div>

      <div className="ct-grid-2 ct-mt-6">
        <div className="ct-card">
          <div className="ct-section-header">
            <h2 className="ct-section-title">Workforce health</h2>
          </div>
          <div className="ct-info-box">
            <p><strong>{activeWorkers}</strong> of <strong>{workers.length}</strong> verified workers are currently available.</p>
          </div>
          
          <h3 className="ct-text-sm ct-font-semibold ct-mt-4 ct-mb-2">High workload workers</h3>
          {highWorkloadWorkers.length > 0 ? (
            <ul className="ct-tag-list">
              {highWorkloadWorkers.map(w => (
                <li key={w.id} className="ct-tag ct-badge-busy">{w.name} (Load: {w.workload})</li>
              ))}
            </ul>
          ) : (
            <p className="ct-text-sm ct-text-muted">No workers currently have a high workload.</p>
          )}
        </div>

        <div className="ct-card">
          <div className="ct-section-header">
            <h2 className="ct-section-title">Matching performance</h2>
          </div>
          <div className="ct-flex ct-items-center ct-justify-between ct-mb-4">
            <span className="ct-text-sm ct-font-medium">Average Match Score</span>
            <div className="ct-flex ct-items-center ct-gap-2">
              <MatchScoreBar score={averageMatchScore} size="md" />
              <span className="ct-text-sm ct-font-bold">{averageMatchScore}%</span>
            </div>
          </div>
          <div className="ct-flex ct-items-center ct-justify-between ct-mb-4">
            <span className="ct-text-sm ct-font-medium">Average Rating</span>
            <div className="ct-flex ct-items-center ct-gap-2">
              <StarRating rating={averageRating} size="sm" />
              <span className="ct-text-sm ct-font-bold">{averageRating.toFixed(1)}</span>
            </div>
          </div>
          <div className="ct-flex ct-items-center ct-justify-between">
            <span className="ct-text-sm ct-font-medium">Completion Rate</span>
            <span className="ct-text-sm ct-font-bold">
              {requests.length > 0 ? Math.round((requestStats.completed / requests.length) * 100) : 0}%
            </span>
          </div>
        </div>
      </div>

      <div className="ct-card ct-mt-6">
        <div className="ct-section-header ct-flex ct-justify-between ct-items-center">
          <h2 className="ct-section-title">Recent requests</h2>
          <button className="ct-text-sm ct-text-primary ct-font-medium hover:underline" onClick={() => onNavigate?.('requests')}>View all</button>
        </div>
        <div className="ct-table-wrapper">
          <table className="ct-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Service</th>
                <th>Area</th>
                <th>Status</th>
                <th>Match</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              {recentRequests.map(req => {
                const time = req.timestamps?.created || new Date(req.timestamp).getTime();
                return (
                  <tr key={req.id} onClick={() => onNavigate?.('requests')} className="cursor-pointer hover:bg-gray-50 transition-colors">
                    <td className="ct-text-sm ct-font-medium">{req.id}</td>
                    <td className="ct-text-sm">{req.serviceType}</td>
                    <td className="ct-text-sm">{req.area}</td>
                    <td><StatusBadge status={req.status} size="sm" /></td>
                    <td>{req.matchScore ? <MatchScoreBar score={req.matchScore} size="sm" /> : <span className="ct-text-xs ct-text-muted">-</span>}</td>
                    <td className="ct-text-xs ct-text-muted">{formatRelativeTime(time)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
