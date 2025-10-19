import React, { useState, useContext, useEffect } from 'react';
import { AppContext } from '../App';
import { KeyIcon } from './Icons';

interface ViewRecoveryPhraseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ViewRecoveryPhraseModal: React.FC<ViewRecoveryPhraseModalProps> = ({ isOpen, onClose }) => {
    const { currentUser } = useContext(AppContext);
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isVerified, setIsVerified] = useState(false);

    // Reset state when modal is opened/closed
    useEffect(() => {
        if (!isOpen) {
            setTimeout(() => {
                setPassword('');
                setError('');
                setIsVerified(false);
            }, 300); // Delay to allow closing animation
        }
    }, [isOpen]);

    if (!isOpen) return null;
    
    const handleVerify = (e: React.FormEvent) => {
        e.preventDefault();
        if (password === currentUser?.password) {
            setIsVerified(true);
            setError('');
        } else {
            setError('Incorrect password. Please try again.');
        }
    };

    const handleClose = () => {
        onClose();
    };
    
    const mnemonic = currentUser?.wallet?.mnemonic || '';

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50" onClick={handleClose}>
            <div className="bg-light-card dark:bg-dark-card rounded-lg shadow-2xl w-full max-w-md p-6 m-4" onClick={e => e.stopPropagation()}>
                <div className="flex items-center mb-4">
                    <KeyIcon className="w-8 h-8 text-primary mr-3" />
                    <h2 className="text-2xl font-bold">View Recovery Phrase</h2>
                </div>

                {!isVerified ? (
                    <form onSubmit={handleVerify} className="space-y-4">
                        <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                            For your security, please enter your password to reveal your recovery phrase.
                        </p>
                        <div>
                            <label htmlFor="password-verify" className="block text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary">Password</label>
                            <input 
                                id="password-verify"
                                type="password" 
                                value={password} 
                                onChange={(e) => setPassword(e.target.value)}
                                className="mt-1 w-full input-style"
                                autoFocus
                            />
                        </div>
                        {error && <p className="text-sm text-red-500">{error}</p>}
                        <div className="flex justify-end space-x-3 pt-2">
                            <button type="button" onClick={handleClose} className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-light-text dark:text-dark-text rounded-md hover:bg-gray-300 dark:hover:bg-gray-500">Cancel</button>
                            <button type="submit" className="px-4 py-2 bg-primary text-primary-content rounded-md hover:bg-primary-focus">Verify</button>
                        </div>
                    </form>
                ) : (
                    <div className="space-y-4">
                        <div className="p-4 bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-200 rounded-lg border border-red-400 dark:border-red-600">
                            <h4 className="font-bold text-lg">⚠️ NEVER share this phrase!</h4>
                            <p className="text-sm">Anyone with these words can steal your crypto. Store it securely and offline.</p>
                        </div>
                        <div className="grid grid-cols-3 gap-2 p-4 border rounded-md bg-light-bg dark:bg-dark-bg border-light-border dark:border-dark-border font-mono text-center">
                            {mnemonic.split(' ').map((word, index) => (
                                <div key={index} className="p-1 text-light-text dark:text-dark-text">{`${index + 1}. ${word}`}</div>
                            ))}
                        </div>
                        <div className="flex justify-end">
                             <button onClick={handleClose} className="px-4 py-2 bg-primary text-primary-content rounded-md hover:bg-primary-focus">I'm Done</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ViewRecoveryPhraseModal;