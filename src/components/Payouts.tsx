// Payouts.tsx

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MarloweSDK from '../services/MarloweSDK';

type PayoutsProps = {
  sdk: MarloweSDK,
  setAndShowToast: (title:string, message:any) => void
};

const Payouts: React.FC<PayoutsProps> = ({sdk, setAndShowToast}) => {
  const changeAddress = sdk.changeAddress || '';
  const truncatedAddress = changeAddress.slice(0,18);
  const payouts = sdk.getPayouts();

  const navigate = useNavigate();

  useEffect(() => {
    const walletProvider = localStorage.getItem('walletProvider');
    if (walletProvider && !changeAddress) {
      navigate('/');
    }
  }, [changeAddress, navigate]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(changeAddress);
      setAndShowToast(
        'Address copied to clipboard',
        <span>Copied <span className="font-weight-bold">{changeAddress}</span> to clipboard</span>
      );
    } catch (err) {
      console.error('Failed to copy address: ', err);
    }
  };

  const disconnectWallet = () => {
    sdk.disconnectWallet();
    localStorage.setItem('walletProvider', '');
    setAndShowToast(
      'Disconnected wallet',
      <span>Please connect a wallet to see a list of available payouts.</span>
    );
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
      <div className="my-5">
        <table className="table">
          <thead>
            <tr>
              <th scope="col">ID</th>
              <th scope="col">Name</th>
              <th scope="col">Amount</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody>
            {payouts.map((payout, index) => (
              <tr key={index}>
                <td>{payout.id}</td>
                <td>{payout.name}</td>
                <td>{payout.amount}</td>
                <td>
                  <button className="btn btn-primary btn-sm" onClick={async () => await sdk.withdraw(payout.id)}>
                    Withdraw
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Payouts;

