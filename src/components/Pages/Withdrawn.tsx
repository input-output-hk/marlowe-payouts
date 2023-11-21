
import { PayoutAvailable, PayoutWithdrawn } from '@marlowe.io/runtime-core';
import { BrowserRuntimeLifecycleOptions, mkRuntimeLifecycle } from '@marlowe.io/runtime-lifecycle/browser';
import { SupportedWalletName } from '@marlowe.io/wallet/browser';
import React, { useEffect, useState } from 'react';
import { contractIdLink, cssOverrideSpinnerCentered, formatAssets, intersperse, payoutTxLink, roleTokenLink } from '../Adapters/Format';
import { HashLoader } from 'react-spinners';



type WithdrawnProps = {
  runtimeURL : string,
  marloweScanURL : string,
  cardanoScanURL : string,
  setAndShowToast: (title:string, message:any, isDanger: boolean) => void
};

export const Withdrawn: React.FC<WithdrawnProps> = ({runtimeURL,marloweScanURL,cardanoScanURL,setAndShowToast}) => {
  const selectedAWalletExtension = localStorage.getItem('walletProvider');
  

  const [withdrawnPayouts, setWithdrawnPayouts] = useState<PayoutWithdrawn[]>([])
  
  const [isFetchingFirstTime, setIsFetchingFirstTime] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [isWaitingConfirmation, setWaitingConfirmation] = useState(false);


  useEffect(() => {
    const fetchData = async () => {
      if(isFetching) return;
      try {
        setIsFetching(true)
        const runtimeLifecycleParameters : BrowserRuntimeLifecycleOptions = { runtimeURL:runtimeURL, walletName:selectedAWalletExtension as SupportedWalletName}
        const runtimeLifecycle = await mkRuntimeLifecycle(runtimeLifecycleParameters)
      
        await runtimeLifecycle.payouts
          .withdrawn()
          .then(setWithdrawnPayouts);

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
  }, [selectedAWalletExtension]);


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
        : <>
        <div className="my-5">
           <table className="table">
                    <thead>
                      <tr>
                        <th>Contract</th>
                        <th>Payout Transaction</th>
                        <th>Role Token</th>
                        <th>Withdrawn Tokens</th>
                      </tr>
                    </thead>
                    <tbody>
                      {withdrawnPayouts.map((payout, index) => (
                        <tr key={index}>
                          <td>{contractIdLink(marloweScanURL,payout.contractId)}</td>
                          <td>{payoutTxLink(cardanoScanURL,payout.payoutId)}</td>
                          <td>{roleTokenLink(cardanoScanURL,payout.role)}</td>
                          <td>{[...intersperse(formatAssets(payout.assets, false), ',')]}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
              
      </div> </>}
      </div>
  );
};
