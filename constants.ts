import { Coin, PayoutCoin, AppSettings, MiningDevice, MiningIntensity, User, MiningPool, Validator } from './types';

// Note: For non-mineable tokens like SHIB (ERC20) or Solana (PoS), this simulation
// mimics services like Unmineable, where you contribute hashrate to a mineable
// algorithm (like Etchash) and get paid out in the token of your choice.
// The commandLineArgs are templates for real miner software.
export const DEFAULT_COINS: Omit<Coin, 'price' | 'blockTime' | 'blockReward' | 'networkHashrate'>[] = [
  { id: 'monero', name: 'Monero', ticker: 'XMR', network: 'XMR', logo: 'https://s2.coinmarketcap.com/static/img/coins/64x64/328.png', algorithm: 'randomx', commandLineArgs: '--algo=randomx -o {POOL_URL} -u {WALLET} -p {WORKER_NAME}', recommendedDevice: 'CPU' },
  { id: 'zephyr-protocol', name: 'Zephyr Protocol', ticker: 'ZEPH', network: 'ZEPH', logo: 'https://s2.coinmarketcap.com/static/img/coins/64x64/28095.png', algorithm: 'randomx', commandLineArgs: '--algo=randomx -o {POOL_URL} -u {WALLET} -p {WORKER_NAME}', recommendedDevice: 'CPU' },
  { id: 'haven', name: 'Haven Protocol', ticker: 'XHV', network: 'XHV', logo: 'https://s2.coinmarketcap.com/static/img/coins/64x64/2662.png', algorithm: 'randomx', commandLineArgs: '--algo=randomx -o {POOL_URL} -u {WALLET} -p {WORKER_NAME}', recommendedDevice: 'CPU' },
  { id: 'bitcoin', name: 'Bitcoin', ticker: 'BTC', network: 'Bitcoin', logo: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1.png', algorithm: 'etchash', commandLineArgs: '-a etchash -o {POOL_URL} -u BTC:{WALLET}.{WORKER_NAME} -p x', recommendedDevice: 'GPU', mineableTicker: 'ETC' },
  { id: 'ravencoin', name: 'Ravencoin', ticker: 'RVN', network: 'RVN', logo: 'https://s2.coinmarketcap.com/static/img/coins/64x64/2577.png', algorithm: 'kawpow', commandLineArgs: '-a kawpow -o {POOL_URL} -u {WALLET}.{WORKER_NAME} -p x', recommendedDevice: 'GPU' },
  { id: 'ethereum-classic', name: 'Ethereum Classic', ticker: 'ETC', network: 'ETC', logo: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1321.png', algorithm: 'etchash', commandLineArgs: '-a etchash -o {POOL_URL} -u {WALLET}.{WORKER_NAME} -p x', recommendedDevice: 'GPU' },
  { id: 'dogecoin', name: 'Dogecoin', ticker: 'DOGE', network: 'DOGE', logo: 'https://s2.coinmarketcap.com/static/img/coins/64x64/74.png', algorithm: 'scrypt', commandLineArgs: '-a scrypt -o {POOL_URL} -u {WALLET}.{WORKER_NAME} -p x', recommendedDevice: 'GPU' },
  { id: 'shiba-inu', name: 'Shiba Inu', ticker: 'SHIB', network: 'ERC20', logo: 'https://s2.coinmarketcap.com/static/img/coins/64x64/5994.png', algorithm: 'etchash', commandLineArgs: '-a etchash -o {POOL_URL} -u SHIB:{WALLET}.{WORKER_NAME} -p x', recommendedDevice: 'GPU', mineableTicker: 'ETC' },
];

export const MINING_POOLS: MiningPool[] = [
  {
    id: '2miners',
    name: '2Miners',
    logo: 'https://2miners.com/assets/img/logo/logo-main-color-128.png',
    serversByCoin: {
      'ETC': [
        { region: 'USA (East)', url: 'stratum+tcp://us-etc.2miners.com:1010', type: 'Pool' },
        { region: 'Europe', url: 'stratum+tcp://etc.2miners.com:1010', type: 'Pool' },
        { region: 'Asia', url: 'stratum+tcp://asia-etc.2miners.com:1010', type: 'Pool' },
        { region: 'USA (East) - SOLO', url: 'stratum+tcp://solo-us-etc.2miners.com:1111', type: 'Solo' },
        { region: 'Europe - SOLO', url: 'stratum+tcp://solo-etc.2miners.com:1111', type: 'Solo' },
      ],
      'RVN': [
        { region: 'USA (East)', url: 'stratum+tcp://us-rvn.2miners.com:6060', type: 'Pool' },
        { region: 'Europe', url: 'stratum+tcp://rvn.2miners.com:6060', type: 'Pool' },
        { region: 'Asia', url: 'stratum+tcp://asia-rvn.2miners.com:6060', type: 'Pool' },
        { region: 'Europe - SOLO', url: 'stratum+tcp://solo-rvn.2miners.com:6161', type: 'Solo' },
      ],
      'XMR': [
        { region: 'USA (East)', url: 'stratum+tcp://us-xmr.2miners.com:2222', type: 'Pool' },
        { region: 'Europe', url: 'stratum+tcp://xmr.2miners.com:2222', type: 'Pool' },
        { region: 'Asia', url: 'stratum+tcp://asia-xmr.2miners.com:2222', type: 'Pool' },
        { region: 'Europe - SOLO', url: 'stratum+tcp://solo-xmr.2miners.com:3333', type: 'Solo' },
      ],
       'ZEPH': [
        { region: 'USA (East)', url: 'stratum+tcp://us-zeph.2miners.com:2020', type: 'Pool' },
        { region: 'Europe', url: 'stratum+tcp://zeph.2miners.com:2020', type: 'Pool' },
        { region: 'Asia', url: 'stratum+tcp://asia-zeph.2miners.com:2020', type: 'Pool' },
      ],
       'XHV': [
        { region: 'Europe', url: 'stratum+tcp://xhv.2miners.com:3030', type: 'Pool' },
      ],
    }
  },
  {
    id: 'ethermine',
    name: 'Ethermine / Flypool',
    logo: 'https://flypool.org/images/logo_flypool_new.svg',
    serversByCoin: {
      'ETC': [
          { region: 'USA (East)', url: 'stratum+tcp://us1-etc.ethermine.org:4444', type: 'Pool' },
          { region: 'USA (West)', url: 'stratum+tcp://us2-etc.ethermine.org:4444', type: 'Pool' },
          { region: 'Europe', url: 'stratum+tcp://eu1-etc.ethermine.org:4444', type: 'Pool' },
          { region: 'Asia', url: 'stratum+tcp://asia1-etc.ethermine.org:4444', type: 'Pool' },
      ],
      'RVN': [
          { region: 'USA (East)', url: 'stratum+tcp://stratum-ravencoin.flypool.org:3333', type: 'Pool' },
          { region: 'Europe', url: 'stratum+tcp://eu1-ravencoin.flypool.org:3333', type: 'Pool' },
          { region: 'Asia', url: 'stratum+tcp://asia1-ravencoin.flypool.org:3333', type: 'Pool' },
      ],
    }
  },
   {
    id: 'unmineable',
    name: 'Unmineable',
    logo: 'https://www.unmineable.com/img/logo_256.png',
    serversByCoin: {
      'ETC': [
          { region: 'USA', url: 'stratum+tcp://etchash.unmineable.com:3333', type: 'Pool' },
          { region: 'Europe', url: 'stratum+tcp://etchash.eu.unmineable.com:3333', type: 'Pool' },
          { region: 'Asia', url: 'stratum+tcp://etchash.asia.unmineable.com:3333', type: 'Pool' },
      ],
      'RVN': [
          { region: 'USA', url: 'stratum+tcp://kawpow.unmineable.com:3333', type: 'Pool' },
          { region: 'Europe', url: 'stratum+tcp://kawpow.eu.unmineable.com:3333', type: 'Pool' },
          { region: 'Asia', url: 'stratum+tcp://kawpow.asia.unmineable.com:3333', type: 'Pool' },
      ],
      'XMR': [
          { region: 'USA', url: 'stratum+tcp://randomx.unmineable.com:3333', type: 'Pool' },
          { region: 'Europe', url: 'stratum+tcp://randomx.eu.unmineable.com:3333', type: 'Pool' },
          { region: 'Asia', url: 'stratum+tcp://randomx.asia.unmineable.com:3333', type: 'Pool' },
      ],
      'ZEPH': [
          { region: 'USA', url: 'stratum+tcp://randomx.unmineable.com:3333', type: 'Pool' },
          { region: 'Europe', url: 'stratum+tcp://randomx.eu.unmineable.com:3333', type: 'Pool' },
          { region: 'Asia', url: 'stratum+tcp://randomx.asia.unmineable.com:3333', type: 'Pool' },
      ],
      'XHV': [
          { region: 'USA', url: 'stratum+tcp://randomx.unmineable.com:3333', type: 'Pool' },
          { region: 'Europe', url: 'stratum+tcp://randomx.eu.unmineable.com:3333', type: 'Pool' },
          { region: 'Asia', url: 'stratum+tcp://randomx.asia.unmineable.com:3333', type: 'Pool' },
      ],
      'DOGE': [
          { region: 'USA', url: 'stratum+tcp://scrypt.unmineable.com:3333', type: 'Pool' },
          { region: 'Europe', url: 'stratum+tcp://scrypt.eu.unmineable.com:3333', type: 'Pool' },
          { region: 'Asia', url: 'stratum+tcp://scrypt.asia.unmineable.com:3333', type: 'Pool' },
      ],
    }
  }
];


export const PAYOUT_COINS: Omit<PayoutCoin, 'price'>[] = [
  { id: 'bitcoin', name: 'Bitcoin', ticker: 'BTC', network: 'Bitcoin', logo: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1.png', apy: 0, compoundIntervalSeconds: 0 },
  { id: 'cosmos', name: 'Cosmos', ticker: 'ATOM', network: 'Cosmos Hub', logo: 'https://s2.coinmarketcap.com/static/img/coins/64x64/3794.png', apy: 0.18, compoundIntervalSeconds: 86400 },
  { id: 'polkadot', name: 'Polkadot', ticker: 'DOT', network: 'Polkadot', logo: 'https://s2.coinmarketcap.com/static/img/coins/64x64/6636.png', apy: 0.14, compoundIntervalSeconds: 86400 },
  { id: 'avalanche', name: 'Avalanche', ticker: 'AVAX', network: 'Avalanche C-Chain', logo: 'https://s2.coinmarketcap.com/static/img/coins/64x64/5805.png', apy: 0.085, compoundIntervalSeconds: 86400 },
  { id: 'cardano', name: 'Cardano', ticker: 'ADA', network: 'Cardano', logo: 'https://s2.coinmarketcap.com/static/img/coins/64x64/2010.png', apy: 0.035, compoundIntervalSeconds: 86400 },
  { id: 'solana', name: 'Solana', ticker: 'SOL', network: 'Solana', logo: 'https://s2.coinmarketcap.com/static/img/coins/64x64/5426.png', apy: 0.07, compoundIntervalSeconds: 86400 },
  { id: 'pepe', name: 'Pepe', ticker: 'PEPE', network: 'ERC20', logo: 'https://s2.coinmarketcap.com/static/img/coins/64x64/24478.png', apy: 0, compoundIntervalSeconds: 0 },
  { id: 'dogwifhat-token', name: 'dogwifhat', ticker: 'WIF', network: 'SPL', logo: 'https://s2.coinmarketcap.com/static/img/coins/64x64/30283.png', apy: 0, compoundIntervalSeconds: 0 },
  { id: 'bonk', name: 'Bonk', ticker: 'BONK', network: 'SPL', logo: 'https://s2.coinmarketcap.com/static/img/coins/64x64/23095.png', apy: 0, compoundIntervalSeconds: 0 },
  { id: 'tezos', name: 'Tezos', ticker: 'XTZ', network: 'Tezos', logo: 'https://s2.coinmarketcap.com/static/img/coins/64x64/2011.png', apy: 0.055, compoundIntervalSeconds: 86400 },
  { id: 'algorand', name: 'Algorand', ticker: 'ALGO', network: 'Algorand', logo: 'https://s2.coinmarketcap.com/static/img/coins/64x64/4030.png', apy: 0.075, compoundIntervalSeconds: 86400 },
];

export const DEFAULT_COIN_ID = 'monero';
export const DEFAULT_PAYOUT_COIN_ID = 'bitcoin';

export const DEFAULT_SETTINGS: AppSettings = {
    selectedCoinId: DEFAULT_COIN_ID,
    selectedPayoutCoinId: DEFAULT_PAYOUT_COIN_ID,
    walletAddress: '',
    selectedPoolId: '2miners',
    selectedServerUrl: 'stratum+tcp://us-xmr.2miners.com:2222',
    workerName: 'MyAwesomeRig',
    theme: 'light',
    device: MiningDevice.GPU,
    intensity: MiningIntensity.High,
    backgroundMining: false,
    minerPaths: [],
    selectedMinerPathId: null,
    customPayoutTokenAddress: '',
    customPayoutTokenTicker: '',
    customPayoutTokenNetwork: 'ERC20',
};

export const INITIAL_USERS: User[] = [
    {
        id: 'admin-001',
        username: 'Kishawn',
        email: 'kishawnsterling4@gmail.com',
        password: 'Tweedy123$', // For simulation purposes only
        role: 'admin',
        status: 'offline',
        lastSeen: null,
        settings: DEFAULT_SETTINGS,
        // FIX: Added wallet property to conform to updated User type.
        wallet: null,
    },
    {
        id: 'user-002',
        username: 'Satoshi',
        email: 'satoshi@minehub.com',
        password: 'password',
        role: 'user',
        status: 'offline',
        lastSeen: '2023-10-26T10:00:00Z',
        settings: { ...DEFAULT_SETTINGS, workerName: 'SatoshiRig', theme: 'light'},
        // FIX: Added wallet property to conform to updated User type.
        wallet: null,
    }
];

// FIX: Add a list of mock validators for different staking coins.
export const VALIDATORS: { [coinId: string]: Validator[] } = {
  'cosmos': [
    { id: 'cosmoshub-val-1', name: 'Everstake', logo: 'https://s2.coinmarketcap.com/static/img/coins/64x64/3794.png', commission: 0.05, votingPower: 4.5 },
    { id: 'cosmoshub-val-2', name: 'Coinbase Custody', logo: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1.png', commission: 0.1, votingPower: 7.2 },
    { id: 'cosmoshub-val-3', name: 'Binance Staking', logo: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1839.png', commission: 0.025, votingPower: 5.1 },
  ],
  'polkadot': [
     { id: 'polkadot-val-1', name: 'Polkadot Validator 1', logo: 'https://s2.coinmarketcap.com/static/img/coins/64x64/6636.png', commission: 0.01, votingPower: 3.1 },
  ],
  'solana': [
      { id: 'solana-val-1', name: 'Solana Validator 1', logo: 'https://s2.coinmarketcap.com/static/img/coins/64x64/5426.png', commission: 0.07, votingPower: 6.2 },
  ]
};