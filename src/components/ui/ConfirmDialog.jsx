import React from 'react';
import { Modal } from './Modal';

export function ConfirmDialog({ isOpen, onConfirm, onCancel, title, message, confirmText = 'Confirm', cancelText = 'Cancel', variant = 'default' }) {
  return (
    <Modal isOpen={isOpen} onClose={onCancel} title={title} size="sm">
      <p style={{ color: 'var(--ct-text-secondary)', marginBottom: 'var(--ct-space-6)' }}>{message}</p>
      <div className="ct-modal-footer" style={{ border: 'none', padding: 0 }}>
        <button className="ct-btn ct-btn-ghost" onClick={onCancel}>{cancelText}</button>
        <button className={`ct-btn ${variant === 'danger' ? 'ct-btn-danger' : 'ct-btn-primary'}`} onClick={onConfirm}>{confirmText}</button>
      </div>
    </Modal>
  );
}
