// src/components/UserHeader.tsx
import React from 'react';

interface UserHeaderProps {
    userName: string;
}

const UserHeader: React.FC<UserHeaderProps> = ({ userName }) => {
    return (
        <div>
            <p>Welcome, {userName}!</p>
        </div>
    );
};

export default UserHeader;
