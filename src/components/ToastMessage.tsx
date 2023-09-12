import React from 'react';

type ToastProps = {
  id: number;
  title: string;
  message: any;
  show: boolean;
  isDanger: boolean; // New prop to determine if the toast should have danger styling
  onClose: (id: number) => void;
};

const ToastMessage: React.FC<ToastProps> = ({ id, title, message, show, onClose, isDanger = false }) => {
  const dangerClass = isDanger ? 'bg-danger' : 'bg-primary'; // If isDanger is true, set the class to 'toast-danger'
  return (
    <div className={`toast ${show ? 'show' : ''} ${dangerClass}`} role="alert" aria-live="assertive" aria-atomic="true" onClick={() => onClose(id)}>
      <div className="toast-header">
        <img src="images/marlowe-logo-only.svg" className="mr-2" alt="marlow-logo" style={{ width: '20px', marginRight: '10px' }} />
        <strong className="me-auto">{title}</strong>
        <button type="button" className="ml-2 mb-1 btn-close" aria-label="Close" onClick={() => onClose(id)} />
      </div>
      <div className="toast-body">
        {message}
      </div>
    </div>
  );
};

export default ToastMessage;
