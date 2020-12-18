//! Cache the assets
const staticMyNote = "my-note-app-v1";
const assets = [
    "index.html",
    "style/app.css",
    "style/darkmode.css",
    "script/app.js",
    "script/html5shiv.js",
    "img/edit-pen.svg",
    "img/logo.svg",
    "img/header.webp"
];

self.addEventListener("install", installEvent => {
    installEvent.waitUntil(
        caches.open(staticMyNote).then(cache => {
            cache.addAll(assets);
        })
    );
});

//* Fetch the assets
self.addEventListener("fetch", fetchEvent => {
    fetchEvent.respondWith(
        caches.match(fetchEvent.request).then(res => {
            return res || fetch(fetchEvent.request);
        })
    );
});