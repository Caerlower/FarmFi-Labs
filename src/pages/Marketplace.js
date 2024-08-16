import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import marketplaceAbi from '../abis/Marketplace.json'; // ABI for Marketplace contract
import cryptograinTokenAbi from '../abis/CryptograinToken.json'; // ABI for CryptograinToken
import '../styles/marketplace.css'; // CSS for styling

const Marketplace = () => {
  const [account, setAccount] = useState(null);
  const [listings, setListings] = useState([]);
  const [newListing, setNewListing] = useState({ name: '', description: '', price: '' });
  const [loading, setLoading] = useState(true);

  const marketplaceContractAddress = '0xYourMarketplaceContractAddressHere';
  const tokenContractAddress = '0xYourCryptograinTokenContractAddressHere';

  // Fetch marketplace listings from the contract
  const fetchListings = async () => {
    try {
      if (!window.ethereum) {
        alert('Please install MetaMask to use this feature!');
        return;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      setAccount(await signer.getAddress());

      // Connect to the marketplace contract
      const marketplaceContract = new ethers.Contract(marketplaceContractAddress, marketplaceAbi, signer);

      // Fetch number of listings
      const listingCount = await marketplaceContract.getListingCount();
      const listingsData = [];

      for (let i = 0; i < listingCount; i++) {
        const listing = await marketplaceContract.getListing(i);
        listingsData.push({
          id: i,
          seller: listing.seller,
          name: listing.name,
          description: listing.description,
          price: ethers.formatUnits(listing.price, 18),
          active: listing.active,
        });
      }

      setListings(listingsData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching listings:', error);
      setLoading(false);
    }
  };

  // Purchase an item from the marketplace
  const purchaseItem = async (listingId, price) => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const marketplaceContract = new ethers.Contract(marketplaceContractAddress, marketplaceAbi, signer);
      const tokenContract = new ethers.Contract(tokenContractAddress, cryptograinTokenAbi, signer);

      // Approve the marketplace contract to spend the user's tokens
      const txApprove = await tokenContract.approve(marketplaceContractAddress, ethers.parseUnits(price, 18));
      await txApprove.wait();

      // Purchase the item
      const txPurchase = await marketplaceContract.purchaseProduct(listingId, 1);
      await txPurchase.wait();

      alert('Item purchased successfully!');
      fetchListings(); // Refresh listings after purchase
    } catch (error) {
      console.error('Error purchasing item:', error);
      alert('Failed to purchase item. Please try again.');
    }
  };

  // Create a new listing (optional feature for sellers)
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
      fetchListings(); // Refresh listings after creation
    } catch (error) {
      console.error('Error creating listing:', error);
      alert('Failed to create listing. Please try again.');
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);

  return (
    <div className="marketplace">
      <h2>Marketplace</h2>
      {loading ? (
        <p>Loading marketplace listings...</p>
      ) : (
        <div>
          <div className="listings">
            {listings.length === 0 ? (
              <p>No listings available</p>
            ) : (
              listings.map((listing, index) => (
                <div className="listing" key={index}>
                  <h4>{listing.name}</h4>
                  <p>{listing.description}</p>
                  <p><strong>Price:</strong> {listing.price} CGT</p>
                  <p><strong>Status:</strong> {listing.active ? 'Active' : 'Sold Out'}</p>
                  <button
                    className="btn btn-primary"
                    onClick={() => purchaseItem(listing.id, listing.price)}
                    disabled={!listing.active}
                  >
                    {listing.active ? 'Buy Now' : 'Sold Out'}
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Optional section for sellers to create new listings */}
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
        </div>
      )}
    </div>
  );
};

export default Marketplace;
