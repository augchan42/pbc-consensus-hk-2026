import { BrowserProvider, Contract, type ContractRunner } from "ethers";

const BASE_SEPOLIA_CHAIN_ID = "0x14a34"; // 84532

const BASE_SEPOLIA_PARAMS = {
  chainId: BASE_SEPOLIA_CHAIN_ID,
  chainName: "Base Sepolia",
  nativeCurrency: { name: "ETH", symbol: "ETH", decimals: 18 },
  rpcUrls: ["https://sepolia.base.org"],
  blockExplorerUrls: ["https://sepolia.basescan.org"],
};

export const REGISTRY_ABI = [
  "function commit(bytes32 cosmologyHash, bytes32 reasoningHash, uint8 bias, uint8 confidence, uint8 hexagramNumber, uint8 movingLine, uint256 computationTimestamp) external returns (uint256 id)",
  "function getLatestCommitment() external view returns (uint256 id, bytes32 cosmologyHash, bytes32 reasoningHash, uint8 bias, uint8 confidence, uint8 hexagramNumber, uint8 movingLine, uint256 computationTimestamp, uint256 commitTimestamp, address committer)",
  "function commitmentCount() external view returns (uint256)",
  "function verify(uint256 id, bytes32 expectedCosmologyHash, bytes32 expectedReasoningHash) external view returns (bool)",
  "event CommitmentMade(uint256 indexed id, address indexed committer, bytes32 cosmologyHash, bytes32 reasoningHash, uint8 bias, uint8 confidence, uint8 hexagramNumber, uint256 computationTimestamp)",
];

export async function connectWallet() {
  if (!window.ethereum) throw new Error("No wallet detected");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const provider = new BrowserProvider(window.ethereum as any);
  const signer = await provider.getSigner();
  return { provider, signer };
}

export async function switchToBaseSepolia() {
  if (!window.ethereum) throw new Error("No wallet detected");
  try {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: BASE_SEPOLIA_CHAIN_ID }],
    });
  } catch (err: unknown) {
    if ((err as { code?: number })?.code === 4902) {
      await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [BASE_SEPOLIA_PARAMS],
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
