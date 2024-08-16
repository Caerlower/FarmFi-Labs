import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import cryptograinTokenAbi from '../abis/CryptograinToken.json'; // ABI for the token
import '../styles/wallet-dashboard.css'; // CSS file for styling

const WalletDashboard = () => {
  const [account, setAccount] = useState(null);
  const [ethBalance, setEthBalance] = useState('0');
  const [tokenBalance, setTokenBalance] = useState('0');
  const [loading, setLoading] = useState(true);

  // Example token contract address (replace with your deployed contract address)
  const tokenContractAddress = '0xYourCryptograinTokenContractAddressHere';

  // Fetch wallet info and balances
  const fetchWalletInfo = async () => {
    try {
      if (!window.ethereum) {
        alert('Please install MetaMask to use this feature!');
        return;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      const accountAddress = await signer.getAddress();
      setAccount(accountAddress);

      // Get ETH balance
      const ethBalanceWei = await provider.getBalance(accountAddress);
      setEthBalance(ethers.formatEther(ethBalanceWei));

      // Get CryptograinToken balance
      const tokenContract = new ethers.Contract(tokenContractAddress, cryptograinTokenAbi, provider);
      const balance = await tokenContract.balanceOf(accountAddress);
      setTokenBalance(ethers.formatUnits(balance, 18));

      setLoading(false);
    } catch (error) {
      console.error('Error fetching wallet info:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWalletInfo();
  }, []);

  return (
    <div className="wallet-dashboard">
      <h2>Wallet Dashboard</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          <div className="wallet-info">
            <p><strong>Wallet Address:</strong> {account}</p>
            <p><strong>Ether Balance:</strong> {ethBalance} ETH</p>
            <p><strong>Cryptograin Token Balance:</strong> {tokenBalance} CGT</p>
          </div>

          {/* Optionally, you can display recent transactions or other relevant information */}
        </div>
      )}
    </div>
  );
};

export default WalletDashboard;
