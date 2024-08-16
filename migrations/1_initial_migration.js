const CryptograinToken = artifacts.require("CryptograinToken");
const Governance = artifacts.require("Governance");
const Marketplace = artifacts.require("Marketplace");

module.exports = async function (deployer, network, accounts) {
  // Deploy the CryptograinToken contract
  await deployer.deploy(CryptograinToken);
  const cryptograinToken = await CryptograinToken.deployed();

  // Deploy the Governance contract
  await deployer.deploy(Governance);
  const governance = await Governance.deployed();

  // Deploy the Marketplace contract, passing in the address of CryptograinToken as the payment token
  await deployer.deploy(Marketplace, cryptograinToken.address);
  const marketplace = await Marketplace.deployed();

  // Optionally, perform some initial setup for the deployed contracts
  console.log("CryptograinToken deployed at:", cryptograinToken.address);
  console.log("Governance deployed at:", governance.address);
  console.log("Marketplace deployed at:", marketplace.address);
};
