// Payouts.tsx

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MarloweSDK from '../services/MarloweSDK';
import PayoutsModal from './PayoutsModal';
import Token from '../models/Token';

type PayoutsProps = {
  sdk: MarloweSDK,
  setAndShowToast: (title:string, message:any) => void
};

const Payouts: React.FC<PayoutsProps> = ({sdk, setAndShowToast}) => {
  const changeAddress = sdk.changeAddress || '';
  const truncatedAddress = changeAddress.slice(0,18);
  const sdkPayouts = sdk.getPayouts();
  const navigate = useNavigate();
  const [payoutsToBePaidIds, setPayoutsToBePaidIds] = useState<string[]>([]);
  const [payouts, setPayouts] = useState<any[]>(sdkPayouts);
  const [showModal, setShowModal] = useState(false);

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

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

  const toggleBundleWithdrawal = (payoutId:string) => {
    let newState = [...payoutsToBePaidIds];
    if (newState.includes(payoutId)) {
      newState = newState.filter(id => id !== payoutId);
    } else {
      newState = [...newState, payoutId];
    }

    setPayoutsToBePaidIds(newState);
  }

  const handleWithdrawals = async () => {
    try {
      console.log("INSIDE HANDLE WITHDRAWALS")
      const payoutsToBeWithdrawn = payouts.filter(payout => payoutsToBePaidIds.includes(payout.payoutId))
      console.log("PAYOUTS TO BE WITHDRAWN", payoutsToBeWithdrawn)
      await sdk.withdrawPayouts(payoutsToBeWithdrawn,
      () => {
        const newState = sdk.getPayouts().filter(payout => !payoutsToBePaidIds.includes(payout.payoutId));
        setPayouts(newState);
        setPayoutsToBePaidIds([]);
        setAndShowToast(
          'Payouts withdrawn',
          <span>Successfully withdrew payouts.</span>
        );
      });
    } catch (err) {
      console.error('Failed to withdraw payouts: ', err);
      setAndShowToast(
        'Failed to withdraw payouts',
        <span>Failed to withdraw payouts. Please try again.</span>
      );
    }
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
      <div className='row'>
        <div className='col-6 text-left'>
          <p className="title">Select rewards to withdraw</p>
        </div>
        <div className='col-6 text-right'>
          <button className='btn btn-primary' disabled={!(payoutsToBePaidIds.length > 0)} onClick={openModal}>
            Withdraw
          </button>
        </div>
      </div>
      <div className="my-5">
        <table className="table">
          <thead>
            <tr>
              <th scope="col">ID</th>
              <th scope="col">ContractId</th>
              <th scope="col">Role Token</th>
              <th scope="col">Tokens</th>
              <th scope="col">Select For Payout</th>
            </tr>
          </thead>
          <tbody>
            {payouts.map((payout, index) => (
              <tr key={index}>
                <td>{payout.payoutId}</td>
                <td>{payout.contractId}</td>
                <td>{payout.role.tokeName}</td>
                <td>{payout.tokens.map((tk : Token) => tk.tokenName).join(", ")}</td>
                <td>
                  <div className='form-check'>
                  <input type="checkbox" className='form-check-input' checked={payoutsToBePaidIds.includes(payout.payoutId)} onChange={() => toggleBundleWithdrawal(payout.payoutId)}/>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <PayoutsModal showModal={showModal} closeModal={closeModal} payoutsToBePaidIds={payoutsToBePaidIds} payouts={payouts} handleWithdrawals={handleWithdrawals} destinationAddress={sdk.getDestinationAddress()} />
    </div>
  );
};

export default Payouts;

