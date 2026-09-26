import React, { useState, useMemo } from 'react';
import { useApp } from '../../hooks/useApp';
import { Input, EmptyState, Avatar, StarRating, Modal } from '../../components/ui';
import { Search, Users, MapPin, Phone, Calendar, Briefcase } from 'lucide-react';
import { formatDate } from '../../utils/formatters';

export function AdminWorkers({ onNavigate }) {
  const { workers, workerStats } = useApp();
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [selectedWorker, setSelectedWorker] = useState(null);

  const filteredWorkers = useMemo(() => {
    return workers.filter(w => {
      // Filter tab
      if (filter === 'Available' && !w.available) return false;
      if (filter === 'Busy' && w.available) return false;
      if (filter === 'Verified' && !w.verified) return false;
      if (filter === 'Pending' && w.verified) return false;

      // Search
      if (search) {
        const query = search.toLowerCase();
        const matchesSearch = 
          w.name.toLowerCase().includes(query) ||
          w.skill.toLowerCase().includes(query) ||
          w.area.toLowerCase().includes(query);
        if (!matchesSearch) return false;
      }
      return true;
    });
  }, [workers, filter, search]);

  return (
    <div className="ct-section">
      <div className="ct-page-header">
        <h1 className="ct-page-title">Worker network</h1>
      </div>

      <div className="ct-flex ct-items-center ct-gap-4 ct-mb-6 flex-wrap">
        <div className="bg-green-50 text-green-800 px-4 py-2 rounded-lg text-sm font-semibold flex-1 min-w-[120px]">
          Total: {workerStats.total}
        </div>
        <div className="bg-blue-50 text-blue-800 px-4 py-2 rounded-lg text-sm font-semibold flex-1 min-w-[120px]">
          Verified: {workerStats.verified}
        </div>
        <div className="bg-amber-50 text-amber-800 px-4 py-2 rounded-lg text-sm font-semibold flex-1 min-w-[120px]">
          Available: {workerStats.available}
        </div>
        <div className="bg-gray-50 text-gray-800 px-4 py-2 rounded-lg text-sm font-semibold flex-1 min-w-[120px]">
          Pending: {workerStats.pendingVerification}
        </div>
      </div>

      <div className="ct-flex ct-items-center ct-justify-between ct-mb-6 flex-wrap gap-4">
        <div className="ct-filter-tabs">
          {['All', 'Available', 'Busy', 'Verified', 'Pending'].map(f => (
            <button key={f} className={`ct-filter-tab ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>
              {f}
            </button>
          ))}
        </div>
        <div className="ct-search">
          <Search className="ct-search-icon" size={18} />
          <input 
            type="text" 
            placeholder="Search workers..." 
            className="ct-search-input"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredWorkers.length > 0 ? (
          filteredWorkers.map(worker => (
            <div key={worker.id} className="ct-worker-card cursor-pointer hover:border-primary transition-colors" onClick={() => setSelectedWorker(worker)}>
              <div className="ct-worker-info">
                <Avatar name={worker.name} size="md" verified={worker.verified} />
                <div>
                  <h3 className="ct-worker-name">{worker.name}</h3>
                  <p className="ct-text-sm text-gray-600">{worker.skill}</p>
                </div>
              </div>
              
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <MapPin size={14}/> {worker.area}
                </div>
                <div className="flex gap-2">
                  <span className={`ct-badge ${worker.verified ? 'ct-badge-verified' : 'ct-badge-pending'}`}>
                    {worker.verified ? 'Verified' : 'Pending'}
                  </span>
                  <span className={`ct-badge ${worker.available ? 'ct-badge-available' : 'ct-badge-busy'}`}>
                    {worker.available ? 'Available' : 'Busy'}
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <StarRating rating={worker.rating} size="sm" />
                  <span className="text-xs text-gray-500">({worker.rating})</span>
                </div>
                <div className="text-xs text-gray-500">
                  <span className="font-semibold text-gray-900">{worker.completedJobs}</span> jobs
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full">
            <EmptyState icon={Users} title="No workers found" description="Try adjusting your filters or search query." />
          </div>
        )}
      </div>

      <Modal isOpen={!!selectedWorker} onClose={() => setSelectedWorker(null)} title="Worker Profile" size="md">
        {selectedWorker && (
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-4">
              <Avatar name={selectedWorker.name} size="lg" verified={selectedWorker.verified} />
              <div>
                <h2 className="text-xl font-bold">{selectedWorker.name}</h2>
                <p className="text-primary font-medium">{selectedWorker.skill}</p>
                <div className="flex items-center gap-2 mt-1">
                  <StarRating rating={selectedWorker.rating} size="sm" />
                  <span className="text-sm font-medium">{selectedWorker.rating.toFixed(1)}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <span className={`ct-badge ${selectedWorker.verified ? 'ct-badge-verified' : 'ct-badge-pending'}`}>
                {selectedWorker.verified ? 'Verified' : 'Pending Verification'}
              </span>
              <span className={`ct-badge ${selectedWorker.available ? 'ct-badge-available' : 'ct-badge-busy'}`}>
                {selectedWorker.available ? 'Currently Available' : 'Currently Busy'}
              </span>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 space-y-3 text-sm">
              <div className="flex items-center gap-3 text-gray-700">
                <Phone size={16} className="text-gray-400" />
                <span>{selectedWorker.phone}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-700">
                <MapPin size={16} className="text-gray-400" />
                <span>{selectedWorker.area}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-700">
                <Calendar size={16} className="text-gray-400" />
                <span>Joined {formatDate(selectedWorker.joinedDate)}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-700">
                <Briefcase size={16} className="text-gray-400" />
                <span>{selectedWorker.completedJobs} jobs completed</span>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold mb-2">Skills & Expertise</h3>
              <ul className="ct-tag-list">
                {selectedWorker.skills.map(s => (
                  <li key={s} className="ct-tag">{s}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
