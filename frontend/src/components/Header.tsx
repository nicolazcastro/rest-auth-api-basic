import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import LoginModal from './LoginModal';
import RegisterModal from './RegisterModal';
import UserInfo from './UserInfo';

const Header: React.FC = () => {
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showRegisterModal, setShowRegisterModal] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));

    const token = localStorage.getItem('token');

    useEffect(() => {
        setIsAuthenticated(!!token);
    }, [token]);

    const handleLoginButtonClick = async () => {
        setShowLoginModal(true);
    };

    const handleRegisterButtonClick = () => {
        setShowRegisterModal(true);
    };

    const handleLogoutButtonClick = () => {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div className="container-fluid">
                <Link className="navbar-brand" to="/">Weather App</Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <Link className="nav-link" to="/diary-list">List Diaryes</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/about">About</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/contact">Contact</Link>
                        </li>
                    </ul>
                    <div className="d-flex">
                        {isAuthenticated ? (
                            <>
                                <UserInfo />
                                <button className="btn btn-outline-primary me-2" onClick={handleLogoutButtonClick}>Logout</button>
                            </>
                        ) : (
                            <>
                                <button className="btn btn-outline-primary me-2" onClick={handleLoginButtonClick}>Login</button>
                                <button className="btn btn-outline-primary" onClick={handleRegisterButtonClick}>Register</button>
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
