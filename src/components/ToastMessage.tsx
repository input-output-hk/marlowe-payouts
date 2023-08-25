import React, { useEffect } from 'react';

type ToastProps = {
  id: number;
  title: string;
  message: any;
  show: boolean;
  onClose: (id: number) => void;
};

const ToastMessage: React.FC<ToastProps> = ({ id, title, message, show, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(id);
    }, 10000);

    return () => {
      clearTimeout(timer);
    };
  }, [id, onClose]);
  return (
    <div className={`toast ${show ? 'show' : ''}`} role="alert" aria-live="assertive" aria-atomic="true">
      <div className="toast-header">
        <img src="images/marlowe-logo-only.svg" className="mr-2" alt="marlow-logo" style={{width: '20px', marginRight: '10px'}}/>
        <strong className="me-auto">{title}</strong>
      </div>
      <div className="toast-body">
        {message}
      </div>
    </div>
  );
};

export default ToastMessage;