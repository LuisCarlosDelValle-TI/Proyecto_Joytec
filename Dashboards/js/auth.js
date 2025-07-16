/**
 * Funciones de autenticación y gestión de usuario
 */

// Función para cargar el usuario logueado
function cargarUsuarioLogueado() {
    try {
        const usuario = JSON.parse(localStorage.getItem('usuario'));
        const token = localStorage.getItem('token');
        
        if (usuario && usuario.nombre_usuario && token) {
            // Buscar el elemento donde mostrar el nombre del usuario
            const elementoNombre = document.getElementById('nombre-usuario');
            if (elementoNombre) {
                elementoNombre.textContent = usuario.nombre_usuario;
            }
            return usuario;
        } else {
            // Si no hay usuario logueado, redirigir al login
            window.location.href = '/Dashboards/html/login.html';
            return null;
        }
    } catch (error) {
        console.error('Error al cargar usuario:', error);
        window.location.href = '/Dashboards/html/login.html';
        return null;
    }
}

// Función para cerrar sesión
function cerrarSesion() {
    localStorage.removeItem('usuario');
    localStorage.removeItem('token');
    window.location.href = '/Dashboards/html/login.html';
}

// Función para verificar si el usuario está autenticado
function verificarAutenticacion() {
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    const token = localStorage.getItem('token');
    
    if (!usuario || !token) {
        window.location.href = '/Dashboards/html/login.html';
        return false;
    }
    return true;
}

// Función para obtener el token de autorización
function obtenerTokenAutorizacion() {
    const token = localStorage.getItem('token');
    return token ? `Bearer ${token}` : null;
}

// Función para hacer peticiones autenticadas
async function peticionAutenticada(url, options = {}) {
    const token = obtenerTokenAutorizacion();
    
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers
    };
    
    if (token) {
        headers['Authorization'] = token;
    }
    
    try {
        const response = await fetch(url, {
            ...options,
            headers
        });
        
        if (response.status === 401) {
            // Token expirado o inválido
            cerrarSesion();
            return null;
        }
        
        return response;
    } catch (error) {
        console.error('Error en petición autenticada:', error);
        throw error;
    }
}

// Ejecutar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    // Cargar usuario solo si no estamos en la página de login o registro
    const paginaActual = window.location.pathname;
    const paginasPublicas = ['/Dashboards/html/login.html', '/Dashboards/html/signin.html'];
    
    if (!paginasPublicas.includes(paginaActual)) {
        cargarUsuarioLogueado();
    }
});
