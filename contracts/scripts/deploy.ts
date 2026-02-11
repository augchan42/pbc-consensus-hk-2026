import { ethers } from "hardhat";

async function main() {
  const factory = await ethers.getContractFactory("CosmicCommitmentRegistry");
  const registry = await factory.deploy();
  await registry.waitForDeployment();

  const address = await registry.getAddress();
  console.log(`CosmicCommitmentRegistry deployed to: ${address}`);
  console.log(`Add to .env: NEXT_PUBLIC_REGISTRY_ADDRESS=${address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
