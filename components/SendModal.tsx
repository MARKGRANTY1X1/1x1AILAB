import React, { useState, useContext } from 'react';
import { AppContext } from '../App';
import { ArrowUpRightIcon, WalletIcon } from './Icons';
import * as backendAPI from '../services/electronAPI';


interface SendModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SendModal: React.FC<SendModalProps> = ({ isOpen, onClose }) => {
    const { payoutCoin, walletBalance, initiateAction } = useContext(AppContext);
    const [address, setAddress] = useState('');
    const [amount, setAmount] = useState('');
    const [error, setError] = useState('');
    
    if (!isOpen) return null;

    // FIX: Converted `handleNext` to an async function to correctly await the fee calculation.
    const handleNext = async () => {
        const numericAmount = parseFloat(amount);
        if (isNaN(numericAmount) || numericAmount <= 0) {
            setError('Please enter a valid amount.');
            return;
        }
        if (address.trim().length < 20) { // Simple validation for address length
            setError('Please enter a valid recipient address.');
            return;
        }
        
        // FIX: Awaited the promise from `calculateFee` before using it in an arithmetic operation.
        const fee = await backendAPI.calculateFee(payoutCoin, numericAmount);

        if (numericAmount + fee > walletBalance) {
            setError('Insufficient funds for amount + network fee.');
            return;
        }

        setError('');
        initiateAction('send', { address, amount: numericAmount, fee });
        onClose();
        setAmount('');
        setAddress('');
    }
    
    // FIX: Converted `handleSetMax` to an async function to correctly await the fee calculation.
    const handleSetMax = async () => {
        // FIX: Awaited the promise from `calculateFee` before using it in an arithmetic operation.
        const fee = await backendAPI.calculateFee(payoutCoin, walletBalance);
        const maxAmount = Math.max(0, walletBalance - fee);
        setAmount(maxAmount.toFixed(6));
    }

    const handleClose = () => {
        onClose();
        setTimeout(() => {
            setAmount('');
            setAddress('');
            setError('');
        }, 300);
    }


  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50" onClick={handleClose}>
      <div className="bg-light-card dark:bg-dark-card rounded-lg shadow-2xl w-full max-w-md p-6 m-4" onClick={e => e.stopPropagation()}>
        <div className="flex items-center mb-4">
            <ArrowUpRightIcon className="w-8 h-8 text-red-500 mr-3" />
            <h2 className="text-2xl font-bold">Send {payoutCoin.ticker}</h2>
        </div>
        
        <div className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary">Recipient Address</label>
                <input 
                    type="text"
                    value={address}
                    onChange={e => setAddress(e.target.value)}
                    placeholder={`Enter ${payoutCoin.ticker} address`}
                    className="mt-1 w-full input-style"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary">Amount</label>
                <div className="relative mt-1">
                    <input 
                        type="number"
                        value={amount}
                        onChange={e => setAmount(e.target.value)}
                        placeholder="0.000000"
                        className="w-full input-style pr-16"
                    />
                    <button onClick={handleSetMax} className="absolute inset-y-0 right-0 px-4 text-sm font-medium text-primary hover:text-primary-focus">
                        Max
                    </button>
                </div>
                <p className="text-xs text-light-text-secondary dark:text-dark-text-secondary mt-1">
                    Available: {walletBalance.toFixed(6)} {payoutCoin.ticker}
                </p>
            </div>
        </div>

        {error && <p className="mt-4 text-sm text-red-500 text-center">{error}</p>}
        
        <div className="mt-6 flex justify-end space-x-3">
            <button
            onClick={handleClose}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-light-text dark:text-dark-text rounded-md hover:bg-gray-300 dark:hover:bg-gray-500"
            >
            Cancel
            </button>
            <button
            onClick={handleNext}
            className="px-4 py-2 bg-secondary text-white rounded-md hover:bg-blue-600"
            >
            Review Transaction
            </button>
        </div>
      </div>
    </div>
  );
};

export default SendModal;
