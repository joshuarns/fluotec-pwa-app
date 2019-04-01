//asignar un nombre y versión al cache
const CACHE_NAME = 'v1_cache_fluotec',
  urlsToCache = [
    './',
    // HTML
    './index.html',
    './html/vegalux-300.html',
    // CSS
    './css/styles-products.css',
    './css/style.css',
    //IMG
    './img/fluotec-logo.png',
    './img/header-banner.jpg',
    './img/icono-64.png',
    './img/carrousel-1.png',
    './img/carousel-image-2.png',
    './img/carousel-image-3.png',
    './img/reconocimiento-1.png',
    './img/reconocimiento-2.png',
    './img/fluotec-photo-white-balck.jpg',
    './img/icono-192.png',
    './img/vegalux-300-1.png',
    './img/g-6led-171-2.png',
    './img/cine-light-1.png',
    './img/led-panels-image.png',
    './img/studio-led-1.png',
    './img/star-maker.png',
    './img/logo-x-900.jpg',
    './img/copa-image.jpg',
    './img/golden-gate.jpg',
    './img/favicon.png',
    // JavaScript
    './script.js',
    './manifest.json',
    './html/installServiceW.js'
  ]

//durante la fase de instalación, generalmente se almacena en caché los activos estáticos
self.addEventListener('install', e => {
  console.log('Evento: Service Worker instalado')
  e.waitUntil(
    caches.open(CACHE_NAME)
    .then(cache => {
      console.log('Archivos en cache')
      return cache.addAll(urlsToCache)
        .then(() => self.skipWaiting())
    })
    .catch(err => console.log('Falló registro de cache', err))
  )
})

//una vez que se instala el SW, se activa y busca los recursos para hacer que funcione sin conexión
self.addEventListener('activate', e => {
  console.log('Evento: Service Worker Activado')
  const cacheWhitelist = [CACHE_NAME]
  e.waitUntil(
    caches.keys()
    .then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          //Eliminamos lo que ya no se necesita en cache
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName)
          }
        })
      )
    })
    // Le indica al SW activar el cache actual
    .then(() => {
      console.log('El cache esta limpio y se ha actualizado')
      return self.clients.claim()
    })
  )
})

//cuando el navegador recupera una url
self.addEventListener('fetch', e => {
  console.log('Service Worker Recuperado')
  //Responder ya sea con el objeto en caché o continuar y buscar la url real
  e.respondWith(
    caches.match(e.request)
    .then(res => {
      console.log('Recuperando cache')
      if (res) {
        return res
      }
      //recuperar de la petición a la url
      return fetch(e.request)
    })
  )
})