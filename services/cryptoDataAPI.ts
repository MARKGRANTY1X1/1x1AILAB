import { MarketData, PoolStats } from '../types';

// Maps our internal IDs to CoinGecko's API IDs
const COINGECKO_ID_MAP: { [key: string]: string } = {
  'bitcoin': 'bitcoin',
  'monero': 'monero',
  'ravencoin': 'ravencoin',
  'ethereum-classic': 'ethereum-classic',
  'dogecoin': 'dogecoin',
  'shiba-inu': 'shiba-inu',
  'cosmos': 'cosmos',
  'polkadot': 'polkadot',
  'avalanche': 'avalanche-2',
  'cardano': 'cardano',
  'solana': 'solana',
  'tezos': 'tezos',
  'algorand': 'algorand',
  'zephyr-protocol': 'zephyr-protocol',
  'haven': 'haven',
  'pepe': 'pepe',
  'dogwifhat-token': 'dogwifhat-token',
  'bonk': 'bonk',
};

// Maps CoinGecko IDs back to our internal IDs
const REVERSE_COINGECKO_ID_MAP: { [key:string]: string } = Object.fromEntries(
  Object.entries(COINGECKO_ID_MAP).map(([key, value]) => [value, key])
);

const API_BASE_URL = 'https://api.coingecko.com/api/v3';

// Fetches market data for all coins used in the app
export const fetchCoinMarketData = async (): Promise<{ [id: string]: MarketData }> => {
  const allApiIds = Object.values(COINGECKO_ID_MAP);
  const idsString = allApiIds.join(',');
  
  try {
    const response = await fetch(`${API_BASE_URL}/coins/markets?vs_currency=usd&ids=${idsString}`);
    if (!response.ok) {
      throw new Error(`CoinGecko API request failed with status: ${response.status}`);
    }
    const data = await response.json();
    
    const marketData: { [id: string]: MarketData } = {};

    for (const item of data) {
      const internalId = REVERSE_COINGECKO_ID_MAP[item.id];
      if (internalId) {
        marketData[internalId] = {
          price: item.current_price,
        };
      }
    }
    
    // Supplement with placeholder network hashrate data
    for (const internalId in marketData) {
        if (internalId === 'bitcoin') marketData[internalId].networkHashrate = 600 * 1000 * 1000 * 1000; // ~600 EH/s
        if (internalId === 'monero') marketData[internalId].networkHashrate = 2.5 * 1000;
        if (internalId === 'zephyr-protocol') marketData[internalId].networkHashrate = 2.4 * 1000;
        if (internalId === 'haven') marketData[internalId].networkHashrate = 0.3 * 1000;
        if (internalId === 'ravencoin') marketData[internalId].networkHashrate = 10 * 1000 * 1000;
        if (internalId === 'ethereum-classic') marketData[internalId].networkHashrate = 65 * 1000 * 1000;
        if (internalId === 'dogecoin') marketData[internalId].networkHashrate = 950 * 1000 * 1000;
        if (internalId === 'shiba-inu') marketData[internalId].networkHashrate = 65 * 1000 * 1000; // Mined via ETC
    }

    return marketData;

  } catch (error) {
    console.error("Failed to fetch coin market data:", error);
    throw error; // Rethrow to be handled by the caller
  }
};


// --- Live Pool Statistics API ---

const COIN_POOL_CONFIG: { [ticker: string]: { decimals: number, hashrateKey: string } } = {
    'XMR': { decimals: 12, hashrateKey: 'hashrate' },
    'ZEPH': { decimals: 12, hashrateKey: 'hashrate' },
    'XHV': { decimals: 12, hashrateKey: 'hashrate' },
    'RVN': { decimals: 8, hashrateKey: 'currentHashrate' },
    'ETC': { decimals: 18, hashrateKey: 'currentHashrate' },
    'DOGE': { decimals: 8, hashrateKey: 'currentHashrate' },
};

const get2MinersApiUrl = (coinTicker: string): string => {
    return `https://${coinTicker.toLowerCase()}.2miners.com/api`;
}

export const fetch2MinersStats = async (walletAddress: string, coinTicker: string): Promise<PoolStats> => {
  const config = COIN_POOL_CONFIG[coinTicker.toUpperCase()];
  if (!config) {
      throw new Error(`Unsupported coin for 2Miners stats: ${coinTicker}`);
  }
  
  const baseUrl = get2MinersApiUrl(coinTicker);
  const response = await fetch(`${baseUrl}/accounts/${walletAddress}`);
  if (!response.ok) {
    // 404 is common for new miners, don't treat as an error, just return no stats.
    if (response.status === 404) {
      return { hashrate: 0, unpaidBalance: 0, workersOnline: 0, lastShare: null };
    }
    throw new Error('Failed to fetch stats from 2Miners');
  }
  const data = await response.json();
  
  const unpaidBalance = data.stats?.balance || 0;
  const hashrate = data[config.hashrateKey] || 0;
  
  return {
    hashrate: hashrate, // H/s
    unpaidBalance: unpaidBalance / Math.pow(10, config.decimals),
    workersOnline: data.workersOnline || 0,
    lastShare: data.stats?.lastShare || null,
  };
};

export const fetchPoolStats = async (poolId: string, walletAddress: string, coinTicker: string): Promise<PoolStats | null> => {
    if (!walletAddress || !coinTicker) return null;

    switch (poolId) {
        case '2miners':
        case 'unmineable': // Unmineable often uses 2Miners pools on the backend
            try {
                // Use the mineableTicker for coins like SHIB that are mined via ETC
                const tickerForApi = coinTicker === 'SHIB' ? 'ETC' : coinTicker;
                return await fetch2MinersStats(walletAddress, tickerForApi);
            } catch (error) {
                console.error(`Error fetching 2Miners stats for ${coinTicker}:`, error);
                return null;
            }
        // Add case for 'ethermine' here in the future
        default:
            return null;
    }
}