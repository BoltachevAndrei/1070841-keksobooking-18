'use strict';

(function () {
  var housingType = document.querySelector('#housing-type');
  window.map = {
    isPageActiveState: false,
    map: document.querySelector('.map'),
    mapPinMain: document.querySelector('.map__pin--main'),
    mapFilters: document.querySelector('.map__filters-container')
  };

  housingType.addEventListener('change', function () {
    onHousingTypeChange(window.data.similarOffers);
  });

  var onHousingTypeChange = function (data) {
    var sortedOffers = [];
    var auxiliaryArray = [];
    var startPosition;
    var endPosition;

    data.sort(function (a, b) {
      if (a.offer.type < b.offer.type) {
        return -1;
      } else if (a.offer.type > b.offer.type) {
        return 1;
      } else {
        return 0;
      }
    });
    auxiliaryArray = data.map(function (element) {
      return element.offer.type;
    });
    startPosition = auxiliaryArray.indexOf(housingType.value);
    endPosition = auxiliaryArray.lastIndexOf(housingType.value);
    sortedOffers = data.slice(startPosition, endPosition + 1).slice(0, window.pin.PINS_COUNT);
    window.pin.renderPins(sortedOffers);
  };
})();
