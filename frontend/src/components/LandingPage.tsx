import React from "react";
import { Link, useLocation } from "react-router-dom";

const LandingPage: React.FC = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const notification = params.get('message');

  return (
    <div className="container text-center">
      <h1>Welcome to the Auth Demo</h1>
      {notification && <div className="alert alert-info">{notification}</div>}
      <p>Please log in or register to access the dashboard.</p>
      <Link to="/dashboard" className="btn btn-primary">
        Go to Dashboard (Protected)
      </Link>
    </div>
  );
};

export default LandingPage;
