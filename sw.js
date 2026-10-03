const CACHE_NAME = 'pocketstore-v1';
const ASSETS_TO_CACHE = [
    '/',
    '/index.html',
    '/styles.css',
    '/app.js',
    '/manifest.json'
];

// Instalación del Service Worker
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Archivos en caché');
                return cache.addAll(ASSETS_TO_CACHE);
            })
    );
});

// Activación y limpieza de cachés antiguos
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cache => {
                    if (cache !== CACHE_NAME) {
                        console.log('Caché antiguo eliminado');
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
});

// Interceptar peticiones (Fetch)
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(cachedResponse => {
            // Devuelve desde la caché si existe, si no, hace la petición a la red
            return cachedResponse || fetch(event.request).then(response => {
                // Clonar la respuesta de la red para guardarla en caché (útil para la API)
                return caches.open(CACHE_NAME).then(cache => {
                    cache.put(event.request, response.clone());
                    return response;
                });
            });
        }).catch(() => {
            // Opcional: Mostrar un fallback si falla la red y no hay caché
            console.log('Fallo en la red y recurso no encontrado en caché.');
        })
    );
});