// App.tsx
import React, {useState} from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MarloweSDK from '../services/MarloweSDK';
import Landing from './Landing';
import Payouts from './Payouts';
import ToastMessage from './ToastMessage';


const App: React.FC = () => {
  const [sdk, setSdk] = useState( new MarloweSDK());
  const [showToast, setShowToast] = useState(false);
  const [toastTitle, setToastTitle] = useState('');
  const [toastMessage, setToastMessage] = useState(<div></div>);

  const setAndShowToast = (title:string, message:any) => {
      setToastTitle(title);
      setToastMessage(message);
      setShowToast(true);
  }


  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing sdk={sdk} setAndShowToast={setAndShowToast} />} />
        <Route path="/payouts" element={<Payouts sdk={sdk} setAndShowToast={setAndShowToast} />} />
      </Routes>
      <ToastMessage
        title={toastTitle}
        message={toastMessage}
        show={showToast}
        onClose={() => setShowToast(false)}
      />
    </Router>

  );
};

export default App;
