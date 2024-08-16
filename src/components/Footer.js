import React from 'react';
import { Link } from 'react-router-dom';
import { FaTwitter, FaLinkedin, FaGithub } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="row">
          <div className="col-md-6">
            <ul className="footer-links">
              <li>
                <Link to="/terms">Terms of Service</Link>
              </li>
              <li>
                <Link to="/privacy">Privacy Policy</Link>
              </li>
            </ul>
          </div>
          <div className="col-md-6 text-end">
            <ul className="social-icons">
              <li>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                  <FaTwitter />
                </a>
              </li>
              <li>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                  <FaLinkedin />
                </a>
              </li>
              <li>
                <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                  <FaGithub />
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="row">
          <div className="col-12 text-center">
            <p className="footer-copyright">© 2024 FarmFi Labs. All Rights Reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
