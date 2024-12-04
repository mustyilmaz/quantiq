import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          HomePage
        </Link>
        <ul className="navbar-menu">
          <li className="navbar-item">
            <Link to="/" className="navbar-link">Home</Link>
          </li>
          <li className="navbar-item">
            <Link to="/about" className="navbar-link">About</Link>
          </li>
          <li className="navbar-item">
            <Link to="/services" className="navbar-link">Services</Link>
          </li>
          <li className="navbar-item">
            <Link to="/weather-forecast" className="navbar-link">Test Client-server</Link>
          </li>
          <li className="navbar-item">
            <Link to="/commission-calculator" className="navbar-link">Commission Calculator</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
