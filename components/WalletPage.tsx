import React, { useContext, useState } from 'react';
import { AppContext } from '../App';
import StatCard from './StatCard';
import { SidebarWalletIcon, ArrowUpRightIcon, ArrowDownLeftIcon, ArrowTopRightOnSquareIcon, ShieldCheckIcon, KeyIcon } from './Icons';
import { Transaction } from '../types';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import SendModal from './SendModal';
import ReceiveModal from './ReceiveModal';
import * as backendAPI from '../services/electronAPI';
import ViewRecoveryPhraseModal from './ViewRecoveryPhraseModal';


dayjs.extend(relativeTime);

const TransactionIcon: React.FC<{ type: Transaction['type'] }> = ({ type }) => {
    const baseClasses = "w-6 h-6 p-1 rounded-full mr-4 flex-shrink-0";
    switch (type) {
        case 'send':
            return <ArrowUpRightIcon className={`${baseClasses} bg-red-500/20 text-red-500`} />;
        case 'receive':
        case 'deposit':
            return <ArrowDownLeftIcon className={`${baseClasses} bg-green-500/20 text-green-500`} />;
        default:
            return null;
    }
};

const TransactionHistory: React.FC<{ transactions: Transaction[], coinTicker: string, coinId: string }> = ({ transactions, coinTicker, coinId }) => (
    <div className="space-y-3">
        {transactions.length > 0 ? transactions.map(tx => (
            <div key={tx.id} className="flex items-center justify-between p-3 bg-light-bg dark:bg-dark-bg rounded-lg">
                <div className="flex items-center">
                    <TransactionIcon type={tx.type} />
                    <div>
                        <p className="font-semibold capitalize">{tx.type.replace('_', ' ')}</p>
                        <div className="flex items-center space-x-2">
                          <p className="text-xs text-light-text-secondary dark:text-dark-text-secondary">
                            {dayjs(tx.timestamp).fromNow()} - {tx.status}
                          </p>
                          {tx.hash && !tx.hash.startsWith('Waiting') && (
                            <a 
                                href={backendAPI.getExplorerLink({id: coinId} as any, tx.hash)}
                                target="_blank" 
                                rel="noopener noreferrer"
                                title="View on blockchain explorer"
                                className="flex items-center text-xs text-blue-500 hover:underline"
                            >
                                <ArrowTopRightOnSquareIcon className="w-3 h-3"/>
                            </a>
                          )}
                        </div>
                    </div>
                </div>
                <div className="text-right">
                    <p className={`font-bold font-mono ${['send'].includes(tx.type) ? 'text-red-500' : 'text-green-500'}`}>
                        {['send'].includes(tx.type) ? '-' : '+'}
                        {tx.amount.toFixed(6)} {coinTicker}
                    </p>
                     <p className="text-xs text-light-text-secondary dark:text-dark-text-secondary truncate w-32" title={tx.address}>
                        {tx.type === 'send' && `To: ${tx.address?.substring(0, 10)}...`}
                        {tx.fee && ` (Fee: ${tx.fee.toFixed(6)})`}
                    </p>
                </div>
            </div>
        )) : (
            <p className="text-center text-light-text-secondary dark:text-dark-text-secondary py-8">No transactions yet.</p>
        )}
    </div>
);

const WalletPage: React.FC = () => {
    const { selectedPayoutCoin, walletBalance, transactions } = useContext(AppContext);
    const [isSendModalOpen, setIsSendModalOpen] = useState(false);
    const [isReceiveModalOpen, setIsReceiveModalOpen] = useState(false);
    const [isRecoveryModalOpen, setIsRecoveryModalOpen] = useState(false);
    
    return (
        <>
        <SendModal isOpen={isSendModalOpen} onClose={() => setIsSendModalOpen(false)} />
        <ReceiveModal isOpen={isReceiveModalOpen} onClose={() => setIsReceiveModalOpen(false)} />
        <ViewRecoveryPhraseModal isOpen={isRecoveryModalOpen} onClose={() => setIsRecoveryModalOpen(false)} />

        <div className="space-y-6">
            <div className="flex items-center space-x-4">
                <SidebarWalletIcon className="w-10 h-10 text-primary" />
                <div>
                    <h1 className="text-3xl font-bold">My Wallet</h1>
                    <p className="text-light-text-secondary dark:text-dark-text-secondary">Manage your {selectedPayoutCoin.name} ({selectedPayoutCoin.ticker}) balance on the {selectedPayoutCoin.network} network.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <div className="bg-light-card dark:bg-dark-card p-6 rounded-lg shadow-lg">
                        <h2 className="text-xl font-semibold mb-4">Recent Transactions</h2>
                        <div className="max-h-[450px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-400 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
                            <TransactionHistory transactions={transactions} coinTicker={selectedPayoutCoin.ticker} coinId={selectedPayoutCoin.id} />
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-light-card dark:bg-dark-card p-6 rounded-lg shadow-lg">
                        <StatCard title="Available Balance">
                            <div className="flex items-center">
                                <img src={selectedPayoutCoin.logo} alt={selectedPayoutCoin.name} className="w-10 h-10 rounded-full mr-4" />
                                <div>
                                    <p className="text-3xl font-bold text-primary">{walletBalance.toFixed(6)}</p>
                                    <p className="text-sm font-mono text-light-text-secondary dark:text-dark-text-secondary">~${(walletBalance * (selectedPayoutCoin.price ?? 0)).toFixed(2)} USD</p>
                                </div>
                            </div>
                        </StatCard>
                    </div>
                     <div className="bg-light-card dark:bg-dark-card p-6 rounded-lg shadow-lg">
                        <h2 className="text-xl font-semibold mb-4">Actions</h2>
                        <div className="space-y-3">
                            <div className="flex space-x-4">
                                <button 
                                    onClick={() => setIsSendModalOpen(true)}
                                    className="flex-1 py-3 bg-primary text-primary-content rounded-md hover:bg-primary-focus font-semibold transition-colors"
                                >
                                    Send
                                </button>
                                <button 
                                    onClick={() => setIsReceiveModalOpen(true)}
                                    className="flex-1 py-3 bg-secondary text-white rounded-md hover:bg-blue-600 font-semibold transition-colors"
                                >
                                    Receive
                                </button>
                            </div>
                            <button
                                onClick={() => setIsRecoveryModalOpen(true)}
                                className="w-full flex items-center justify-center py-3 bg-gray-200 dark:bg-dark-bg border border-light-border dark:border-dark-border text-light-text dark:text-dark-text rounded-md hover:bg-gray-300 dark:hover:bg-gray-700 font-semibold transition-colors"
                            >
                                <KeyIcon className="w-5 h-5 mr-2" />
                                View Recovery Phrase
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </>
    );
};

export default WalletPage;