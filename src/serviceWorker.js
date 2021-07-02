/* global importScripts, workbox, firebase */
/* eslint-disable no-restricted-globals */
importScripts(
  "https://storage.googleapis.com/workbox-cdn/releases/5.1.4/workbox-sw.js"
);

// cache map
const cacheMap = {
  local: "local-resources",
  html: "notemap-html",
  images: "images",
  externalStatic: "external-static-resources",
};

const clearCaches = async () => {
  const cacheNames = await caches.keys();
  const filtered = cacheNames.filter(
    (name) => !Object.values(cacheMap).includes(name)
  );
  return Promise.all(filtered.map((name) => caches.delete(name)));
};

workbox.core.clientsClaim();

// Clear unnecessary caches
self.addEventListener("activate", (e) => {
  e.waitUntil(clearCaches());
});

const isLocal = (url) => url.origin === self.location.origin;
const isOSM = (url) => url.origin.match(/openstreetmap.org/);

// Cache all local resources (index.html, bundled CSS & JS) with a network first strategy
workbox.routing.registerRoute(
  ({ url, request }) => {
    const dontCache = [
      "image", // outdated images never cause any issues and will be cached stale while revalidate
      "document", // index.html is cached separately
    ];
    return isLocal(url) && !dontCache.includes(request.destination);
  },
  new workbox.strategies.NetworkFirst({
    cacheName: cacheMap.local,
    plugins: [
      new workbox.cacheableResponse.CacheableResponsePlugin({
        statuses: [200],
      }),
    ],
  })
);

// Cache index.html with network first
workbox.routing.registerRoute(
  ({ url, request }) => isLocal(url) && request.destination === "document",
  new workbox.strategies.NetworkFirst({
    cacheName: cacheMap.html,
    plugins: [
      {
        cacheKeyWillBeUsed: () => "index",
      },
    ],
  })
);

// Cache local images with stale while revalidate
workbox.routing.registerRoute(
  ({ url, request }) => isLocal(url) && request.destination === "image",
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: cacheMap.images,
    plugins: [
      new workbox.expiration.ExpirationPlugin({
        maxAgeSeconds: 60 * 60 * 24 * 30, // expire after 1 month
      }),
    ],
  })
);

// Cache external stylesheets & scripts with a stale with revalidate strategy
workbox.routing.registerRoute(
  ({ request, url }) =>
    !isLocal(url) &&
    !isOSM(url) &&
    (request.destination === "script" || request.destination === "style"),
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: cacheMap.externalStatic,
  })
);

// Push Messaging
importScripts("https://www.gstatic.com/firebasejs/8.6.8/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/8.6.8/firebase-messaging.js");

// Initialize the Firebase app in the service worker by passing the generated config
const firebaseProjectId = process.env.REACT_APP_FIREBASE_PROJECT_ID;

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: `${firebaseProjectId}pwa-notemap.firebaseapp.com`,
  projectId: firebaseProjectId,
  storageBucket: `${firebaseProjectId}.appspot.com`,
  messagingSenderId: process.env.REACT_APP_FIREBASE_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

firebase.initializeApp(firebaseConfig);

// Retrieve firebase messaging
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log("Received background message ", payload);
});
