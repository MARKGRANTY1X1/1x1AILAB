
import React, { useState } from 'react';
import { Wallet } from '../types';
import { KeyIcon } from './Icons';

interface ImportWalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (wallet: Wallet) => void;
}

const ImportWalletModal: React.FC<ImportWalletModalProps> = ({ isOpen, onClose, onImport }) => {
  const [mnemonic, setMnemonic] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleImport = () => {
    const words = mnemonic.trim().split(/\s+/);
    if (words.length !== 12) {
      setError('Recovery phrase must be exactly 12 words.');
      return;
    }
    // In a real app, you'd derive the address from the mnemonic.
    // Here we'll just create a dummy wallet.
    const newWallet: Wallet = {
      mnemonic: words.join(' '),
      address: `imported-wallet-address-${Date.now()}`
    };
    onImport(newWallet);
    onClose();
  };
  
  const handleClose = () => {
    onClose();
    setTimeout(() => {
        setMnemonic('');
        setError('');
    }, 300);
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50" onClick={handleClose}>
      <div className="bg-light-card dark:bg-dark-card rounded-lg shadow-2xl w-full max-w-md p-6 m-4" onClick={e => e.stopPropagation()}>
        <div className="flex items-center mb-4">
          <KeyIcon className="w-8 h-8 text-primary mr-3" />
          <h2 className="text-2xl font-bold">Import Wallet</h2>
        </div>
        <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary mb-4">
          Enter your 12-word recovery phrase to restore your wallet.
        </p>
        <textarea
          value={mnemonic}
          onChange={(e) => setMnemonic(e.target.value)}
          rows={3}
          placeholder="word1 word2 word3 ..."
          className="w-full input-style font-mono"
        />
        {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
        <div className="mt-6 flex justify-end space-x-3">
          <button onClick={handleClose} className="px-4 py-2 bg-gray-200 dark:bg-gray-600 rounded-md">Cancel</button>
          <button onClick={handleImport} className="px-4 py-2 bg-primary text-primary-content rounded-md">Import</button>
        </div>
      </div>
    </div>
  );
};

export default ImportWalletModal;
