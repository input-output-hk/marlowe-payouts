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
    <div className={`modal ${showModal ? 'show' : ''}`} tabIndex={-1} style={{ display: showModal ? 'block' : 'none' }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Withdraw Payouts</h5>
            <button type="button" className="close" onClick={closeModal}>
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">
            <p>Summary of payouts to be paid:</p>
            <ul>
              {payoutsToBePaid.map((payout, index) => (
                <li key={index}>{payout.name}: {payout.amount.toString()} lovelace</li>
              ))}
            </ul>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={closeModal}>
              Close
            </button>
            <button type="button" className="btn btn-primary" onClick={handleWithdrawals}>
              Confirm Withdrawal
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PayoutsModal;
