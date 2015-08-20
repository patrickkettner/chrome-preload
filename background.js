'use strict';
function uniq(a) {
  var usedObjects = {};

  for (var i=a.length - 1;i>=0;i--) {
    var so = JSON.stringify(a[i]);

    if (usedObjects[so]) {
      a.splice(i, 1);

    } else {
      usedObjects[so] = true;
    }
  }

  return a;
}

chrome.webRequest.onCompleted.addListener(
  function(details) {
    chrome.tabs.get(details.tabId, function (tab) {

      var host = new URL(tab.url).hostname;

      chrome.storage.local.get(host, function(cache) {
        cache = cache[host];

        if (!Array.isArray(cache)) {
          cache = [];
        }

        var type = details.type;
        switch (type) {
          case 'other':
            if (/\.(woff|ttf)$/.test(details.url)) {
              cache.push({
                type: 'font',
                href: details.url
              });
            }
            break;
          case 'script':
          case 'stylesheet':
            cache.push({
              type: type,
              href: details.url
            });
            break;
        }

        var obj = {};
        obj[host] = uniq(cache);

        chrome.storage.local.set(obj);
      });
    });
  }, {
    urls: ['*://*/*']
  }
);
