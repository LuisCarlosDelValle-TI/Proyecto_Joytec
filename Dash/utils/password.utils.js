const bcrypt = require('bcryptjs');
const AppError = require('./appError');

class PasswordUtils {
    static async hashPassword(password) {
        try {
            const salt = await bcrypt.genSalt(10);
            return await bcrypt.hash(password, salt);
        } catch (error) {
            throw new AppError('Error al encriptar la contraseña', 500);
        }
    }

    static async comparePasswords(plainPassword, hashedPassword) {
        try {
            return await bcrypt.compare(plainPassword, hashedPassword);
        } catch (error) {
            throw new AppError('Error al comparar las contraseñas', 500);
        }
    }

    static validatePasswordStrength(password) {
        const minLength = 8;
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumbers = /\d/.test(password);
        const hasSpecialChar = /[!@#$%^&*]/.test(password);

        const errors = [];

        if (password.length < minLength) {
            errors.push(`La contraseña debe tener al menos ${minLength} caracteres`);
        }
        if (!hasUpperCase) {
            errors.push('La contraseña debe contener al menos una mayúscula');
        }
        if (!hasLowerCase) {
            errors.push('La contraseña debe contener al menos una minúscula');
        }
        if (!hasNumbers) {
            errors.push('La contraseña debe contener al menos un número');
        }
        if (!hasSpecialChar) {
            errors.push('La contraseña debe contener al menos un carácter especial');
        }

        if (errors.length > 0) {
            throw new AppError(errors.join('. '), 400);
        }

        return true;
    }
}

module.exports = PasswordUtils;