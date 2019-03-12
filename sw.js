//asignar un nombre y versión al cache
const CACHE_NAME = 'v1_cache_programador_fitness',
  urlsToCache = [
    './',
    './index.html',
    './css/style.css',
    './script.js',
    './img/g6led-177-1.png',
    './img/icono-32.png',
    './img/favicon.png',
    'https://fonts.googleapis.com/css?family=Raleway:400,700',
    'https://fonts.gstatic.com/s/raleway/v12/1Ptrg8zYS_SKggPNwJYtWqZPAA.woff2',
    'https://use.fontawesome.com/releases/v5.0.7/css/all.css',
    'https://use.fontawesome.com/releases/v5.0.6/webfonts/fa-brands-400.woff2'
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