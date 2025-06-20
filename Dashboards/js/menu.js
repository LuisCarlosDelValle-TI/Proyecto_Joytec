document.addEventListener("DOMContentLoaded", () => {
    const menuItems = document.querySelectorAll("nav ul li a");
    const currentPage = window.location.pathname.split("/").pop(); // Obtiene el nombre del archivo actual

    menuItems.forEach(item => {
        if (item.getAttribute("href") === currentPage) {
            item.parentElement.classList.add("activo"); // Agrega la clase activo
        } else {
            item.parentElement.classList.remove("activo"); // Elimina la clase activo de otros elementos
        }
    });
});