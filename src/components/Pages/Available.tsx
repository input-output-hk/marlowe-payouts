import { AddressBech32, PayoutAvailable, PayoutId, addressBech32, unAddressBech32 } from '@marlowe.io/runtime-core';
import { BrowserRuntimeLifecycleOptions, mkRuntimeLifecycle } from '@marlowe.io/runtime-lifecycle/browser';
import { SupportedWalletName } from '@marlowe.io/wallet/browser';
import React, { useEffect, useState } from 'react';
import { contractIdLink, cssOverrideSpinnerCentered, formatAssets, intersperse, payoutTxLink, roleTokenLink } from '../Adapters/Format';
import { HashLoader } from 'react-spinners';
import { GeneratePayoutRequest, mkContract } from '../Contract/GeneratePayout';
import { NewPayoutModal } from './NewPayout';
import { RuntimeLifecycle } from '@marlowe.io/runtime-lifecycle/api';
import { mkEnvironment } from '@marlowe.io/language-core-v1';
import { Deposit } from "@marlowe.io/language-core-v1/next";
import { MarloweJSON, MarloweJSONCodec } from '@marlowe.io/adapter/codec';

type AvailableProps = {
  runtimeURL : string,
  marloweScanURL : string,
  cardanoScanURL : string,
  onWaitingConfirmation : () => void,
  onConfirmation : () => void,
  setAndShowToast: (title:string, message:any, isDanger: boolean) => void
};

export const Available: React.FC<AvailableProps> = ({runtimeURL,marloweScanURL,cardanoScanURL,setAndShowToast,onWaitingConfirmation,onConfirmation}) => {
  const selectedAWalletExtension = localStorage.getItem('walletProvider');
  
  const [runtimeLifecycle, setRuntimeLifecycle] = useState<RuntimeLifecycle>();
  const [changeAddress, setChangeAddress] = useState<string>('')
  const [availablePayouts, setAvailablePayouts] = useState<PayoutAvailable[]>([])
  
  const [isFetchingFirstTime, setIsFetchingFirstTime] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [isWaitingConfirmation, setWaitingConfirmation] = useState(false);

  const [showNewPayoutModal, setShowNewPayoutModal] = useState(false);


  useEffect(() => {
    const fetchData = async () => {
      if(isFetching) return;
      try {
        setIsFetching(true)
        const runtimeLifecycleParameters : BrowserRuntimeLifecycleOptions = { runtimeURL:runtimeURL, walletName:selectedAWalletExtension as SupportedWalletName}
        const runtimeLifecycle = await mkRuntimeLifecycle(runtimeLifecycleParameters).then((a) => {setRuntimeLifecycle(a);return a})
        await runtimeLifecycle.wallet.getChangeAddress().then((changeAddress : AddressBech32) => {setChangeAddress(unAddressBech32(changeAddress))})
        
        await runtimeLifecycle.payouts
          .available()
          .then(setAvailablePayouts);

        setIsFetchingFirstTime(false)
        setIsFetching(false)
                  
      } catch (err) {
        console.log("Error", err);
        setIsFetchingFirstTime(false)
        setIsFetching(false)
        }
    }

    fetchData()
    const intervalId = setInterval(() => {fetchData()}, 10_000); 
    // Clear the interval when the component is unmounted
    return () => clearInterval(intervalId);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedAWalletExtension,availablePayouts]);

  function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async function handleCreateGeneratePayoutContract 
    ( request : GeneratePayoutRequest
    , afterTxSubmitted : () => void) {
    try {
      if(runtimeLifecycle) {
        const generatePayoutContract = mkContract(request);
        setWaitingConfirmation(true)
        const [contractId, txIdCreated] = await runtimeLifecycle.contracts.createContract({
              contract: generatePayoutContract,
              roles : {[request.claimer.role_token] : addressBech32(changeAddress)},
              tags: { "simulated.payout": { role: request.claimer.role_token} },
            });
        setAndShowToast(
          "Simple Contract Submitted",
          "Once the transaction is confirmed, You'll be asked to add a Deposit and sign another transaction...",
          false)
        await runtimeLifecycle.wallet.waitConfirmation(txIdCreated);
        console.log("Tx Confirmed")
        let next = await runtimeLifecycle.contracts.getApplicableInputs(contractId, mkEnvironment(new Date())(new Date((new Date()).getTime() + 10 * 1000)));
        console.log(`Next retrieved ${MarloweJSON.stringify(next)}`)
        await sleep(5_000)
        const txFirstTokensDeposited = await runtimeLifecycle.contracts.applyInputs
          (contractId
          , {inputs: [
              {
                input_from_party : {address : changeAddress}
              , that_deposits : request.tokenValue.amount
              , of_token : request.tokenValue.token
              , into_account: request.claimer
              }
          ]});
        setAndShowToast(
          "Payout Creation Submitted",
          "Once the transaction is confirmed, You'll see your Payout availaible in the list ...",
          false)
        await runtimeLifecycle.wallet.waitConfirmation(txFirstTokensDeposited);
        afterTxSubmitted()
        setShowNewPayoutModal(false);
        setAndShowToast(
          "Payout Confirmed",
          "You are about to see your Payout availaible...",
          false)
        // console.log(`Contract submitted on Cardano with Id : ${contractId}`);
        // console.log(`Waiting Confirmation : ${txIdCreated}`);
        setWaitingConfirmation(false)
        console.log(`Contract Creation Confirmed on Cardano.`);
      }
    } catch (e) {
      console.log(MarloweJSON.stringify(e))
      setWaitingConfirmation(false)
      setAndShowToast(
        "Creation Aborted",
        "...",
        false
      );
    }
    
    
  }

  async function handleWithdraw(payoutId : PayoutId) {
    if(runtimeLifecycle !== undefined){
    try {
      setWaitingConfirmation(true)
      onWaitingConfirmation()
      const txId = await runtimeLifecycle.payouts.withdraw([payoutId]);
      setAndShowToast(
        `Payout Withdrawal Transaction Submitted`,
        "The Withdrawal History will be updated once the transaction is confirmed...",
        false
      );
      console.log(`Withdraw submitted on Cardano with tx Id : ${txId}`);
      console.log(`Waiting Confirmation : ${txId}`);
      // await runtimeLifecycle?.wallet.waitConfirmation(txId);
      setAndShowToast(
        `Tokens have been Withdrawn Successfully`,
        "The Withdrawal History is about to be updated...",
        false
      );
      setWaitingConfirmation(false)
      onConfirmation()
      console.log(`Withdraw Confirmed on Cardano.`);
    } catch (e) {
      setWaitingConfirmation(false)
      onConfirmation()
      setAndShowToast(
        `Withdraw on Payout has Failed`,
        "Please Retry...",
        true
      );
    }}
  }

  return (
      <div>
        { isFetchingFirstTime ? 
           <div className='d-flex justify-content-start' style={{width:"150px"}}>
           <HashLoader color="#4B1FED"
             cssOverride={cssOverrideSpinnerCentered}
             loading={isFetchingFirstTime}
             size={15}
             id="loading-plans"/> 
              <div>Loading Payouts</div>
            </div> 
        : <><div className='d-flex justify-content-start' style={{width:"200px"}}>
            <button
              className='btn btn-outline-primary' onClick={() => setShowNewPayoutModal(true)}
              disabled = {isWaitingConfirmation} >
            Simulate a Payout                        
            </button>
            <HashLoader color="#4B1FED"
            cssOverride={cssOverrideSpinnerCentered}
            loading={isWaitingConfirmation }
            size={15}
            id="cancel-id"
          />
        </div>
        <div className="my-5">
           <table className="table">
                    <thead>
                      <tr>
                        <th>Contract</th>
                        <th>Payout Transaction</th>
                        <th>Role Token</th>
                        <th>Tokens to withdraw</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {availablePayouts.map((payout, index) => (
                        <tr key={index}>
                          <td>{contractIdLink(marloweScanURL,payout.contractId)}</td>
                          <td>{payoutTxLink(cardanoScanURL,payout.payoutId)}</td>
                          <td>{roleTokenLink(cardanoScanURL,payout.role)}</td>
                          <td>{[...intersperse(formatAssets(payout.assets, false), ',')]}</td>
                          <td>
                            { <div className='d-flex justify-content-start'>
                                  <button
                                      className='btn btn-outline-primary' 
                                      onClick={() => handleWithdraw(payout.payoutId)}
                                      disabled = {isWaitingConfirmation} >
                                  Withdraw                        
                                  </button>
                                  <HashLoader color="#4B1FED"
                                  cssOverride={cssOverrideSpinnerCentered}
                                  loading={isWaitingConfirmation}
                                  size={15}
                                  id="cancel-id"
                                />
                              </div>
                            }
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
              
      </div> </>}
      <NewPayoutModal 
        showModal={showNewPayoutModal} 
        handleCreateGeneratePayoutContract={handleCreateGeneratePayoutContract} 
        closeModal={() => setShowNewPayoutModal(false) } 
        changeAddress={changeAddress} /> 
      </div>
  );
};
