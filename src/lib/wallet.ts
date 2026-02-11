import { BrowserProvider, Contract, type ContractRunner } from "ethers";

interface ChainInfo {
  chainId: string;
  chainName: string;
  nativeCurrency: { name: string; symbol: string; decimals: number };
  rpcUrls: string[];
  blockExplorerUrls: string[];
}

const CHAINS: Record<string, ChainInfo> = {
  sepolia: {
    chainId: "0xaa36a7", // 11155111
    chainName: "Sepolia",
    nativeCurrency: { name: "ETH", symbol: "ETH", decimals: 18 },
    rpcUrls: ["https://rpc.sepolia.org"],
    blockExplorerUrls: ["https://sepolia.etherscan.io"],
  },
  baseSepolia: {
    chainId: "0x14a34", // 84532
    chainName: "Base Sepolia",
    nativeCurrency: { name: "ETH", symbol: "ETH", decimals: 18 },
    rpcUrls: ["https://sepolia.base.org"],
    blockExplorerUrls: ["https://sepolia.basescan.org"],
  },
  mainnet: {
    chainId: "0x1", // 1
    chainName: "Ethereum",
    nativeCurrency: { name: "ETH", symbol: "ETH", decimals: 18 },
    rpcUrls: ["https://eth.llamarpc.com"],
    blockExplorerUrls: ["https://etherscan.io"],
  },
  base: {
    chainId: "0x2105", // 8453
    chainName: "Base",
    nativeCurrency: { name: "ETH", symbol: "ETH", decimals: 18 },
    rpcUrls: ["https://mainnet.base.org"],
    blockExplorerUrls: ["https://basescan.org"],
  },
};

const networkKey = process.env.NEXT_PUBLIC_CHAIN || "sepolia";

export const CHAIN_CONFIG = CHAINS[networkKey] || CHAINS.sepolia;

export const REGISTRY_ABI = [
  "function commit(bytes32 cosmologyHash, bytes32 reasoningHash, uint8 bias, uint8 confidence, uint8 hexagramNumber, uint8 movingLine, uint256 computationTimestamp) external returns (uint256 id)",
  "function getLatestCommitment() external view returns (uint256 id, bytes32 cosmologyHash, bytes32 reasoningHash, uint8 bias, uint8 confidence, uint8 hexagramNumber, uint8 movingLine, uint256 computationTimestamp, uint256 commitTimestamp, address committer)",
  "function commitments(uint256) external view returns (bytes32 cosmologyHash, bytes32 reasoningHash, uint8 bias, uint8 confidence, uint8 hexagramNumber, uint8 movingLine, uint256 computationTimestamp, uint256 commitTimestamp, address committer)",
  "function commitmentCount() external view returns (uint256)",
  "function verify(uint256 id, bytes32 expectedCosmologyHash, bytes32 expectedReasoningHash) external view returns (bool)",
  "event CommitmentMade(uint256 indexed id, address indexed committer, bytes32 cosmologyHash, bytes32 reasoningHash, uint8 bias, uint8 confidence, uint8 hexagramNumber, uint256 computationTimestamp)",
];

export function getEthProvider() {
  if (!window.ethereum) throw new Error("No wallet detected");
  // If multiple wallet extensions exist, prefer MetaMask
  if (window.ethereum.providers?.length) {
    const metamask = window.ethereum.providers.find((p) => p.isMetaMask);
    if (metamask) return metamask;
  }
  return window.ethereum;
}

export async function connectWallet() {
  const eth = getEthProvider();
  await eth.request({ method: "eth_requestAccounts" });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const provider = new BrowserProvider(eth as any);
  const signer = await provider.getSigner();
  return { provider, signer };
}

export async function switchChain() {
  const eth = getEthProvider();
  try {
    await eth.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: CHAIN_CONFIG.chainId }],
    });
  } catch (err: unknown) {
    const code = (err as { code?: number })?.code;
    // 4902 = chain not added, -32603 = internal error (MetaMask can't find chain)
    if (code === 4902 || code === -32603) {
      await eth.request({
        method: "wallet_addEthereumChain",
        params: [CHAIN_CONFIG],
      });
    } else {
      throw err;
    }
  }
}

export function getRegistryContract(signerOrProvider: ContractRunner) {
  const address = process.env.NEXT_PUBLIC_REGISTRY_ADDRESS;
  if (!address) throw new Error("NEXT_PUBLIC_REGISTRY_ADDRESS not set");
  return new Contract(address, REGISTRY_ABI, signerOrProvider);
}
