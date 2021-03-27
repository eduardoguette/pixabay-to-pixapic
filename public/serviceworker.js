const nombreCache = 'px-v1';

const assets = [
  "./",
  './index.html',
  './error.html',
  './css/styles.css',
  './css/tailwind.css',
  './js/app.js',
  './js/main.js',
  './images/icons/favicon.ico',
  './images/icons/android-chrome-72x72.png',
  './images/icons/android-chrome-120x120.png',
  './images/icons/android-chrome-128x128.png',
  './images/icons/android-chrome-144x144.png',
  './images/icons/android-chrome-152x152.png',
  './images/icons/android-chrome-196x196.png',
  './images/icons/android-chrome-256x256.png',
  './images/icons/android-chrome-512x512.png',
  './images/fullscreen.png',
  './images/x-regular-24.png',
  './images/image-hero.jpg',
  './video/hero.mp4',
];

// Instalar el service Worker, no se puede utilizar window, por lo tanto se utiliza self
self.addEventListener('install', (e) => {
  console.log('Instalado el Service Worker');

  e.waitUntil(
    // Buen lugar para cachear -
    caches.open(nombreCache).then((cache) => {
      // Esta función es asincrona...
      console.log('cacheando...');
      cache.addAll(assets);
    })
  );

  // Revisar en App (Chrome) en Firefox en Almacenamiento
});
// activer el service worker

self.addEventListener('activate', (e) => {
  console.log('Service Worker Activado');

  // Actualizar la PWA //
  e.waitUntil(
    caches.keys().then((keys) => {
      console.log(keys);

      return Promise.all(
        keys.filter((key) => key !== nombreCache).map((key) => caches.delete(key)) // borrar los demas
      );
    })
  );
});

// evento fetch para descargar assets estaticos

self.addEventListener('fetch', (e) => {
  // console.log('Fetch...', e);

  e.respondWith(
    caches
      .match(e.request)
      .then((respuestaCache) => {
        return respuestaCache || fetch(e.request);
      })
      .catch(() => caches.match('/error.html'))
  );
});
