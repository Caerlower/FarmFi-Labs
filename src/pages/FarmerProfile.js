import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import marketplaceAbi from '../abis/Marketplace.json'; // Import ABI for marketplace interactions
import cryptograinTokenAbi from '../abis/CryptograinToken.json'; // ABI for the tokenized commodity contract
import stakingRewardsAbi from '../abis/StakingRewards.json'; // ABI for staking contract
import '../styles/profile.css'; // Add your CSS for styling

const FarmerProfile = () => {
  const [account, setAccount] = useState(null);
  const [listings, setListings] = useState([]);
  const [stakedBalance, setStakedBalance] = useState('0');
  const [rewardsBalance, setRewardsBalance] = useState('0');
  const [tokenizedCommodities, setTokenizedCommodities] = useState('0');
  const [loading, setLoading] = useState(true);

  // Contract addresses (replace with your actual deployed contract addresses)
  const marketplaceContractAddress = '0xYourMarketplaceContractAddressHere';
  const tokenContractAddress = '0xYourCryptograinTokenContractAddressHere';
  const stakingContractAddress = '0xYourStakingRewardsContractAddressHere';

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!window.ethereum) return;

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const accountAddress = await signer.getAddress();
      setAccount(accountAddress);

      // Fetch data from marketplace, staking, and token contracts
      await fetchMarketplaceListings(signer, accountAddress);
      await fetchStakingData(signer, accountAddress);
      await fetchTokenizedCommodities(signer, accountAddress);

      setLoading(false);
    };

    fetchProfileData();
  }, []);

  // Fetch the farmer's active listings from the marketplace contract
  const fetchMarketplaceListings = async (signer, accountAddress) => {
    const marketplaceContract = new ethers.Contract(marketplaceContractAddress, marketplaceAbi, signer);
    const listingCount = await marketplaceContract.getListingCount();
    const farmerListings = [];

    for (let i = 0; i < listingCount; i++) {
      const listing = await marketplaceContract.getListing(i);
      if (listing.seller.toLowerCase() === accountAddress.toLowerCase()) {
        farmerListings.push(listing);
      }
    }

    setListings(farmerListings);
  };

  // Fetch the staked balance and rewards from the staking contract
  const fetchStakingData = async (signer, accountAddress) => {
    const stakingContract = new ethers.Contract(stakingContractAddress, stakingRewardsAbi, signer);

    const staked = await stakingContract.balanceOf(accountAddress);
    const rewards = await stakingContract.earned(accountAddress);

    setStakedBalance(ethers.formatUnits(staked, 18));
    setRewardsBalance(ethers.formatUnits(rewards, 18));
  };

  // Fetch the amount of tokenized commodities from the token contract
  const fetchTokenizedCommodities = async (signer, accountAddress) => {
    const tokenContract = new ethers.Contract(tokenContractAddress, cryptograinTokenAbi, signer);
    const balance = await tokenContract.balanceOf(accountAddress);

    setTokenizedCommodities(ethers.formatUnits(balance, 18));
  };

  return (
    <div className="profile">
      {loading ? (
        <p>Loading profile data...</p>
      ) : (
        <>
          <h2>Farmer Profile</h2>
          <p><strong>Account:</strong> {account}</p>

          <div className="profile-section">
            <h3>Your Tokenized Commodities</h3>
            <p><strong>Balance:</strong> {tokenizedCommodities} CGT</p>
          </div>

          <div className="profile-section">
            <h3>Your Active Listings</h3>
            {listings.length === 0 ? (
              <p>No active listings.</p>
            ) : (
              <ul>
                {listings.map((listing, index) => (
                  <li key={index}>
                    <h4>{listing.name}</h4>
                    <p>{listing.description}</p>
                    <p><strong>Price:</strong> {ethers.formatUnits(listing.price, 18)} CGT</p>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="profile-section">
            <h3>Your Staking Status</h3>
            <p><strong>Staked Balance:</strong> {stakedBalance} CGT</p>
            <p><strong>Earned Rewards:</strong> {rewardsBalance} CGT</p>
          </div>
        </>
      )}
    </div>
  );
};

export default FarmerProfile;
