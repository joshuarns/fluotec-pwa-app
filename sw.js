//asignar un nombre y versión al cache
const CACHE_NAME = 'v1_cache_fluotec',
  urlsToCache = [
    './',
    './index.html',
    './html/vegalux-300.html',
    './html/auralux.html',
    './html/cine-light.html',
    './html/cine-light-quad.html',
    './html/studio-led.html',
    './html/star-maker.html',
    './html/awards.html',
    './css/styles-products.css',
    './css/style.css',
    './css/awards.css',
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
    './img/auralux-img.png',
    './img/img-awards/awards-1.jpg',
    './img/img-awards/awards-2.jpg',
    './img/img-awards/awards-3.jpg',
    './img/img-awards/awards-4.jpg',
    './img/img-awards/awards-5.jpg',
    './img/img-awards/awards-6.jpg',
    './img/img-awards/awards-7.jpg',
    './img/img-awards/awards-8.jpg',
    './img/img-awards/awards-9.jpg',
    './img/img-awards/awards-10.jpg',
    './img/img-awards/awards-11.jpg',
    './img/img-awards/awards-12.jpg',
    './img/img-awards/awards-13.jpg',
    './img/img-awards/awards-14.jpg',
    './img/img-awards/awards-15.jpg',
    './img/img-awards/awards-16.jpg',
    './img/img-awards/awards-17.jpg',
    './script.js',
    './manifest.json',
    './html/installServiceW.js',
    'https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css'
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