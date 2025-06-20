const bcrypt = require('bcryptjs');
const db = require('../../config/db');

exports.registrarUsuario = async (req, res) => {
    const { nombre_usuario, correo, contraseña } = req.body;

    if (!nombre_usuario || !correo || !contraseña) {
        return res.status(400).json({ mensaje: 'Todos los campos son obligatorios' });
    }

    try {
        // Verifica si el correo ya existe
        const existe = await db.query('SELECT id_usuario FROM usuarios WHERE correo = $1', [correo]);
        if (existe.rows.length > 0) {
            return res.status(409).json({ mensaje: 'El correo ya está registrado' });
        }

        const hashedPassword = await bcrypt.hash(contraseña, 10);

        await db.query(
            'INSERT INTO usuarios (nombre_usuario, correo, contraseña) VALUES ($1, $2, $3)',
            [nombre_usuario, correo, hashedPassword]
        );

        res.json({ mensaje: 'Usuario registrado correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error en el servidor' });
    }
};