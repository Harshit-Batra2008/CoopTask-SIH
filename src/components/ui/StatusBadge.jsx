import React from 'react';

const STATUS_MAP = {
  REQUESTED: { className: 'requested', label: 'Requested' },
  MATCHING: { className: 'matching', label: 'Matching' },
  ASSIGNED: { className: 'assigned', label: 'Assigned' },
  ACCEPTED: { className: 'accepted', label: 'Accepted' },
  IN_PROGRESS: { className: 'in_progress', label: 'In Progress' },
  COMPLETED: { className: 'completed', label: 'Completed' },
  CANCELLED: { className: 'cancelled', label: 'Cancelled' },
  REJECTED: { className: 'rejected', label: 'Rejected' },
};

export function StatusBadge({ status, size = 'md' }) {
  const config = STATUS_MAP[status?.toUpperCase()] || { className: 'requested', label: status || 'Unknown' };
  const sizeClass = size === 'sm' ? 'ct-badge-sm' : '';

  return (
    <span className={`ct-badge ct-badge-${config.className} ${sizeClass}`}>
      <span className="ct-badge-dot" />
      {config.label}
    </span>
  );
}
