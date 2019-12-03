//prod v1
importScripts('https://storage.googleapis.com/workbox-cdn/releases/4.2.0/workbox-sw.js');


workbox.setConfig({
  debug: false
});


workbox.loadModule('workbox-strategies');
workbox.loadModule('workbox-routing');

//This functionis called to make sure url params are not saved for some files
const pluginIgnoreParams={
	 cacheKeyWillBeUsed: async function ({request, mode}) {
		 let pos = request.url.indexOf("?");
		 if(pos>=0)
			 return request.url.substring(0,pos);
		 else return request;
	 }
	
}



            
// Cache the Google Fonts webfont files with a cache first strategy for 1 year.
workbox.routing.registerRoute(
  /^https:\/\/fonts\.googleapis\.com/,
  new workbox.strategies.CacheFirst({
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
  /^https:\/\/fonts\.gstatic\.com/,
  new workbox.strategies.CacheFirst({
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
  new workbox.strategies.CacheFirst({
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
  new workbox.strategies.CacheFirst({
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
  new workbox.strategies.CacheFirst({
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
workbox.routing.registerRoute(//Cache get response api server to reduce unnecessary duplicate requests
 /^https:\/\/api.kutyalepcso.com/,
  new workbox.strategies.CacheFirst({
    cacheName: 'product-info-cache',
    plugins: [
      new workbox.cacheableResponse.Plugin({
        statuses: [0, 200],
      }),
      new workbox.expiration.Plugin({
        maxAgeSeconds: 60 * 20
      }),
    ],
  }),
);

// the js, css and html files will be cached for 5 minutes to reduce the number of server requests
workbox.routing.registerRoute(
  // Cache CSS files
  /\.(?:js|css|html|xml|json)/,
  // Use cache
  new workbox.strategies.CacheFirst({
    // Use a custom cache name
    cacheName: 'js-css-html-json-xml-cache',
	plugins: [
      new workbox.expiration.Plugin({
        maxAgeSeconds: 60 * 5 //expire after 30 minutes
      }),
	  pluginIgnoreParams
    ],
  })
);

//since img_1.jpg files appear first, for faster loading, we will save then in their own cache
workbox.routing.registerRoute(
  /\img_1.(?:png|gif|jpg|jpeg|svg)$/,
  new workbox.strategies.CacheFirst({
    cacheName: 'first-img-cache',
    plugins: [
      new workbox.expiration.Plugin({
        maxEntries: 50,
        maxAgeSeconds: 86400 * 30, // 1 month
      }),
    ],
  }),
); 

//to reduce network load, secondary image caches have been added
workbox.routing.registerRoute(
  /\.(?:png|gif|jpg|jpeg|svg)$/,
  new workbox.strategies.CacheFirst({
    cacheName: 'secondary-img-cache',
    plugins: [
      new workbox.expiration.Plugin({
        maxEntries: 30,
        maxAgeSeconds:  86400 * 30, // 1 month 
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




	 
	  
	