'use strict';

(function () {
  var REQUEST_OK = 200;

  var sendRequest = function (onLoad, onError, data, url, urlSuffix, method) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.open(method, url + urlSuffix);
    xhr.addEventListener('load', function () {
      if (xhr.status === REQUEST_OK) {
        onLoad(xhr.response);
      } else {
        onError();
      }
    });
    xhr.addEventListener('error', function () {
      onError();
    });
    xhr.send(data);
  };

  window.backend = {
    URL: 'https://js.dump.academy/keksobooking',
    load: function (onLoad, onError, url) {
      sendRequest(onLoad, onError, '', url, '/data', 'GET');
    },
    save: function (onLoad, onError, data, url) {
      sendRequest(onLoad, onError, data, url, '', 'POST');
    }
  };
})();
