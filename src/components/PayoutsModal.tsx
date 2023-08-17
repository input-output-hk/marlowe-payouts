import React from 'react';

interface Payout {
  id: string;
  name: string;
  amount: number;
}

interface PayoutsModalProps {
  showModal: boolean;
  closeModal: () => void;
  payoutsToBePaidIds: string[];
  payouts: Payout[];
  handleWithdrawals: () => void;
}

const PayoutsModal: React.FC<PayoutsModalProps> = ({ showModal, closeModal, payoutsToBePaidIds, payouts, handleWithdrawals }) => {
  const payoutsToBePaid = payouts.filter(payout => payoutsToBePaidIds.includes(payout.id));
  return (
    <>
      <div className={`modal ${showModal ? 'show' : ''}`} tabIndex={-1} style={{ display: showModal ? 'block' : 'none' }}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Confirm Withdrawal</h5>
              <button type="button" className="close btn btn-outline-secondary" onClick={closeModal}>
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <div className='col-12'>
                <p>Summary of payouts to be paid:</p>
                <ul>
                  {payoutsToBePaid.map((payout, index) => (
                    <li key={index}>{payout.name}: {payout.amount.toString()} lovelace</li>
                  ))}
                </ul>
              </div>
              <div className='divider'></div>
              <div className='col-12'>
                Will transfer to
              </div>
              <div className='divider'></div>
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
                    <button type="button" className="btn btn-primary w-100" onClick={handleWithdrawals}>
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
