import axios from 'axios';
import { ethers } from 'ethers';

// Example endpoint for Chainlink or any other oracle API
const ORACLE_API_URL = 'https://api.your-oracle.com/data';

// Define contract ABI and address (replace with your actual contract details)
const oracleContractAbi = [
  // ABI of the oracle-related functions in your contract
  {
    "constant": true,
    "inputs": [],
    "name": "getPrice",
    "outputs": [
      { "name": "", "type": "uint256" }
    ],
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      { "name": "price", "type": "uint256" }
    ],
    "name": "updatePrice",
    "outputs": [],
    "type": "function"
  }
];
const oracleContractAddress = '0xYourOracleContractAddressHere';

// Fetch data from an external API (mocking Chainlink or another source)
export const fetchExternalData = async () => {
  try {
    const response = await axios.get(`${ORACLE_API_URL}`);
    if (response.data) {
      console.log("Fetched data from oracle:", response.data);
      return response.data; // Return the relevant data
    } else {
      throw new Error("No data received from oracle API");
    }
  } catch (error) {
    console.error("Error fetching external data:", error);
    throw error;
  }
};

// Fetch price from the on-chain oracle contract
export const fetchOnChainPrice = async (provider) => {
  try {
    const oracleContract = new ethers.Contract(oracleContractAddress, oracleContractAbi, provider);
    const price = await oracleContract.getPrice();
    console.log("Fetched on-chain price:", ethers.formatUnits(price, 18)); // Adjust units as needed
    return price;
  } catch (error) {
    console.error("Error fetching on-chain price:", error);
    throw error;
  }
};

// Submit data to the on-chain oracle contract (update the price)
export const submitDataToOracle = async (newPrice, signer) => {
  try {
    const oracleContract = new ethers.Contract(oracleContractAddress, oracleContractAbi, signer);
    const tx = await oracleContract.updatePrice(ethers.parseUnits(newPrice.toString(), 18)); // Convert price to appropriate units
    const receipt = await tx.wait();
    console.log("Submitted data to oracle, transaction receipt:", receipt);
    return receipt;
  } catch (error) {
    console.error("Error submitting data to oracle:", error);
    throw error;
  }
};
