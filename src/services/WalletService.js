import { ethers } from 'ethers';

// State for connected account and provider
let provider;
let signer;
let account;

// Connect to MetaMask (or other injected wallets)
export const connectWallet = async () => {
  if (window.ethereum) {
    try {
      provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      signer = await provider.getSigner();
      account = await signer.getAddress();

      console.log("Connected account:", account);
      return account; // Return the connected account address
    } catch (error) {
      console.error("Error connecting to wallet:", error);
      throw error;
    }
  } else {
    alert("MetaMask or another Ethereum-compatible wallet is required.");
    throw new Error("No wallet found");
  }
};

// Get the connected account address
export const getAccount = () => {
  if (!account) {
    throw new Error("No wallet connected");
  }
  return account;
};

// Get provider (for network interactions)
export const getProvider = () => {
  if (!provider) {
    throw new Error("No wallet connected");
  }
  return provider;
};

// Get signer (for signing transactions)
export const getSigner = () => {
  if (!signer) {
    throw new Error("No wallet connected");
  }
  return signer;
};

// Send ETH or Tokens via Wallet
export const sendTransaction = async (toAddress, amountInEther) => {
  try {
    if (!signer) {
      throw new Error("No wallet connected");
    }

    const transaction = {
      to: toAddress,
      value: ethers.parseEther(amountInEther.toString()), // Convert to wei
    };

    const txResponse = await signer.sendTransaction(transaction);
    const receipt = await txResponse.wait();

    console.log("Transaction receipt:", receipt);
    return receipt; // Return the transaction receipt
  } catch (error) {
    console.error("Error sending transaction:", error);
    throw error;
  }
};

// Sign a message with the connected wallet
export const signMessage = async (message) => {
  try {
    if (!signer) {
      throw new Error("No wallet connected");
    }

    const signature = await signer.signMessage(message);
    console.log("Message signature:", signature);

    return signature; // Return the signed message
  } catch (error) {
    console.error("Error signing message:", error);
    throw error;
  }
};

// Disconnect the wallet (optional)
export const disconnectWallet = () => {
  provider = null;
  signer = null;
  account = null;
  console.log("Wallet disconnected");
};
