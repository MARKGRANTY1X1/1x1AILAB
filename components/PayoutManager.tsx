import React, { useContext } from 'react';
import { AppContext } from '../App';
import { ArrowRightIcon, ShieldCheckIcon, WalletIcon } from './Icons';
import PayoutCoinSelector from './PayoutCoinSelector';

const PayoutManager: React.FC = () => {
  const { 
    settings,
    selectedCoin, 
    selectedPayoutCoin,
    poolStats,
   } = useContext(AppContext);

   const unpaidBalance = poolStats?.unpaidBalance || 0;
   const claimableValueUSD = (unpaidBalance * (selectedPayoutCoin.price ?? 0)).toFixed(2);

  return (
    <div className="bg-light-card dark:bg-dark-card p-6 rounded-lg shadow-lg">
        <h3 className="font-semibold text-lg mb-4">Payout Configuration</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            
            {/* From Coin */}
            <div className="flex flex-col items-center md:items-start text-center md:text-left">
                <p className="text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary">Unpaid Pool Balance</p>
                <div className="flex items-center mt-2">
                    <img src={selectedCoin.logo} alt={selectedCoin.name} className="w-8 h-8 rounded-full mr-3" />
                    <div>
                        <p className="text-xl font-bold">{unpaidBalance.toFixed(6)} <span className="text-sm font-normal">{selectedPayoutCoin.ticker}</span></p>
                        <p className="text-xs text-light-text-secondary dark:text-dark-text-secondary">~${claimableValueUSD} USD</p>
                    </div>
                </div>
                <p className="text-xs text-light-text-secondary dark:text-dark-text-secondary mt-2">Mined with {selectedCoin.name}</p>
            </div>
            
            {/* Arrow & Action */}
            <div className="flex flex-col items-center">
                 <ArrowRightIcon className="w-8 h-8 text-light-text-secondary dark:text-dark-text-secondary hidden md:block" />
                 <PayoutCoinSelector />
            </div>

            {/* To Payout Address */}
            <div className="flex flex-col items-center md:items-end text-center md:text-right">
                <p className="text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary">Payout Address</p>
                <div className="flex items-center mt-2">
                    <WalletIcon className="w-8 h-8 text-light-text-secondary dark:text-dark-text-secondary mr-3 md:mr-0 md:ml-3 md:order-2 flex-shrink-0" />
                     <div className="md:text-right">
                        <p className="text-lg font-bold font-mono text-light-text dark:text-dark-text truncate max-w-[200px]" title={settings.walletAddress}>
                            {settings.walletAddress || 'Not Set'}
                        </p>
                        <p className="text-xs text-light-text-secondary dark:text-dark-text-secondary">
                            Configure in Settings
                        </p>
                    </div>
                </div>
                 <div className="flex items-center space-x-2 mt-4 text-center md:text-right">
                    <ShieldCheckIcon className="w-5 h-5 text-primary flex-shrink-0" />
                    <p className="text-xs text-light-text-secondary dark:text-dark-text-secondary">
                        Payout is automatic from the pool once the minimum threshold is met.
                    </p>
                 </div>
            </div>
        </div>
    </div>
  );
};

export default PayoutManager;