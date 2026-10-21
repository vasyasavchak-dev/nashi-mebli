// Мінімальний service worker: кешує лише оболонку (іконки, сторінку-обгортку),
// щоб застосунок можна було встановити й він швидко відкривався.
// Самі дані CRM завжди беруться з Google напряму — нічого не кешується.
const CACHE = 'nashi-mebli-v5';
const SHELL = ['./', './index.html', './manifest.webmanifest', './icons/icon-192.png', './icons/icon-512.png', './icons/apple-touch-icon.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (url.origin !== location.origin) return;            // Google / CRM — без кешу
  e.respondWith(fetch(e.request).catch(() => caches.match(e.request)));   // спершу мережа, без мережі — кеш
});
