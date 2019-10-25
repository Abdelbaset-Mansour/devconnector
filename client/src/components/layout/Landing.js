import React from 'react';
import { Link } from 'react-router-dom';

const Landing = () => {
  return (
    <div className="landing">
      <div className="over-layer">
        <div className="intro has-text-centered">
          <h1 className="title is-size-1  has-text-white">
            Developer Connector
          </h1>
          <p>
            Create a developer profile/portfolio, shere posts and get helps from
            other developers
          </p>
          <div className="buttons">
            <Link to="/register" className="button is-primary">
              Sign up
            </Link>
            <Link to="login" className="button is-white">
              Log in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
