import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";

dotenv.config();

const config: HardhatUserConfig = {
  solidity: "0.8.19",
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY || "",
  },
  networks: {
    sepolia: {
      url: process.env.SEPOLIA_RPC || "https://rpc.sepolia.org",
      chainId: 11155111,
      accounts: process.env.PRIVATE_KEY
        ? [process.env.PRIVATE_KEY]
        : process.env.MNEMONIC
          ? { mnemonic: process.env.MNEMONIC }
          : [],
    },
    baseSepolia: {
      url: process.env.BASE_SEPOLIA_RPC || "https://sepolia.base.org",
      chainId: 84532,
      accounts: process.env.PRIVATE_KEY
        ? [process.env.PRIVATE_KEY]
        : process.env.MNEMONIC
          ? { mnemonic: process.env.MNEMONIC }
          : [],
    },
  },
};

export default config;
