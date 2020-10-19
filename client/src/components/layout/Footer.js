import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

const Footer = ({ version }) => {
  return (
    <footer className="navbar fixed-bottom navbar-dark bg-dark">
      <div className="container">
        <h6 className="navbar-brand text-muted">
          <small>Version: {version}</small>
        </h6>
        <ul className="navbar-nav ml-auto">
          <li className="nav-item">
            <Link className="nav-link" to="/about">
              About
            </Link>
          </li>
        </ul>
      </div>
    </footer>
  );
};

Footer.propTypes = {
  version: PropTypes.string
};

Footer.defaultProps = {
  version: "1.0.0"
};
export default Footer;
