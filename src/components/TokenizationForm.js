import React, { useState } from 'react';
import { ethers } from 'ethers';
import cryptograinTokenAbi from '../abis/CryptograinToken.json'; // ABI of the CryptograinToken contract

const TokenizationForm = () => {
  const [commodity, setCommodity] = useState('');
  const [quantity, setQuantity] = useState('');
  const [tokenizing, setTokenizing] = useState(false);
  const [message, setMessage] = useState('');

  // Example tokenization contract address (replace with your deployed contract address)
  const contractAddress = '0xYourCryptograinTokenContractAddressHere';

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if form is filled out correctly
    if (!commodity || !quantity) {
      setMessage('Please select a commodity and enter a quantity.');
      return;
    }

    try {
      setTokenizing(true);

      // Connect to the user's wallet
      if (!window.ethereum) {
        alert('Please install MetaMask to tokenize your commodity!');
        return;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();

      // Connect to the contract
      const contract = new ethers.Contract(contractAddress, cryptograinTokenAbi, signer);

      // Call the mint function (replace with your tokenization logic)
      const tx = await contract.mint(signer.getAddress(), ethers.utils.parseEther(quantity));
      await tx.wait();

      setMessage('Commodity successfully tokenized!');
    } catch (error) {
      console.error('Tokenization failed:', error);
      setMessage('Tokenization failed. Please try again.');
    } finally {
      setTokenizing(false);
    }
  };

  return (
    <div className="tokenization-form">
      <h2>Tokenize Your Commodity</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="commodity">Commodity Type</label>
          <select
            id="commodity"
            className="form-control"
            value={commodity}
            onChange={(e) => setCommodity(e.target.value)}
          >
            <option value="">Select a commodity</option>
            <option value="wheat">Wheat</option>
            <option value="corn">Corn</option>
            <option value="soy">Soy</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="quantity">Quantity (in metric tons)</label>
          <input
            type="number"
            id="quantity"
            className="form-control"
            placeholder="Enter quantity"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-primary" disabled={tokenizing}>
          {tokenizing ? 'Tokenizing...' : 'Tokenize'}
        </button>
      </form>
      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default TokenizationForm;
