
import React, { useContext, useState } from 'react';
import { AppContext } from '../App';
import StakingCoinSelector from './PayoutCoinSelector'; // Using PayoutCoinSelector as it lists stakeable coins
import ValidatorSelector from './ValidatorSelector';
import StatCard from './StatCard';
import { ArrowPathRoundedSquareIcon } from './Icons';

const StakingPage: React.FC = () => {
  const {
    payoutCoin,
    walletBalance,
    stakedBalance,
    claimableRewards,
    stake,
    unstake,
    claimRewards,
    selectedValidatorId,
    validators,
  } = useContext(AppContext);

  const [amount, setAmount] = useState('');
  const [isStaking, setIsStaking] = useState(true); // true for stake, false for unstake
  const [isLoading, setIsLoading] = useState(false);

  const selectedValidator = validators.find(v => v.id === selectedValidatorId);
  const valueStakedUSD = (stakedBalance * (payoutCoin.price || 0)).toFixed(2);
  const rewardsValueUSD = (claimableRewards * (payoutCoin.price || 0)).toFixed(2);
  
  const handleAction = async () => {
      const numericAmount = parseFloat(amount);
      if (isNaN(numericAmount) || numericAmount <= 0 || !selectedValidatorId) {
          return;
      }
      setIsLoading(true);
      try {
          if (isStaking) {
              await stake(numericAmount, selectedValidatorId);
          } else {
              await unstake(numericAmount, selectedValidatorId);
          }
          setAmount('');
      } catch (error) {
          console.error(error);
      } finally {
          setIsLoading(false);
      }
  };
  
  const handleClaim = async () => {
      if(!selectedValidatorId || claimableRewards <= 0) return;
      setIsLoading(true);
      try {
          await claimRewards(selectedValidatorId);
      } catch (error) {
          console.error(error);
      } finally {
          setIsLoading(false);
      }
  }

  const maxAmount = isStaking ? walletBalance : (stakedBalance || 0);

  return (
    <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex items-center space-x-4">
            <ArrowPathRoundedSquareIcon className="w-10 h-10 text-primary" />
            <div>
                <h1 className="text-3xl font-bold">Staking</h1>
                <p className="text-light-text-secondary dark:text-dark-text-secondary">Earn passive rewards by staking your {payoutCoin.name}.</p>
            </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard title="Staked Balance">
                <p className="text-2xl font-bold">{stakedBalance.toFixed(6)} <span className="text-lg font-normal">{payoutCoin.ticker}</span></p>
                <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">~${valueStakedUSD} USD</p>
            </StatCard>
            <StatCard title="Claimable Rewards">
                <p className="text-2xl font-bold">{claimableRewards.toFixed(6)} <span className="text-lg font-normal">{payoutCoin.ticker}</span></p>
                 <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">~${rewardsValueUSD} USD</p>
            </StatCard>
             <StatCard title="Estimated APY">
                 <p className="text-2xl font-bold text-primary">{(payoutCoin.apy * 100).toFixed(2)}%</p>
                 <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">Varies by validator</p>
            </StatCard>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-light-card dark:bg-dark-card p-6 rounded-lg shadow-lg space-y-4">
                <h2 className="text-xl font-semibold">Stake or Unstake</h2>
                <StakingCoinSelector />
                <ValidatorSelector />

                <div>
                    <div className="flex justify-center rounded-md bg-light-bg dark:bg-dark-bg p-1 my-4">
                        <button onClick={() => setIsStaking(true)} className={`${isStaking ? 'bg-primary text-primary-content' : 'hover:bg-gray-300 dark:hover:bg-gray-700'} w-full py-2 rounded-md font-semibold transition-colors`}>Stake</button>
                        <button onClick={() => setIsStaking(false)} className={`${!isStaking ? 'bg-primary text-primary-content' : 'hover:bg-gray-300 dark:hover:bg-gray-700'} w-full py-2 rounded-md font-semibold transition-colors`}>Unstake</button>
                    </div>

                     <div>
                        <label htmlFor="amount" className="block text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary">Amount</label>
                        <div className="relative mt-1">
                            <input
                                type="number"
                                id="amount"
                                value={amount}
                                onChange={e => setAmount(e.target.value)}
                                placeholder="0.00"
                                className="w-full input-style pr-16"
                            />
                            <button onClick={() => setAmount(maxAmount.toFixed(6))} className="absolute inset-y-0 right-0 px-4 text-sm font-medium text-primary hover:text-primary-focus">Max</button>
                        </div>
                        <p className="text-xs text-light-text-secondary dark:text-dark-text-secondary mt-1">Available to {isStaking ? 'Stake' : 'Unstake'}: {maxAmount.toFixed(6)} {payoutCoin.ticker}</p>
                    </div>
                </div>
                
                <button onClick={handleAction} disabled={isLoading || !selectedValidator} className="w-full py-3 bg-secondary text-white rounded-md hover:bg-blue-600 font-semibold transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed">
                    {isLoading ? 'Processing...' : (isStaking ? 'Stake Now' : 'Unstake Now')}
                </button>
            </div>

            <div className="bg-light-card dark:bg-dark-card p-6 rounded-lg shadow-lg space-y-4">
                <h2 className="text-xl font-semibold">My Positions</h2>
                <div className="max-h-80 overflow-y-auto space-y-3 pr-2">
                    {stakedBalance > 0 && selectedValidator ? (
                         <div className="p-4 bg-light-bg dark:bg-dark-bg rounded-lg">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <img src={selectedValidator?.logo} alt={selectedValidator?.name} className="w-8 h-8 rounded-full mr-3" />
                                    <div>
                                        <p className="font-semibold">{selectedValidator?.name || 'No Validator Selected'}</p>
                                        <p className="text-xs text-light-text-secondary dark:text-dark-text-secondary">Commission: {selectedValidator ? (selectedValidator.commission * 100).toFixed(1) + '%' : 'N/A'}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold">{stakedBalance.toFixed(6)} {payoutCoin.ticker}</p>
                                    <p className="text-xs text-light-text-secondary dark:text-dark-text-secondary">Rewards: {claimableRewards.toFixed(6)}</p>
                                </div>
                            </div>
                             <button onClick={handleClaim} disabled={isLoading || claimableRewards <= 0} className="mt-4 w-full py-2 bg-primary text-primary-content text-sm rounded-md hover:bg-primary-focus disabled:bg-gray-500">
                                 {isLoading ? 'Claiming...' : 'Claim & Compound Rewards'}
                            </button>
                         </div>
                    ) : (
                        <div className="text-center py-10 text-light-text-secondary dark:text-dark-text-secondary">
                            <p>You have no active staking positions for {payoutCoin.name}.</p>
                            <p className="text-sm mt-1">Start by staking some tokens in the panel on the left.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>

    </div>
  );
};

export default StakingPage;
