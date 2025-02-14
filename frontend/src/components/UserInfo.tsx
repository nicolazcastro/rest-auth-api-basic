import React, { useState, useEffect } from 'react';
import { getUserInfo } from '../services/userServices';

const UserInfo: React.FC = () => {
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                if (token !== null) {
                    const userInfo = await getUserInfo(token);
                    setUser(userInfo);
                } else {
                    console.error('Token de acceso no encontrado en localStorage');
                }
            } catch (error) {
                // Manejar el error
                console.error('Error fetching user information:', error);
            }
        };

        fetchData();
    }, []); // Vacío para que se ejecute solo una vez al montar el componente

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <p>Name: {user.name}</p>
            <p>Email: {user.email}</p>
        </div>
    );
};

export default UserInfo;
