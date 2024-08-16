import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ethers } from 'ethers';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faGavel, faCoins, faWallet } from '@fortawesome/free-solid-svg-icons';

import '../styles/header-footer.css';

const Header = () => {
  const [account, setAccount] = useState(null);

  // Function to connect the user's wallet
  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = await provider.getSigner();
        const accountAddress = await signer.getAddress();
        setAccount(accountAddress);
      } catch (error) {
        console.error("Error connecting wallet:", error);
      }
    } else {
      alert("Please install MetaMask!");
    }
  };

  useEffect(() => {
    // Check if wallet is already connected
    const checkWalletConnection = async () => {
      if (window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.listAccounts();
        if (accounts.length > 0) {
          setAccount(accounts[0].address);
        }
      }
    };
    checkWalletConnection();
  }, []);

  return (
    <header className="header">
      <nav className="navbar">
        <div className="navbar-content">
          <Link to="/" className="navbar-brand">FarmFi Labs</Link>
          <ul className="nav-links">
            <li className="nav-item">
              <Link to="/marketplace" className="nav-link">
                <FontAwesomeIcon icon={faShoppingCart} /> Marketplace
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/governance" className="nav-link">
                <FontAwesomeIcon icon={faGavel} /> Governance
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/staking" className="nav-link">
                <FontAwesomeIcon icon={faCoins} /> Staking
              </Link>
            </li>
          </ul>
          <div className="auth-section">
            {account ? (
              <span className="navbar-text">
                <FontAwesomeIcon icon={faWallet} /> {account.substring(0, 6)}...{account.substring(account.length - 4)}
              </span>
            ) : (
              <button onClick={connectWallet} className="btn btn-primary">
                <FontAwesomeIcon icon={faWallet} /> Connect Wallet
              </button>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
