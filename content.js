'use strict';
var host = location.hostname;
chrome.storage.local.get(host, function(caches) {
  caches = caches[host] || [];

  caches.forEach(function(cache) {
    var link = document.createElement('link');
    link.rel = 'preload';
    link.href = cache.href;
    link.setAttribute('as', cache.type);

    document.head.insertBefore(link, document.head.firstChild);
  });
});

