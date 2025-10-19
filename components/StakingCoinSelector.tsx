import React, { useContext, useState, useRef, useEffect } from 'react';
import { AppContext } from '../App';
import { ChevronDownIcon, CheckIcon } from './Icons';

const StakingCoinSelector: React.FC = () => {
  const { settings, setSettings, payoutCoin, allStakingCoins } = useContext(AppContext);
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const handleCoinSelect = (coinId: string) => {
    setSettings(prev => ({ ...prev, selectedStakingCoinId: coinId }));
    setIsOpen(false);
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [wrapperRef]);

  return (
    <div className="relative" ref={wrapperRef}>
      <label className="block text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary text-center md:text-left">
        Payout & Stake In
      </label>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="mt-1 relative w-full bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm"
      >
        <span className="flex items-center">
          <img src={payoutCoin.logo} alt="" className="h-6 w-6 rounded-full" />
          <span className="ml-3 block truncate font-semibold">{payoutCoin.name} ({payoutCoin.ticker})</span>
        </span>
        <span className="ml-3 absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
          <ChevronDownIcon className="h-5 w-5 text-gray-400" />
        </span>
      </button>

      {isOpen && (
        <div className="absolute mt-1 w-full rounded-md bg-light-card dark:bg-dark-card shadow-lg z-10 border border-light-border dark:border-dark-border">
          <ul className="max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
            {allStakingCoins.map(coin => (
              <li
                key={coin.id}
                onClick={() => handleCoinSelect(coin.id)}
                className="text-light-text dark:text-dark-text cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center justify-between"
              >
                <div className="flex items-center">
                  <img src={coin.logo} alt="" className="h-6 w-6 rounded-full" />
                  <div className="ml-3">
                    <p className={`block truncate ${settings.selectedStakingCoinId === coin.id ? 'font-semibold' : 'font-normal'}`}>
                      {coin.name} ({coin.ticker})
                    </p>
                    <p className="text-xs text-light-text-secondary dark:text-dark-text-secondary">
                      Network: {coin.network} | APY: ~{(coin.apy * 100).toFixed(1)}%
                    </p>
                  </div>
                </div>
                {settings.selectedStakingCoinId === coin.id && (
                    <CheckIcon className="h-5 w-5 text-primary" />
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default StakingCoinSelector;