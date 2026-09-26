import React from 'react';

export function Textarea({ label, helperText, error, maxLength, className = '', value, ...textareaProps }) {
  const charCount = value ? value.length : 0;
  return (
    <div className={`ct-field ${className}`}>
      {label && <label className="ct-label">{label}</label>}
      <textarea className={`ct-textarea ${error ? 'error' : ''}`} maxLength={maxLength} value={value} {...textareaProps} />
      {maxLength && <div className="ct-char-count">{charCount}/{maxLength}</div>}
      {helperText && !error && <div className="ct-helper">{helperText}</div>}
      {error && <div className="ct-error-msg">{error}</div>}
    </div>
  );
}
