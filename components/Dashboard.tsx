import React, { useContext, useState } from 'react';
import { AppContext } from '../App';
import StatCard from './StatCard';
import HashrateChart from './HashrateChart';
import CoinSelector from './CoinSelector';
import { PowerIcon, CpuChipIcon, ServerIcon, CheckIcon, CodeBracketIcon, WalletIcon, ClipboardIcon, ArrowPathRoundedSquareIcon, HashtagIcon } from './Icons';
import LogsConsole from './LogsConsole';
import NetworkStats from './NetworkStats';
import PayoutManager from './PayoutManager';
import { MINING_POOLS } from '../constants';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);


const PoolStats: React.FC = () => {
    const { poolStats, isPoolStatsLoading, refreshPoolStats, selectedPayoutCoin } = useContext(AppContext);

    const formatPoolHashrate = (hashrate?: number) => {
        if (typeof hashrate !== 'number') return 'N/A';
        if (hashrate === 0) return '0.00 H/s';
        if (hashrate < 1000) return `${hashrate.toFixed(2)} H/s`;
        if (hashrate < 1000 * 1000) return `${(hashrate / 1000).toFixed(2)} KH/s`;
        if (hashrate < 1000 * 1000 * 1000) return `${(hashrate / (1000 * 1000)).toFixed(2)} MH/s`;
        return `${(hashrate / (1000 * 1000 * 1000)).toFixed(2)} GH/s`;
    };
    
    return (
        <div className="bg-light-card dark:bg-dark-card p-4 rounded-lg shadow-lg">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-base">Live Pool Stats</h3>
                <button onClick={refreshPoolStats} disabled={isPoolStatsLoading} className="p-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-wait">
                    <ArrowPathRoundedSquareIcon className={`w-5 h-5 text-light-text-secondary dark:text-dark-text-secondary ${isPoolStatsLoading ? 'animate-spin' : ''}`} />
                </button>
            </div>
            {!poolStats && !isPoolStatsLoading ? (
                 <div className="text-center py-4 text-sm text-light-text-secondary dark:text-dark-text-secondary">
                    <p>No data from pool.</p>
                    <p className="text-xs">Ensure your wallet address is correct and you have started mining.</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                    <div className="flex items-center space-x-3">
                        <HashtagIcon className="w-7 h-7 text-light-text-secondary dark:text-dark-text-secondary flex-shrink-0"/>
                        <div>
                            <p className="text-xs text-light-text-secondary dark:text-dark-text-secondary">Pool Hashrate</p>
                            <p className="font-bold text-light-text dark:text-dark-text">{formatPoolHashrate(poolStats?.hashrate)}</p>
                        </div>
                    </div>
                     <div className="flex items-center space-x-3">
                        <WalletIcon className="w-7 h-7 text-light-text-secondary dark:text-dark-text-secondary flex-shrink-0"/>
                        <div>
                            <p className="text-xs text-light-text-secondary dark:text-dark-text-secondary">Unpaid Balance</p>
                            <p className="font-bold text-light-text dark:text-dark-text">{(poolStats?.unpaidBalance || 0).toFixed(6)} {selectedPayoutCoin.ticker}</p>
                        </div>
                    </div>
                     <div className="flex items-center space-x-3">
                        <ServerIcon className="w-7 h-7 text-light-text-secondary dark:text-dark-text-secondary flex-shrink-0"/>
                        <div>
                            <p className="text-xs text-light-text-secondary dark:text-dark-text-secondary">Workers Online</p>
                            <p className="font-bold text-light-text dark:text-dark-text">{poolStats?.workersOnline ?? 'N/A'}</p>
                        </div>
                    </div>
                     <div className="flex items-center space-x-3">
                        <CheckIcon className="w-7 h-7 text-light-text-secondary dark:text-dark-text-secondary flex-shrink-0"/>
                        <div>
                            <p className="text-xs text-light-text-secondary dark:text-dark-text-secondary">Last Share</p>
                            <p className="font-bold text-light-text dark:text-dark-text">{poolStats?.lastShare ? dayjs.unix(poolStats.lastShare).fromNow() : 'N/A'}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

const CommandLinePreview: React.FC = () => {
    const { currentUser, selectedCoin } = useContext(AppContext);
    const settings = currentUser.settings;
    const [copyText, setCopyText] = useState('Copy');

    const selectedMiner = settings.minerPaths.find(p => p.id === settings.selectedMinerPathId);

    const generateCommand = () => {
        if (!selectedMiner || !settings.selectedServerUrl || !settings.walletAddress) {
            return "Please complete your configuration in Settings to see the command preview.";
        }

        let command = selectedCoin.commandLineArgs;
        command = command.replace('{POOL_URL}', settings.selectedServerUrl);
        command = command.replace('{WALLET}', settings.walletAddress);
        command = command.replace('{WORKER_NAME}', settings.workerName);

        return `"${selectedMiner.path}" ${command}`;
    };
    
    const command = generateCommand();

    const handleCopy = () => {
        navigator.clipboard.writeText(command).then(() => {
            setCopyText('Copied!');
            setTimeout(() => setCopyText('Copy'), 2000);
        });
    };

    return (
        <div className="bg-light-card dark:bg-dark-card p-6 rounded-lg shadow-lg">
            <h3 className="font-semibold text-lg mb-4">Command Line Preview</h3>
            <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary mb-3">
                This is the actual command that will be executed by the application to start the miner you configured in Settings.
            </p>
            <div className="relative">
                <pre className="bg-gray-900 dark:bg-black text-gray-300 p-4 rounded-md text-xs font-mono overflow-x-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
                    <code>{command}</code>
                </pre>
                <button 
                    onClick={handleCopy}
                    title="Copy Command"
                    disabled={command.startsWith("Please complete")}
                    className="absolute top-2 right-2 p-1.5 text-xs font-semibold rounded-md bg-gray-700 hover:bg-gray-600 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {copyText === 'Copy' ? <ClipboardIcon className="w-4 h-4" /> : <CheckIcon className="w-4 h-4 text-green-400" />}
                </button>
            </div>
        </div>
    );
};


const Dashboard: React.FC = () => {
  const { 
    settings, 
    selectedCoin,
    isMining,
    isStarting,
    hashrate,
    miningChartData,
    acceptedShares,
    rejectedShares,
    miningLogs,
    startMining,
    stopMining,
  } = useContext(AppContext);
  const [configError, setConfigError] = useState('');
  
  const selectedMiner = settings.minerPaths.find(p => p.id === settings.selectedMinerPathId);

  const handleStartMining = async () => {
      const success = await startMining();
      if (!success) {
          if (settings.walletAddress.trim() === '') {
            setConfigError('Please set your payout wallet address in the Settings page.');
          } else if (settings.selectedServerUrl.trim() === '') {
            setConfigError('Please configure a mining pool and server in the Settings page.');
          } else if (!selectedMiner) {
            setConfigError('Please select a miner executable in the Settings page.');
          }
      } else {
          setConfigError('');
      }
  }

  const tickerForPools = selectedCoin.mineableTicker || selectedCoin.ticker;
  const selectedPool = MINING_POOLS.find(p => p.id === settings.selectedPoolId);
  const selectedServer = selectedPool?.serversByCoin[tickerForPools]?.find(s => s.url === settings.selectedServerUrl);
  const poolInfo = selectedPool ? `${selectedPool.name} (${selectedServer?.region || 'N/A'})` : 'Not Configured';
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Status">
            <div className={`text-lg font-bold flex items-center ${isMining ? 'text-green-500' : isStarting ? 'text-yellow-500' : 'text-red-500'}`}>
                <span className={`h-3 w-3 rounded-full mr-2 ${isMining ? 'bg-green-500 animate-pulse-fast' : isStarting ? 'bg-yellow-500 animate-pulse-fast' : 'bg-red-500'}`}></span>
                {isMining ? 'Mining' : isStarting ? 'Starting...' : 'Stopped'}
            </div>
        </StatCard>
        <StatCard title="Local Hashrate">
            <div className="text-lg font-bold text-primary">{isMining ? hashrate.toFixed(2) : '0.00'} <span className="text-sm text-light-text-secondary dark:text-dark-text-secondary">MH/s</span></div>
        </StatCard>
        <StatCard title="Accepted Shares">
            <div className="text-lg font-bold text-green-500">{acceptedShares}</div>
        </StatCard>
        <StatCard title="Rejected Shares">
            <div className={`text-lg font-bold ${rejectedShares > 0 ? 'text-red-500' : ''}`}>{rejectedShares}</div>
        </StatCard>
      </div>
      
      <PoolStats />
      <NetworkStats />

      <div className="bg-light-card dark:bg-dark-card p-4 rounded-lg shadow-lg">
        <h3 className="font-semibold mb-4">Live Performance (Local)</h3>
        <HashrateChart data={miningChartData} isMining={isMining} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-light-card dark:bg-dark-card p-6 rounded-lg shadow-lg space-y-4">
            <h3 className="font-semibold text-lg">Configuration</h3>
            <CoinSelector />
             <div className="flex items-center justify-between pt-2">
                <div className="text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary truncate">
                    <WalletIcon className="h-5 w-5 mr-2 inline-block" />
                    <span className="font-mono text-xs text-light-text dark:text-dark-text" title={settings.walletAddress}>{settings.walletAddress || 'No Wallet Set'}</span>
                </div>
                <div className="flex items-center text-green-500 text-sm flex-shrink-0 ml-4">
                    <CheckIcon className="h-5 w-5 mr-1" />
                    <span>Pool: {poolInfo}</span>
                </div>
             </div>
             <div className="flex items-center justify-between pt-2">
                 <p className="text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary">
                  Worker: <span className="font-semibold text-light-text dark:text-dark-text">{settings.workerName}</span>
                </p>
                <p className="text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary">
                  Algorithm: <span className="font-semibold text-light-text dark:text-dark-text">{selectedCoin.algorithm}</span>
                </p>
             </div>
             {configError && <p className="mt-2 text-sm text-red-600 text-center">{configError}</p>}
        </div>
        <div className="bg-light-card dark:bg-dark-card p-6 rounded-lg shadow-lg flex flex-col justify-between">
            <h3 className="font-semibold text-lg mb-4">Controls</h3>
            <div className="flex-grow space-y-4">
              <div className="flex items-center text-sm">
                <CpuChipIcon className="w-5 h-5 mr-2 text-light-text-secondary dark:text-dark-text-secondary"/> Device: {settings.device}
              </div>
              <div className="flex items-center text-sm">
                <ServerIcon className="w-5 h-5 mr-2 text-light-text-secondary dark:text-dark-text-secondary"/> Intensity: {settings.intensity}
              </div>
              <div className="flex items-center text-sm">
                <CodeBracketIcon className="w-5 h-5 mr-2 text-light-text-secondary dark:text-dark-text-secondary"/> Miner: {selectedMiner ? selectedMiner.name : 'Not Set'}
              </div>
            </div>
            <button
                onClick={isMining ? stopMining : handleStartMining}
                disabled={isStarting}
                className={`w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${isMining ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500' : 'bg-primary hover:bg-primary-focus focus:ring-emerald-500'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-light-card dark:focus:ring-offset-dark-card transition-colors duration-200 disabled:bg-gray-500 disabled:cursor-wait`}
            >
                <PowerIcon className="w-5 h-5 mr-2"/>
                {isMining ? 'Stop Mining' : isStarting ? 'Starting...' : 'Start Mining'}
            </button>
        </div>
      </div>
        
      <PayoutManager />
      
      <CommandLinePreview />

      <div className="bg-light-card dark:bg-dark-card p-6 rounded-lg shadow-lg">
          <h3 className="font-semibold text-lg mb-4">Miner Logs</h3>
          <LogsConsole logs={miningLogs} />
      </div>
    </div>
  );
};

export default Dashboard;