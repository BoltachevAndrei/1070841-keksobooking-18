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
    window.data.sortedOffers = [];
    var count = 0;
    for (var i = 0; i < data.length; i++) {
      if (count === window.pin.PINS_COUNT) {
        break;
      }
      if (data[i].offer.type === housingType.value) {
        window.data.sortedOffers[count] = data[i];
        count++;
      }
    }
    window.pin.renderPins(window.data.sortedOffers);
  };
})();
