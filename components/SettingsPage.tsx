import React, { useContext, useState, useMemo, useEffect } from 'react';
import { AppContext } from '../App';
import { MiningDevice, MiningIntensity } from '../types';
import { TrashIcon, PlusCircleIcon, MagnifyingGlassIcon } from './Icons';
import { MINING_POOLS } from '../constants';
import { useToast } from '../contexts/ToastContext';
import * as backendAPI from '../services/electronAPI';

const SettingsPage: React.FC = () => {
  const { currentUser, setSettings, selectedCoin } = useContext(AppContext);
  const { settings } = currentUser;
  const { addToast } = useToast();

  const [localSettings, setLocalSettings] = useState(settings);
  const [isScanning, setIsScanning] = useState(false);

  // When the original settings from context change (e.g., user logs out, another user logs in),
  // reset the local editing state to match.
  useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  const [newMinerName, setNewMinerName] = useState('');
  const [newMinerPath, setNewMinerPath] = useState('');
  const [minerError, setMinerError] = useState('');

  const hasChanges = useMemo(() => JSON.stringify(localSettings) !== JSON.stringify(settings), [localSettings, settings]);
  const tickerForPools = useMemo(() => selectedCoin.mineableTicker || selectedCoin.ticker, [selectedCoin]);


  const handleSettingChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setLocalSettings(prev => ({ ...prev, [id]: value }));
  };
  
  const handleBackgroundMiningToggle = () => {
      setLocalSettings(prev => ({...prev, backgroundMining: !prev.backgroundMining}));
  }
  
    const handleBrowseMiner = async () => {
        const path = await backendAPI.selectMinerPath();
        if (path) {
            setNewMinerPath(path);
            // Auto-fill name as a UX improvement
            const fileName = path.split('\\').pop()?.split('/').pop() || ''; // Handles both / and \
            const minerName = fileName.split('.')[0]; // Remove extension
            if (minerName) {
                setNewMinerName(minerName);
            }
        }
    }

  const handleAddNewMiner = () => {
    if (!newMinerName.trim() || !newMinerPath.trim()) {
        setMinerError('Both miner name and path are required.');
        return;
    }
    const newMiner = {
        id: Date.now().toString(),
        name: newMinerName.trim(),
        path: newMinerPath.trim()
    };
    
    const updatedPaths = [...localSettings.minerPaths, newMiner];
    const newSelectedId = localSettings.selectedMinerPathId === null ? newMiner.id : localSettings.selectedMinerPathId;

    setLocalSettings(prev => ({
        ...prev,
        minerPaths: updatedPaths,
        selectedMinerPathId: newSelectedId
    }));

    setNewMinerName('');
    setNewMinerPath('');
    setMinerError('');
  }
  
  const handleDeleteMiner = (idToDelete: string) => {
    const remainingPaths = localSettings.minerPaths.filter(p => p.id !== idToDelete);
    let newSelectedId = localSettings.selectedMinerPathId;
    if (newSelectedId === idToDelete) {
        newSelectedId = remainingPaths.length > 0 ? remainingPaths[0].id : null;
    }
    setLocalSettings(prev => ({
        ...prev,
        minerPaths: remainingPaths,
        selectedMinerPathId: newSelectedId
    }));
  }

  const handleScanForMiners = async () => {
    setIsScanning(true);
    addToast('Scanning for miners, this may take a moment...', 'info');
    const foundMiners = await backendAPI.scanForMiners();
    setIsScanning(false);
    
    const currentPaths = new Set(localSettings.minerPaths.map(m => m.path));
    const newMiners = foundMiners.filter(m => !currentPaths.has(m.path));

    if (newMiners.length > 0) {
        setLocalSettings(prev => ({
            ...prev,
            minerPaths: [...prev.minerPaths, ...newMiners]
        }));
        addToast(`Found ${newMiners.length} new miner(s)!`, 'success');
    } else {
        addToast('No new miners were found on your system.', 'info');
    }
  };


  const exportData = (filename: string, data: object) => {
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const selectedPool = MINING_POOLS.find(p => p.id === localSettings.selectedPoolId);
  const availableServers = selectedPool?.serversByCoin[tickerForPools] || [];

  const handlePoolChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const newPoolId = e.target.value;
      const newPool = MINING_POOLS.find(p => p.id === newPoolId);
      const newServerUrl = newPool?.serversByCoin[tickerForPools]?.[0]?.url || '';
      setLocalSettings(prev => ({
          ...prev,
          selectedPoolId: newPoolId,
          selectedServerUrl: newServerUrl,
      }));
  }

  const handleSaveChanges = () => {
      setSettings(localSettings);
      addToast('Settings have been saved!', 'success');
  };

  const handleDiscardChanges = () => {
      setLocalSettings(settings);
      addToast('Changes have been discarded.', 'info');
  };
  
  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-24">
        <h1 className="text-3xl font-bold">Settings</h1>

        <div className="bg-light-card dark:bg-dark-card p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4 border-b border-light-border dark:border-dark-border pb-2">Account Information</h2>
            <div className="space-y-2 text-sm">
                <div className="flex"><p className="w-24 font-medium text-light-text-secondary dark:text-dark-text-secondary">Username:</p> <p>{currentUser.username}</p></div>
                <div className="flex"><p className="w-24 font-medium text-light-text-secondary dark:text-dark-text-secondary">Email:</p> <p>{currentUser.email}</p></div>
                <div className="flex"><p className="w-24 font-medium text-light-text-secondary dark:text-dark-text-secondary">Role:</p> <p className="capitalize">{currentUser.role}</p></div>
            </div>
        </div>
        
        <div className="bg-light-card dark:bg-dark-card p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4 border-b border-light-border dark:border-dark-border pb-2">Pool & Miner Configuration</h2>
            <div className="space-y-4">
                <div>
                    <label htmlFor="walletAddress" className="block text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary">Payout Wallet Address</label>
                    <input 
                        type="text" 
                        id="walletAddress" 
                        value={localSettings.walletAddress} 
                        onChange={handleSettingChange} 
                        placeholder="Enter your external wallet address" 
                        className="mt-1 block w-full px-3 py-2 bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border rounded-md text-sm shadow-sm focus:outline-none focus:ring-primary focus:border-primary font-mono"/>
                    <p className="mt-1 text-xs text-light-text-secondary dark:text-dark-text-secondary">This is where the mining pool will send your earnings. The app does not manage your private keys.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="selectedPoolId" className="block text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary">Mining Pool</label>
                        <select id="selectedPoolId" value={localSettings.selectedPoolId} onChange={handlePoolChange} className="mt-1 block w-full px-3 py-2 bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border rounded-md text-sm shadow-sm focus:outline-none focus:ring-primary focus:border-primary">
                            {MINING_POOLS.map(pool => {
                                const isCompatible = !!pool.serversByCoin[tickerForPools];
                                return (
                                    <option 
                                        key={pool.id} 
                                        value={pool.id}
                                        disabled={!isCompatible}
                                        className={!isCompatible ? 'text-gray-400 dark:text-gray-600' : ''}
                                    >
                                        {pool.name} {!isCompatible ? `(not for ${selectedCoin.ticker})` : ''}
                                    </option>
                                );
                            })}
                        </select>
                    </div>
                     <div>
                        <label htmlFor="selectedServerUrl" className="block text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary">Server</label>
                        <select id="selectedServerUrl" name="selectedServerUrl" value={localSettings.selectedServerUrl} onChange={handleSettingChange} className="mt-1 block w-full px-3 py-2 bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border rounded-md text-sm shadow-sm focus:outline-none focus:ring-primary focus:border-primary">
                            {availableServers.length === 0 ? (
                                <option value="" disabled>Select a compatible pool first</option>
                            ) : (
                                availableServers.map(server => (
                                    <option key={server.url} value={server.url}>{server.region} ({server.type})</option>
                                ))
                            )}
                        </select>
                    </div>
                </div>
                 <div>
                    <label htmlFor="workerName" className="block text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary">Worker Name</label>
                    <input type="text" id="workerName" value={localSettings.workerName} onChange={handleSettingChange} placeholder="MyAwesomeRig" className="mt-1 block w-full px-3 py-2 bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border rounded-md text-sm shadow-sm focus:outline-none focus:ring-primary focus:border-primary"/>
                </div>
                <div>
                    <label htmlFor="selectedMinerPathId" className="block text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary">Miner Executable</label>
                    <select id="selectedMinerPathId" value={localSettings.selectedMinerPathId ?? ''} onChange={handleSettingChange} className="mt-1 block w-full pl-3 pr-10 py-2 bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border rounded-md text-sm shadow-sm focus:outline-none focus:ring-primary focus:border-primary">
                        {localSettings.minerPaths.length === 0 ? (
                            <option value="" disabled>Please add a miner below</option>
                        ) : (
                            localSettings.minerPaths.map(miner => (
                                <option key={miner.id} value={miner.id}>{miner.name}</option>
                            ))
                        )}
                    </select>
                </div>
                
                <div className="pt-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-medium">Manage Miners</h3>
                    <button onClick={handleScanForMiners} disabled={isScanning} className="flex items-center px-3 py-1.5 bg-secondary text-white rounded-md hover:bg-blue-600 text-sm disabled:bg-gray-500 disabled:cursor-wait">
                      <MagnifyingGlassIcon className={`w-4 h-4 mr-2 ${isScanning ? 'animate-spin' : ''}`}/>
                      {isScanning ? 'Scanning...' : 'Auto-Scan'}
                    </button>
                  </div>
                  <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
                    {localSettings.minerPaths.length > 0 ? localSettings.minerPaths.map(miner => (
                      <div key={miner.id} className="flex items-center justify-between bg-light-bg dark:bg-dark-bg p-2 rounded-md">
                        <div>
                          <p className="font-semibold text-sm">{miner.name}</p>
                          <p className="font-mono text-xs text-light-text-secondary dark:text-dark-text-secondary">{miner.path}</p>
                        </div>
                        <button onClick={() => handleDeleteMiner(miner.id)} className="text-red-500 hover:text-red-700 p-1">
                          <TrashIcon className="w-5 h-5"/>
                        </button>
                      </div>
                    )) : (
                        <p className="text-sm text-center text-light-text-secondary dark:text-dark-text-secondary py-4">No miners configured. Try the Auto-Scan!</p>
                    )}
                  </div>

                    <div className="mt-4 pt-4 border-t border-light-border dark:border-dark-border">
                        <h4 className="font-medium mb-2">Add New Miner Manually</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="new-miner-name" className="block text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary">Miner Nickname</label>
                                <input id="new-miner-name" type="text" value={newMinerName} onChange={e => setNewMinerName(e.target.value)} placeholder="e.g., T-Rex Miner" className="mt-1 w-full input-style"/>
                            </div>
                            <div>
                                <label htmlFor="new-miner-path" className="block text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary">Path to Executable</label>
                                <div className="mt-1 flex rounded-md shadow-sm">
                                    <input
                                        id="new-miner-path"
                                        type="text"
                                        value={newMinerPath}
                                        onChange={e => setNewMinerPath(e.target.value)}
                                        placeholder="Click Browse to select..."
                                        className="flex-1 block w-full rounded-none rounded-l-md sm:text-sm input-style"
                                    />
                                    <button
                                        type="button"
                                        onClick={handleBrowseMiner}
                                        className="inline-flex items-center px-3 py-2 rounded-r-md border border-l-0 border-light-border dark:border-dark-border bg-gray-200 dark:bg-gray-600 text-sm font-medium hover:bg-gray-300 dark:hover:bg-gray-500"
                                    >
                                        Browse...
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="mt-4 flex justify-end">
                            <button onClick={handleAddNewMiner} className="flex items-center px-4 py-2 bg-primary text-primary-content rounded-md hover:bg-primary-focus">
                                <PlusCircleIcon className="w-5 h-5 mr-2"/>
                                Add Miner
                            </button>
                        </div>
                        {minerError && <p className="mt-2 text-sm text-red-600 text-right">{minerError}</p>}
                   </div>
                </div>
            </div>
        </div>

        <div className="bg-light-card dark:bg-dark-card p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4 border-b border-light-border dark:border-dark-border pb-2">Performance</h2>
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <label htmlFor="device" className="font-medium">Device</label>
                    <select
                        id="device"
                        value={localSettings.device}
                        onChange={handleSettingChange}
                        className="w-48 p-2 bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border rounded-md"
                    >
                        <option value={MiningDevice.CPU}>CPU</option>
                        <option value={MiningDevice.GPU}>GPU</option>
                    </select>
                </div>
                 <div className="flex items-center justify-between">
                    <label htmlFor="intensity" className="font-medium">Intensity</label>
                    <select
                        id="intensity"
                        value={localSettings.intensity}
                        onChange={handleSettingChange}
                        className="w-48 p-2 bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border rounded-md"
                    >
                        <option value={MiningIntensity.Low}>Low</option>
                        <option value={MiningIntensity.Medium}>Medium</option>
                        <option value={MiningIntensity.High}>High</option>
                    </select>
                </div>
                <div className="flex items-center justify-between">
                    <label htmlFor="background-mining" className="font-medium">Background Mining</label>
                    <button
                        onClick={handleBackgroundMiningToggle}
                        className={`${localSettings.backgroundMining ? 'bg-primary' : 'bg-gray-400 dark:bg-gray-600'} relative inline-flex h-6 w-11 items-center rounded-full transition-colors`}
                    >
                        <span className={`${localSettings.backgroundMining ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`} />
                    </button>
                </div>
            </div>
        </div>

        <div className="bg-light-card dark:bg-dark-card p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4 border-b border-light-border dark:border-dark-border pb-2">Data Export</h2>
            <div className="flex items-center space-x-4">
                <button 
                    onClick={() => exportData('mining_settings.json', settings)}
                    className="px-4 py-2 bg-secondary text-white rounded-md hover:bg-blue-600 transition-colors"
                >
                    Export Settings
                </button>
            </div>
        </div>
        
        {hasChanges && (
            <div className="fixed bottom-0 left-64 right-0 bg-light-card dark:bg-dark-card border-t border-light-border dark:border-dark-border p-4 shadow-lg flex justify-end items-center z-10">
                <p className="mr-4 text-sm font-medium text-yellow-600 dark:text-yellow-400">You have unsaved changes.</p>
                <button
                    onClick={handleDiscardChanges}
                    className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-light-text dark:text-dark-text rounded-md hover:bg-gray-300 dark:hover:bg-gray-500 mr-2"
                >
                    Discard
                </button>
                <button
                    onClick={handleSaveChanges}
                    className="px-4 py-2 bg-primary text-primary-content font-bold rounded-md hover:bg-primary-focus"
                >
                    Save Changes
                </button>
            </div>
        )}

    </div>
  );
};

export default SettingsPage;