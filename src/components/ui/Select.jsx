import React from 'react';

export function Select({ label, options = [], helperText, error, className = '', ...selectProps }) {
  return (
    <div className={`ct-field ${className}`}>
      {label && <label className="ct-label">{label}</label>}
      <select className={`ct-select ${error ? 'error' : ''}`} {...selectProps}>
        {options.map((opt) => {
          const value = typeof opt === 'string' ? opt : opt.value;
          const optLabel = typeof opt === 'string' ? opt : opt.label;
          return <option key={value} value={value}>{optLabel}</option>;
        })}
      </select>
      {helperText && !error && <div className="ct-helper">{helperText}</div>}
      {error && <div className="ct-error-msg">{error}</div>}
    </div>
  );
}
