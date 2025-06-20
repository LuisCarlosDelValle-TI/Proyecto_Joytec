class ResponseUtils {
    static success(res, data = null, message = 'Operación exitosa', statusCode = 200) {
        return res.status(statusCode).json({
            status: 'success',
            message,
            data
        });
    }

    static created(res, data = null, message = 'Recurso creado exitosamente') {
        return this.success(res, data, message, 201);
    }

    static noContent(res) {
        return res.status(204).send();
    }

    static error(res, error) {
        const statusCode = error.statusCode || 500;
        const message = error.message || 'Error interno del servidor';
        const status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';

        return res.status(statusCode).json({
            status,
            message,
            ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
        });
    }

    static badRequest(res, message = 'Solicitud incorrecta') {
        return res.status(400).json({
            status: 'fail',
            message
        });
    }

    static unauthorized(res, message = 'No autorizado') {
        return res.status(401).json({
            status: 'fail',
            message
        });
    }

    static forbidden(res, message = 'Acceso denegado') {
        return res.status(403).json({
            status: 'fail',
            message
        });
    }

    static notFound(res, message = 'Recurso no encontrado') {
        return res.status(404).json({
            status: 'fail',
            message
        });
    }

    static pagination(res, data, page, limit, total) {
        const totalPages = Math.ceil(total / limit);
        const hasNextPage = page < totalPages;
        const hasPrevPage = page > 1;

        return res.status(200).json({
            status: 'success',
            data,
            pagination: {
                page,
                limit,
                total,
                totalPages,
                hasNextPage,
                hasPrevPage
            }
        });
    }
}

module.exports = ResponseUtils;