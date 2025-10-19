import React, { useContext, useState, useRef, useEffect } from 'react';
import { AppContext } from '../App';
import { ChevronDownIcon, CheckIcon } from './Icons';

const ValidatorSelector: React.FC = () => {
  const { validators, selectedValidatorId, setSelectedValidatorId, payoutCoin } = useContext(AppContext);
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const selectedValidator = validators.find(v => v.id === selectedValidatorId);

  const handleValidatorSelect = (validatorId: string) => {
    setSelectedValidatorId(validatorId);
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
  
  if (validators.length === 0) {
      return (
        <div>
            <label className="block text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary">Select Validator</label>
            <div className="mt-1 h-10 flex items-center justify-center bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border rounded-md">
                <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">No validators available for {payoutCoin.name}</p>
            </div>
        </div>
      )
  }

  return (
    <div className="relative" ref={wrapperRef}>
      <label className="block text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary">
        Select Validator
      </label>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="mt-1 relative w-full bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm"
      >
        {selectedValidator ? (
            <span className="flex items-center">
            <img src={selectedValidator.logo} alt="" className="h-6 w-6 rounded-full" />
            <span className="ml-3 block truncate font-semibold">{selectedValidator.name}</span>
            <span className="ml-auto text-xs text-light-text-secondary dark:text-dark-text-secondary">
                Comm: {(selectedValidator.commission * 100).toFixed(0)}%
            </span>
            </span>
        ) : (
             <span className="block truncate">Select a validator...</span>
        )}
        <span className="ml-3 absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
          <ChevronDownIcon className="h-5 w-5 text-gray-400" />
        </span>
      </button>

      {isOpen && (
        <div className="absolute mt-1 w-full rounded-md bg-light-card dark:bg-dark-card shadow-lg z-10 border border-light-border dark:border-dark-border">
          <ul className="max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
            {validators.map(validator => (
              <li
                key={validator.id}
                onClick={() => handleValidatorSelect(validator.id)}
                className="text-light-text dark:text-dark-text cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center justify-between"
              >
                <div className="flex items-center">
                  <img src={validator.logo} alt="" className="h-6 w-6 rounded-full" />
                  <div className="ml-3">
                    <p className={`block truncate font-medium ${selectedValidatorId === validator.id ? 'font-semibold' : 'font-normal'}`}>
                        {validator.name}
                    </p>
                    <p className="text-xs text-light-text-secondary dark:text-dark-text-secondary">
                        Commission: {(validator.commission * 100).toFixed(0)}% | Power: {validator.votingPower}%
                    </p>
                  </div>
                </div>
                {selectedValidatorId === validator.id && (
                    <CheckIcon className="h-5 w-5 text-primary ml-auto" />
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ValidatorSelector;