import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import components
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';



// Import pages
import Home from './pages/Home';
import Marketplace from './pages/Marketplace';
import Staking from './pages/Staking';
import Governance from './pages/Governance';
import Tokenization from './pages/Tokenization';
import FarmerProfile from './pages/FarmerProfile';
import MerchantProfile from './pages/MerchantProfile';

// Import global styles
import './App.css';

const App = () => {
  return (
    <Router>
      <div className="app">
        <Header />
        <div className="app-body">
          <Sidebar /> {/* Sidebar for navigation */}
          <div className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/marketplace" element={<Marketplace />} />
              <Route path="/staking" element={<Staking />} />
              <Route path="/governance" element={<Governance />} />
              <Route path="/tokenization" element={<Tokenization />} />
              <Route path="/profile/farmer" element={<FarmerProfile />} />
              <Route path="/profile/merchant" element={<MerchantProfile />} />
            </Routes>
          </div>
        </div>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
