import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import stakingRewardsAbi from '../abis/StakingRewards.json'; // ABI for the StakingRewards contract
import '../styles/defi-dashboard.css'; // CSS for styling

const DeFiDashboard = () => {
  const [account, setAccount] = useState(null);
  const [stakedBalance, setStakedBalance] = useState('0');
  const [rewardsBalance, setRewardsBalance] = useState('0');
  const [loading, setLoading] = useState(true);

  // Example staking rewards contract address (replace with your deployed contract address)
  const stakingContractAddress = '0xYourStakingRewardsContractAddressHere';

  // Fetch DeFi data (staked tokens, rewards, etc.)
  const fetchDeFiData = async () => {
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

      // Connect to the staking rewards contract
      const stakingContract = new ethers.Contract(stakingContractAddress, stakingRewardsAbi, signer);

      // Fetch staked balance and rewards balance
      const staked = await stakingContract.balanceOf(accountAddress);
      const rewards = await stakingContract.earned(accountAddress);

      setStakedBalance(ethers.formatUnits(staked, 18));
      setRewardsBalance(ethers.formatUnits(rewards, 18));

      setLoading(false);
    } catch (error) {
      console.error('Error fetching DeFi data:', error);
      setLoading(false);
    }
  };

  // Function to claim rewards
  const claimRewards = async () => {
    try {
      if (!window.ethereum) {
        alert('Please install MetaMask to use this feature!');
        return;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const stakingContract = new ethers.Contract(stakingContractAddress, stakingRewardsAbi, signer);

      const tx = await stakingContract.getReward();
      await tx.wait();
      alert('Rewards claimed successfully!');

      // Update rewards balance after claiming
      const updatedRewards = await stakingContract.earned(signer.getAddress());
      setRewardsBalance(ethers.formatUnits(updatedRewards, 18));
    } catch (error) {
      console.error('Error claiming rewards:', error);
      alert('Failed to claim rewards. Please try again.');
    }
  };

  useEffect(() => {
    fetchDeFiData();
  }, []);

  return (
    <div className="defi-dashboard">
      <h2>DeFi Dashboard</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          <div className="wallet-info">
            <p><strong>Wallet Address:</strong> {account}</p>
          </div>
          <div className="defi-info">
            <p><strong>Staked Balance:</strong> {stakedBalance} CGT</p>
            <p><strong>Rewards Balance:</strong> {rewardsBalance} CGT</p>
          </div>
          <button className="btn btn-primary" onClick={claimRewards}>Claim Rewards</button>
          {/* Additional DeFi stats like APR and TVL */}
          <div className="defi-stats">
            <p><strong>Annual Percentage Rate (APR):</strong> 12.5%</p>
            <p><strong>Total Value Locked (TVL):</strong> $1,000,000</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeFiDashboard;
