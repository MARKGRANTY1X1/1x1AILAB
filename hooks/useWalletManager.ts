import { useState, useCallback } from 'react';
import { PayoutCoin, Transaction } from '../types';
import * as backendAPI from '../services/electronAPI';
import { useToast } from '../contexts/ToastContext';
import dayjs from 'dayjs';

const MAX_TRANSACTIONS = 100;

export const useWalletManager = (payoutCoin: PayoutCoin) => {
  const { addToast } = useToast();
  
  const [walletBalance, setWalletBalance] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const [actionState, setActionState] = useState<{ isOpen: boolean; type: string | null; details: any }>({ isOpen: false, type: null, details: {} });
  const [isActionLoading, setIsActionLoading] = useState(false);

  const addTransaction = useCallback((tx: Omit<Transaction, 'id' | 'timestamp'>) => {
    const newTransaction: Transaction = {
      ...tx,
      id: `${Date.now()}-${Math.random()}`,
      timestamp: new Date().toISOString(),
    };
    setTransactions(prev => [newTransaction, ...prev].slice(0, MAX_TRANSACTIONS));
    return newTransaction;
  }, []);

  const updateTransactionStatus = useCallback((id: string, status: 'completed' | 'failed', newHash?: string) => {
      setTransactions(prev => prev.map(tx => tx.id === id ? {...tx, status, hash: newHash || tx.hash} : tx));
  }, []);
  
  const receiveFunds = useCallback(async (amount: number) => {
    setWalletBalance(prev => prev + amount);
    addTransaction({ type: 'receive', status: 'completed', amount, hash: 'external-tx' });
    addToast(`Received ${amount.toFixed(6)} ${payoutCoin.ticker}!`, 'success');
  }, [payoutCoin, addTransaction, addToast]);

  const initiateAction = (type: 'send', details: any) => {
      setActionState({ isOpen: true, type, details });
  };

  const cancelAction = () => {
      setActionState({ isOpen: false, type: null, details: {} });
  };

  const confirmAction = async () => {
    if (actionState.type !== 'send') return;
    setIsActionLoading(true);

    const txStub = { type: 'send', amount: actionState.details.amount || 0, status: 'confirming', address: actionState.details.address, hash: 'Waiting for confirmation...' } as const;
    const pendingTx = addTransaction(txStub);
    addToast('Transaction submitted...', 'info');

    try {
        const resultHash = await backendAPI.executeSend(payoutCoin, actionState.details.address, actionState.details.amount);
        setWalletBalance(prev => prev - (actionState.details.amount + actionState.details.fee));
        addToast('Send successful!', 'success', backendAPI.getExplorerLink(payoutCoin, resultHash));
        updateTransactionStatus(pendingTx.id, 'completed', resultHash);
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Transaction failed';
        addToast(message, 'error');
        updateTransactionStatus(pendingTx.id, 'failed');
    } finally {
        setIsActionLoading(false);
        cancelAction();
    }
  };


  return {
    walletBalance,
    transactions,
    initiateAction,
    actionState,
    confirmAction,
    cancelAction,
    isActionLoading,
    receiveFunds,
  };
};