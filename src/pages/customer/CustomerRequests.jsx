import React, { useState } from 'react';
import { useApp } from '../../hooks/useApp';
import { 
  Search, 
  Clock, 
  MapPin,
  Zap, Droplets, Hammer, Sparkles, Paintbrush, Wrench
} from 'lucide-react';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { EmptyState } from '../../components/ui/EmptyState';
import { Input } from '../../components/ui/Input';
import { formatRelativeTime } from '../../utils/formatters';

const SERVICE_ICONS = { 
  Electrician: Zap, 
  Plumber: Droplets, 
  Carpenter: Hammer, 
  Cleaner: Sparkles, 
  Painter: Paintbrush, 
  'Appliance Repair': Wrench 
};

export function CustomerRequests({ onNavigate }) {
  const { requests } = useApp();
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');

  const TABS = ['All', 'Active', 'Completed', 'Cancelled'];

  const filteredRequests = requests.filter(req => {
    if (filter === 'Active' && ['COMPLETED', 'CANCELLED', 'REJECTED'].includes(req.status)) return false;
    if (filter === 'Completed' && req.status !== 'COMPLETED') return false;
    if (filter === 'Cancelled' && req.status !== 'CANCELLED') return false;
    
    if (search) {
      const q = search.toLowerCase();
      return req.serviceType.toLowerCase().includes(q) || req.id.toLowerCase().includes(q);
    }
    
    return true;
  }).sort((a, b) => b.timestamps.created - a.timestamps.created);

  return (
    <div className="ct-page">
      <div className="ct-page-header ct-mb-6">
        <h1 className="ct-font-bold ct-text-2xl">My Requests</h1>
      </div>

      <div className="ct-search ct-mb-4">
        <Input 
          icon={Search} 
          placeholder="Search requests..." 
          value={search} 
          onChange={(e) => setSearch(e.target.value)} 
        />
      </div>

      <div className="ct-filter-tabs flex gap-2 overflow-x-auto pb-2 ct-mb-6">
        {TABS.map(tab => (
          <button 
            key={tab}
            className={`ct-filter-tab px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${filter === tab ? 'bg-green-700 text-white active' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            onClick={() => setFilter(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="ct-flex-col ct-gap-4">
        {filteredRequests.length === 0 ? (
          <EmptyState 
            icon={Search} 
            title="No requests found" 
            description="We couldn't find any requests matching your filters."
          />
        ) : (
          filteredRequests.map(req => {
            const Icon = SERVICE_ICONS[req.serviceType] || Zap;
            
            return (
              <div 
                key={req.id} 
                className="ct-card ct-cursor-pointer hover:shadow-md transition-all"
                onClick={() => onNavigate('request-detail', { id: req.id })}
              >
                <div className="ct-flex ct-justify-between ct-items-start ct-mb-3">
                  <div className="ct-flex ct-gap-3">
                    <div className="ct-service-icon bg-green-50 p-3 rounded-xl text-green-700">
                      <Icon size={24} />
                    </div>
                    <div>
                      <div className="ct-flex ct-items-center ct-gap-2">
                        <span className="text-xs text-gray-500 font-mono">{req.id}</span>
                        <StatusBadge status={req.status} size="sm" />
                      </div>
                      <h3 className="ct-font-semibold ct-text-lg mt-1">{req.serviceType}</h3>
                    </div>
                  </div>
                </div>
                
                <div className="ct-divider ct-my-3"></div>
                
                <div className="ct-flex-col ct-gap-2 ct-text-sm ct-text-muted">
                  <div className="ct-flex ct-items-center ct-gap-2">
                    <MapPin size={16} />
                    <span className="truncate">{req.area}</span>
                  </div>
                  <div className="ct-flex ct-items-center ct-gap-2">
                    <Clock size={16} />
                    <span>{formatRelativeTime(req.timestamps.created)}</span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
