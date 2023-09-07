// App.tsx
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Landing from './Landing';
import Payouts from './Payouts';
import ToastMessage from './ToastMessage';
import { Navigate } from 'react-router-dom';

const App: React.FC = () => {
  const hasSelectedAWalletExtension = localStorage.getItem('walletProvider');
  const [toasts, setToasts] = useState<any[]>([]);

  const setAndShowToast = (title: string, message: React.ReactNode, isDanger: boolean) => {
    const newToast = { id: new Date().getTime(), title, message, isDanger };
    setToasts(prevToasts => [...prevToasts, newToast]);
  }

  const removeToast = (id: number) => {
    setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id));
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={hasSelectedAWalletExtension ? <Navigate to="/payouts" /> : <Landing setAndShowToast={setAndShowToast} />} />
        <Route path="/payouts" element={hasSelectedAWalletExtension ? <Payouts setAndShowToast={setAndShowToast} /> : <Navigate to="/" />} />
      </Routes>
      <div className="toast-container position-fixed bottom-0 end-0 p-3">
        {toasts.map(toast => (
          <ToastMessage
            key={toast.id}
            id={toast.id}
            title={toast.title}
            message={toast.message}
            isDanger={toast.isDanger}
            show={true}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>
    </Router>

  );
};

export default App;
