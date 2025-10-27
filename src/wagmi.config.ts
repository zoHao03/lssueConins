import { createConfig, http } from 'wagmi'
import { metaMask } from 'wagmi/connectors'

// 只配置 BSC 测试网
const bscTestnet = {
  id: 97,
  name: 'BNB Smart Chain Testnet',
  network: 'bsc-testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'BNB',
    symbol: 'tBNB',
  },
  rpcUrls: {
    public: { http: ['https://data-seed-prebsc-1-s1.binance.org:8545'] },
    default: { http: ['https://data-seed-prebsc-1-s1.binance.org:8545'] },
  },
  blockExplorers: {
    default: { name: 'BscScan', url: 'https://testnet.bscscan.com' },
  },
  contracts: {
    multicall3: {
      address: '0xca11bde05977b3631167028862be2a173976ca11',
      blockCreated: 17422483,
    },
  },
  testnet: true,
} as const

export const config = createConfig({
  chains: [bscTestnet], // 只保留 BSC 测试网
  connectors: [
    metaMask(),
  ],
  transports: {
    [bscTestnet.id]: http(),
  },
})