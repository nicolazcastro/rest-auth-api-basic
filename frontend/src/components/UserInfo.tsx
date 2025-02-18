import React from 'react';
import { useUserContext } from '../context/UserContext';

const UserInfo: React.FC = () => {
  const { user, isAuthenticated } = useUserContext();

  // If the user isn't authenticated or no user data exists, render nothing
  if (!isAuthenticated || !user) return null;

  return (
    <div>
      <p>Name: {user.name}</p>
      <p>Email: {user.email}</p>
    </div>
  );
};

export default UserInfo;