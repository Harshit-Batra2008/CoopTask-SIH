import React, { useMemo } from 'react';
import { useApp } from '../../hooks/useApp';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { StatCard, MatchScoreBar, StarRating } from '../../components/ui';

const COLORS = ['#1B5E3B', '#d97706', '#9ca3af'];

export function AdminAnalytics() {
  const { requests, workers, averageMatchScore, averageRating } = useApp();

  const serviceData = useMemo(() => {
    const counts = {};
    requests.forEach(req => {
      counts[req.serviceType] = (counts[req.serviceType] || 0) + 1;
    });
    return Object.entries(counts).map(([name, count]) => ({ name, count }));
  }, [requests]);

  const completionData = useMemo(() => {
    let completed = 0, active = 0, cancelled = 0;
    requests.forEach(req => {
      if (req.status === 'COMPLETED') completed++;
      else if (req.status === 'CANCELLED') cancelled++;
      else active++;
    });
    return [
      { name: 'Completed', value: completed },
      { name: 'Active', value: active },
      { name: 'Cancelled', value: cancelled }
    ];
  }, [requests]);

  const topWorkers = useMemo(() => {
    return [...workers]
      .sort((a, b) => b.workload - a.workload)
      .slice(0, 5);
  }, [workers]);

  return (
    <div className="ct-section">
      <div className="ct-page-header">
        <h1 className="ct-page-title">Analytics</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="ct-card">
          <h2 className="ct-section-title mb-4">Requests by Service</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={serviceData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip cursor={{fill: '#f3f4f6'}} />
                <Bar dataKey="count" fill="#1B5E3B" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="ct-card">
          <h2 className="ct-section-title mb-4">Completion Rate</h2>
          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={completionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {completionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute flex flex-col gap-2 pointer-events-none">
              {completionData.map((entry, index) => (
                <div key={entry.name} className="flex items-center gap-2 text-sm">
                  <div className="w-3 h-3 rounded-full" style={{backgroundColor: COLORS[index % COLORS.length]}}></div>
                  <span className="font-medium text-gray-700">{entry.name}</span>
                  <span className="text-gray-500">({entry.value})</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="ct-card">
          <h2 className="ct-section-title mb-4">Worker Utilization (Top 5 Workloads)</h2>
          <div className="space-y-4">
            {topWorkers.map(w => (
              <div key={w.id} className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-semibold">{w.name}</p>
                  <p className="text-xs text-gray-500">{w.skill}</p>
                </div>
                <div className="w-1/2 flex items-center gap-3">
                  <div className="flex-1 bg-gray-200 h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-amber-500 h-full rounded-full" 
                      style={{width: `${Math.min((w.workload / 5) * 100, 100)}%`}}
                    />
                  </div>
                  <span className="text-sm font-medium w-8 text-right">{w.workload}/5</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="ct-card">
          <h2 className="ct-section-title mb-4">Performance Metrics</h2>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between mb-1 text-sm font-medium">
                <span>Average Match Score</span>
                <span>{averageMatchScore}%</span>
              </div>
              <MatchScoreBar score={averageMatchScore} size="lg" />
            </div>
            
            <div className="flex justify-between items-center border-t border-gray-100 pt-4">
              <span className="text-sm font-medium">Average Rating</span>
              <div className="flex items-center gap-2">
                <StarRating rating={averageRating} size="md" />
                <span className="font-bold">{averageRating.toFixed(1)}</span>
              </div>
            </div>

            <div className="flex justify-between items-center border-t border-gray-100 pt-4">
              <span className="text-sm font-medium">Total Completed Jobs</span>
              <span className="font-bold">{completionData.find(d => d.name === 'Completed')?.value || 0}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
