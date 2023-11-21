import React, { useState } from 'react';
import HashLoader from "react-spinners/HashLoader";
import './modal.scss';
import "react-datepicker/dist/react-datepicker.css";
import { adaToken, datetoTimeout } from '@marlowe.io/language-core-v1';
import { GeneratePayoutRequest } from '../Contract/GeneratePayout';
import { addressBech32 } from '@marlowe.io/runtime-core';


interface NewPayoutProps {
  showModal: boolean;
  closeModal: () => void;
  handleCreateGeneratePayoutContract: (request : GeneratePayoutRequest, afterTxSubmitted : () => void) => void;
  changeAddress: string;
}

type FormData = {
  roleTokenName: string;
  initialDepositAmount: number;
};

const initialFormData : () => FormData = () => ({
  roleTokenName: '',
  initialDepositAmount: 10
})

const formErrorsInitialState : FormDataError = {
  roleTokenName: null,
  initialDepositAmount: null,
}

type FormDataError = {
  roleTokenName: string | null;
  initialDepositAmount: string | null;
};

export const NewPayoutModal: React.FC<NewPayoutProps> = ({ showModal, closeModal, handleCreateGeneratePayoutContract, changeAddress}) => {


  let [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState<FormData>(initialFormData());
  
  const [formErrors, setFormErrors] = useState<FormDataError>(formErrorsInitialState);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value,
    });
  };

  const handleSubmit = () => {
    let valid = true;
    let errors = formErrorsInitialState

    for (const [key, value] of Object.entries(formData)) {
      if (!value) {
        valid = false;
        errors = { ...errors, [key]: 'This field is required' };
      }
    }
    if (lengthInUtf8Bytes(formData.roleTokenName) >= 64){
      errors = { ...errors, "roleTokenName": 'This field is too long to be stored on chain( 64 bytes maximum)' };
    }
  
    setFormErrors(errors);

    if (valid) {
      setLoading(true)
      
      handleCreateGeneratePayoutContract(
        { provider: addressBech32(changeAddress) , 
          claimer: { role_token: formData.roleTokenName}, 
          tokenValue: {
            amount: BigInt(formData.initialDepositAmount) * 1_000_000n,
            token: adaToken},
          deadline : datetoTimeout(new Date()) + 10n * 60n * 1000n // 10 minutes
      }, () => {
        handleClose()
      })
      
    }
  };

  const handleClose = () => {
    setFormData(initialFormData());
    setLoading(false)
    setFormErrors(formErrorsInitialState);
    closeModal();
  }

  function lengthInUtf8Bytes(str : string) {
    // Matches only the 10.. bytes that are non-initial characters in a multi-byte sequence.
    var m = encodeURIComponent(str).match(/%[89ABab]/g);
    return str.length + (m ? m.length : 0);
  }

  return (
    <>
    <div className={`modal ${showModal ? 'show' : ''}`} tabIndex={-1} style={{ display: showModal ? 'block' : 'none' }}>
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content">
            <div className="modal-header">
              <div className='container'>
                <div className='row'>
                  <div className='col-10 text-left'>
                    <h5 className="modal-title">Simulate A New Payout</h5>
                  </div>
                  <div className='col-2 text-right'>
                    <button type="button" className="btn btn-outline-secondary" onClick={handleClose}>
                        <svg fill="none" height="15" viewBox="0 0 14 15" width="14" xmlns="http://www.w3.org/2000/svg" className="dark:text-gray-400"><path d="M13.6743 0.442879C13.2399 0.00862377 12.5358 0.00862377 12.1014 0.442879L7 5.54428L1.8986 0.442879C1.46422 0.00862377 0.760077 0.00862377 0.325691 0.442879C-0.108564 0.877265 -0.108564 1.5814 0.325691 2.01579L5.42709 7.11719L0.325691 12.2186C-0.108564 12.653 -0.108564 13.3571 0.325691 13.7915C0.760077 14.2258 1.46422 14.2258 1.8986 13.7915L7 8.6901L12.1014 13.7915C12.5358 14.2258 13.2399 14.2258 13.6743 13.7915C14.1086 13.3571 14.1086 12.653 13.6743 12.2186L8.57291 7.11719L13.6743 2.01579C14.1086 1.5814 14.1086 0.877265 13.6743 0.442879Z" fill="currentColor"></path></svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-body">
              <div className='container'>
                <div className='row'>
                  <div className='col-12'>
                    <form>
                      <div className='row'>
                        <div className="form-group my-3">
                        <label htmlFor="roleTokenName">Token Role name to Mint  </label>
                          <input
                            type="text"
                            className="form-control"
                            id="roleTokenName"
                            value={formData.roleTokenName}
                            onChange={handleInputChange}
                          />
                          {formErrors.roleTokenName && <small className="text-danger">{formErrors.roleTokenName}</small>}
                      </div>
                      </div>
                      <div className='row'>
                        <div className="form-group my-2 col-6">
                          <label htmlFor="initialDepositAmount">Amount to place on the Payout Address (in ₳)</label>
                          <input
                            type="number" 
                            className="form-control"
                            id="initialDepositAmount"
                            value={formData.initialDepositAmount}
                            min={10}
                            onChange={handleInputChange}
                          />
                          {formErrors.initialDepositAmount && <small className="text-danger">{formErrors.initialDepositAmount}</small>}
                        </div>
                      </div>
                    <div className='col-12 my-3'>
                      <hr className='mx-1'/>
                    </div>

                    <div className='col-12'>
                      <p className='destination-address-title'>Your are about to create a simple contract that will create a Payout of {formData.initialDepositAmount} ₳ owned by the Role Token that will be minted in your wallet. You'll have to sign 2 Transactions to simulate this payout : </p>
                      <p className='destination-address-title'>
                        <ul><li>The 1st Transaction will create the Simple Contract for you and mint the role token in your wallet.</li>
                            <li>The 2nd Transaction will add the {formData.initialDepositAmount} ₳ on the payout Address </li>
                        </ul>
                      </p>
                      <p className='destination-address-title'>
                       At the end of these 2 Transactions, you'll see a new available payout in the list. 
                      </p>
                    </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <div className='container'>
                <div className='row justify-content-center'>
                  <div className='col-3' style={{width:"170px"}}>
                     <button type="button" className="btn btn-outline-secondary w-100" onClick={handleClose}>
                      Cancel
                     </button>
                  </div>
                  <div className='col-3'>
                  <div className='d-flex justify-content-start' style={{width:"200px"}}>
                        <button type="button" className="btn btn-primary"  onClick={handleSubmit} disabled = {loading} >
                        Create Payout                       
                        </button>
                        <HashLoader color="#4B1FED"
                        cssOverride={cssOverrideSpinnerCentered}
                        loading={loading}
                        size={15}
                        id="create-contract"
                      />
                  </div>
        
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {showModal && <div className="modal-backdrop show"></div>}
    </>
  );
};

export const cssOverrideSpinnerCentered 
  = ({display: "block",
      marginLeft: "auto",
      marginRight:"auto",
      height: "auto",
      witdth : "20px",
      paddingTop: "10px"})


