document.addEventListener("DOMContentLoaded", () => {
    // Cargar el menú
    fetch("/Dashboards/html/menu.html")
        .then(response => response.text())
        .then(data => {
            document.getElementById("menu-container").innerHTML = data;
        })
        .catch(error => console.error("Error al cargar el menú:", error));

    const token = localStorage.getItem('token');
    fetch("http://localhost:3001/api/usuarios", {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => {
        if (!response.ok) throw new Error("No autorizado o error en el servidor");
        return response.json();
    })
    .then(usuarios => {
        const tbody = document.querySelector("#tabla-usuarios tbody");
        tbody.innerHTML = "";
        usuarios.forEach(usuario => {
            tbody.innerHTML += `
                <tr>
                    <td>${usuario.nombre_usuario || ""}</td>
                    <td>${usuario.correo || ""}</td>
                    <td>
                        <button class="btn btn-warning btn-sm">Editar</button>
                        <button class="btn btn-danger btn-sm">Eliminar</button>
                    </td>
                </tr>
            `;
        });
    })
    .catch(error => {
        console.error("Error al cargar usuarios:", error);
        alert("No se pudieron cargar los usuarios.");
    });
});