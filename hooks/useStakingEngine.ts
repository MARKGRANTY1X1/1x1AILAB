
import { useState, useEffect, useCallback } from 'react';
import useLocalStorage from './useLocalStorage';
import { StakedPosition, PayoutCoin, ToastType } from '../types';

export const useStakingEngine = (
  payoutCoin: PayoutCoin,
  addToast: (message: string, type?: ToastType) => void
) => {
  const [stakedPositions, setStakedPositions] = useLocalStorage<StakedPosition[]>(`staking-${payoutCoin.id}`, []);
  const [stakedBalance, setStakedBalance] = useState(0);
  const [claimableRewards, setClaimableRewards] = useState(0);

  const calculateRewards = useCallback(() => {
    let totalStaked = 0;
    let totalRewards = 0;
    
    const now = Date.now();

    stakedPositions.forEach(pos => {
      totalStaked += pos.amount;
      
      const stakedAt = new Date(pos.stakedAt).getTime();
      const secondsSinceLastUpdate = (now - stakedAt) / 1000;
      
      // Simplified reward calculation for simulation
      const apyPerSecond = payoutCoin.apy / (365 * 24 * 60 * 60);
      const earned = pos.amount * apyPerSecond * secondsSinceLastUpdate;
      
      totalRewards += pos.rewards + earned;
    });

    setStakedBalance(totalStaked);
    setClaimableRewards(totalRewards);
  }, [stakedPositions, payoutCoin]);


  useEffect(() => {
    calculateRewards();
    const interval = setInterval(calculateRewards, 5000); // Recalculate every 5 seconds
    return () => clearInterval(interval);
  }, [calculateRewards]);

  const stake = async (amount: number, validatorId: string): Promise<void> => {
      return new Promise(resolve => setTimeout(() => {
          setStakedPositions(prev => {
              const existingPosition = prev.find(p => p.validatorId === validatorId);
              if (existingPosition) {
                  return prev.map(p => p.validatorId === validatorId ? { ...p, amount: p.amount + amount, stakedAt: new Date().toISOString() } : p);
              }
              return [...prev, { validatorId, amount, rewards: 0, stakedAt: new Date().toISOString() }];
          });
          addToast(`Successfully staked ${amount.toFixed(4)} ${payoutCoin.ticker}.`, 'success');
          resolve();
      }, 1500));
  };
  
  const unstake = async (amount: number, validatorId: string): Promise<void> => {
    return new Promise((resolve, reject) => setTimeout(() => {
        const position = stakedPositions.find(p => p.validatorId === validatorId);
        if (!position || position.amount < amount) {
            addToast('Insufficient staked balance to unstake.', 'error');
            return reject(new Error('Insufficient staked balance'));
        }

        setStakedPositions(prev => prev.map(p => 
            p.validatorId === validatorId ? { ...p, amount: p.amount - amount, stakedAt: new Date().toISOString() } : p
        ).filter(p => p.amount > 0.000001)); // Remove if empty

        addToast(`Successfully unstaked ${amount.toFixed(4)} ${payoutCoin.ticker}.`, 'success');
        resolve();
    }, 1500));
  };
  
  const claimRewards = async (validatorId: string): Promise<void> => {
      return new Promise((resolve, reject) => setTimeout(() => {
          const position = stakedPositions.find(p => p.validatorId === validatorId);
          if (!position) {
              addToast('No position found for this validator.', 'error');
              return reject(new Error('No position found'));
          }

          // Recalculate rewards one last time before claiming
          const now = Date.now();
          const stakedAt = new Date(position.stakedAt).getTime();
          const secondsSinceLastUpdate = (now - stakedAt) / 1000;
          const apyPerSecond = payoutCoin.apy / (365 * 24 * 60 * 60);
          const earned = position.amount * apyPerSecond * secondsSinceLastUpdate;
          const totalRewardsToClaim = position.rewards + earned;

          if (totalRewardsToClaim <= 0) {
              addToast('No rewards to claim.', 'info');
              return reject(new Error('No rewards to claim'));
          }
          
          setStakedPositions(prev => prev.map(p => 
              p.validatorId === validatorId ? { ...p, rewards: 0, amount: p.amount + totalRewardsToClaim, stakedAt: new Date().toISOString() } : p
          )); // Compounding rewards
          
          addToast(`Claimed and re-staked ${totalRewardsToClaim.toFixed(6)} ${payoutCoin.ticker}.`, 'success');
          resolve();
      }, 1000));
  };


  return {
    stakedBalance,
    claimableRewards,
    stakedPositions,
    stake,
    unstake,
    claimRewards,
  };
};
