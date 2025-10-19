import React, { useContext } from 'react';
import { AppContext } from '../App';
import { GlobeAltIcon, ClockIcon, CubeIcon, HashtagIcon } from './Icons';

const NetworkStats: React.FC = () => {
    const { selectedCoin } = useContext(AppContext);

    const formatHashrate = (hashrate?: number) => {
        if (typeof hashrate !== 'number') return 'N/A';
        if (hashrate >= 1000 * 1000 * 1000) return `${(hashrate / (1000 * 1000 * 1000)).toFixed(2)} EH/s`;
        if (hashrate >= 1000 * 1000) return `${(hashrate / (1000 * 1000)).toFixed(2)} TH/s`;
        if (hashrate >= 1000) return `${(hashrate / 1000).toFixed(2)} GH/s`;
        return `${hashrate.toFixed(2)} MH/s`;
    };

    return (
        <div className="bg-light-card dark:bg-dark-card p-4 rounded-lg shadow-lg">
            <h3 className="font-semibold mb-4 text-base">
                <span className="text-primary">{selectedCoin.name}</span> Blockchain Stats
            </h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                <div className="flex items-center space-x-3">
                    <GlobeAltIcon className="w-7 h-7 text-light-text-secondary dark:text-dark-text-secondary flex-shrink-0"/>
                    <div>
                        <p className="text-xs text-light-text-secondary dark:text-dark-text-secondary">Algorithm</p>
                        <p className="font-bold text-light-text dark:text-dark-text">{selectedCoin.algorithm}</p>
                    </div>
                </div>
                <div className="flex items-center space-x-3">
                    <ClockIcon className="w-7 h-7 text-light-text-secondary dark:text-dark-text-secondary flex-shrink-0"/>
                    <div>
                        <p className="text-xs text-light-text-secondary dark:text-dark-text-secondary">Avg. Block Time</p>
                        <p className="font-bold text-light-text dark:text-dark-text">{selectedCoin.blockTime ? `${selectedCoin.blockTime}s` : 'N/A'}</p>
                    </div>
                </div>
                <div className="flex items-center space-x-3">
                    <CubeIcon className="w-7 h-7 text-light-text-secondary dark:text-dark-text-secondary flex-shrink-0"/>
                    <div>
                        <p className="text-xs text-light-text-secondary dark:text-dark-text-secondary">Block Reward</p>
                        <p className="font-bold text-light-text dark:text-dark-text">{selectedCoin.blockReward ? `${selectedCoin.blockReward} ${selectedCoin.ticker}` : 'N/A'}</p>
                    </div>
                </div>
                <div className="flex items-center space-x-3">
                    <HashtagIcon className="w-7 h-7 text-light-text-secondary dark:text-dark-text-secondary flex-shrink-0"/>
                    <div>
                        <p className="text-xs text-light-text-secondary dark:text-dark-text-secondary">Network Hashrate</p>
                        <p className="font-bold text-light-text dark:text-dark-text">{formatHashrate(selectedCoin.networkHashrate)}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default NetworkStats;
