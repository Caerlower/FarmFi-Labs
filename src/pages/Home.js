import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/home.css'; // CSS for styling the Home component

const Home = () => {
  return (
    <div className="home">
      <div className="intro">
        <h1>Welcome to FarmFi Labs</h1>
        <p>Empowering agriculture through decentralized finance and blockchain technology.</p>
      </div>

      <div className="features">
        <div className="feature">
          <h3>Tokenization</h3>
          <p>Convert your agricultural commodities into digital assets using our tokenization platform.</p>
          <Link to="/tokenization" className="btn btn-primary">Get Started</Link>
        </div>

        <div className="feature">
          <h3>Staking</h3>
          <p>Stake your tokens to earn rewards and support the decentralized economy of FarmFi Labs.</p>
          <Link to="/staking" className="btn btn-primary">Stake Now</Link>
        </div>

        <div className="feature">
          <h3>Governance</h3>
          <p>Participate in decentralized governance by creating and voting on proposals.</p>
          <Link to="/governance" className="btn btn-primary">Join Governance</Link>
        </div>

        <div className="feature">
          <h3>Marketplace</h3>
          <p>Buy and sell agricultural products and services in our decentralized marketplace.</p>
          <Link to="/marketplace" className="btn btn-primary">Explore Marketplace</Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
