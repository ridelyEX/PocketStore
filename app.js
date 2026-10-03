// 1. Registrar el Service Worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
            .then(registration => {
                console.log('Service Worker registrado con éxito:', registration.scope);
            })
            .catch(error => {
                console.log('Fallo al registrar el Service Worker:', error);
            });
    });
}

// 2. Consumir la API y renderizar contenido
document.addEventListener('DOMContentLoaded', () => {
    const contentDiv = document.getElementById('content');
    const API_URL = 'https://jsonplaceholder.typicode.com/users'; // Usamos users como catálogo

    fetch(API_URL)
        .then(response => response.json())
        .then(data => {
            contentDiv.innerHTML = ''; // Limpiar el mensaje de "Cargando"
            data.forEach(item => {
                const card = document.createElement('div');
                card.className = 'card';
                card.innerHTML = `
                    <h2>${item.name}</h2>
                    <p><strong>Email:</strong> ${item.email}</p>
                    <p><strong>Compañía:</strong> ${item.company.name}</p>
                `;
                contentDiv.appendChild(card);
            });
        })
        .catch(error => {
            console.error('Error al obtener los datos:', error);
            contentDiv.innerHTML = '<p class="loading">No se pudo cargar el catálogo. Estás en modo offline y sin datos guardados.</p>';
        });
});