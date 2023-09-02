// Payouts.tsx

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PayoutsModal from './PayoutsModal';
import { Browser } from "@marlowe.io/runtime-lifecycle"
import { RuntimeLifecycle } from "@marlowe.io/runtime-lifecycle/dist/apis/runtimeLifecycle"
import { unAddressBech32,PayoutAvailable, unPayoutId, unContractId, PayoutWithdrawn } from "@marlowe.io/runtime-core"
import * as O from 'fp-ts/lib/Option.js'
import * as TE from "fp-ts/lib/TaskEither"
import * as E from "fp-ts/lib/Either"
import { pipe } from 'fp-ts/lib/function';
import './Payouts.scss';

import { formatAssets, intersperse, shortViewTxOutRef } from './Format';
import Spinner from './Spinner';

const runtimeURL = `${process.env.MARLOWE_RUNTIME_WEB_URL}`;

type PayoutsProps = {
  setAndShowToast: (title:string, message:any, isDanger:boolean) => void
};

const Payouts: React.FC<PayoutsProps> = ({setAndShowToast}) => {
  const navigate = useNavigate();
  const selectedAWalletExtension = localStorage.getItem('walletProvider');
  if (!selectedAWalletExtension) {navigate('/');}
  const [sdk, setSdk] = useState<RuntimeLifecycle>();
  const [changeAddress,setChangeAddress] = useState<string>('')
  const truncatedAddress = changeAddress.slice(0,11) + '....' + changeAddress.slice(102,108);
  const [availablePayouts,setAvailablePayouts] = useState<PayoutAvailable[]>([])
  const [withdrawnPayouts,setWithdrawnPayouts] = useState<PayoutWithdrawn[]>([])
  const [payoutIdsToBeWithdrawn, setPayoutIdsToBeWithdrawn] = useState<string[]>([]);
  const [payoutIdsWithdrawnInProgress, setPayoutIdsWithdrawnInProgress] = useState<string[]>([]);
  const payoutsToBeWithdrawn = availablePayouts.filter(payout => payoutIdsToBeWithdrawn.includes(unPayoutId(payout.payoutId)))
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);  


  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  useEffect(() => {

    const fetchData = async () => {
      if (!selectedAWalletExtension) {navigate('/');}
      else {
        const runtimeLifecycle =  await Browser.mkRuntimeLifecycle(runtimeURL)(selectedAWalletExtension)()
        setSdk(runtimeLifecycle)
        const newChangeAddress = await runtimeLifecycle.wallet.getChangeAddress()
        setChangeAddress(unAddressBech32(newChangeAddress))
        await pipe( runtimeLifecycle.payouts.available (O.none)
                  ,TE.match(  
                      (err) => console.log("Error", err),
                      a => setAvailablePayouts(a)))()
        await pipe( runtimeLifecycle.payouts.withdrawn (O.none)
        ,TE.match(  
            (err) => console.log("Error", err),
            a => setWithdrawnPayouts(a)))()
      }}
    fetchData().catch(console.error)
            
  }, [selectedAWalletExtension,navigate]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(changeAddress);
      setAndShowToast(
        'Address copied to clipboard',
        <span className='text-color-white'>Copied <span className="font-weight-bold">{changeAddress}</span> to clipboard</span>,
        false
      );
    } catch (err) {
      console.error('Failed to copy address: ', err);
    }
  };

  const disconnectWallet = () => {
    localStorage.removeItem('walletProvider');
    setChangeAddress('');
    setAndShowToast(
      'Disconnected wallet',
      <span className='text-color-white'>Please connect a wallet to see a list of available payouts.</span>,
      false
    );
    navigate('/');
  }

  const toggleBundleWithdrawal = (payoutId:string) => {
    let newState = [...payoutIdsToBeWithdrawn];
    if (newState.includes(payoutId)) {
      newState = newState.filter(id => id !== payoutId);
    } else {
      newState = [...newState, payoutId];
    }

    setPayoutIdsToBeWithdrawn(newState);

    if (newState.length > 3) {
      showTooManyPayoutsWarning();
    }
  }

  const showTooManyPayoutsWarning = () => {
      return setAndShowToast(
        'Warning: Too many payouts selected',
        <div className='text-color-white'>
          <span>This payout bundle might be too big to go on chain.</span>
          <span> Please consider breaking up your payouts into smaller bundles.</span>
        </div>,
        true
      );
  }

  const handleWithdrawals = async () => {
      if (sdk) {
        await setIsLoading(true)
        await pipe(sdk.payouts.withdraw(payoutsToBeWithdrawn.map(payout => payout.payoutId))
          , TE.chain (() => sdk.payouts.withdrawn (O.none))
          , TE.map (newWithdrawnPayouts => { return setWithdrawnPayouts(newWithdrawnPayouts)})
          , TE.chain (() => sdk.payouts.available (O.none))
          , TE.map (newWAvailablePayouts => { return setAvailablePayouts(newWAvailablePayouts)})
          , TE.match(
            (err) => {
              console.error('Failed to withdraw payouts: ', err);
              setAndShowToast(
                'Failed to withdraw payouts',
                <span className='text-color-white'>Failed to withdraw payouts. Please try again.</span>,
                true
              )},
            () => {
              setPayoutIdsWithdrawnInProgress([])
              setAndShowToast(
                'Payouts withdrawn',
                <span className='text-color-white'>Successfully withdrawn payouts.</span>,
                false
              )}))()
        await setPayoutIdsToBeWithdrawn([])
        await setPayoutIdsWithdrawnInProgress(payoutIdsToBeWithdrawn)
        await setIsLoading(false)
      } 
  }

  function allPayoutIds() {
    return availablePayouts.map(payout => unPayoutId(payout.payoutId));
  }

  function allPayoutsSelected() {
    return payoutIdsToBeWithdrawn.length === allPayoutIds().length;
  }


  function handleSelectAll() {
    if (allPayoutsSelected()) {
      setPayoutIdsToBeWithdrawn([]);
    } else {
      const payoutIds = allPayoutIds();
      setPayoutIdsToBeWithdrawn(payoutIds);
      if (payoutIds.length > 3) {
        showTooManyPayoutsWarning();
      }
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
            <button className="btn btn-light btn-sm d-none" title="Show QR Code">
              <img src="/images/qr_code_2.svg" alt="QR Code" />
            </button>
          </div>
        </div>
      </div>
      <div className='row'>
        <div className='col-6 text-left'>
            <p className="title">Available Rewards</p>
        </div>
        <div className='col-6 d-flex justify-content-end align-items-center'>
            <div className='form-check form-switch d-flex align-items-center' style={{ marginRight: '30px' }}>
                <input type="checkbox" className='form-check-input font-weight-bold' style={{ marginRight: '10px' }} checked={allPayoutsSelected()} onChange={handleSelectAll}/>
                <label className="form-check-label font-weight-bold">Select All</label>
            </div>
            <button className='btn btn-primary' disabled={!(payoutIdsToBeWithdrawn.length > 0) || isLoading} onClick={openModal}>
              {
                isLoading ?
                  'Processing...'
                : 'Withdraw'
              }
            </button>
        </div>
      </div>
      <div className="my-5">
        <table className="table">
          <thead>
            <tr>
              <th scope="col">ContractId</th>
              <th scope="col">Role Token</th>
              <th scope="col">Rewards</th>
              <th scope="col">Select to Withdraw</th>
            </tr>
          </thead>
          <tbody>
            {availablePayouts.map((payout, index) => (
              <tr key={index}>
                <td><a target="_blank" 
                           rel="noopener noreferrer" 
                           href={'https://preprod.marlowescan.com/contractView?tab=info&contractId=' + encodeURIComponent(unContractId(payout.contractId))}> 
                           {shortViewTxOutRef(unContractId(payout.contractId))} </a>
                  </td>
                <td>{payout.role.assetName}</td>
                <td>{ [...intersperse ( formatAssets(payout.assets,false),',')]}</td>
                <td>
                  {isLoading
                    ? <Spinner size={7} />
                    : <div className='form-check form-switch'>
                        <input type="checkbox" className='form-check-input mx-auto' checked={payoutIdsToBeWithdrawn.includes(unPayoutId(payout.payoutId))} onChange={() => toggleBundleWithdrawal(unPayoutId(payout.payoutId))}/>
                        </div> }
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className='row'>
        <div className='col-6 text-left'>
            <p className="title">Rewards Withdrawn</p>
        </div>
      </div>
      <div className="my-5">
        <table className="table">
          <thead>
            <tr>
              <th scope="col">ContractId</th>
              <th scope="col">Role Token</th>
              <th scope="col">Rewards</th>
            </tr>
          </thead>
          <tbody>
            {withdrawnPayouts.map((payout, index) => (
              <tr key={index}>
                <td><a target="_blank" 
                           rel="noopener noreferrer" 
                           href={'https://preprod.marlowescan.com/contractView?tab=info&contractId=' + encodeURIComponent(unContractId(payout.contractId))}> 
                           {shortViewTxOutRef(unContractId(payout.contractId))} </a>
                  </td>
                <td>{payout.role.assetName}</td>
                <td>{ [...intersperse ( formatAssets(payout.assets,false),',')]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <PayoutsModal showModal={showModal} closeModal={closeModal} payoutsToBeWithdrawn={payoutsToBeWithdrawn}  handleWithdrawals={handleWithdrawals} changeAddress={changeAddress} />
    </div>
  );
};

export default Payouts;

