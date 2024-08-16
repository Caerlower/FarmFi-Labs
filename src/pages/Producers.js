import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import marketplaceAbi from '../abis/Marketplace.json'; // ABI for the Marketplace contract
import cryptograinTokenAbi from '../abis/CryptograinToken.json'; // ABI for CryptograinToken
import stakingRewardsAbi from '../abis/StakingRewards.json'; // ABI for StakingRewards contract
import '../styles/producers.css'; // CSS for styling

const Producers = () => {
  const [account, setAccount] = useState(null);
  const [listings, setListings] = useState([]);
  const [newListing, setNewListing] = useState({ name: '', description: '', price: '' });
  const [stakedBalance, setStakedBalance] = useState('0');
  const [rewardsBalance, setRewardsBalance] = useState('0');
  const [loading, setLoading] = useState(true);

  const marketplaceContractAddress = '0xYourMarketplaceContractAddressHere';
  const tokenContractAddress = '0xYourCryptograinTokenContractAddressHere';
  const stakingContractAddress = '0xYourStakingRewardsContractAddressHere';

  // Fetch producer's listings and staking information
  const fetchProducerData = async () => {
    try {
      if (!window.ethereum) {
        alert('Please install MetaMask to use this feature!');
        return;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      setAccount(await signer.getAddress());

      // Fetch listings for the producer
      const marketplaceContract = new ethers.Contract(marketplaceContractAddress, marketplaceAbi, signer);
      const listingCount = await marketplaceContract.getListingCount();
      const producerListings = [];

      for (let i = 0; i < listingCount; i++) {
        const listing = await marketplaceContract.getListing(i);
        if (listing[0].toLowerCase() === account.toLowerCase()) {
          producerListings.push({
            id: i,
            name: listing[1],
            description: listing[2],
            price: ethers.formatUnits(listing[3], 18),
            active: listing[4],
          });
        }
      }

      setListings(producerListings);

      // Fetch staking data
      const stakingContract = new ethers.Contract(stakingContractAddress, stakingRewardsAbi, signer);
      const staked = await stakingContract.balanceOf(account);
      const rewards = await stakingContract.earned(account);

      setStakedBalance(ethers.formatUnits(staked, 18));
      setRewardsBalance(ethers.formatUnits(rewards, 18));

      setLoading(false);
    } catch (error) {
      console.error('Error fetching producer data:', error);
      setLoading(false);
    }
  };

  // Create a new listing
  const createListing = async () => {
    const { name, description, price } = newListing;
    if (!name || !description || !price) {
      alert('Please fill out all fields');
      return;
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const marketplaceContract = new ethers.Contract(marketplaceContractAddress, marketplaceAbi, signer);

      const tx = await marketplaceContract.createListing(name, description, ethers.parseUnits(price, 18));
      await tx.wait();

      alert('Listing created successfully!');
      setNewListing({ name: '', description: '', price: '' }); // Clear form
      fetchProducerData(); // Refresh listings after creation
    } catch (error) {
      console.error('Error creating listing:', error);
      alert('Failed to create listing. Please try again.');
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
      fetchProducerData(); // Refresh staking data after claiming rewards
    } catch (error) {
      console.error('Error claiming rewards:', error);
      alert('Failed to claim rewards. Please try again.');
    }
  };

  useEffect(() => {
    fetchProducerData();
  }, []);

  return (
    <div className="producers">
      <h2>Producer Dashboard</h2>
      {loading ? (
        <p>Loading producer data...</p>
      ) : (
        <div>
          <div className="producer-listings">
            <h3>Your Listings</h3>
            {listings.length === 0 ? (
              <p>No listings available</p>
            ) : (
              listings.map((listing, index) => (
                <div className="listing" key={index}>
                  <h4>{listing.name}</h4>
                  <p>{listing.description}</p>
                  <p><strong>Price:</strong> {listing.price} CGT</p>
                  <p><strong>Status:</strong> {listing.active ? 'Active' : 'Inactive'}</p>
                </div>
              ))
            )}
          </div>

          <div className="create-listing">
            <h3>Create New Listing</h3>
            <input
              type="text"
              className="form-control"
              placeholder="Product Name"
              value={newListing.name}
              onChange={(e) => setNewListing({ ...newListing, name: e.target.value })}
            />
            <textarea
              className="form-control"
              placeholder="Product Description"
              value={newListing.description}
              onChange={(e) => setNewListing({ ...newListing, description: e.target.value })}
            ></textarea>
            <input
              type="number"
              className="form-control"
              placeholder="Price in CGT"
              value={newListing.price}
              onChange={(e) => setNewListing({ ...newListing, price: e.target.value })}
            />
            <button className="btn btn-success" onClick={createListing}>Create Listing</button>
          </div>

          <div className="staking-info">
            <h3>Your Staking</h3>
            <p><strong>Staked Balance:</strong> {stakedBalance} CGT</p>
            <p><strong>Rewards Balance:</strong> {rewardsBalance} CGT</p>
            <button className="btn btn-primary" onClick={claimRewards}>Claim Rewards</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Producers;
