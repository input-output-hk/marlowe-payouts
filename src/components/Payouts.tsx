// Payouts.tsx

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MarloweSDK from '../services/MarloweSDK';

// import Card from './components/card/Card';
// import PayoutModal from './components/PayoutModal';

type PayoutsProps = {
  sdk: MarloweSDK
};

const Payouts: React.FC<PayoutsProps> = ({sdk}) => {
  // const [selectedPayout, setSelectedPayout] = useState(null);
  // const [showModal, setShowModal] = useState(false);
  const changeAddress = sdk.changeAddress || '';
  const truncatedAddress = changeAddress.slice(0,18);

  const navigate = useNavigate();

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(changeAddress);
      console.log('Address copied to clipboard');
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

  const tokens1 = [
    { id: 1, tokenName: "TokenA", currencySymbol: "TA", amount: 100 },
    { id: 2, tokenName: "TokenB", currencySymbol: "TB", amount: 200 }
  ];

  const tokens2 = [
    { id: 3, tokenName: "TokenC", currencySymbol: "TC", amount: 300 },
    { id: 4, tokenName: "TokenD", currencySymbol: "TD", amount: 400 }
  ];

  const payout1 = {
    id: 1,
    name: "Payout1",
    iconImage: "/path/to/payout1-icon.jpg",
    roleToken: "RoleToken1",
    actionLabel: "Withdraw",
    tokens: [tokens1, tokens2]
  };

  const payout2 = {
    id: 2,
    name: "Payout2",
    iconImage: "/path/to/payout2-icon.jpg",
    roleToken: "RoleToken2",
    actionLabel: "Withdraw",
    tokens: [tokens1, tokens2]
  };

  const payoutBundle = {
    id: 5,
    name: "PayoutBundle1",
    iconImage: "/path/to/payout-bundle-icon.jpg",
    roleToken: "RoleTokenBundle",
    actionLabel: "Withdraw Bundle",
    payouts: [payout1, payout2],
    tokens: []
  };

  const payouts = [payout1, payout2, payoutBundle];

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
      {/* {showModal && <PayoutModal payout={selectedPayout} onClose={() => setShowModal(false)} />} */}
    </div>
  );
};

export default Payouts;

