import React from 'react';
import { Check } from 'lucide-react';

const COLORS = ['#1B5E3B', '#2563eb', '#d97706', '#dc2626', '#7c3aed', '#0891b2', '#be185d', '#ea580c'];

function hashName(name) {
  let hash = 0;
  for (let i = 0; i < (name || '').length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash);
}

export function Avatar({ name = '', size = 'md', verified = false }) {
  const initials = name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  const color = COLORS[hashName(name) % COLORS.length];

  return (
    <div className={`ct-avatar ct-avatar-${size}`} style={{ background: color }} title={name}>
      {initials}
      {verified && (
        <span className="ct-avatar-verified">
          <Check size={10} />
        </span>
      )}
    </div>
  );
}
