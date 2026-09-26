import React from 'react';

export function EmptyState({ icon: Icon, title, description, actionText, onAction, children }) {
  return (
    <div className="ct-empty">
      {Icon && <Icon className="ct-empty-icon" size={48} />}
      {title && <div className="ct-empty-title">{title}</div>}
      {description && <div className="ct-empty-desc">{description}</div>}
      {actionText && onAction && (
        <button className="ct-btn ct-btn-primary" onClick={onAction}>
          {actionText}
        </button>
      )}
      {children}
    </div>
  );
}
