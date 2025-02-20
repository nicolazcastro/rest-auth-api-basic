import React, { useState } from 'react';
import { forgotPassword } from '../services/authService';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [notification, setNotification] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await forgotPassword(email);
      if (res.status === 'success') {
        setNotification('Password reset email sent. Please check your inbox.');
      } else {
        setNotification(res.message || 'Failed to send password reset email.');
      }
    } catch (error) {
      console.error(error);
      setNotification('An error occurred.');
    }
  };

  return (
    <div className="container mt-5">
      <h2>Forgot Password</h2>
      {notification && <div className="alert alert-info">{notification}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Email:</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">Send Reset Email</button>
      </form>
    </div>
  );
};

export default ForgotPassword;