export const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

export const validatePassword = (password: string): string[] => {
    const errors: string[] = [];

    // Regular expressions for password validation
    const minLengthRegex = /.{6,}/; // Minimum 6 characters
    const letterRegex = /[a-zA-Z]/; // At least one letter
    const numberRegex = /\d/; // At least one number
    const capitalLetterRegex = /[A-Z]/; // At least one capital letter

    // Check each validation criteria and add corresponding error messages
    if (!minLengthRegex.test(password)) {
        errors.push('Password must be at least 6 characters long');
    }
    if (!letterRegex.test(password)) {
        errors.push('Password must contain letters');
    }
    if (!numberRegex.test(password)) {
        errors.push('Password must contain numbers');
    }
    if (!capitalLetterRegex.test(password)) {
        errors.push('Password must contain at least one capital letter');
    }

    return errors;
};
