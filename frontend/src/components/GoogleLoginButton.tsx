import React from 'react';

const GoogleLoginButton: React.FC = () => {
  const handleClick = () => {
    window.location.href = `${import.meta.env.VITE_BACKEND_URL}/api/v1/auth/google`;
  };

  return (
    <button className="btn" onClick={handleClick}>
      <img
        src="/assets/google_signin_button.png"
        alt="Sign in with Google"
        style={{ height: '40px' }}
      />
    </button>
  );
};

export default GoogleLoginButton;