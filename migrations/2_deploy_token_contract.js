const GovernanceToken = artifacts.require("GovernanceToken");
const StakingRewards = artifacts.require("StakingRewards");
const CryptograinToken = artifacts.require("CryptograinToken");

module.exports = async function (deployer, network, accounts) {
  // Define token parameters (these can be customized)
  const initialSupply = web3.utils.toWei('1000000', 'ether');  // 1 million tokens

  // Deploy the GovernanceToken contract with the initial supply minted to the deployer's address
  await deployer.deploy(GovernanceToken, initialSupply);
  const governanceToken = await GovernanceToken.deployed();
  console.log("GovernanceToken deployed at:", governanceToken.address);

  // Assuming CryptograinToken was deployed in the first migration (1_initial_migration.js),
  // we can retrieve its deployed instance
  const cryptograinToken = await CryptograinToken.deployed();
  console.log("CryptograinToken deployed at:", cryptograinToken.address);

  // Deploy the StakingRewards contract, passing in the address of CryptograinToken and GovernanceToken
  await deployer.deploy(StakingRewards, cryptograinToken.address, governanceToken.address, accounts[0]);
  const stakingRewards = await StakingRewards.deployed();
  console.log("StakingRewards deployed at:", stakingRewards.address);

  // Optionally, initialize the StakingRewards contract with initial parameters
  const rewardRate = web3.utils.toWei('1', 'ether');  // Example reward rate (1 token per block)
  await stakingRewards.updateRewardRate(rewardRate);
  console.log("StakingRewards contract initialized with reward rate:", rewardRate);
};
