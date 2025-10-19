import React, { createContext, useState, useEffect, useMemo, useCallback } from 'react';
import useLocalStorage from './hooks/useLocalStorage';
import { useWalletManager } from './hooks/useWalletManager';
import { useMinerManager } from './hooks/useMinerManager';
import { useStakingEngine } from './hooks/useStakingEngine';
import { useToast, ToastProvider } from './contexts/ToastContext';
import {
  User, AppSettings, Coin, PayoutCoin, ChartDataPoint, LogEntry,
  MiningDevice, MiningIntensity, Validator, PoolStats, StakedPosition, Wallet, Transaction
} from './types';
import { DEFAULT_COINS, PAYOUT_COINS, INITIAL_USERS, DEFAULT_SETTINGS, VALIDATORS, DEFAULT_PAYOUT_COIN_ID, DEFAULT_COIN_ID } from './constants';
import { fetchCoinMarketData, fetchPoolStats } from './services/cryptoDataAPI';
import * as backendAPI from './services/electronAPI';

import { Sidebar } from './components/Sidebar';
import Dashboard from './components/Dashboard';
import SettingsPage from './components/SettingsPage';
import UsersPage from './components/UsersPage';
import LoginPage from './components/LoginPage';
import WalletPage from './components/WalletPage';
import StakingPage from './components/StakingPage';
import ReferralPage from './components/ReferralPage';
import SetupGuidePage from './components/SetupGuidePage';
import RoadmapPage from './components/RoadmapPage';
import WalletSetupPage from './components/WalletSetupPage';
import ActionConfirmationModal from './components/ActionConfirmationModal';

export const AppContext = createContext<any>(null);

type ViewType = 'dashboard' | 'wallet' | 'staking' | 'settings' | 'referrals' | 'guide' | 'roadmap' | 'users';

const AppContent: React.FC = () => {
  const [users, setUsers] = useLocalStorage<User[]>('minehub-users', INITIAL_USERS);
  const [currentUser, setCurrentUser] = useLocalStorage<User | null>('minehub-currentUser', null);
  const [activeView, setActiveView] = useState<ViewType>('dashboard');

  const [allCoins, setAllCoins] = useState<Coin[]>([]);
  const [allPayoutCoins, setAllPayoutCoins] = useState<PayoutCoin[]>([]);

  const [selectedValidatorId, setSelectedValidatorId] = useLocalStorage<string | null>('selected-validator', null);

  const { addToast } = useToast();

  useEffect(() => {
    if (!backendAPI.isElectron()) {
        addToast("Running in web preview. Miner controls are disabled.", 'info');
    }

    const fetchData = async () => {
      try {
        const marketData = await fetchCoinMarketData();
        const coinsWithData = DEFAULT_COINS.map(c => ({
          ...c,
          ...marketData[c.id],
        }));
        setAllCoins(coinsWithData as Coin[]);

        const payoutCoinsWithData = PAYOUT_COINS.map(c => ({
          ...c,
          ...marketData[c.id],
        }));
        setAllPayoutCoins(payoutCoinsWithData as PayoutCoin[]);

      } catch (error) {
        console.error("Failed to fetch initial coin data:", error);
        addToast("Could not fetch live market data.", 'error');
        setAllCoins(DEFAULT_COINS as Coin[]);
        setAllPayoutCoins(PAYOUT_COINS as PayoutCoin[]);
      }
    };
    fetchData();
    const interval = setInterval(fetchData, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, [addToast]);

  const setSettings = (newSettings: Partial<AppSettings> | ((prev: AppSettings) => AppSettings)) => {
    if (!currentUser) return;
    const updatedSettings = typeof newSettings === 'function' ? newSettings(currentUser.settings) : { ...currentUser.settings, ...newSettings };
    const updatedUser = { ...currentUser, settings: updatedSettings };
    setCurrentUser(updatedUser);
    setUsers(users.map(u => u.id === currentUser.id ? updatedUser : u));
  };
  
  const updateUser = useCallback((updatedUser: User) => {
    setUsers(prevUsers => prevUsers.map(u => u.id === updatedUser.id ? updatedUser : u));
    setCurrentUser(prevCurrentUser => {
        if (prevCurrentUser && prevCurrentUser.id === updatedUser.id) {
            return updatedUser;
        }
        return prevCurrentUser;
    });
  }, [setUsers, setCurrentUser]);

  const selectedCoin = useMemo(() => {
    const defaultCoin = (DEFAULT_COINS.find(c => c.id === DEFAULT_COIN_ID) || DEFAULT_COINS[0]) as Coin;
    if (allCoins.length === 0) {
        return defaultCoin;
    }
    const coinId = currentUser?.settings?.selectedCoinId || DEFAULT_SETTINGS.selectedCoinId;
    return allCoins.find(c => c.id === coinId) || allCoins[0] || defaultCoin;
  }, [currentUser, allCoins]);

  const selectedPayoutCoin = useMemo(() => {
    if (currentUser?.settings.selectedPayoutCoinId === 'custom') {
        return {
            id: 'custom',
            name: `Custom (${currentUser.settings.customPayoutTokenTicker})`,
            ticker: currentUser.settings.customPayoutTokenTicker,
            network: currentUser.settings.customPayoutTokenNetwork,
            logo: '', // Placeholder for custom token logo
            apy: 0,
            compoundIntervalSeconds: 0,
        }
    }
    const defaultPayoutCoin = (PAYOUT_COINS.find(c => c.id === DEFAULT_PAYOUT_COIN_ID) || PAYOUT_COINS[0]) as PayoutCoin;
    if (allPayoutCoins.length === 0) {
        return defaultPayoutCoin;
    }
    const coinId = currentUser?.settings?.selectedPayoutCoinId || DEFAULT_PAYOUT_COIN_ID;
    return allPayoutCoins.find(c => c.id === coinId) || allPayoutCoins[0] || defaultPayoutCoin;
  }, [currentUser, allPayoutCoins]);

  const allStakingCoins = useMemo(() => allPayoutCoins.filter(c => c.apy > 0), [allPayoutCoins]);
  const validators = useMemo(() => VALIDATORS[selectedPayoutCoin?.id] || [], [selectedPayoutCoin]);
  
  useEffect(() => {
      if (validators.length > 0 && !validators.find(v => v.id === selectedValidatorId)) {
          setSelectedValidatorId(validators[0].id);
      }
  }, [validators, selectedValidatorId, setSelectedValidatorId]);

  // Hooks
  const { miningLogs, hashrate, acceptedShares, rejectedShares, isMining, isStarting, startMining, stopMining, miningChartData } = useMinerManager();
  const { walletBalance, transactions, initiateAction, actionState, confirmAction, cancelAction, isActionLoading, receiveFunds } = useWalletManager(selectedPayoutCoin);
  const { stakedBalance, claimableRewards, stakedPositions, stake, unstake, claimRewards } = useStakingEngine(selectedPayoutCoin, addToast);

  // Effect to update user status based on mining activity
  useEffect(() => {
    if (!currentUser || currentUser.status === 'offline') {
        return;
    }

    const targetStatus = isMining ? 'mining' : 'online';

    if (currentUser.status !== targetStatus) {
        const updatedUser = { ...currentUser, status: targetStatus };
        updateUser(updatedUser);
    }
  }, [isMining, currentUser, updateUser]);

  // Pool Stats
  const [poolStats, setPoolStats] = useState<PoolStats | null>(null);
  const [isPoolStatsLoading, setIsPoolStatsLoading] = useState(false);

  const refreshPoolStats = useCallback(async () => {
      if (!currentUser || !selectedCoin) return;
      setIsPoolStatsLoading(true);
      try {
        const ticker = selectedCoin.mineableTicker || selectedCoin.ticker;
        const stats = await fetchPoolStats(currentUser.settings.selectedPoolId, currentUser.settings.walletAddress, ticker);
        setPoolStats(stats);
      } catch (error) {
        console.error("Failed to fetch pool stats:", error);
        setPoolStats(null);
      } finally {
        setIsPoolStatsLoading(false);
      }
  }, [currentUser, selectedCoin]);

  useEffect(() => {
    if (currentUser && isMining) {
      refreshPoolStats();
      const interval = setInterval(refreshPoolStats, 30000);
      return () => clearInterval(interval);
    }
  }, [currentUser, isMining, refreshPoolStats]);

  const handleStartMining = async () => {
      if (!currentUser) return false;
      const { minerPaths, selectedMinerPathId, selectedServerUrl, walletAddress, workerName } = currentUser.settings;
      const selectedMiner = minerPaths.find(p => p.id === selectedMinerPathId);

      if (!walletAddress) {
          addToast('Please set your payout wallet address in the Settings page.', 'error');
          return false;
      }
      if (!selectedMiner?.path || !selectedServerUrl) {
          addToast('Missing configuration. Check pool and miner path in settings.', 'error');
          return false;
      }
      
      let command = selectedCoin.commandLineArgs
          .replace('{POOL_URL}', selectedServerUrl)
          .replace('{WALLET}', walletAddress)
          .replace('{WORKER_NAME}', workerName);
      
      return await startMining(selectedMiner.path, command);
  };
  
  const handleLogin = (email: string, password: string) => {
      const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
      if (user) {
          if (user.status === 'online' && user.id !== currentUser?.id) {
              return { status: 'conflict' as const, user };
          }
          const updatedUser = {...user, status: 'online' as const, lastSeen: new Date().toISOString()};
          setCurrentUser(updatedUser);
          setUsers(prev => prev.map(u => u.id === user.id ? updatedUser : u));
          return { status: 'success' as const, user };
      }
      return { status: 'failure' as const };
  }
  
  const handleForceLogin = (user: User) => {
      const updatedUser = {...user, status: 'online' as const, lastSeen: new Date().toISOString()};
      setCurrentUser(updatedUser);
      setUsers(prev => prev.map(u => u.id === user.id ? updatedUser : u));
  }

  const handleLogout = () => {
    if (currentUser) {
       const updatedUser = {...currentUser, status: 'offline' as const};
       setCurrentUser(null);
       setUsers(prev => prev.map(u => u.id === currentUser.id ? updatedUser : u));
    }
  }
  
  const handleWalletSetupComplete = (wallet: Wallet) => {
    if (!currentUser) return;
    const updatedUser = { ...currentUser, wallet };
    updateUser(updatedUser);
  };

  // Render Logic
  if (!currentUser) {
    return <LoginPage onLogin={handleLogin} onForceLogin={handleForceLogin} />;
  }
  
  if (currentUser && !currentUser.wallet) {
    return <WalletSetupPage onSetupComplete={handleWalletSetupComplete} />;
  }

  const renderView = () => {
    switch (activeView) {
      case 'wallet': return <WalletPage />;
      case 'staking': return <StakingPage />;
      case 'settings': return <SettingsPage />;
      case 'users': return <UsersPage />;
      case 'referrals': return <ReferralPage />;
      case 'guide': return <SetupGuidePage />;
      case 'roadmap': return <RoadmapPage />;
      case 'dashboard':
      default:
        return <Dashboard />;
    }
  };

  return (
    <AppContext.Provider value={{
      currentUser,
      users,
      setUsers,
      updateUser,
      settings: currentUser.settings,
      setSettings,
      
      allCoins,
      selectedCoin,
      allPayoutCoins,
      selectedPayoutCoin,
      allStakingCoins,
      
      isMining,
      isStarting,
      hashrate,
      miningChartData,
      acceptedShares,
      rejectedShares,
      miningLogs,
      startMining: handleStartMining,
      stopMining,
      
      poolStats,
      isPoolStatsLoading,
      refreshPoolStats,
      
      walletBalance,
      transactions,
      initiateAction,
      actionState,
      confirmAction,
      cancelAction,
      isActionLoading,
      receiveFunds,

      stakedBalance,
      claimableRewards,
      stakedPositions,
      stake,
      unstake,
      claimRewards,
      validators,
      selectedValidatorId,
      setSelectedValidatorId,

      payoutCoin: selectedPayoutCoin, // Alias for staking/wallet pages
    }}>
      <div className={`flex h-screen font-sans bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text ${currentUser.settings.theme}`}>
        <Sidebar activeView={activeView} setActiveView={setActiveView} onLogout={handleLogout} />
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
            {renderView()}
        </main>
      </div>
      <ActionConfirmationModal />
    </AppContext.Provider>
  );
}

const App: React.FC = () => {
    return (
        <ToastProvider>
            <AppContent />
        </ToastProvider>
    )
}

export default App;