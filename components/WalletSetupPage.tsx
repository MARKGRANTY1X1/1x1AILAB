import React, { useState, useMemo } from 'react';
import { LogoIcon, WalletIcon } from './Icons';
import { Wallet } from '../types';
import { useToast } from '../contexts/ToastContext';
import * as backendAPI from '../services/electronAPI';

interface WalletSetupPageProps {
  onSetupComplete: (wallet: Wallet) => void;
}

const WalletSetupPage: React.FC<WalletSetupPageProps> = ({ onSetupComplete }) => {
  const [step, setStep] = useState<'create' | 'confirm'>('create');
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [error, setError] = useState('');
  const { addToast } = useToast();

  const wallet = useMemo(() => backendAPI.createWallet(), []);

  const handleFinalizeCreate = () => {
    if (!isConfirmed) {
        setError("Please confirm you have saved your recovery phrase.");
        return;
    }
    onSetupComplete(wallet);
    addToast('Wallet created! It is now securely linked to your account.', 'success');
  };

  const primaryBtnClasses = "w-full px-4 py-2.5 bg-wallet-setup-primary text-teal-950 font-bold rounded-lg hover:bg-wallet-setup-primary-focus focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-wallet-setup-primary-focus focus:ring-offset-teal-950/50 transition-colors duration-200";
  const backBtnClasses = "px-4 py-2.5 bg-teal-900/50 text-wallet-setup-text-secondary font-bold rounded-lg hover:bg-teal-800/70 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-700 focus:ring-offset-teal-950/50 transition-colors duration-200";
  const continueBtnClasses = "px-4 py-2.5 bg-wallet-setup-primary text-teal-950 font-bold rounded-lg hover:bg-wallet-setup-primary-focus focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-wallet-setup-primary-focus focus:ring-offset-teal-950/50 transition-colors duration-200";

  const renderContent = () => {
    switch (step) {
      case 'confirm':
          return (
              <>
                <h2 className="text-xl font-bold">Confirm You're Secure</h2>
                 <div className="my-4 space-y-3">
                    <p className="text-sm text-wallet-setup-text-secondary">
                        Please acknowledge that you have securely stored your 12-word recovery phrase. Without it, you cannot recover your assets if you lose access.
                    </p>
                    <label className="flex items-center p-3 rounded-md hover:bg-teal-900/50 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={isConfirmed}
                            onChange={() => {setError(''); setIsConfirmed(!isConfirmed)}}
                            className="h-5 w-5 rounded text-wallet-setup-primary bg-teal-900 border-teal-500 focus:ring-wallet-setup-primary"
                        />
                        <span className="ml-3 text-sm">I have written down or otherwise securely stored my recovery phrase.</span>
                    </label>
                 </div>
                 {error && <p className="text-sm text-red-400 mt-2">{error}</p>}
                 <div className="flex justify-between mt-4">
                    <button onClick={() => setStep('create')} className={backBtnClasses}>Back</button>
                    <button onClick={handleFinalizeCreate} className={continueBtnClasses}>Finish Setup</button>
                </div>
              </>
          );
      case 'create':
      default:
        return (
          <>
            <div className="flex flex-col items-center mb-4">
              <WalletIcon className="w-12 h-12 text-wallet-setup-primary" />
              <h2 className="text-xl font-bold mt-2">Create Your New Wallet</h2>
            </div>
            <div className="p-4 bg-wallet-setup-warning-bg text-wallet-setup-warning-text rounded-lg border border-wallet-setup-warning-border my-4">
                <h4 className="font-bold text-yellow-200">⚠️ Store this phrase securely.</h4>
                <p className="text-sm">This is the only way to recover your wallet. Anyone with this phrase can access your funds.</p>
            </div>
            <div className="grid grid-cols-3 gap-2 p-4 border rounded-md bg-teal-950/50 border-teal-700 font-mono text-center">
                {wallet.mnemonic.split(' ').map((word, index) => (
                    <div key={index} className="p-1">{`${index + 1}. ${word}`}</div>
                ))}
            </div>
            <div className="mt-6">
                <button onClick={() => setStep('confirm')} className={primaryBtnClasses}>I've Saved It, Continue</button>
            </div>
          </>
        );
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-wallet-setup-bg-start to-wallet-setup-bg-end text-wallet-setup-text">
      <div className="w-full max-w-lg p-8 space-y-4 bg-wallet-setup-card backdrop-blur-sm border border-teal-700 rounded-xl shadow-2xl">
        <div className="flex justify-center mb-4">
           <LogoIcon className="h-10 w-auto text-wallet-setup-primary" />
        </div>
        {renderContent()}
      </div>
    </div>
  );
};

export default WalletSetupPage;