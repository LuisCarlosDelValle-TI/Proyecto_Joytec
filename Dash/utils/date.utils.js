class DateUtils {
    static formatDate(date) {
        const d = new Date(date);
        return d.toLocaleDateString('es-MX', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });
    }

    static formatDateTime(date) {
        const d = new Date(date);
        return d.toLocaleString('es-MX', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    }

    static getStartOfDay(date) {
        const d = new Date(date);
        d.setHours(0, 0, 0, 0);
        return d;
    }

    static getEndOfDay(date) {
        const d = new Date(date);
        d.setHours(23, 59, 59, 999);
        return d;
    }

    static getStartOfMonth(date) {
        const d = new Date(date);
        d.setDate(1);
        d.setHours(0, 0, 0, 0);
        return d;
    }

    static getEndOfMonth(date) {
        const d = new Date(date);
        d.setMonth(d.getMonth() + 1);
        d.setDate(0);
        d.setHours(23, 59, 59, 999);
        return d;
    }

    static addDays(date, days) {
        const d = new Date(date);
        d.setDate(d.getDate() + days);
        return d;
    }

    static addMonths(date, months) {
        const d = new Date(date);
        d.setMonth(d.getMonth() + months);
        return d;
    }

    static getDaysBetween(startDate, endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const diffTime = Math.abs(end - start);
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }

    static isWeekend(date) {
        const d = new Date(date);
        return d.getDay() === 0 || d.getDay() === 6;
    }

    static getAge(birthDate) {
        const today = new Date();
        const birth = new Date(birthDate);
        let age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
            age--;
        }
        
        return age;
    }

    static isValidDate(date) {
        const d = new Date(date);
        return d instanceof Date && !isNaN(d);
    }
}

module.exports = DateUtils;