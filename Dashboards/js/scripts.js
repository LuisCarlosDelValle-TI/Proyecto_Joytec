document.addEventListener('DOMContentLoaded', function () {
    var ctx1 = document.getElementById('chart1').getContext('2d');
    var ctx2 = document.getElementById('chart2').getContext('2d');
    var ctxClientes = document.getElementById('chartClientes').getContext('2d');

    var chart1 = new Chart(ctx1, {
        type: 'bar',
        data: {
            labels: ['Categoría 1', 'Categoría 2', 'Categoría 3'],
            datasets: [{
                label: 'Ventas por Categoría',
                data: [12, 19, 3],
                backgroundColor: [
                    'var(--rosy-brown)',
                    'var(--ecru)',
                    'var(--lion)'
                ],
                borderColor: 'var(--jet)',
                borderWidth: 1
            }]
        },
        options: {
            plugins: {
                title: {
                    display: true,
                    text: 'Ventas por Categoría',
                    align: 'center',
                    padding: {
                        top: 10,
                        bottom: 30
                    },
                    font: {
                        size: 18
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    var chart2 = new Chart(ctx2, {
        type: 'line',
        data: {
            labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio'],
            datasets: [{
                label: 'Ingresos Mensuales',
                data: [65, 59, 80, 81, 56, 55],
                backgroundColor: 'var(--rosy-brown)',
                borderColor: 'var(--jet)',
                borderWidth: 1,
                fill: false
            }]
        },
        options: {
            plugins: {
                title: {
                    display: true,
                    text: 'Ingresos Mensuales',
                    align: 'center',
                    padding: {
                        top: 10,
                        bottom: 30
                    },
                    font: {
                        size: 18
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    var chartClientes = new Chart(ctxClientes, {
        type: 'pie',
        data: {
            labels: ['Frecuentes', 'Nuevos'],
            datasets: [{
                label: 'Clientes Frecuentes vs. Nuevos',
                data: [300, 50],
                backgroundColor: [
                    'var(--rosy-brown)',
                    'var(--ecru)'
                ],
                borderColor: 'var(--jet)',
                borderWidth: 1
            }]
        },
        options: {
            plugins: {
                title: {
                    display: true,
                    text: 'Clientes Frecuentes vs. Nuevos',
                    align: 'center',
                    padding: {
                        top: 10,
                        bottom: 30
                    },
                    font: {
                        size: 18
                    }
                }
            },
            responsive: true,
            maintainAspectRatio: false
        }
    });

    // Agrega el evento de búsqueda
    document.getElementById('search-form').addEventListener('submit', function(event) {
        event.preventDefault(); // Evita que el formulario se envíe de la manera tradicional

        var query = document.getElementById('search-input').value.toLowerCase(); // Obtiene el valor de búsqueda y lo convierte a minúsculas

        // Lógica para redirigir a las páginas del menú si hay coincidencia
        var menuItems = document.querySelectorAll('nav a');
        var found = false;
        menuItems.forEach(function(item) {
            var itemText = item.innerText.toLowerCase();
            if (itemText.includes(query)) {
                window.location.href = item.href; // Redirige a la página correspondiente
                found = true;
            }
        });

        if (!found) {
            // Lógica para buscar en los elementos de la página y mostrar solo los que coincidan con la búsqueda
            var elements = document.querySelectorAll('.contenido *');
            elements.forEach(function(element) {
                var elementText = element.innerText.toLowerCase();
                if (elementText.includes(query)) {
                    element.style.display = ''; // Muestra el elemento si coincide con la búsqueda
                } else {
                    element.style.display = 'none'; // Oculta el elemento si no coincide con la búsqueda
                }
            });
        }
    });
});

