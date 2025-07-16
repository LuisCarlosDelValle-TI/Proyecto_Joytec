#!/usr/bin/env node

// Script para actualizar todas las páginas del dashboard con autenticación

const fs = require('fs');
const path = require('path');

const dashboardPages = [
    'proveedores.html',
    'empleado.html', 
    'compras.html',
    'categorias.html',
    'ventas_new.html'
];

const dashboardDir = path.join(__dirname, '..', 'html');

function updatePage(fileName) {
    const filePath = path.join(dashboardDir, fileName);
    
    if (!fs.existsSync(filePath)) {
        console.log(`❌ Archivo no encontrado: ${fileName}`);
        return;
    }
    
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Reemplazar Juanito2014 con nombre-usuario
    content = content.replace(
        /<p>Juanito2014<\/p>/g,
        '<p id="nombre-usuario">Cargando...</p>'
    );
    
    // Agregar el script de auth.js si no existe
    if (!content.includes('/Dashboards/js/auth.js')) {
        // Buscar el último script antes de </body>
        const lastScriptRegex = /(<script[^>]*>[\s\S]*?<\/script>[\s\S]*?)<\/body>/i;
        const match = content.match(lastScriptRegex);
        
        if (match) {
            const replacement = match[1] + '\n    <script src="/Dashboards/js/auth.js"></script>\n</body>';
            content = content.replace(lastScriptRegex, replacement);
        }
    }
    
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Actualizado: ${fileName}`);
}

// Actualizar todas las páginas
dashboardPages.forEach(updatePage);

console.log('\n🎉 Todas las páginas han sido actualizadas!');
