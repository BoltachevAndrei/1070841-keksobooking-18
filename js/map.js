'use strict';

(function () {
  var FILTER_SELECT_ALL = 'any';
  var filterNameToOfferKey = {
    'housing-type': 'type',
    'housing-price': 'price',
    'housing-rooms': 'rooms',
    'housing-guests': 'guests'
  };
  var filterPriceValueToRange = {
    'low': {
      min: 1,
      max: 9999
    },
    'middle': {
      min: 10000,
      max: 50000
    },
    'high': {
      min: 50001,
      max: 10000000
    }
  };
  var selectFilters = document.querySelectorAll('.map__filter');
  var checkBoxFilters = document.querySelectorAll('.map__checkbox');

  window.map = {
    isPageActiveState: false,
    map: document.querySelector('.map'),
    mapFilters: document.querySelector('.map__filters-container'),
    setFilterEventListeners: function () {
      for (var i = 0; i < selectFilters.length; i++) {
        setFilterEventListener(selectFilters[i]);
      }
      for (var j = 0; j < checkBoxFilters.length; j++) {
        setFilterEventListener(checkBoxFilters[j]);
      }
    }
  };

  var setFilterEventListener = function (element) {
    element.addEventListener('change', function () {
      onFilterChange(window.data.similarOffers);
    });
  };

  var onFilterChange = window.utils.debounce(function (data) {
    window.data.sortedOffers = data.slice();
    for (var i = 0; i < selectFilters.length; i++) {
      if (selectFilters[i].value === FILTER_SELECT_ALL) {
        continue;
      }
      if (selectFilters[i].name !== 'housing-price') {
        var key = filterNameToOfferKey[selectFilters[i].name];
        window.data.sortedOffers = window.data.sortedOffers.filter(function (element) {
          return (String(element.offer[key]) === selectFilters[i].value);
        });
      } else {
        window.data.sortedOffers = window.data.sortedOffers.filter(function (element) {
          return (element.offer.price >= filterPriceValueToRange[selectFilters[i].value].min && element.offer.price <= filterPriceValueToRange[selectFilters[i].value].max);
        });
      }
    }
    for (var j = 0; j < checkBoxFilters.length; j++) {
      if (!checkBoxFilters[j].checked) {
        continue;
      }
      window.data.sortedOffers = window.data.sortedOffers.filter(function (element) {
        return (element.offer.features.indexOf(checkBoxFilters[j].value) >= 0);
      });
    }
    window.pin.renderPins(window.data.sortedOffers);
    window.card.deleteCard();
  });
})();
