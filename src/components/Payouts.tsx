// Payouts.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PayoutsModal from './PayoutsModal';

import { BrowserRuntimeLifecycleOptions, mkRuntimeLifecycle } from "@marlowe.io/runtime-lifecycle/browser"
import { RuntimeLifecycle } from '@marlowe.io/runtime-lifecycle/api';


import { unAddressBech32, PayoutAvailable, unPayoutId, unContractId, PayoutWithdrawn, AddressBech32 } from "@marlowe.io/runtime-core"
import './Payouts.scss';

import { formatAssets, intersperse, shortViewTxOutRef } from './Format';
import { SupportedWallet } from '@marlowe.io/wallet/browser';

const runtimeURL = `${process.env.MARLOWE_RUNTIME_WEB_URL}`;
const marloweScanURL = `${process.env.MARLOWE_SCAN_URL}`;
type PayoutsProps = {
  setAndShowToast: (title: string, message: any, isDanger: boolean) => void
};

const Payouts: React.FC<PayoutsProps> = ({ setAndShowToast }) => {
  const navigate = useNavigate();
  const selectedAWalletExtension = localStorage.getItem('walletProvider');
  if (!selectedAWalletExtension) { navigate('/'); }

  const [runtimeLifecycle, setRuntimeLifecycle] = useState<RuntimeLifecycle>();

  const [changeAddress, setChangeAddress] = useState<string>('')
  const [availablePayouts, setAvailablePayouts] = useState<PayoutAvailable[]>([])
  const [withdrawnPayouts, setWithdrawnPayouts] = useState<PayoutWithdrawn[]>([])
  const [payoutIdsToBeWithdrawn, setPayoutIdsToBeWithdrawn] = useState<string[]>([]);

  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [firstTabContentClassNames, setFirstTabContentClassNames] = useState('tab-pane fade show active');
  const [secondTabContentClassNames, setSecondTabContentClassNames] = useState('tab-pane fade d-none');

  const payoutsToBeWithdrawn = availablePayouts.filter(payout => payoutIdsToBeWithdrawn.includes(unPayoutId(payout.payoutId)))
  
  const toggleTabContentClassNames = () => {
    setFirstTabContentClassNames(firstTabContentClassNames === 'tab-pane fade show active' ? 'tab-pane fade d-none' : 'tab-pane fade show active');
    setSecondTabContentClassNames(secondTabContentClassNames === 'tab-pane fade d-none' ? 'tab-pane fade show active' : 'tab-pane fade d-none');
  }

  const truncateString = (str: string, start: number, end: number) => {
    const length = str.length;
    const lastLetterIndex = length - 1;
    return str.slice(0, start) + '....' + str.slice(end, lastLetterIndex)
  }
  const truncatedAddress = truncateString(changeAddress, 11, 102)

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const closeModalAndClearPayouts = () => {
    setShowModal(false);
    setPayoutIdsToBeWithdrawn([]);
    setIsLoading(false);
  };
  
  useEffect(() => {
    const fetchData = async () => {
      const runtimeLifecycleParameters : BrowserRuntimeLifecycleOptions = { runtimeURL:runtimeURL, walletName:selectedAWalletExtension as SupportedWallet}
      const runtimeLifecycle = await mkRuntimeLifecycle(runtimeLifecycleParameters).then((a) => {setRuntimeLifecycle(a);return a})
      await runtimeLifecycle.wallet.getChangeAddress().then((changeAddress : AddressBech32) => setChangeAddress(unAddressBech32(changeAddress) ))
      await runtimeLifecycle.payouts.available().then(setAvailablePayouts)
      await runtimeLifecycle.payouts.withdrawn().then(setWithdrawnPayouts)
    }

    fetchData()
      .catch(err => 
        { console.log("Error", err);
          const error = JSON.parse(err);
          const { message } = error;
          setAndShowToast(
            'Failed Retrieving Payouts Infornation',
            <span className='text-color-white'>{message}</span>,
            true)
        })

    const intervalId = setInterval(() => {
      fetchData().catch(err => console.error(err));
    }, 10_000); // 10 seconds
    // Clear the interval when the component is unmounted
    return () => clearInterval(intervalId);
  }, [selectedAWalletExtension, navigate, setAndShowToast]);


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
      setAndShowToast(
        'Failed to copy address',
        <span className='text-color-white'>Failed to copy change address to clipboard.</span>,
        true
      );
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

  const toggleBundleWithdrawal = (payoutId: string) => {
    setIsLoading(true);
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

    openModal();
  }

  const showTooManyPayoutsWarning = () => {
    return setAndShowToast(
      'Warning: Too many payouts selected',
      <div className='text-color-white'>
        <span>This payout bundle might be too big to go on chain.</span>
        <span> Please consider breaking up your payouts into smaller bundles.</span>
      </div>,
      true
    )
  }

  const handleWithdrawals = async () => {
    if (runtimeLifecycle) {
    try {
        setIsLoading(true)
        setAndShowToast(
          'Please sign your transaction',
          <div>
            <p className='text-color-white'>When your wallet opens, please sign the transaction to submit the payout for processing. This may take a few minutes to process and confirm on the chain.</p>
          </div>,
          false
        )
        
        await runtimeLifecycle.payouts.withdraw(payoutsToBeWithdrawn.map(payout => payout.payoutId))
  
        closeModalAndClearPayouts()
        setAndShowToast(
          'Payouts withdrawn',
          <span className='text-color-white'>Successfully withdrawn payouts.</span>,
          false
        ) 
    } catch (err : any)  
      { console.log("Error", err);
        const error = JSON.parse(err);
        const { message } = error;
        closeModalAndClearPayouts()
        setAndShowToast(
          'Payouts withdrawal failed',
          <div>
            <p className='text-color-white'>Message from Server: </p>
            <p className='text-color-white'>{message}</p>
          </div>
          ,
          true
        )}}}

  const payoutSelectedToBeWithdrawn = (payoutId: string) => {
    return payoutIdsToBeWithdrawn.includes(payoutId);
  }

  return (
    <div className="container">
      <div className="header">
        <img src="/images/marlowe-logo-primary.svg" alt="Logo" width="120px" className="mb-4" />
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
      <ul className='nav nav-tabs'>
        <li className='nav-item'>
          <a className='nav-link active' href='#available-rewards' data-bs-toggle="tab" onClick={toggleTabContentClassNames}>
            <p className="title font-size-1rem">Available Rewards</p>
          </a>
        </li>
        <li className='nav-item'>
          <a className='nav-link' href='#rewards-withdrawn' data-bs-toggle="tab" onClick={toggleTabContentClassNames}>
            <p className="title font-size-1rem">Rewards Withdrawn</p>
          </a>
        </li>
      </ul>

      <div className='tab-conent'>
        {/* First Tab Content */}
        <div className={firstTabContentClassNames} id='available-rewards' role='tabpanel' aria-labelledby='available-rewards-tab'>
          <div className='container'>
            <div className='row'>
              <div className='col-12'>
                <div className="my-5">
                  <table className="table">
                    <thead>
                      <tr>
                        <th className="pt-3" scope="col"><img src="images/fingerprint.svg" alt="Name Logo" className="header-logo" /></th>
                        <th className="pt-3" scope="col"><img src="images/cycle.svg" alt="Next Vest Date Logo" className="header-logo" /></th>
                        <th className="pt-3" scope="col"><img src="images/nature.svg" alt="Vested Logo" className="header-logo" /></th>
                        <th className="pt-3" scope="col"><img src="images/check_circle.svg" alt="Actions Logo" className="header-logo" /></th>
                      </tr>
                      <tr>
                        <th className="pb-3" scope="col">ContractId</th>
                        <th className="pb-3" scope="col">Role Token</th>
                        <th className="pb-3" scope="col">Rewards</th>
                        <th className="pb-3" scope="col">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {availablePayouts.map((payout, index) => (
                        <tr key={index}>
                          <td className='py-3'>
                            <a target="_blank"
                              rel="noopener noreferrer"
                              href={`${marloweScanURL}/contractView?tab=info&contractId=` + encodeURIComponent(unContractId(payout.contractId))}>
                              {truncateString(unContractId(payout.contractId), 5, 60)}
                            </a>
                          </td>
                          <td className='py-3'>{payout.role.assetName}</td>
                          <td className='py-3'>{[...intersperse(formatAssets(payout.assets, false), ',')]}</td>
                          <td className='py-3'>
                            {isLoading && payoutSelectedToBeWithdrawn(unPayoutId(payout.payoutId))
                              ? <button disabled className='btn btn-primary'>
                                  <span className="pl-2 spinner-border spinner-border-sm text-white " role="status">
                                    <span className="visually-hidden">Loading...</span>
                                  </span>
                                  <span> Processing...</span>
                                </button>
                              : <button disabled={isLoading} className='btn btn-primary' onClick={() => toggleBundleWithdrawal(unPayoutId(payout.payoutId))}>
                                { isLoading ?
                                  <span>
                                    <span className="pl-2 spinner-border spinner-border-sm text-white " role="status">
                                      <span className="visually-hidden">Loading...</span>
                                    </span>
                                    <span> Please wait...</span>
                                  </span>
                                  : 'Withdraw'}
                              </button>
                            }
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Second Tab Content */}
        <div className={secondTabContentClassNames} id='rewards-withdrawn' role='tabpanel' aria-labelledby='rewards-withdrawn-tab'>
          <div className='container'>
            <div className='row'>
              <div className='col-12'>

                <div className="my-5">
                  <table className="table">
                    <thead>
                      <tr>
                        <th className="pt-3" scope="col"><img src="images/fingerprint.svg" alt="Name Logo" className="header-logo" /></th>
                        <th className="pt-3" scope="col"><img src="images/cycle.svg" alt="Next Vest Date Logo" className="header-logo" /></th>
                        <th className="pt-3" scope="col"><img src="images/nature.svg" alt="Vested Logo" className="header-logo" /></th>
                      </tr>
                      <tr>
                        <th className="pb-3" scope="col">ContractId</th>
                        <th className="pb-3" scope="col">Role Token</th>
                        <th className="pb-3" scope="col">Rewards</th>
                      </tr>
                    </thead>
                    <tbody>
                      {withdrawnPayouts.map((payout, index) => (
                        <tr key={index}>
                          <td className='py-3'><a target="_blank"
                            rel="noopener noreferrer"
                            href={`${marloweScanURL}/contractView?tab=info&contractId=` + encodeURIComponent(unContractId(payout.contractId))}>
                            {shortViewTxOutRef(unContractId(payout.contractId))} </a>
                          </td>
                          <td className='py-3'>{payout.role.assetName}</td>
                          <td className='py-3'>{[...intersperse(formatAssets(payout.assets, false), ',')]}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <PayoutsModal showModal={showModal} onCancel={closeModalAndClearPayouts} closeModal={closeModal} payoutsToBeWithdrawn={payoutsToBeWithdrawn} handleWithdrawals={handleWithdrawals} changeAddress={changeAddress} />
    </div>
  );
};

export default Payouts;