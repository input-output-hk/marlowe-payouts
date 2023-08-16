// Payouts.tsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MarloweSDK from '../services/MarloweSDK';
import ToastMessage from './ToastMessage';

// import Card from './components/card/Card';
// import PayoutModal from './components/PayoutModal';

type PayoutsProps = {
  sdk: MarloweSDK
};

const Payouts: React.FC<PayoutsProps> = ({sdk}) => {
  const [showToast, setShowToast] = useState(false);
  const [toastTitle, setToastTitle] = useState('');
  const [toastMessage, setToastMessage] = useState(<div></div>);
  // const [selectedPayout, setSelectedPayout] = useState(null);
  // const [showModal, setShowModal] = useState(false);
  const changeAddress = sdk.changeAddress || '';
  const truncatedAddress = changeAddress.slice(0,18);

  const navigate = useNavigate();

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(changeAddress);
      setToastTitle('Address copied to clipboard');
      setToastMessage(<span>Copied <span className="font-weight-bold">{changeAddress}</span> to clipboard</span>);
      setShowToast(true);
    } catch (err) {
      console.error('Failed to copy address: ', err);
    }
  };

  // const showPayoutDetails = (payout) => {
  //   setSelectedPayout(payout);
  //   setShowModal(true);
  // };

  const disconnectWallet = () => {
    sdk.disconnectWallet();
    localStorage.setItem('walletProvider', '');
    navigate('/');
  }


  return (
    <div className="container">
      <div className="header">
        <img src="/images/marlowe-logo-primary.svg" alt="Logo" className="mb-4" />
        <div className="connected-wallet-details">
          <div className="dropdown">
            <button className="btn btn-light btn-sm dropdown-toggle mr-2" title="menu" data-bs-toggle="dropdown" aria-expanded="false">
              <span className="truncated">{truncatedAddress}</span>
            </button>
            <ul className="dropdown-menu">
              <li>
                <button className="dropdown-item" type="button" onClick={() => disconnectWallet()}>
                  Disconnect wallet
                  <img src="/images/electrical_services.svg" alt="icon" style={{ marginLeft: '8px' }} />
                </button>
              </li>
            </ul>
            <button className="btn btn-light btn-sm mr-2" title="Copy Address" onClick={copyToClipboard}>
              <img src="/images/content_copy.svg" alt="content-copy" />
            </button>
            <button className="btn btn-light btn-sm" title="Show QR Code">
              <img src="/images/qr_code_2.svg" alt="QR Code" />
            </button>
          </div>
        </div>
      </div>
      <p className="title">Select rewards to withdraw</p>
      <div className="grid my-5">
      </div>
      <ToastMessage
        title={toastTitle}
        message={toastMessage}
        show={showToast}
        onClose={() => setShowToast(false)}
      />

      {/* {showModal && <PayoutModal payout={selectedPayout} onClose={() => setShowModal(false)} />} */}
    </div>
  );
};

export default Payouts;

