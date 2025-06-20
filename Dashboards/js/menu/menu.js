// filepath: c:\Users\luisc\OneDrive\Desktop\Proyecto_Joyeria\Dashboards\js\menu\menu.js
document.addEventListener("DOMContentLoaded", () => {
    // Obtén la ruta actual sin el dominio
    const currentPath = window.location.pathname.replace(/\/$/, ""); // Elimina la barra final si existe
    console.log("Ruta actual:", currentPath);

    // Selecciona todos los enlaces del menú
    const menuLinks = document.querySelectorAll('.menu a');

    // Recorre los enlaces y agrega la clase 'active' al enlace correspondiente
    menuLinks.forEach(link => {
        const linkPath = new URL(link.href, window.location.origin).pathname.replace(/\/$/, ""); // Elimina la barra final
        console.log("Comparando:", linkPath, "con", currentPath);
        if (linkPath === currentPath) {
            link.classList.add('active');
            console.log("Clase 'active' añadida a:", link);
        }
    });

    // Agrega un evento de clic para cambiar la clase activa dinámicamente
    menuLinks.forEach(item => {
        item.addEventListener("click", () => {
            // Remover la clase activa de todos los elementos
            menuLinks.forEach(link => link.classList.remove("active"));
            // Agregar la clase activa al elemento clicado
            item.classList.add("active");
            console.log("Clase 'active' cambiada dinámicamente a:", item);
        });
    });
});