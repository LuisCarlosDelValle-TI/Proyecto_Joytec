const AppError = require('./appError');

class ValidationUtils {
    static validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            throw new AppError('Formato de email inválido', 400);
        }
        return true;
    }

    static validatePhone(phone) {
        const phoneRegex = /^[0-9]{10}$/;
        if (!phoneRegex.test(phone)) {
            throw new AppError('El número de teléfono debe tener 10 dígitos', 400);
        }
        return true;
    }

    static validateRFC(rfc) {
        // Regex para RFC de persona moral (12 caracteres) y física (13 caracteres)
        const rfcRegex = /^[A-Z&Ñ]{3,4}[0-9]{2}(0[1-9]|1[0-2])(0[1-9]|[12][0-9]|3[01])[A-Z0-9]{2}[0-9A]$/;
        if (!rfcRegex.test(rfc)) {
            throw new AppError('Formato de RFC inválido', 400);
        }
        return true;
    }

    static validatePostalCode(cp) {
        const cpRegex = /^[0-9]{5}$/;
        if (!cpRegex.test(cp)) {
            throw new AppError('El código postal debe tener 5 dígitos', 400);
        }
        return true;
    }

    static validatePrice(price) {
        if (typeof price !== 'number' || price < 0) {
            throw new AppError('El precio debe ser un número positivo', 400);
        }
        return true;
    }

    static validateStock(stock) {
        if (!Number.isInteger(stock) || stock < 0) {
            throw new AppError('El stock debe ser un número entero positivo', 400);
        }
        return true;
    }

    static validateDate(date) {
        const dateObj = new Date(date);
        if (isNaN(dateObj.getTime())) {
            throw new AppError('Fecha inválida', 400);
        }
        return true;
    }

    static validateRequiredFields(obj, fields) {
        const missingFields = fields.filter(field => !obj[field]);
        if (missingFields.length > 0) {
            throw new AppError(`Campos requeridos faltantes: ${missingFields.join(', ')}`, 400);
        }
        return true;
    }

    static validateEnum(value, allowedValues, fieldName) {
        if (!allowedValues.includes(value)) {
            throw new AppError(`Valor inválido para ${fieldName}. Valores permitidos: ${allowedValues.join(', ')}`, 400);
        }
        return true;
    }
}

module.exports = ValidationUtils;