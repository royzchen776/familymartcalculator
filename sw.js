const CACHE_NAME = 'fm-calc-v2-ai';
const urlsToCache = [
  './index.html',
  './manifest.json',
  'https://cdn.tailwindcss.com',
  'https://cdn.jsdelivr.net/npm/jsbarcode@3.11.5/dist/JsBarcode.all.min.js',
  'https://cdn.jsdelivr.net/npm/marked/marked.min.js',
  'https://cdn-icons-png.flaticon.com/512/3757/3757881.png' // 關鍵修正：必須快取這個圖示，否則手機可能會認定 App 不完整
];

self.addEventListener('install', event => {
  self.skipWaiting(); // 強制立即更新 Service Worker
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('activate', event => {
  // 清除舊版本的快取，確保使用者總是用到最新的檔案
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // 如果快取中有，就直接回傳快取（離線可用）
        if (response) {
          return response;
        }
        // 否則就去網路抓取
        return fetch(event.request);
      })
  );
});
