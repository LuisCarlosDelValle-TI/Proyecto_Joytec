const jwt = require('jsonwebtoken');

function verificarToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(401).json({ message: 'Token no proporcionado' });
    }
    const token = authHeader.split(' ')[1]; // Quita el "Bearer"
    if (!token) {
        return res.status(401).json({ message: 'Token no válido' });
    }
    jwt.verify(token, 'secreto', (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Token inválido o expirado' });
        }
        req.usuario = decoded;
        next();
    });
}

// ESTA ES LA FUNCIÓN QUE TE FALTA
function verificarRol(roles = []) {
    return (req, res, next) => {
        if (!roles.includes(req.usuario.rol)) {
            return res.status(403).json({ message: 'No autorizado' });
        }
        next();
    };
}

module.exports = { verificarToken, verificarRol };
