
import React, { useContext, useState, useRef, useEffect } from 'react';
import { AppContext } from '../App';
import { ChevronDownIcon, CheckIcon, CurrencyQuestionIcon } from './Icons';
import { useToast } from '../contexts/ToastContext';
// FIX: Imported DEFAULT_PAYOUT_COIN_ID to resolve reference error.
import { DEFAULT_PAYOUT_COIN_ID } from '../constants';

const PayoutCoinSelector: React.FC = () => {
  const { settings, setSettings, selectedPayoutCoin, allPayoutCoins } = useContext(AppContext);
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const { addToast } = useToast();

  const [isCustomFormVisible, setIsCustomFormVisible] = useState(settings.selectedPayoutCoinId === 'custom');
  const [customAddress, setCustomAddress] = useState(settings.customPayoutTokenAddress);
  const [customTicker, setCustomTicker] = useState(settings.customPayoutTokenTicker);
  const [customNetwork, setCustomNetwork] = useState(settings.customPayoutTokenNetwork);

  useEffect(() => {
    if (settings.selectedPayoutCoinId !== 'custom') {
      setIsCustomFormVisible(false);
    } else {
      setIsCustomFormVisible(true);
      setCustomAddress(settings.customPayoutTokenAddress);
      setCustomTicker(settings.customPayoutTokenTicker);
      setCustomNetwork(settings.customPayoutTokenNetwork);
    }
  }, [settings.selectedPayoutCoinId, settings.customPayoutTokenAddress, settings.customPayoutTokenTicker, settings.customPayoutTokenNetwork]);

  const handleCoinSelect = (coinId: string) => {
    if (coinId === 'show_custom_form') {
      setIsCustomFormVisible(true);
      setIsOpen(false);
    } else {
      setSettings(prev => ({ ...prev, selectedPayoutCoinId: coinId }));
      setIsCustomFormVisible(false);
      setIsOpen(false);
    }
  };

  const handleSaveCustomToken = () => {
    if (!customAddress.trim() || !customTicker.trim()) {
        addToast('Address and Ticker are required for custom tokens.', 'error');
        return;
    }
    setSettings(prev => ({
        ...prev,
        selectedPayoutCoinId: 'custom',
        customPayoutTokenAddress: customAddress.trim(),
        customPayoutTokenTicker: customTicker.trim(),
        customPayoutTokenNetwork: customNetwork
    }));
    setIsCustomFormVisible(false);
    addToast('Custom payout token saved!', 'success');
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
        Payout Coin
      </label>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="mt-1 relative w-full bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm"
      >
        <span className="flex items-center">
          {selectedPayoutCoin.id === 'custom' ? (
              <CurrencyQuestionIcon className="h-6 w-6 rounded-full text-light-text-secondary dark:text-dark-text-secondary" />
          ) : (
              <img src={selectedPayoutCoin.logo} alt="" className="h-6 w-6 rounded-full" />
          )}
          <span className="ml-3 block truncate font-semibold">{selectedPayoutCoin.name} ({selectedPayoutCoin.ticker})</span>
        </span>
        <span className="ml-3 absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
          <ChevronDownIcon className="h-5 w-5 text-gray-400" />
        </span>
      </button>

      {isOpen && (
        <div className="absolute mt-1 w-full rounded-md bg-light-card dark:bg-dark-card shadow-lg z-10 border border-light-border dark:border-dark-border">
          <ul className="max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
            {allPayoutCoins.map(coin => (
              <li
                key={coin.id}
                onClick={() => handleCoinSelect(coin.id)}
                className="text-light-text dark:text-dark-text cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center justify-between"
              >
                <div className="flex items-center">
                  <img src={coin.logo} alt="" className="h-6 w-6 rounded-full" />
                  <div className="ml-3">
                    <p className={`block truncate ${settings.selectedPayoutCoinId === coin.id ? 'font-semibold' : 'font-normal'}`}>
                      {coin.name} ({coin.ticker})
                    </p>
                    <p className="text-xs text-light-text-secondary dark:text-dark-text-secondary">
                      Network: {coin.network}
                    </p>
                  </div>
                </div>
                {settings.selectedPayoutCoinId === coin.id && (
                    <CheckIcon className="h-5 w-5 text-primary" />
                )}
              </li>
            ))}
             <li
                onClick={() => handleCoinSelect('show_custom_form')}
                className="text-light-text dark:text-dark-text cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center"
              >
                <div className="flex items-center">
                    <CurrencyQuestionIcon className="h-6 w-6 rounded-full" />
                     <span className="ml-3 block truncate font-normal">
                        Enter Custom Token...
                    </span>
                </div>
              </li>
          </ul>
        </div>
      )}
      {isCustomFormVisible && (
        <div className="mt-2 p-3 border border-light-border dark:border-dark-border rounded-md bg-light-bg dark:bg-dark-bg space-y-2">
            <h4 className="font-semibold text-sm">Custom Payout Token</h4>
            <div>
                <label className="block text-xs font-medium text-light-text-secondary dark:text-dark-text-secondary">Token Contract Address</label>
                <input type="text" value={customAddress} onChange={e => setCustomAddress(e.target.value)} placeholder="0x..." className="mt-1 input-style text-xs py-1"/>
            </div>
            <div className="grid grid-cols-2 gap-2">
                <div>
                    <label className="block text-xs font-medium text-light-text-secondary dark:text-dark-text-secondary">Token Ticker</label>
                    <input type="text" value={customTicker} onChange={e => setCustomTicker(e.target.value)} placeholder="e.g. MYT" className="mt-1 input-style text-xs py-1"/>
                </div>
                 <div>
                    <label className="block text-xs font-medium text-light-text-secondary dark:text-dark-text-secondary">Network</label>
                    <select value={customNetwork} onChange={e => setCustomNetwork(e.target.value)} className="mt-1 input-style text-xs py-1">
                        <option>ERC20</option>
                        <option>BEP20</option>
                        <option>SPL</option>
                        <option>Polygon</option>
                    </select>
                </div>
            </div>
            <div className="flex justify-end space-x-2 pt-1">
                <button onClick={() => {
                    setIsCustomFormVisible(false);
                    if (settings.selectedPayoutCoinId === 'custom') {
                        setSettings(prev => ({...prev, selectedPayoutCoinId: DEFAULT_PAYOUT_COIN_ID}))
                    }
                }} className="px-3 py-1 text-xs btn-secondary">Cancel</button>
                <button onClick={handleSaveCustomToken} className="px-3 py-1 text-xs btn-primary">Save</button>
            </div>
        </div>
      )}
    </div>
  );
};

export default PayoutCoinSelector;