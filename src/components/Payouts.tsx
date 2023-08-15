// Payouts.tsx
import React, {useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import MarloweSDK from '../services/MarloweSDK';


type PayoutsProps = {
  sdk: MarloweSDK
};

const Payouts: React.FC<PayoutsProps> = ({sdk}) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!sdk.getConnectedWallet()) {
      navigate('/');
    }
  });


  return <h1>Payouts Page</h1>;
}

export default Payouts;
