import React, { useState } from 'react';
import { login } from '../services/userServices';
import { isValidEmail } from '../utils/validation';
import { useUserContext } from '../context/UserContext';
import { User } from '../types/userContextType';

interface LoginModalProps {
    onClose: () => void;
}


const LoginModal: React.FC<LoginModalProps> = ({ onClose }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState<string[]>([]);
    const { setUserData } = useUserContext();

    const handleLogin = async () => {
        if (!email || !password) {
            setErrors(['Email and password are required.']);
            return;
        }

        if (!isValidEmail(email)) {
            setErrors(['Please enter a valid email address.']);
            return;
        }

        try {
            const loginHandler = (user: User | null, token: string | null, isAuthenticated: boolean) => {
                setUserData({ user, token, isAuthenticated });
            };

            const token = await login(email, password, loginHandler);
            localStorage.setItem('token', token); // Store token in localStorage
            onClose(); // Close the modal after successful login
        } catch (error) {
            console.error('Error logging in:', error);
            setErrors(['Error logging in']);
        }
    };

    return (
        <div className="modal fade show" tabIndex={-1} role="dialog" style={{ display: 'block' }}>
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Login</h5>
                        <button type="button" className="btn-close" aria-label="Close" onClick={onClose}></button>
                    </div>
                    <div className="modal-body">
                        <input type="email" className="form-control" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                        <input type="password" className="form-control" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                        {errors.map((error, index) => (
                            <p key={index} className="error-message">{error}</p>
                        ))}
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-primary" onClick={handleLogin}>Login</button>
                        <button type="button" className="btn btn-secondary" onClick={onClose}>Close</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginModal;
