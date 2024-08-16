const Web3 = require('web3');
const BN = Web3.utils.BN;

/**
 * @dev Converts an amount of tokens to its base unit (e.g., from ether to wei for ERC20 tokens with 18 decimals).
 * @param {string|number} amount - The amount in human-readable form (e.g., 1 for 1 token).
 * @param {number} [decimals=18] - The number of decimals for the token.
 * @return {BN} The amount in the base unit (e.g., wei).
 */
function toWei(amount, decimals = 18) {
  return Web3.utils.toWei(amount.toString(), 'ether').toString();
}

/**
 * @dev Converts an amount of tokens from its base unit to a human-readable form (e.g., from wei to ether).
 * @param {string|number} amount - The amount in base units (e.g., wei for ERC20 tokens with 18 decimals).
 * @param {number} [decimals=18] - The number of decimals for the token.
 * @return {string} The amount in human-readable form.
 */
function fromWei(amount, decimals = 18) {
  return Web3.utils.fromWei(amount.toString(), 'ether');
}

/**
 * @dev Deploys a contract with specific arguments.
 * @param {object} contractArtifact - The contract artifact (compiled contract) to deploy.
 * @param {Array} args - The arguments for the contract's constructor.
 * @param {object} deployer - The deployer object (usually from Truffle or Hardhat).
 * @param {string} [from] - The address from which to deploy the contract (optional).
 * @return {object} The deployed contract instance.
 */
async function deployContract(contractArtifact, args, deployer, from) {
  let contract;
  if (from) {
    contract = await deployer.deploy(contractArtifact, ...args, { from });
  } else {
    contract = await deployer.deploy(contractArtifact, ...args);
  }
  return contract.deployed();
}

/**
 * @dev Logs a contract's deployed address.
 * @param {string} contractName - The name of the contract.
 * @param {object} contractInstance - The deployed contract instance.
 */
function logContractDeployment(contractName, contractInstance) {
  console.log(`${contractName} deployed at: ${contractInstance.address}`);
}

/**
 * @dev Waits for a specified number of seconds (useful for timing delays in tests or scripts).
 * @param {number} seconds - The number of seconds to wait.
 * @return {Promise<void>}
 */
function wait(seconds) {
  return new Promise(resolve => setTimeout(resolve, seconds * 1000));
}

/**
 * @dev Returns a BigNumber representing the block number at which the contract is deployed.
 * @param {object} web3Instance - The Web3 instance to interact with the blockchain.
 * @return {Promise<number>} The current block number.
 */
async function getCurrentBlockNumber(web3Instance) {
  return await web3Instance.eth.getBlockNumber();
}

module.exports = {
  toWei,
  fromWei,
  deployContract,
  logContractDeployment,
  wait,
  getCurrentBlockNumber
};
