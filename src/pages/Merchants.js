import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import marketplaceAbi from '../abis/Marketplace.json'; // ABI for the Marketplace contract
import '../styles/merchants.css'; // CSS for styling

const Merchants = () => {
  const [account, setAccount] = useState(null);
  const [listings, setListings] = useState([]);
  const [newListing, setNewListing] = useState({ name: '', description: '', price: '' });
  const [loading, setLoading] = useState(true);

  const marketplaceContractAddress = '0xYourMarketplaceContractAddressHere';

  // Fetch merchant's listings from the marketplace contract
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
      const listingCount = await marketplaceContract.getListingCount();
      const merchantListings = [];

      for (let i = 0; i < listingCount; i++) {
        const listing = await marketplaceContract.getListing(i);
        if (listing[0].toLowerCase() === account.toLowerCase()) {
          merchantListings.push({
            id: i,
            name: listing[1],
            description: listing[2],
            price: ethers.formatUnits(listing[3], 18),
            active: listing[4],
            sales: await marketplaceContract.getSales(i),
          });
        }
      }

      setListings(merchantListings);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching listings:', error);
      setLoading(false);
    }
  };

  // Add a new listing to the marketplace
  const addListing = async () => {
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

      alert('Listing added successfully!');
      setNewListing({ name: '', description: '', price: '' });
      fetchListings(); // Refresh listings after adding
    } catch (error) {
      console.error('Error adding listing:', error);
      alert('Failed to add listing. Please try again.');
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);

  return (
    <div className="merchants">
      <h2>Merchant Dashboard</h2>
      {loading ? (
        <p>Loading your listings...</p>
      ) : (
        <div>
          <div className="merchant-listings">
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
                  <p><strong>Total Sales:</strong> {listing.sales} units sold</p>
                </div>
              ))
            )}
          </div>

          <div className="add-listing">
            <h3>Add New Product</h3>
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
            <button className="btn btn-success" onClick={addListing}>Add Product</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Merchants;
