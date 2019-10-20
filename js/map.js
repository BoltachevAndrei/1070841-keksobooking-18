'use strict';

(function () {
  var housingType = document.querySelector('#housing-type');
  window.map = {
    isPageActiveState: false,
    map: document.querySelector('.map'),
    mapFilters: document.querySelector('.map__filters-container'),
    pinMain: document.querySelector('.map__pin--main')
  };

  housingType.addEventListener('change', function () {
    onHousingTypeChange(window.data.similarOffers);
  });

  var getLastIndex = function (start, end) {
    return ((end - start - window.pin.PINS_COUNT) > 0 ? start + window.pin.PINS_COUNT + 1 : end + 1);
  };

  var onHousingTypeChange = function (data) {
    window.data.sortedOffers = data.slice();
    var auxiliaryArray = [];
    var startPosition;
    var endPosition;

    window.data.sortedOffers.sort(function (a, b) {
      if (a.offer.type < b.offer.type) {
        return -1;
      } else if (a.offer.type > b.offer.type) {
        return 1;
      } else {
        return 0;
      }
    });
    auxiliaryArray = window.data.sortedOffers.map(function (element) {
      return element.offer.type;
    });
    startPosition = auxiliaryArray.indexOf(housingType.value);
    endPosition = auxiliaryArray.lastIndexOf(housingType.value);
    window.data.sortedOffers = window.data.sortedOffers.slice(startPosition, getLastIndex(startPosition, endPosition));
    window.pin.renderPins(window.data.sortedOffers);
  };
})();
