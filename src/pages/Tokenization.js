import React, { useState } from 'react';
import { ethers } from 'ethers';
import cryptograinTokenAbi from '../abis/CryptograinToken.json'; // ABI for CryptograinToken
import '../styles/tokenization.css'; // CSS for styling

const Tokenization = () => {
  const [commodity, setCommodity] = useState('');
  const [quantity, setQuantity] = useState('');
  const [tokenizing, setTokenizing] = useState(false);
  const [message, setMessage] = useState('');

  const contractAddress = '0xYourCryptograinTokenContractAddressHere';

  const handleTokenize = async (e) => {
    e.preventDefault();

    if (!commodity || !quantity) {
      setMessage('Please select a commodity and enter a quantity.');
      return;
    }

    try {
      setTokenizing(true);
      if (!window.ethereum) {
        alert('Please install MetaMask to tokenize your commodity!');
        setTokenizing(false);
        return;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, cryptograinTokenAbi, signer);

      const tx = await contract.mint(signer.getAddress(), ethers.parseUnits(quantity, 18));
      await tx.wait();

      setMessage(`Successfully tokenized ${quantity} units of ${commodity}.`);
      setCommodity('');
      setQuantity('');
    } catch (error) {
      console.error('Error tokenizing commodity:', error);
      setMessage('Tokenization failed. Please try again.');
    } finally {
      setTokenizing(false);
    }
  };

  return (
    <div className="tokenization">
      <h2>Tokenize Your Commodity</h2>
      <form onSubmit={handleTokenize}>
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

export default Tokenization;
