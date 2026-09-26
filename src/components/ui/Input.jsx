import React from 'react';

export function Input({ label, helperText, error, icon: Icon, className = '', ...inputProps }) {
  return (
    <div className={`ct-field ${className}`}>
      {label && <label className="ct-label">{label}</label>}
      {Icon ? (
        <div className="ct-input-icon-wrapper">
          <Icon size={16} />
          <input className={`ct-input ${error ? 'error' : ''}`} {...inputProps} />
        </div>
      ) : (
        <input className={`ct-input ${error ? 'error' : ''}`} {...inputProps} />
      )}
      {helperText && !error && <div className="ct-helper">{helperText}</div>}
      {error && <div className="ct-error-msg">{error}</div>}
    </div>
  );
}
