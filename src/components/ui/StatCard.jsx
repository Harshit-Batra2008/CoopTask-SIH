import React from 'react';

export function StatCard({ label, value, icon: Icon, iconColor = 'green', trend, className = '' }) {
  return (
    <div className={`ct-stat-card ${className}`}>
      {Icon && (
        <div className={`ct-stat-icon ct-stat-icon-${iconColor}`}>
          <Icon size={20} />
        </div>
      )}
      <div>
        <div className="ct-stat-value">{value}</div>
        <div className="ct-stat-label">{label}</div>
        {trend && (
          <div className="ct-text-xs" style={{ color: trend > 0 ? 'var(--ct-success)' : 'var(--ct-error)', marginTop: 2 }}>
            {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
          </div>
        )}
      </div>
    </div>
  );
}
