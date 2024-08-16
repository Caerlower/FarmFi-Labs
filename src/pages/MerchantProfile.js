import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers'; // Import ethers for general interaction
import { BigNumber } from '@ethersproject/bignumber'; // Correct import for BigNumber in v6
import marketplaceAbi from '../abis/Marketplace.json'; // Import ABI for marketplace interactions
import '../styles/profile.css'; // Add your CSS for styling

const MerchantProfile = () => {
  const [account, setAccount] = useState(null);
  const [listings, setListings] = useState([]);
  const [sales, setSales] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState('0');
  const [loading, setLoading] = useState(true);

  // Contract address (replace with your actual deployed contract addresses)
  const marketplaceContractAddress = '0xYourMarketplaceContractAddressHere';

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!window.ethereum) return;

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const accountAddress = await signer.getAddress();
      setAccount(accountAddress);

      // Fetch data from the marketplace contract
      await fetchMerchantListings(signer, accountAddress);
      await fetchSalesData(signer, accountAddress);

      setLoading(false);
    };

    fetchProfileData();
  }, []);

  // Fetch the merchant's active listings from the marketplace contract
  const fetchMerchantListings = async (signer, accountAddress) => {
    const marketplaceContract = new ethers.Contract(marketplaceContractAddress, marketplaceAbi, signer);
    const listingCount = await marketplaceContract.getListingCount();
    const merchantListings = [];

    for (let i = 0; i < listingCount; i++) {
      const listing = await marketplaceContract.getListing(i);
      if (listing.seller.toLowerCase() === accountAddress.toLowerCase()) {
        merchantListings.push(listing);
      }
    }

    setListings(merchantListings);
  };

  // Fetch sales data and calculate total revenue
  const fetchSalesData = async (signer, accountAddress) => {
    const marketplaceContract = new ethers.Contract(marketplaceContractAddress, marketplaceAbi, signer);
    const salesData = [];
    let totalRev = BigNumber.from(0); // Use BigNumber from '@ethersproject/bignumber'

    const salesCount = await marketplaceContract.getSalesCount(accountAddress); // Assume this is implemented
    for (let i = 0; i < salesCount; i++) {
      const sale = await marketplaceContract.getSale(accountAddress, i); // Assume this is implemented
      salesData.push(sale);
      totalRev = totalRev.add(sale.amount);
    }

    setSales(salesData);
    setTotalRevenue(ethers.formatUnits(totalRev, 18));
  };

  return (
    <div className="profile">
      {loading ? (
        <p>Loading profile data...</p>
      ) : (
        <>
          <h2>Merchant Profile</h2>
          <p><strong>Account:</strong> {account}</p>

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
            <h3>Your Sales Data</h3>
            {sales.length === 0 ? (
              <p>No sales data available.</p>
            ) : (
              <ul>
                {sales.map((sale, index) => (
                  <li key={index}>
                    <p><strong>Product ID:</strong> {sale.productId}</p>
                    <p><strong>Amount Sold:</strong> {ethers.formatUnits(sale.amount, 18)} CGT</p>
                    <p><strong>Buyer:</strong> {sale.buyer}</p>
                  </li>
                ))}
              </ul>
            )}
            <p><strong>Total Revenue:</strong> {totalRevenue} CGT</p>
          </div>
        </>
      )}
    </div>
  );
};

export default MerchantProfile;
