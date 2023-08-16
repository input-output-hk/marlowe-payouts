import React from 'react';

type ToastProps = {
  title: string;
  message: any;
  show: boolean;
  onClose: () => void;
};

const ToastMessage: React.FC<ToastProps> = ({ title, message, show, onClose }) => {
  return (
    <div className="toast-container position-fixed bottom-0 end-0 p-3">
      <div className={`toast ${show ? 'show' : ''}`} role="alert" aria-live="assertive" aria-atomic="true">
        <div className="toast-header">
          <strong className="me-auto">{title}</strong>
          <button type="button" className="ml-2 mb-1 btn-close" data-bs-dismiss="toast" aria-label="Close" onClick={onClose}>
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div className="toast-body">
          {message}
        </div>
      </div>
    </div>
  );
};

export default ToastMessage;
