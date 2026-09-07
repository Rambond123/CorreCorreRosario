// Service worker do Corre Corre Rosário.
// Estratégia: REDE PRIMEIRO para tudo (com internet, sempre a versão nova);
// o cache é só a reserva para jogar offline. Mude o CACHE a cada versão.
const CACHE = 'ccr-v0.14';
const SHELL = ['./', './index.html', './manifest.webmanifest', './icon-192.png', './icon-512.png',
  './sprites/vito.png', './sprites/maria.png',
  ...['cachorro','patinete','drone','barata','rato','aranha','morcego','unicornio','coelho','ursinho','gatinho','cupcake','fadinha'].map(k=>'./sprites/enemies/'+k+'.png'),
  ...['adolescente','frangorato','ursao'].map(k=>'./sprites/bosses/'+k+'.png'),
  ...['orla','lacador','beirario','chafariz'].map(k=>'./sprites/scenery/'+k+'.png')];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  e.respondWith(
    fetch(req).then(r => {
      if (r && r.ok) { const cp = r.clone(); caches.open(CACHE).then(c => c.put(req, cp)); }
      return r;
    }).catch(() => caches.match(req, { ignoreSearch: true }).then(hit => hit || caches.match('./index.html')))
  );
});
