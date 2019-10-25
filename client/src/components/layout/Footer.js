import React, { Component } from 'react';

class Footer extends Component {
  render() {
    return (
      <footer id="footer">
        Copyright &copy; {new Date().getFullYear()} DevConnector
      </footer>
    );
  }
}

export default Footer;
