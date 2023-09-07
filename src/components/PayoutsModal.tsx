import React from 'react';

import { PayoutAvailable } from '@marlowe.io/runtime-core';
import { formatAssets, intersperse } from './Format';

interface PayoutsModalProps {
  showModal: boolean;
  closeModal: () => void;
  payoutsToBeWithdrawn: PayoutAvailable[];
  changeAddress: string;
  handleWithdrawals: () => void;
}

const PayoutsModal: React.FC<PayoutsModalProps> = ({ showModal, closeModal, payoutsToBeWithdrawn, changeAddress, handleWithdrawals }) => {
  return (
    <>
      <div className={`modal ${showModal ? 'show' : ''}`} tabIndex={-1} style={{ display: showModal ? 'block' : 'none' }}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <div className='container'>
                <div className='row'>
                  <div className='col-10 text-left'>
                    <h5 className="modal-title">Confirm Withdrawal</h5>
                  </div>
                  <div className='col-2 text-right'>
                    <button type="button" className="close btn btn-outline-secondary" onClick={closeModal}>
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-body">
              <div className='container'>
                <div className='row'>
                  <div className='col-12'>
                    <div className='container outer-modal-body'>
                      <p className='font-weight-bold'>Rewards</p>
                      <div className='container'>
                        {payoutsToBeWithdrawn.map((payout, index) => (
                          <p className='font-weight-bold' key={index}>{[...intersperse(formatAssets(payout.assets, false), ',')]}</p>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className='col-12 my-3'>
                    <hr className='mx-1' />
                    <p className='transfer-title'>
                      Will be transfered to
                    </p>
                    <hr className='mx-1' />
                  </div>

                  <div className='col-12'>
                    <p className='destination-address-title'>Your wallet address</p>
                    <div className='container destination-address-container'>
                      <p className='destination-address'>{changeAddress}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <div className='container'>
                <div className='row'>
                  <div className='col'>
                    <button type="button" className="btn btn-outline-secondary w-100" onClick={closeModal}>
                      Cancel
                    </button>
                  </div>
                  <div className='col'>
                    <button type="button" className="btn btn-primary w-100" onClick={x => { handleWithdrawals(); closeModal() }}>
                      Confirm
                    </button>
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

export default PayoutsModal;
