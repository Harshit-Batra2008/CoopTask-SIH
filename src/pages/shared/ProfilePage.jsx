import React, { useState } from 'react';
import { useApp } from '../../hooks/useApp';
import { Avatar, StarRating, Button, ConfirmDialog, StatCard } from '../../components/ui';
import { MapPin, Phone, Calendar, Shield, Briefcase, RefreshCw } from 'lucide-react';
import { formatDate } from '../../utils/formatters';

export function ProfilePage() {
  const { currentRole, activeWorkerId, customer, workers, requestStats, resetDemo, toggleWorkerAvailability } = useApp();
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  if (currentRole === 'admin') {
    return (
      <div className="ct-section max-w-2xl mx-auto">
        <div className="ct-card text-center py-8">
          <div className="mx-auto w-16 h-16 bg-primary rounded-xl flex items-center justify-center mb-4">
            <Shield className="text-white" size={32} />
          </div>
          <h1 className="text-2xl font-bold mb-2">Cooperative Admin</h1>
          <p className="text-gray-600 mb-8">Managing the CodeCooperatives platform</p>
          
          <div className="grid grid-cols-2 gap-4 text-left mb-8 max-w-md mx-auto">
            <StatCard label="Platform Workers" value={workers.length} />
            <StatCard label="Total Requests" value={requestStats.total} />
          </div>

          <div className="border-t border-gray-100 pt-6 mt-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Developer Tools</h3>
            <Button variant="danger" icon={RefreshCw} onClick={() => setShowResetConfirm(true)}>
              Reset Demo Data
            </Button>
          </div>
        </div>

        <ConfirmDialog 
          isOpen={showResetConfirm}
          title="Reset Demo Data"
          message="Are you sure you want to reset all demo data? This will restore the initial state of the application. This action cannot be undone."
          confirmText="Reset Data"
          onConfirm={() => {
            resetDemo();
            setShowResetConfirm(false);
          }}
          onCancel={() => setShowResetConfirm(false)}
          variant="danger"
        />
      </div>
    );
  }

  if (currentRole === 'worker') {
    const worker = workers.find(w => w.id === activeWorkerId);
    if (!worker) return null;

    return (
      <div className="ct-section max-w-3xl mx-auto">
        <div className="ct-card">
          <div className="flex flex-col md:flex-row items-start gap-6">
            <Avatar name={worker.name} size="lg" verified={worker.verified} className="w-24 h-24 text-2xl" />
            
            <div className="flex-1 w-full">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-2xl font-bold">{worker.name}</h1>
                  <p className="text-primary font-medium text-lg">{worker.skill}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-700">{worker.available ? 'Available' : 'Busy'}</span>
                  <button 
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${worker.available ? 'bg-primary' : 'bg-gray-300'}`}
                    onClick={() => toggleWorkerAvailability(worker.id)}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${worker.available ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-4 mt-4 mb-6">
                <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg">
                  <StarRating rating={worker.rating} size="sm" />
                  <span className="font-bold text-sm">{worker.rating.toFixed(1)}</span>
                </div>
                <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg">
                  <Briefcase size={16} className="text-gray-500" />
                  <span className="font-bold text-sm">{worker.completedJobs} <span className="font-normal text-gray-500">jobs</span></span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
                <div className="flex items-center gap-3">
                  <Phone size={18} className="text-gray-400" />
                  <span>{worker.phone}</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin size={18} className="text-gray-400" />
                  <span>{worker.area}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar size={18} className="text-gray-400" />
                  <span>Joined {formatDate(worker.joinedDate)}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Shield size={18} className="text-gray-400" />
                  <span>{worker.verified ? 'Verified Member' : 'Pending Verification'}</span>
                </div>
              </div>

              <div className="mt-8 border-t border-gray-100 pt-6">
                <h3 className="font-semibold mb-3">Skills</h3>
                <ul className="ct-tag-list">
                  {worker.skills.map(s => (
                    <li key={s} className="ct-tag">{s}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Customer profile
  return (
    <div className="ct-section max-w-2xl mx-auto">
      <div className="ct-card">
        <div className="flex flex-col items-center text-center pb-8 border-b border-gray-100 mb-8">
          <Avatar name={customer?.name || 'Customer'} size="lg" className="w-24 h-24 text-2xl mb-4" />
          <h1 className="text-2xl font-bold">{customer?.name}</h1>
          
          <div className="flex gap-4 mt-4 text-sm text-gray-600">
            <span className="flex items-center gap-1.5"><Phone size={16} /> {customer?.phone}</span>
            <span className="flex items-center gap-1.5"><MapPin size={16} /> {customer?.area}</span>
          </div>
        </div>

        <h3 className="font-semibold text-lg mb-4">Your Activity</h3>
        <div className="grid grid-cols-2 gap-4">
          <StatCard label="Total Requests" value={requestStats.total} />
          <StatCard label="Completed Jobs" value={requestStats.completed} />
        </div>
      </div>
    </div>
  );
}
