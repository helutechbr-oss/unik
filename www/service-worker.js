const CACHE_NAME = 'unik-app-v2';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './home.html',
  './mapa.html',
  './perfil.html',
  './clube.html',
  './faturas.html',
  './manifest.json',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js',
  'https://unpkg.com/@phosphor-icons/web'
];

// 1. Instalação: Cache dos arquivos estáticos
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// 2. Ativação: Limpa caches antigos
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
});

// 3. Fetch: Tenta rede, se falhar, usa cache (Estratégia Network falling back to Cache)
self.addEventListener('fetch', (event) => {
  // Ignora requisições do Firebase/Google APIs e do Backend para não quebrar autenticação/API
  if (
    event.request.url.includes('firebase') ||
    event.request.url.includes('googleapis') ||
    event.request.url.includes('35.198.58.216') ||
    event.request.method !== 'GET'
  ) {
    return;
  }

  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request);
    })
  );
});