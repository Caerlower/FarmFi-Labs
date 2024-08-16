const CryptograinToken = artifacts.require("CryptograinToken");
const Marketplace = artifacts.require("Marketplace");

module.exports = async function (deployer, network, accounts) {
  // Retrieve the deployed CryptograinToken contract instance from previous migrations
  const cryptograinToken = await CryptograinToken.deployed();
  console.log("CryptograinToken deployed at:", cryptograinToken.address);

  // Deploy the Marketplace contract and pass in the address of the CryptograinToken as the payment token
  await deployer.deploy(Marketplace, cryptograinToken.address);
  const marketplace = await Marketplace.deployed();
  console.log("Marketplace deployed at:", marketplace.address);

  // Optionally, perform any initial configuration or setup for the marketplace
  // For example, setting up initial listings, if required, or configuring permissions.
};
