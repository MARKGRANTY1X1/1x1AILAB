
import React, { useState, useContext } from 'react';
// FIX: Corrected import path for AppContext from '../App' to fix module resolution error.
import { AppContext } from '../App';
import { ArrowDownLeftIcon, ClipboardIcon, CheckIcon } from './Icons';
import QRCode from 'react-qr-code';

interface ReceiveModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ReceiveModal: React.FC<ReceiveModalProps> = ({ isOpen, onClose }) => {
    const { currentUser, selectedPayoutCoin } = useContext(AppContext);
    const [copyText, setCopyText] = useState('Copy');
    
    if (!isOpen) return null;

    const walletAddress = currentUser?.wallet?.address || 'No wallet found';

    const handleCopy = () => {
        navigator.clipboard.writeText(walletAddress).then(() => {
            setCopyText('Copied!');
            setTimeout(() => setCopyText('Copy'), 2000);
        });
    };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50" onClick={onClose}>
      <div className="bg-light-card dark:bg-dark-card rounded-lg shadow-2xl w-full max-w-md p-6 m-4" onClick={e => e.stopPropagation()}>
        <div className="flex items-center mb-4">
            <ArrowDownLeftIcon className="w-8 h-8 text-green-500 mr-3" />
            <h2 className="text-2xl font-bold">Receive {selectedPayoutCoin.ticker}</h2>
        </div>
        
        <div className="flex flex-col items-center space-y-4">
            <div className="p-4 bg-white rounded-lg">
                <QRCode value={walletAddress} size={192} />
            </div>

            <div>
                <label className="block text-sm font-medium text-center text-light-text-secondary dark:text-dark-text-secondary">Your {selectedPayoutCoin.name} Address</label>
                <div className="relative mt-1">
                    <input 
                        type="text"
                        readOnly
                        value={walletAddress}
                        className="w-full input-style text-center font-mono text-xs pr-12"
                    />
                    <button 
                        onClick={handleCopy}
                        title="Copy Address"
                        className="absolute inset-y-0 right-0 flex items-center px-3 text-light-text-secondary dark:text-dark-text-secondary hover:text-light-text dark:hover:text-dark-text"
                    >
                        {copyText === 'Copy' ? <ClipboardIcon className="w-5 h-5" /> : <CheckIcon className="w-5 h-5 text-green-500" />}
                    </button>
                </div>
            </div>
        </div>

        <div className="mt-6 flex justify-end">
            <button
            onClick={onClose}
            className="px-4 py-2 bg-primary text-primary-content rounded-md hover:bg-primary-focus"
            >
            Done
            </button>
        </div>
      </div>
    </div>
  );
};

export default ReceiveModal;
