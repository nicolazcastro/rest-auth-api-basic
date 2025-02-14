// src/components/RegisterModal.tsx
import React, { useState } from 'react';
import { registerUser } from '../services/userServices';
import { isValidEmail, validatePassword } from '../utils/validation';

interface RegisterModalProps {
    onClose: () => void;
}

const RegisterModal: React.FC<RegisterModalProps> = ({ onClose }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errors, setErrors] = useState<string[]>([]);

    const handleRegister = async () => {

        const passwordErrors = validatePassword(password);
        if (passwordErrors.length > 0) {
            setErrors(passwordErrors);
            return;
        }

        if (!email || !password || !confirmPassword) {
            setErrors(['Email and password are required.']);
            return;
        }

        if (password !== confirmPassword) {
            setErrors(['Passwords do not match']);
            return;
        }

        if (!isValidEmail(email)) {
            setErrors(['Please enter a valid email address.']);
            return;
        }

        try {
            await registerUser(email, password);
            console.log('Registered successfully');
            onClose(); // Close the modal after successful registration
        } catch (error) {
            console.error('Error registering:', error);
        }
    };

    return (
        <div className="modal">
            <h2>Register Modal</h2>
            <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
            <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
            <input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
            {errors.map((error, index) => (
                <p key={index} className="error-message">{error}</p>
            ))}
            <button onClick={handleRegister}>Register</button>
        </div>
    );
};

export default RegisterModal;
