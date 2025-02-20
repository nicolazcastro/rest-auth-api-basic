import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { confirmEmail, ConfirmEmailResponse } from '../services/authService';
import { useUserContext } from '../context/UserContext';

const ConfirmEmail: React.FC = () => {
  const [message, setMessage] = useState('Confirming your email...');
  const navigate = useNavigate();
  const { setUserData } = useUserContext();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    // Extract the token from the query parameter "confirm-token"
    const token = params.get('confirm-token');
    if (!token) {
      setMessage('Invalid confirmation link.');
      return;
    }
    confirmEmail(token)
      .then((res: ConfirmEmailResponse) => {
        if (res.status === 'success') {
          setMessage('Email confirmed! Logging you in...');
          localStorage.setItem('token', res.token);
          setUserData({ user: res.user, token: res.token, isAuthenticated: true });
          setTimeout(() => {
            navigate('/');
          }, 2000);
        } else {
          setMessage(res.message || 'Email confirmation failed.');
        }
      })
      .catch((error) => {
        console.error("Confirmation error:", error);
        setMessage('Email confirmation failed. Please try again.');
      });
  }, [navigate, setUserData]);

  return (
    <div className="container text-center mt-5">
      <h2>{message}</h2>
    </div>
  );
};

export default ConfirmEmail;
