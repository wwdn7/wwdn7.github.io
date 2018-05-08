var CACHE_NAME = "my_cache";
var urlsToCache = [
  '/index.html',
  '/index2.html',
  '/css/style.css',
  '/js/script.js'
];
//这里的self代表ServiceWorkerGlobalScope  全局范围
self.addEventListener('install', function (event) {
  // 这里的waitUtil会在安装成功之前执行一些预装的操作，但是只建议做一些轻量级和非常重要资源的缓存，减少安装失败的概率。
  // 安装成功后ServiceWorker状态会从installing变为installed   
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      console.log('OpenedCache : ', cache);
      return cache.addAll(urlsToCache);
    })
  );
});

var imgArr = [
  '/static/images/1.jpg',
  '/static/images/2.jpeg',
  '/static/images/3.jpg',
  '/static/images/4.jpg',
  '/static/images/5.jpg',
  '/static/images/6.jpg',
  '/static/images/7.jpg',
  '/static/images/8.jpg',
  '/static/images/9.jpg',
  '/static/images/10.jpg',
  '/static/images/11.jpg',
  '/static/images/12.jpg',
  '/static/images/13.jpg',
  '/static/images/14.jpg',
  '/static/images/15.jpg',
  '/static/images/16.jpg',
  '/static/images/17.jpg',
  '/static/images/18.jpg',
  '/static/images/19.jpg',
  '/static/images/20.jpg'
]
caches.open(CACHE_NAME).then(function (cache) {
  cache.addAll(imgArr);
})

// 拦截请求 响应缓存
// self.addEventListener('fetch', function (event) {
//   event.respondWith(
//     caches.match(event.request).then(function (response) {
//       // Cache hit - return response  
//       if (response) {
//         return response;
//       }
//       return fetch(event.request);
//     })
//   );
// });

// 拦截请求 响应已有缓存 并增量缓存新的请求
self.addEventListener('fetch', function (event) {
  event.respondWith(
    caches.match(event.request).then(function (response) {
      if (response) {
        return response;
      }
      var fetchRequest = event.request.clone();
      return fetch(fetchRequest).then(
        function (response) {
          if (!response || response.status !== 200 || !response.headers.get('Content-type').match(/image/)) {
            return response;
          }
          var responseToCache = response.clone();
          caches.open(CACHE_NAME).then(function (cache) {
            cache.put(event.request, responseToCache);
          });
          return response;
        }
      );
    })
  )
})