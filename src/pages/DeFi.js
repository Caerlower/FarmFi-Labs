import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import stakingRewardsAbi from '../abis/StakingRewards.json'; // ABI for the StakingRewards contract
import cryptograinTokenAbi from '../abis/CryptograinToken.json'; // ABI for CryptograinToken
import '../styles/defi.css'; // CSS for styling

const DeFi = () => {
  const [account, setAccount] = useState(null);
  const [stakedBalance, setStakedBalance] = useState('0');
  const [rewardsBalance, setRewardsBalance] = useState('0');
  const [stakeAmount, setStakeAmount] = useState('');
  const [loading, setLoading] = useState(true);

  const stakingContractAddress = '0xYourStakingRewardsContractAddressHere';
  const tokenContractAddress = '0xYourCryptograinTokenContractAddressHere';

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
      setAccount(await signer.getAddress());

      const stakingContract = new ethers.Contract(stakingContractAddress, stakingRewardsAbi, signer);

      // Fetch staked balance and rewards balance
      const staked = await stakingContract.balanceOf(account);
      const rewards = await stakingContract.earned(account);

      setStakedBalance(ethers.formatUnits(staked, 18));
      setRewardsBalance(ethers.formatUnits(rewards, 18));

      setLoading(false);
    } catch (error) {
      console.error('Error fetching DeFi data:', error);
      setLoading(false);
    }
  };

  // Stake tokens
  const stakeTokens = async () => {
    if (!stakeAmount || isNaN(stakeAmount)) {
      alert('Please enter a valid stake amount');
      return;
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const stakingContract = new ethers.Contract(stakingContractAddress, stakingRewardsAbi, signer);
      const tokenContract = new ethers.Contract(tokenContractAddress, cryptograinTokenAbi, signer);

      // Approve the staking contract to spend the user's tokens
      const txApprove = await tokenContract.approve(stakingContractAddress, ethers.parseUnits(stakeAmount, 18));
      await txApprove.wait();

      // Stake the tokens
      const txStake = await stakingContract.stake(ethers.parseUnits(stakeAmount, 18));
      await txStake.wait();

      alert('Tokens staked successfully!');
      setStakeAmount('');
      fetchDeFiData(); // Refresh staking data after staking
    } catch (error) {
      console.error('Error staking tokens:', error);
      alert('Failed to stake tokens. Please try again.');
    }
  };

  // Claim staking rewards
  const claimRewards = async () => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const stakingContract = new ethers.Contract(stakingContractAddress, stakingRewardsAbi, signer);

      const tx = await stakingContract.getReward();
      await tx.wait();

      alert('Rewards claimed successfully!');
      fetchDeFiData(); // Refresh staking data after claiming rewards
    } catch (error) {
      console.error('Error claiming rewards:', error);
      alert('Failed to claim rewards. Please try again.');
    }
  };

  useEffect(() => {
    fetchDeFiData();
  }, []);

  return (
    <div className="defi">
      <h2>DeFi Dashboard</h2>
      {loading ? (
        <p>Loading DeFi data...</p>
      ) : (
        <div>
          <div className="staking-info">
            <h3>Your Staking</h3>
            <p><strong>Staked Balance:</strong> {stakedBalance} CGT</p>
            <p><strong>Rewards Balance:</strong> {rewardsBalance} CGT</p>
            <button className="btn btn-primary" onClick={claimRewards}>Claim Rewards</button>
          </div>

          <div className="stake-tokens">
            <h3>Stake Tokens</h3>
            <input
              type="number"
              className="form-control"
              placeholder="Amount to stake in CGT"
              value={stakeAmount}
              onChange={(e) => setStakeAmount(e.target.value)}
            />
            <button className="btn btn-success" onClick={stakeTokens}>Stake Tokens</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeFi;
