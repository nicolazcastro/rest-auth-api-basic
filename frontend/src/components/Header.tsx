// frontend/src/components/Header.tsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import LoginModal from './LoginModal';
import RegisterModal from './RegisterModal';
import UserInfo from './UserInfo';
import { useUserContext } from '../context/UserContext';

const Header: React.FC = () => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  // Get authentication state and logout function from context
  const { isAuthenticated, logout } = useUserContext();

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">Auth Demo</Link>
        <div className="collapse navbar-collapse">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            {isAuthenticated && (
              <li className="nav-item">
                <Link className="nav-link" to="/dashboard">Protected Page</Link>
              </li>
            )}
          </ul>
          <div className="d-flex">
            {isAuthenticated ? (
              <>
                <UserInfo />
                <button className="btn btn-outline-primary ms-2" onClick={logout}>
                  Logout
                </button>
              </>
            ) : (
              <>
                <button className="btn btn-outline-primary ms-2" onClick={() => setShowLoginModal(true)}>
                  Login/Register
                </button>
              </>
            )}
          </div>
        </div>
      </div>
      {showLoginModal && <LoginModal onClose={() => setShowLoginModal(false)} />}
      {showRegisterModal && <RegisterModal onClose={() => setShowRegisterModal(false)} />}
    </nav>
  );
};

export default Header;