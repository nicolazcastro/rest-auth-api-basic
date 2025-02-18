import React, { useState } from 'react';
import { login, registerUser } from '../services/userServices';
import { isValidEmail } from '../utils/validation';
import { useUserContext } from '../context/UserContext';
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
      // Check for error details from the API
      if (error.response && error.response.data) {
        if (error.response.data.errors) {
          // Display each error message returned from the API
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

  // Handler for registration with auto-login on success
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
      // Call the registerUser service. It is assumed that the API returns an object with status, token, and user.
      const response = await registerUser(name, email, password);
      if (response.status === 'success' && response.token) {
        // Automatically update context and log in the user
        setUserData({ user: response.user, token: response.token, isAuthenticated: true });
        localStorage.setItem('token', response.token);
        onClose(); // Close modal automatically upon successful registration
      } else {
        setErrors(['Registration failed.']);
      }
    } catch (error: any) {
      console.error('Error registering:', error);
      // Check for error details from the API
      if (error.response && error.response.data) {
        if (error.response.data.errors) {
          // Display each error message returned from the API
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
            {/* Tab buttons */}
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
            {/* Form fields */}
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
            {/* Display error messages */}
            {errors.length > 0 && (
              <div className="alert alert-danger mt-3">
                {errors.map((error, index) => (
                  <div key={index}>{error}</div>
                ))}
              </div>
            )}
            {/* Display success message */}
            {successMessage && (
              <div className="alert alert-success mt-3">{successMessage}</div>
            )}
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
