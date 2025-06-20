//gráfica barras
const ctx1 = document.getElementById('chart1').getContext('2d');
        new Chart(ctx1, {
            type: 'bar',
            data: {
                labels: ['Anillos', 'Pulseras', 'Aretes', 'Collares', 'Dijes'],
                datasets: [{
                    label: 'Ventas por categoría',
                    data: [28, 33, 22, 25, 30],
                    backgroundColor: [
                        'rgba(212, 165, 165, 0.2)',
                        'rgba(192, 178, 131, 0.2)',
                        'rgba(230, 142, 81, 0.2)',
                        'rgba(166, 138, 100, 0.2)',
                        'rgba(42, 42, 42, 0.2)'
                    ],
                    borderColor: [
                        'rgba(212, 165, 165, 1)',
                        'rgba(192, 178, 131, 1)',
                        'rgba(230, 142, 81, 1)',
                        'rgba(166, 138, 100, 1)',
                        'rgba(42, 42, 42, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { position: 'false' },
                    title: { display: true, text: 'Ventas por categoría', font: {
                        size: 22
                    } }
                }
            }
        });

        // Gráfica de líneas
        const ctx2 = document.getElementById('chart2').getContext('2d');
        new Chart(ctx2, {
            type: 'line',
            data: {
                labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo'],
                datasets: [{
                    label: 'Ingresos Mensuales',
                    data: [15, 35, 20, 25, 30],
                    borderColor: 'rgba(166, 138, 100, 1)',
                    borderWidth: 2,
                    fill: false
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { position: 'false' },
                    title: { display: true, text: 'Ingresos por Mes', font: {
                        size: 22 }
                }}
            }
        });

        const ctxClientes = document.getElementById('chartClientes').getContext('2d');

        //gráfica pastel
        new Chart(ctxClientes, {
            type: 'doughnut',
            data: {
                labels: ['Clientes Frecuentes', 'Clientes Nuevos'],
                datasets: [{
                    label: 'Ventas por Tipo de Cliente',
                    data: [65, 35], // 
                    backgroundColor: [
                        'rgba(166, 138, 100, 1)', 
                        'rgba(192, 178, 131, 1)'  
                    ],
                    borderColor: [
                        'rgba(166, 138, 100, 1)',
                        'rgba(192, 178, 131, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { position: 'top' }, // Posición de la leyenda
                    title: { 
                        display: true, 
                        text: 'Clientes Frecuentes vs. Nuevos (Porcentaje de Ventas)' 
                        , font: {
                            size: 22
                    }}
                }
            }
        });