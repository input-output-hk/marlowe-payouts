// App.tsx
import React, {useState} from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MarloweSDK from '../services/MarloweSDK';
import Landing from './Landing';
import Payouts from './Payouts';


const App: React.FC = () => {
  const [sdk, setSdk] = useState( new MarloweSDK());
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing sdk={sdk} />} />
        <Route path="/payouts" element={<Payouts />} />
      </Routes>
    </Router>
  );
};

export default App;
