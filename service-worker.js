//prod v1
importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.6.1/workbox-sw.js');


workbox.setConfig({
  debug: false
});


workbox.loadModule('workbox-strategies');
workbox.loadModule('workbox-routing');


            
// Cache the Google Fonts webfont files with a cache first strategy for 1 year.
workbox.routing.registerRoute(
  /^https:\/\/fonts\.googleapis\.com/,
  workbox.strategies.cacheFirst({
    cacheName: 'perm-library',
    plugins: [
      new workbox.cacheableResponse.Plugin({ 
        statuses: [0, 200]
      }),
      new workbox.expiration.Plugin({
        maxAgeSeconds: 60 * 60 * 24 * 365
      }),
    ],
  }),
); 

workbox.routing.registerRoute(
  /^https:\/\/ajax\.googleapis\.com/,
  workbox.strategies.cacheFirst({
    cacheName: 'perm-library',
    plugins: [
      new workbox.cacheableResponse.Plugin({
        statuses: [0, 200]
      }),
      new workbox.expiration.Plugin({
        maxAgeSeconds: 60 * 60 * 24 * 365
      }),
    ],
  }),
); 

workbox.routing.registerRoute(
  /\/w3.css$/,
  workbox.strategies.cacheFirst({
    cacheName: 'perm-library',
    plugins: [
      new workbox.cacheableResponse.Plugin({
        statuses: [0, 200]
      }),
      new workbox.expiration.Plugin({
        maxAgeSeconds: 60 * 60 * 24 * 365
      }),
    ],
  }),
);

//cache the slick library which is unlikely to change for a year
workbox.routing.registerRoute(
  /\/slick/,
  workbox.strategies.cacheFirst({
    cacheName: 'perm-library',
    plugins: [
      new workbox.cacheableResponse.Plugin({
        statuses: [0, 200],
      }),
      new workbox.expiration.Plugin({
        maxAgeSeconds: 60 * 60 * 24 * 365
      }),
    ],
  }),
);

// the js, css and html files will be cached for 5 minutes to reduce the number of server requests
workbox.routing.registerRoute(
  // Cache CSS files
  /\.(?:js|css|html|xml|json)/,
  // Use cache but update in the background ASAP
  workbox.strategies.cacheFirst({
    // Use a custom cache name
    cacheName: 'js-css-html-json-xml-cache',
	plugins: [
      new workbox.expiration.Plugin({
        maxAgeSeconds: 60 * 1 //expire after 10 minutes
      }),
    ],
  })
);

//since img_1.jpg files appear first, for faster loading, we will save then in their own cache
workbox.routing.registerRoute(
  /\img_1.(?:png|gif|jpg|jpeg|svg)$/,
  workbox.strategies.cacheFirst({
    cacheName: 'first-img-cache',
    plugins: [
      new workbox.expiration.Plugin({
        maxEntries: 30,
        maxAgeSeconds: 1 * 60 * 30, // 30 minutes
      }),
    ],
  }),
); 

//to reduce network load, secondary image caches have been added
workbox.routing.registerRoute(
  /\.(?:png|gif|jpg|jpeg|svg)$/,
  workbox.strategies.cacheFirst({
    cacheName: 'secondary-img-cache',
    plugins: [
      new workbox.expiration.Plugin({
        maxEntries: 30,
        maxAgeSeconds:  1 * 60 * 60, // 24 
		 purgeOnQuotaError: true, // Opt-in to automatic cleanup.
      }),
    ],
  }),
); 


//delete all previous caches just to prevent build up
self.addEventListener('activate', function(event) {
  caches.keys().then(function(names) {
    for (let name of names){
		if(name.search('perm')<0)//don't delete permanent cache
			caches.delete(name);
	}
	});
});




	 
	  
	