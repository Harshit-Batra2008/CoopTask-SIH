import React from 'react';

export function LoadingState({ message = 'Loading...' }) {
  return (
    <div className="ct-loading">
      <div className="ct-spinner" />
      <div className="ct-loading-text">{message}</div>
    </div>
  );
}
