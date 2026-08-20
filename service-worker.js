const CACHE='vtm-v5v6-chargen-v0.2.0';
const ASSETS=['./','./index.html','./manifest.webmanifest','./data/rules.js','./data/clans.js','./data/skills.js','./data/resources.js','./data/lifepaths.js','./data/merits.js','./src/model.js','./src/app.js','./icon-192.png','./icon-512.png','./apple-touch-icon.png'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS))));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k))))));
self.addEventListener('fetch',e=>e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request))));
