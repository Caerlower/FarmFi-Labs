import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTachometerAlt, faShoppingCart, faCoins, faGavel, faUserTie, faStore, faTimes, faBars } from '@fortawesome/free-solid-svg-icons';
import '../styles/sidebar.css'; // Add your CSS for styling

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true); // State to toggle sidebar visibility

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <button className="toggle-button" onClick={toggleSidebar}>
        <FontAwesomeIcon icon={isOpen ? faTimes : faBars} />
      </button>
      <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
        <ul>
          <li>
            <Link to="/dashboard">
              <FontAwesomeIcon icon={faTachometerAlt} /> Dashboard
            </Link>
          </li>
          <li>
            <Link to="/marketplace">
              <FontAwesomeIcon icon={faShoppingCart} /> Marketplace
            </Link>
          </li>
          <li>
            <Link to="/staking">
              <FontAwesomeIcon icon={faCoins} /> Staking
            </Link>
          </li>
          <li>
            <Link to="/governance">
              <FontAwesomeIcon icon={faGavel} /> Governance
            </Link>
          </li>
          <li>
            <Link to="/profile/farmer">
              <FontAwesomeIcon icon={faUserTie} /> Farmer Profile
            </Link>
          </li>
          <li>
            <Link to="/profile/merchant">
              <FontAwesomeIcon icon={faStore} /> Merchant Profile
            </Link>
          </li>
        </ul>
      </div>
    </>
  );
};

export default Sidebar;
