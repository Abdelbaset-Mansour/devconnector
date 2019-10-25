import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Navbar extends Component {
  render() {
    return (
      <nav
        className="navbar is-dark"
        role="navigation"
        aria-label="main navigation"
      >
        <div className="container">
          <div className="navbar-brand">
            <Link to="/" className="navbar-item">
              DevConnector
            </Link>

            <button
              className="navbar-burger burger"
              aria-label="menu"
              aria-expanded="false"
              data-target="navbarBasicExample"
            >
              <span aria-hidden="true"></span>
              <span aria-hidden="true"></span>
              <span aria-hidden="true"></span>
            </button>
          </div>

          <div id="navbarBasicExample" className="navbar-menu">
            <div className="navbar-start">
              <Link to="/profiles" className="navbar-item">
                Developers
              </Link>
            </div>

            <div className="navbar-end">
              <Link to="/register" className="navbar-item">
                Sign Up
              </Link>
              <Link to="login" className="navbar-item">
                Login
              </Link>
            </div>
          </div>
        </div>
      </nav>
    );
  }
}

export default Navbar;
