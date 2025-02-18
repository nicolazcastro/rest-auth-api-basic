import React from "react";
import { Link } from "react-router-dom";

const LandingPage: React.FC = () => {
  return (
    <div className="container text-center">
      <h1>Welcome to the Auth Demo</h1>
      <p>Please log in or register to access the dashboard.</p>
      <Link to="/dashboard" className="btn btn-primary">
        Go to Dashboard (Protected)
      </Link>
    </div>
  );
};

export default LandingPage;