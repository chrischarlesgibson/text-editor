const { offlineFallback, warmStrategyCache } = require("workbox-recipes");
const { CacheFirst, StaleWhileRevalidate } = require("workbox-strategies");
const { registerRoute } = require("workbox-routing");
const { CacheableResponsePlugin } = require("workbox-cacheable-response");
//import expiration plugin
const { ExpirationPlugin } = require("workbox-expiration");
const { precacheAndRoute } = require("workbox-precaching/precacheAndRoute");

//self. __WB_MANIFEST - workbox
//Webpack will take that reference and generate our final dist/service-worker.js .
//But for that we need to add a new plugin to our webpack.
//Add assets to the cache and respond to network requests with these cached assets.
precacheAndRoute(self.__WB_MANIFEST);

// A cache first strategy is useful for assets that have been revisioned, such as URLs like /styles/example.a8f5f1.css, since they can be cached for long periods of time.
//checks cache first for the resource bc if there it saves bandwidth and if not there then get assesst from server
const pageCache = new CacheFirst({
  cacheName: "page-cache",
  plugins: [
    //If both statuses and headers are specified, then both conditions must be met for the Response to be considered cacheable.

    new CacheableResponsePlugin({
      statuses: [0, 200],
    }),
    new ExpirationPlugin({
      //max age 30 days and then clear
      maxAgeSeconds: 30 * 24 * 60 * 60,
    }),
  ],
});

//The warm strategy cache recipe allows you to load provided URLs into your cache during the service worker's install phase, caching them with the options of the provided strategy. This can be used as an alternative to precaching if you know the specific URLs you'd like to cache,
warmStrategyCache({
  urls: ["/index.html", "/"],
  strategy: pageCache,
});

registerRoute(({ request }) => request.mode === "navigate", pageCache);

//implemeting asset cacheing
registerRoute(
  // Here we define the callback function that will filter the requests we want to cache (in this case, JS and CSS files)
  ({ request }) => ["style", "script", "worker"].includes(request.destination),
  // Resources are requested from both the cache and the network in parallel.
  // The strategy will respond with the cached version if available,
  // otherwise wait for the network response.
  // The cache is updated with the network response with each successful request.
  new StaleWhileRevalidate({
    // Name of the cache storage.
    cacheName: "asset-cache",
    plugins: [
      // This plugin will cache responses with these headers to a maximum-age of 30 days
      // If both statuses and headers are specified, then both conditions must be met for the Response to be considered cacheable.
      // HTTP StatusCode=0 is associated with incomplete capture of a hit or page and often with a labeling of the hit as: request canceled ("ReqCancelled=Client" "ReqCancelled=Server" or "ReqCancelled=True").

      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
    ],
  })
);
