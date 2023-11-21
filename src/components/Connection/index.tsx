import { AddressBech32, unAddressBech32 } from '@marlowe.io/runtime-core';
import { RuntimeLifecycle } from '@marlowe.io/runtime-lifecycle/api';
import { BrowserRuntimeLifecycleOptions, mkRuntimeLifecycle } from '@marlowe.io/runtime-lifecycle/browser';
import { SupportedWalletName, getInstalledWalletExtensions } from '@marlowe.io/wallet/browser';
import React, { useEffect, useState } from 'react';
import { Image } from 'semantic-ui-react'
import { SelectWalletExtensionModal } from './SelectWalletExtension';

type ConnectionWalletProps = {
  runtimeURL : string,
  onConnect: () => void
  onDisconnect: () => void
  setAndShowToast: (title:string, message:any, isDanger: boolean) => void
};

type ConnectedProps = {
    runtimeURL : string,
    onDisconnect: () => void
    selectedWalletExtensionName : string
    setAndShowToast: (title:string, message:any, isDanger: boolean) => void
  };

export const ConnectionWallet: React.FC<ConnectionWalletProps> = ({runtimeURL,setAndShowToast,onConnect,onDisconnect}) => {
  
  const [showSelectWalletExtensionModal, setShowSelectWalletExtensionModal] = useState(false);
  const selectedWalletExtensionName = localStorage.getItem('walletProvider');
  if (!selectedWalletExtensionName) { 
    return (<><div className="dropdown" style={{width: "210px"}}>
      <button className="btn btn-light btn-sm dropdown-toggle mr-2" onClick={() => setShowSelectWalletExtensionModal(true)}>
        <span style={{fontSize: "medium"}}>
          Connect Cardano Wallet
          </span>  
      </button>
    </div>
      <SelectWalletExtensionModal 
            showModal={showSelectWalletExtensionModal}
            onConnect={() => onConnect()} 
            closeModal={() => setShowSelectWalletExtensionModal(false) } 
          /></>)
    }
  else { 
    return <><ConnectedWallet onDisconnect={() => onDisconnect()} runtimeURL={runtimeURL} selectedWalletExtensionName={selectedWalletExtensionName} setAndShowToast={setAndShowToast}/>
            </> }
}

export const ConnectedWallet : React.FC<ConnectedProps>  = ({ runtimeURL,selectedWalletExtensionName,setAndShowToast,onDisconnect }) => {
  const [changeAddress, setChangeAddress] = useState<string>('')
  const [isMainnet, setIsMainnet] = useState<boolean>(false)
  const [lovelaceBalance, setLovelaceBalance] = useState<number>(0)
  const selectedWalletExtension = getInstalledWalletExtensions().filter(extension => extension.name === selectedWalletExtensionName )[0]
  useEffect(() => {
    const fetchData = async () => {
      try {
      
        const runtimeLifecycleParameters : BrowserRuntimeLifecycleOptions = { runtimeURL:runtimeURL, walletName:selectedWalletExtensionName as SupportedWalletName}
        const runtimeLifecycle = await mkRuntimeLifecycle(runtimeLifecycleParameters)
        await runtimeLifecycle.wallet.getChangeAddress()
          .then((changeAddress : AddressBech32) => {setChangeAddress(unAddressBech32(changeAddress));return unAddressBech32(changeAddress)})
        await runtimeLifecycle.wallet.isMainnet().then(setIsMainnet)
        await runtimeLifecycle.wallet.getLovelaces().then(a => setLovelaceBalance(Number(a)))
      } catch (err) {
        console.log("Error", err);
        }
    }

    fetchData()
    
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedWalletExtensionName]);
 
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(changeAddress);
      setAndShowToast(
        'Address copied to clipboard',
        <span>Copied <span className="font-weight-bold">{changeAddress}</span> to clipboard</span>,
        false
      );
    } catch (err) {
      console.error('Failed to copy address: ', err);
    }
  };

  const disconnectWallet = () => {
    localStorage.removeItem('walletProvider');
    onDisconnect()
  }
  
  const adas = (Math.trunc(lovelaceBalance / 1_000_000))
  const decimalADAs = (lovelaceBalance % 1_000_000)

  return (<div className="dropdown" style={{width: "210px"}}>
          <button className="btn btn-light btn-sm dropdown-toggle mr-2" title="menu" data-bs-toggle="dropdown" aria-expanded="false">
            <span style={{fontSize: "medium"}}>
              <Image src={selectedWalletExtension.icon} className="walletIcon" alt="" />
              &nbsp;&nbsp;&nbsp;
              {(adas).toLocaleString()}.
              </span>
              <span  style={{fontSize: "smaller"}}>{decimalADAs + '  '} </span> 
              <span  style={{fontWeight: 'bold',fontSize: "small"}}> {isMainnet ? '  ₳' : '  t₳' }</span>      
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
        </div>)
    
  }


