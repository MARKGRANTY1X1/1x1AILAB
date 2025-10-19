import { PayoutCoin, MinerPath, Wallet } from '../types';

/**
 * NOTE: This file is the bridge between the React UI (Renderer Process) and the
 * main desktop application backend (Main Process in Electron).
 *
 * It assumes a preload script has securely exposed functions onto the `window` object
 * under the `window.electronAPI` namespace. These functions use IPC (Inter-Process Communication)
 * to trigger actions (like starting a miner) in the main process, which has access to
 * Node.js APIs like `child_process` and `fs`.
 */

declare global {
  interface Window {
    electronAPI: {
      startMiner: (path: string, args: string) => Promise<boolean>;
      stopMiner: () => Promise<boolean>;
      onMinerOutput: (callback: (data: string) => void) => void;
      offMinerOutput: () => void;
      onMinerExit: (callback: (code: number) => void) => void;
      offMinerExit: () => void;
      selectMinerPath: () => Promise<string | null>;
      scanForMiners: () => Promise<MinerPath[]>;
      createWallet: () => Promise<Wallet>;
      calculateFee: (coin: PayoutCoin, amount: number) => Promise<number>;
      executeSend: (coin: PayoutCoin, address: string, amount: number) => Promise<string>;
      getExplorerLink: (coin: PayoutCoin, txHash: string) => string;
    };
  }
}

/**
 * Checks if the app is running in the Electron environment.
 * @returns {boolean} True if the Electron API is available, false otherwise.
 */
export const isElectron = (): boolean => {
    return window.electronAPI !== undefined;
}


// --- Wallet Management ---
export const createWallet = (): Promise<Wallet> => {
    if (!isElectron()) return Promise.reject(new Error("Wallet functions require the desktop app."));
    return window.electronAPI.createWallet();
};

export const calculateFee = (coin: PayoutCoin, amount: number): Promise<number> => {
    if (!isElectron()) return Promise.resolve(0.0005); // Return a placeholder for UI
    return window.electronAPI.calculateFee(coin, amount);
};

export const executeSend = (coin: PayoutCoin, address: string, amount: number): Promise<string> => {
    if (!isElectron()) return Promise.reject(new Error("Wallet functions require the desktop app."));
    return window.electronAPI.executeSend(coin, address, amount);
};

export const getExplorerLink = (coin: PayoutCoin, txHash: string): string => {
    if (!isElectron()) return `https://some-explorer.com/${coin.ticker}/tx/${txHash}`;
    return window.electronAPI.getExplorerLink(coin, txHash);
};


// --- Miner Process Management ---

export const selectMinerPath = async (): Promise<string | null> => {
  if (!isElectron()) {
    alert("This feature is only available in the desktop app.");
    return null;
  }
  return window.electronAPI.selectMinerPath();
};

export const scanForMiners = async (): Promise<MinerPath[]> => {
    if (!isElectron()) {
        console.warn("Scanning is disabled in web preview.");
        return [];
    }
    return window.electronAPI.scanForMiners();
};


export const startMinerProcess = async (minerPath: string, args: string): Promise<boolean> => {
  if (!isElectron()) {
    console.error("Cannot start miner in a web browser environment.");
    return false;
  }
  console.log(`[API Bridge] Requesting to start miner: ${minerPath} with args: ${args}`);
  return window.electronAPI.startMiner(minerPath, args);
};

export const stopMinerProcess = async (): Promise<boolean> => {
  if (!isElectron()) return false;
  console.log('[API Bridge] Requesting to stop miner.');
  return window.electronAPI.stopMiner();
};

export const onMinerOutput = (callback: (data: string) => void): (() => void) => {
  if (isElectron()) {
    window.electronAPI.onMinerOutput(callback);
    // Return the unsubscribe function
    return () => window.electronAPI.offMinerOutput();
  }
  // Return a no-op unsubscribe function for web environment
  return () => {};
};

export const onMinerExit = (callback: (code: number) => void): (() => void) => {
    if (isElectron()) {
        window.electronAPI.onMinerExit(callback);
        return () => window.electronAPI.offMinerExit();
    }
    return () => {};
}
