// const CACHE_NAME = APP_PREFIX + VERSION;
const CACHE_NAME = "static-cache-v1";
const DATA_CACHE_NAME = "data-cache-v1";

// list all files to cache
const FILES_TO_CACHE = [
  "/",
  "/index.html",
  "idb.js",
  "index.js",
  "manifest.json",
  "service-worker.js",
  "/icons/icon-192x192.png",
  "/icons/icon-512x512.png",
  "styles.css"
];
// function to all all files to cache
self.addEventListener("install", function (e) {
  e.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      console.log("installing cache : " + CACHE_NAME);
      cache
          .addAll(FILES_TO_CACHE)
          .then((result) => {
            // debugger;
            console.log("result of add all", result);
          })
          .catch((err) => {
            // debugger;
            console.log("Add all error: ", err);
          });
      })
      .catch((err) => {
        console.log(err);
      })
  );
});
self.addEventListener("activate", function (e) {
  e.waitUntil(
    caches.keys().then(function (keyList) {
      // let cacheKeeplist = keyList.filter(function (key) {
      //   return key.indexOf(APP_PREFIX);
      // });
      // cacheKeeplist.push(CACHE_NAME);
      return Promise.all(
        keyList.map(function (key, i) {
         // if (casheKeeplist.indexOf(key) === -1) {
           if (key !== CACHE_NAME && key !== DATA_CACHE_NAME) {
            console.log("deleting cache : " + keyList[i]);
            return caches.delete(keyList[i]);
          }
        })
      );
    })
  );
});

// fetch
self.addEventListener("fetch", function (e) {
if (e.request.url.includes("/api/")) {
  e.respondWith(
    caches
      .open(DATA_CACHE_NAME)
      .then((cache) => {
        return fetch(e.request)
          .then((response) => {
            // If the response was good, clone it and store it in the cache.
            if (response.status === 200) {
              cache.put(e.request.url, response.clone());
            }

            return response;
          })
          .catch((err) => {
            // Network request failed, try to get it from the cache.
            return cache.match(e.request);
          });
      })
      .catch((err) => console.log(err))
  );

  return;
}

e.respondWith(
  // caches.open(CACHE_NAME).then((cache) => {
  //   return cache.match(e.request).then((response) => {
  //     return response || fetch(e.request);
  //   });
  // })
  fetch(e.request).catch(function () {
    return caches.match(e.request).then(function (response) {
        if (response) {
            return response;
        } else if (e.request.headers.get('accept').includes('text/html')) {
            // return the cached home page for all requests for html pages
            return caches.match('/');
        }
    });
})
);
});

