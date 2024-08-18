import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTachometerAlt, faShoppingCart, faCoins, faGavel, faUserTie, faStore } from '@fortawesome/free-solid-svg-icons';
import '../styles/sidebar.css';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <ul>
        <li>
          <Link to="/">
            <FontAwesomeIcon icon={faTachometerAlt} />
            <span>Dashboard</span>
          </Link>
        </li>
        <li>
          <Link to="/marketplace">
            <FontAwesomeIcon icon={faShoppingCart} />
            <span>Marketplace</span>
          </Link>
        </li>
        <li>
          <Link to="/staking">
            <FontAwesomeIcon icon={faCoins} />
            <span>Staking</span>
          </Link>
        </li>
        <li>
          <Link to="/governance">
            <FontAwesomeIcon icon={faGavel} />
            <span>Governance</span>
          </Link>
        </li>
        <li>
          <Link to="/profile/farmer">
            <FontAwesomeIcon icon={faUserTie} />
            <span>Farmer Profile</span>
          </Link>
        </li>
        <li>
          <Link to="/profile/merchant">
            <FontAwesomeIcon icon={faStore} />
            <span>Merchant Profile</span>
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
