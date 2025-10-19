import React, { useContext } from 'react';
import { AppContext } from '../App';
import { ArrowUpRightIcon } from './Icons';

const ActionConfirmationModal: React.FC = () => {
  const { actionState, cancelAction, confirmAction, isActionLoading, selectedPayoutCoin } = useContext(AppContext);

  if (!actionState.isOpen || actionState.type !== 'send') {
    return null;
  }

  const { details } = actionState;
  const totalAmount = (details.amount || 0) + (details.fee || 0);

  const content = {
      icon: <ArrowUpRightIcon className="w-8 h-8 text-red-500" />,
      title: `Confirm Send`,
      details: [
        { label: 'Sending To', value: <span className="font-mono text-xs break-all">{details.address}</span> },
        { label: 'Amount', value: `${details.amount.toFixed(6)} ${selectedPayoutCoin.ticker}` },
        { label: 'Network Fee (Est.)', value: `~${details.fee.toFixed(6)} ${selectedPayoutCoin.ticker}` },
      ],
      totalLabel: 'Total To Be Sent'
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50" onClick={cancelAction}>
      <div className="bg-light-card dark:bg-dark-card rounded-lg shadow-2xl w-full max-w-md p-6 m-4" onClick={e => e.stopPropagation()}>
        <div className="flex items-center mb-4">
          {content.icon}
          <h2 className="text-2xl font-bold ml-3">{content.title}</h2>
        </div>

        <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary mb-4">Please review the details below. This action cannot be undone once confirmed on the network.</p>

        <div className="space-y-2 p-4 bg-light-bg dark:bg-dark-bg rounded-lg border border-light-border dark:border-dark-border">
          {content.details.map((item, index) => (
            <div key={index} className="flex justify-between items-center text-sm">
              <span className="text-light-text-secondary dark:text-dark-text-secondary">{item.label}:</span>
              <span className="font-medium text-right">{item.value}</span>
            </div>
          ))}
          <div className="flex justify-between items-center text-sm font-bold pt-2 border-t border-light-border dark:border-dark-border">
            <span className="text-light-text-secondary dark:text-dark-text-secondary">{content.totalLabel}:</span>
            <span className="text-primary text-lg">{totalAmount.toFixed(6)} {selectedPayoutCoin.ticker}</span>
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-3">
          <button onClick={cancelAction} disabled={isActionLoading} className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-light-text dark:text-dark-text rounded-md hover:bg-gray-300 dark:hover:bg-gray-500 disabled:opacity-50">
            Cancel
          </button>
          <button onClick={confirmAction} disabled={isActionLoading} className="px-4 py-2 bg-primary text-primary-content rounded-md hover:bg-primary-focus disabled:bg-gray-500 disabled:cursor-wait min-w-[120px]">
            {isActionLoading ? 'Processing...' : 'Confirm'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ActionConfirmationModal;