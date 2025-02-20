import React, { useState, useEffect } from 'react';
import { resetPassword, ResetPasswordResponse } from '../services/authService';
import { useNavigate } from 'react-router-dom';
import { useUserContext } from '../context/UserContext';

const ResetPassword: React.FC = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [notification, setNotification] = useState('');
  const navigate = useNavigate();
  const { setUserData } = useUserContext(); // Import the context setter

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    // Extract token from query parameter "password-reset-token"
    const token = params.get('password-reset-token');
    if (!token) {
      setNotification('No reset token provided.');
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Validate that both password fields match
    if (newPassword !== confirmPassword) {
      setNotification('Passwords do not match.');
      return;
    }
    const params = new URLSearchParams(window.location.search);
    const token = params.get('password-reset-token');
    if (!token) {
      setNotification('No reset token provided.');
      return;
    }
    try {
      const res: ResetPasswordResponse = await resetPassword(token, newPassword);
      if (res.status === 'success') {
        console.log("res", res);
        setNotification('Password has been reset. Logging you in...');
        localStorage.setItem('token', res.token);
        setUserData({ user: res.user, token: res.token, isAuthenticated: true });
        setTimeout(() => {
          navigate('/');
        }, 2000);
      } else {
        setNotification(res.message || 'Failed to reset password.');
      }
    } catch (error) {
      console.error(error);
      setNotification('An error occurred while resetting password.');
    }
  };

  return (
    <div className="container mt-5">
      <h2>Reset Password</h2>
      {notification && <div className="alert alert-info">{notification}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>New Password:</label>
          <input
            type="password"
            className="form-control"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label>Confirm Password:</label>
          <input
            type="password"
            className="form-control"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">Reset Password</button>
      </form>
    </div>
  );
};

export default ResetPassword;