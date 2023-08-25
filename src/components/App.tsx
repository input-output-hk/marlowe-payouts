// App.tsx
import React, {useState} from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MarloweSDK from '../services/MarloweSDK';
import Landing from './Landing';
import Payouts from './Payouts';
import ToastMessage from './ToastMessage';


const App: React.FC = () => {
  const [sdk, setSdk] = useState(new MarloweSDK());
  const [toasts, setToasts] = useState<any[]>([]);

  const setAndShowToast = (title: string, message: React.ReactNode) => {
    const newToast = { id: new Date().getTime(), title, message };
    setToasts(prevToasts => [...prevToasts, newToast]);
  }

  const removeToast = (id: number) => {
    setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id));
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing sdk={sdk} setAndShowToast={setAndShowToast} />} />
        <Route path="/payouts" element={<Payouts sdk={sdk} setAndShowToast={setAndShowToast} />} />
      </Routes>
    <div className="toast-container position-fixed bottom-0 end-0 p-3">
      {toasts.map(toast => (
        <ToastMessage
          key={toast.id}
          id={toast.id}
          title={toast.title}
          message={toast.message}
          show={true}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
    </Router>

  );
};

export default App;
