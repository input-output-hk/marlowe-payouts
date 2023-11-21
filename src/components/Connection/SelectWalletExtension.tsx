import React, {  } from 'react';
import './modal.scss';
import "react-datepicker/dist/react-datepicker.css";
import { getInstalledWalletExtensions } from '@marlowe.io/wallet/browser';


interface SelectWalletExtensionModalProps {
  showModal: boolean;
  closeModal: () => void;
  onConnect: () => void
}


export const SelectWalletExtensionModal: React.FC<SelectWalletExtensionModalProps> = ({ showModal, closeModal,onConnect}) => {
  
  const installedWalletExtensions = getInstalledWalletExtensions()
  
  async function connectWallet(walletName: string) {
    localStorage.setItem('walletProvider', walletName);
    onConnect();
    closeModal()
  }

  function capitalizeFirstLetter(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  return (
    <>
    <div className={`modal ${showModal ? 'show' : ''}`} tabIndex={1} style={{ display: showModal ? 'block' : 'none' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
            <div className="modal-header" style={{border:"none"}}>
              <div className='container'>
                <div className='row'>
                  <div className='col-10 text-left'>
                    <h2 className="modal-title">Connnect to Wallet</h2>
                  </div>
                  <div className='col-2 text-right'>
                    <button type="button" className="btn btn-outline-secondary" onClick={() => closeModal()}>
                        <svg fill="none" height="15" viewBox="0 0 14 15" width="14" xmlns="http://www.w3.org/2000/svg" className="dark:text-gray-400"><path d="M13.6743 0.442879C13.2399 0.00862377 12.5358 0.00862377 12.1014 0.442879L7 5.54428L1.8986 0.442879C1.46422 0.00862377 0.760077 0.00862377 0.325691 0.442879C-0.108564 0.877265 -0.108564 1.5814 0.325691 2.01579L5.42709 7.11719L0.325691 12.2186C-0.108564 12.653 -0.108564 13.3571 0.325691 13.7915C0.760077 14.2258 1.46422 14.2258 1.8986 13.7915L7 8.6901L12.1014 13.7915C12.5358 14.2258 13.2399 14.2258 13.6743 13.7915C14.1086 13.3571 14.1086 12.653 13.6743 12.2186L8.57291 7.11719L13.6743 2.01579C14.1086 1.5814 14.1086 0.877265 13.6743 0.442879Z" fill="currentColor"></path></svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-body">
            <div className="card-body">
                  {installedWalletExtensions.map(extension => 
                    <div key={extension.name} className="card_WrXe" style={{fontFamily:"inter"}} onClick={() => connectWallet(extension.name)}>
                      <div key={extension.name+".title"} className="d-flex justify-content-start align-items-center">
                          <img src={extension.icon} alt="Icon Before" width="20px" height="20px" style={{marginRight:"5px"}} />
                          <span style={{textAlign:"left",fontSize:"1.1rem"}}>{capitalizeFirstLetter(extension.name)}</span>
                      </div>
                      <div key={extension.name+".supports"} className="d-flex justify-content-start align-items-center">
                          {extension.supported?
                            <p style={{textAlign:"left",fontSize:"x-small",marginTop:"10px"}}>(Supports Marlowe Technology)</p>
                            : <p style={{textAlign:"left",fontSize:"x-small",marginTop:"10px"}}>(May not support Marlowe Technology)</p>
                          }     
                      </div>
                      <div key={extension.name+".connect"} className="d-flex justify-content-end align-items-center">
                          <span style={{fontSize:"small",color: "var(--ifm-link-color)"}}> Connect </span> 
                          <svg width="12" 
                              height="12" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" 
                              className="arrow"><path d="M3 8h9M8.168 12.5l4.5-4.5-4.5-4.5" stroke="#1B2738" 
                              strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path></svg>
                      </div>
                  </div>
                    )}
              </div>
            </div>
     
             
          </div>
        </div>
      </div>
      {showModal && <div className="modal-backdrop show"></div>}
    </>
  );
};

