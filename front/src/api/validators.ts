function strongPassword(password: string): { minLength: boolean; hasUpperCase: boolean; hasLowerCase: boolean; hasNumber: boolean; hasSpecialChar: boolean } {
    const minLength = 12;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    return {
        minLength: password.length >= minLength,
        hasUpperCase,
        hasLowerCase,
        hasNumber,
        hasSpecialChar
    };
}

function validateEmail(email: string): boolean {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
}

function validateUsername(username: string): boolean {
    const re = /^[a-zA-Z0-9]*$/;
    return re.test(username);
}

function validatePasswords(password: string, confirmPassword: string): boolean {
    return password === confirmPassword;
}


export const useValidators = ()=> {
    return {
        strongPassword,
        validateEmail,
        validateUsername,
        validatePasswords
    }
};