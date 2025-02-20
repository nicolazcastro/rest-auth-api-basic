import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { login, registerUser } from '../services/userServices';
import { isValidEmail } from '../utils/validation';
import { useUserContext } from '../context/UserContext';
import GoogleLoginButton from './GoogleLoginButton';
import { User } from '../types/userContextType';

interface LoginModalProps {
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ onClose }) => {
  // Manage active tab: "login" or "register"
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');

  // Form fields (shared between tabs)
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Additional fields for registration
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // State for error and success messages
  const [errors, setErrors] = useState<string[]>([]);
  const [successMessage, setSuccessMessage] = useState<string>('');

  // Get the setUserData function from the UserContext
  const { setUserData } = useUserContext();

  // Handler for login
  const handleLogin = async () => {
    setErrors([]);
    setSuccessMessage('');
    if (!email || !password) {
      setErrors(['Email and password are required.']);
      return;
    }
    if (!isValidEmail(email)) {
      setErrors(['Please enter a valid email address.']);
      return;
    }
    try {
      // Define a callback to update the context after successful login
      const loginHandler = (data: { user: User | null; token: string | null; isAuthenticated: boolean }) => {
        setUserData(data);
      };
      const token = await login(email, password, loginHandler);
      localStorage.setItem('token', token);
      onClose(); // Close modal upon successful login
    } catch (error: any) {
      console.error('Error logging in:', error);
      if (error.response && error.response.data) {
        if (error.response.data.errors) {
          setErrors(error.response.data.errors);
        } else if (error.response.data.message) {
          setErrors([error.response.data.message]);
        } else {
          setErrors(['Error logging in', error.message || 'Unknown error']);
        }
      } else {
        setErrors(['Error logging in', error.message || 'Unknown error']);
      }
    }
  };

  // Handler for registration with auto-login on success if immediate, or display a message if email confirmation is required.
  const handleRegister = async () => {
    setErrors([]);
    setSuccessMessage('');
    if (!name || !email || !password || !confirmPassword) {
      setErrors(['All fields are required for registration.']);
      return;
    }
    if (!isValidEmail(email)) {
      setErrors(['Please enter a valid email address.']);
      return;
    }
    if (password !== confirmPassword) {
      setErrors(['Passwords do not match.']);
      return;
    }
    try {
      const response = await registerUser(name, email, password);
      if (response.status === 'success') {
        // If the API returns a token, then immediate login is enabled.
        if (response.token) {
          setUserData({ user: response.user, token: response.token, isAuthenticated: true });
          localStorage.setItem('token', response.token);
          onClose();
        } else if (response.emailConfirmationEnabled) {
          // Email confirmation is enabled, so just display the success message.
          setSuccessMessage(response.message || 'Registration successful. Please check your email to confirm your account.');
        } else {
          setErrors(['Registration failed.']);
        }
      } else {
        setErrors(['Registration failed.']);
      }
    } catch (error: any) {
      console.error('Error registering:', error);
      if (error.response && error.response.data) {
        if (error.response.data.errors) {
          setErrors(error.response.data.errors);
        } else if (error.response.data.message) {
          setErrors([error.response.data.message]);
        } else {
          setErrors(['Error registering', error.message || 'Unknown error']);
        }
      } else {
        setErrors(['Error registering', error.message || 'Unknown error']);
      }
    }
  };

  return (
    <div className="modal fade show" tabIndex={-1} role="dialog" style={{ display: 'block' }}>
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{activeTab === 'login' ? 'Login' : 'Register'}</h5>
            <button type="button" className="btn-close" aria-label="Close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <div className="d-flex mb-3">
              <button
                className={`btn me-2 ${activeTab === 'login' ? 'btn-primary' : 'btn-outline-primary'}`}
                onClick={() => {
                  setActiveTab('login');
                  setErrors([]);
                  setSuccessMessage('');
                }}
              >
                Login
              </button>
              <button
                className={`btn ${activeTab === 'register' ? 'btn-primary' : 'btn-outline-primary'}`}
                onClick={() => {
                  setActiveTab('register');
                  setErrors([]);
                  setSuccessMessage('');
                }}
              >
                Register
              </button>
            </div>
            {activeTab === 'login' && (
              <>
                <input
                  type="email"
                  className="form-control mb-2"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <input
                  type="password"
                  className="form-control mb-2"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button type="button" className="btn btn-primary" onClick={handleLogin}>
                  Login
                </button>
              </>
            )}
            {activeTab === 'register' && (
              <>
                <input
                  type="text"
                  className="form-control mb-2"
                  placeholder="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <input
                  type="email"
                  className="form-control mb-2"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <input
                  type="password"
                  className="form-control mb-2"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <input
                  type="password"
                  className="form-control mb-2"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <button type="button" className="btn btn-primary" onClick={handleRegister}>
                  Register
                </button>
              </>
            )}
            {errors.length > 0 && (
              <div className="alert alert-danger mt-3">
                {errors.map((error, index) => (
                  <div key={index}>{error}</div>
                ))}
              </div>
            )}
            {successMessage && (
              <div className="alert alert-success mt-3">{successMessage}</div>
            )}
          </div>
          <div className="modal-footer">
            <Link to="/forgot-password" onClick={onClose}>
              Forgot Password?
            </Link>
          </div>
          <div className="mt-3 text-center">
            <GoogleLoginButton />
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;