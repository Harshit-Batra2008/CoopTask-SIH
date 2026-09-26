import React, { useState, useMemo } from 'react';
import { useApp } from '../../hooks/useApp';
import { Input, StatusBadge, MatchScoreBar, MatchBreakdown, Modal, EmptyState, Avatar } from '../../components/ui';
import { Search, ClipboardList, MapPin, Calendar, User, Info } from 'lucide-react';
import { formatDate, formatTime } from '../../utils/formatters';

export function AdminRequests({ onNavigate }) {
  const { requests, getWorkerById, customer } = useApp();
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [selectedRequest, setSelectedRequest] = useState(null);

  const filteredRequests = useMemo(() => {
    return requests.filter(req => {
      // Filter tab
      if (filter === 'Active' && !['REQUESTED', 'MATCHING', 'ASSIGNED', 'ACCEPTED', 'IN_PROGRESS'].includes(req.status)) return false;
      if (filter === 'Completed' && req.status !== 'COMPLETED') return false;
      if (filter === 'Cancelled' && req.status !== 'CANCELLED') return false;

      // Search
      if (search) {
        const query = search.toLowerCase();
        const matchesSearch = 
          req.id.toLowerCase().includes(query) ||
          req.serviceType.toLowerCase().includes(query) ||
          req.area.toLowerCase().includes(query);
        if (!matchesSearch) return false;
      }
      return true;
    }).sort((a, b) => {
      const timeA = a.timestamps?.created || new Date(a.timestamp).getTime();
      const timeB = b.timestamps?.created || new Date(b.timestamp).getTime();
      return timeB - timeA;
    });
  }, [requests, filter, search]);

  return (
    <div className="ct-section">
      <div className="ct-page-header">
        <h1 className="ct-page-title">Service requests</h1>
      </div>

      <div className="ct-flex ct-items-center ct-justify-between ct-mb-6 flex-wrap gap-4">
        <div className="ct-filter-tabs">
          {['All', 'Active', 'Completed', 'Cancelled'].map(f => (
            <button key={f} className={`ct-filter-tab ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>
              {f}
            </button>
          ))}
        </div>
        <div className="ct-search">
          <Search className="ct-search-icon" size={18} />
          <input 
            type="text" 
            placeholder="Search requests..." 
            className="ct-search-input"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="ct-card">
        {filteredRequests.length > 0 ? (
          <>
            <div className="ct-table-wrapper hidden md:block">
              <table className="ct-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Service</th>
                    <th>Customer</th>
                    <th>Area</th>
                    <th>Status</th>
                    <th>Worker</th>
                    <th>Match Score</th>
                    <th>Time</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRequests.map(req => {
                    const worker = req.assignedWorkerId ? getWorkerById(req.assignedWorkerId) : null;
                    const time = req.timestamps?.created || new Date(req.timestamp).getTime();
                    return (
                      <tr key={req.id} onClick={() => setSelectedRequest(req)} className="cursor-pointer hover:bg-gray-50">
                        <td className="ct-text-sm ct-font-medium">{req.id}</td>
                        <td className="ct-text-sm">{req.serviceType}</td>
                        <td className="ct-text-sm">{customer?.name || 'Customer'}</td>
                        <td className="ct-text-sm">{req.area}</td>
                        <td><StatusBadge status={req.status} size="sm" /></td>
                        <td className="ct-text-sm">{worker ? worker.name : <span className="ct-text-muted">Unassigned</span>}</td>
                        <td>{req.matchScore ? <MatchScoreBar score={req.matchScore} size="sm" /> : <span className="ct-text-muted">-</span>}</td>
                        <td className="ct-text-xs ct-text-muted">{formatDate(time)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="md:hidden flex flex-col gap-4">
              {filteredRequests.map(req => {
                const worker = req.assignedWorkerId ? getWorkerById(req.assignedWorkerId) : null;
                const time = req.timestamps?.created || new Date(req.timestamp).getTime();
                return (
                  <div key={req.id} className="border border-gray-100 rounded-lg p-4 cursor-pointer hover:bg-gray-50" onClick={() => setSelectedRequest(req)}>
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <span className="text-xs font-medium text-gray-500">{req.id}</span>
                        <h3 className="font-semibold text-gray-900">{req.serviceType}</h3>
                      </div>
                      <StatusBadge status={req.status} size="sm" />
                    </div>
                    <div className="flex flex-col gap-1 text-sm text-gray-600 mt-3">
                      <div className="flex items-center gap-2"><MapPin size={14}/> {req.area}</div>
                      <div className="flex items-center gap-2"><Calendar size={14}/> {formatDate(time)}</div>
                      {worker && <div className="flex items-center gap-2"><User size={14}/> {worker.name}</div>}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <EmptyState icon={ClipboardList} title="No requests found" description="Try adjusting your filters or search query." />
        )}
      </div>

      <Modal isOpen={!!selectedRequest} onClose={() => setSelectedRequest(null)} title="Request Details" size="lg">
        {selectedRequest && (() => {
          const worker = selectedRequest.assignedWorkerId ? getWorkerById(selectedRequest.assignedWorkerId) : null;
          const match = selectedRequest.matches?.find(m => m.workerId === selectedRequest.assignedWorkerId);
          const time = selectedRequest.timestamps?.created || new Date(selectedRequest.timestamp).getTime();
          
          return (
            <div className="flex flex-col gap-6">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-bold">{selectedRequest.serviceType}</h2>
                  <p className="text-sm text-gray-500">ID: {selectedRequest.id}</p>
                </div>
                <StatusBadge status={selectedRequest.status} size="md" />
              </div>
              
              <div className="ct-grid-2">
                <div className="border border-gray-100 rounded-lg p-4 bg-gray-50">
                  <h3 className="text-sm font-semibold mb-3 flex items-center gap-2"><Info size={16}/> Details</h3>
                  <div className="space-y-2 text-sm">
                    <p><span className="text-gray-500 w-24 inline-block">Area:</span> {selectedRequest.area}</p>
                    <p><span className="text-gray-500 w-24 inline-block">Address:</span> {selectedRequest.address}</p>
                    <p><span className="text-gray-500 w-24 inline-block">Urgency:</span> {selectedRequest.urgency}</p>
                    <p><span className="text-gray-500 w-24 inline-block">Created:</span> {formatDate(time)} {formatTime(time)}</p>
                    <div className="mt-2 pt-2 border-t border-gray-200">
                      <p className="text-gray-700">{selectedRequest.description}</p>
                    </div>
                  </div>
                </div>

                <div className="border border-gray-100 rounded-lg p-4 bg-gray-50">
                  <h3 className="text-sm font-semibold mb-3 flex items-center gap-2"><User size={16}/> Assigned Worker</h3>
                  {worker ? (
                    <div className="flex items-start gap-3">
                      <Avatar name={worker.name} size="md" verified={worker.verified} />
                      <div>
                        <p className="font-semibold">{worker.name}</p>
                        <p className="text-sm text-gray-500">{worker.phone}</p>
                        <p className="text-sm text-gray-500">{worker.skill}</p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 italic">No worker assigned yet.</p>
                  )}
                </div>
              </div>

              {match && match.breakdown && (
                <div className="border border-gray-100 rounded-lg p-4">
                  <h3 className="text-sm font-semibold mb-3">FairMatch Analysis</h3>
                  <div className="mb-4">
                    <MatchScoreBar score={match.score} size="md" showLabel />
                  </div>
                  <MatchBreakdown breakdown={match.breakdown} />
                </div>
              )}
            </div>
          );
        })()}
      </Modal>
    </div>
  );
}
