import { ReactNode } from "react";

// FIX: Added Wallet interface for wallet management.
export interface Wallet {
  mnemonic: string;
  address: string;
}

// FIX: Added Transaction interface for transaction history.
export interface Transaction {
  id: string;
  type: 'send' | 'receive' | 'deposit';
  status: 'completed' | 'confirming' | 'failed';
  amount: number;
  fee?: number;
  address?: string; // For send transactions
  hash?: string;
  timestamp: string;
}

export interface Coin {
  id: string;
  name: string;
  ticker: string;
  network: string;
  logo: string;
  algorithm: string;
  commandLineArgs: string;
  recommendedDevice: 'CPU' | 'GPU';
  mineableTicker?: string; // Ticker to use for finding pools (e.g., ETC for SHIB)
  price?: number;
  blockTime?: number;
  blockReward?: number;
  networkHashrate?: number; // in MH/s
}

export interface PayoutCoin {
  id: string;
  name: string;
  ticker: string;
  network: string;
  logo: string;
  apy: number;
  compoundIntervalSeconds: number;
  price?: number;
}

export interface MiningPoolServer {
  region: string;
  url: string;
  type: 'Pool' | 'Solo';
}

export interface MiningPool {
  id: string;
  name: string;
  logo: string;
  serversByCoin: {
    [coinTicker: string]: MiningPoolServer[];
  };
}

export enum MiningDevice {
    CPU = 'CPU',
    GPU = 'GPU',
}

export enum MiningIntensity {
    Low = 'Low',
    Medium = 'Medium',
    High = 'High',
}

export interface MinerPath {
    id: string;
    name: string;
    path: string;
}

export interface AppSettings {
    selectedCoinId: string;
    selectedPayoutCoinId: string;
    walletAddress: string;
    selectedPoolId: string;
    selectedServerUrl: string;
    workerName: string;
    theme: 'light' | 'dark';
    device: MiningDevice;
    intensity: MiningIntensity;
    backgroundMining: boolean;
    minerPaths: MinerPath[];
    selectedMinerPathId: string | null;
    selectedStakingCoinId?: string;
    customPayoutTokenAddress: string;
    customPayoutTokenTicker: string;
    customPayoutTokenNetwork: string;
}

export interface User {
    id: string;
    username: string;
    email: string;
    password?: string;
    role: 'admin' | 'user';
    status: 'online' | 'offline' | 'mining';
    lastSeen: string | null;
    settings: AppSettings;
    // FIX: Added wallet property to support integrated wallet features.
    wallet: Wallet | null;
}

export interface Validator {
  id: string;
  name: string;
  logo: string;
  commission: number;
  votingPower: number;
}

export interface ChartDataPoint {
  time: string;
  hashrate: number;
}

export enum LogLevel {
  INFO,
  WARN,
  ERROR,
  SUCCESS,
  RAW,
}

export interface LogEntry {
  timestamp: string;
  message: string;
  level: LogLevel;
}

export type ToastType = 'success' | 'error' | 'info';

export interface ToastMessage {
  id: string;
  message: string;
  type: ToastType;
  link?: string;
}

export interface MarketData {
  price?: number;
  networkHashrate?: number;
}

export interface StakedPosition {
  validatorId: string;
  amount: number;
  rewards: number;
  stakedAt: string; // ISO date string
}

export interface PoolStats {
  hashrate: number; // Current hashrate reported by the pool in H/s
  unpaidBalance: number; // In the coin's main unit
  workersOnline: number;
  lastShare: number | null; // timestamp
}