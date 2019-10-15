'use strict';

(function () {
  var pinsTemplate = document.querySelector('#pin').content.querySelector('.map__pin');
  var mapPins = document.querySelector('.map__pins');

  window.pin = {
    PINS_COUNT: 5,
    PIN: {
      WIDTH: 50,
      HEIGHT: 70
    },
    PIN_MAIN_DISABLED: {
      WIDTH: 65,
      HEIGHT: 65
    },
    PIN_MAIN_ENABLED: {
      WIDTH: 65,
      HEIGHT: 87
    },
    renderPins: function (offerData) {
      var pinsElement;
      var similarOffer = {};
      var count = Math.min(offerData.length, window.pin.PINS_COUNT);
      var fragment = document.createDocumentFragment();
      removePins();
      for (var i = 0; i < count; i++) {
        similarOffer = offerData[i];
        pinsElement = pinsTemplate.cloneNode(true);
        pinsElement.style = 'left: ' + (similarOffer.location.x - window.pin.PIN.WIDTH / 2) + 'px; top: ' + (similarOffer.location.y - window.pin.PIN.HEIGHT) + 'px;';
        pinsElement.querySelector('img').src = similarOffer.author.avatar;
        pinsElement.querySelector('img').alt = similarOffer.offer.title;
        fragment.appendChild(pinsElement);
      }
      mapPins.appendChild(fragment);
    }
  };

  var disableMapFade = function (element) {
    element.classList.remove('map--faded');
  };

  var setPageActiveState = function () {
    window.utils.enableFormElements(window.form.adFormFieldsets);
    window.utils.enableFormElements(window.map.mapFilters.querySelectorAll('select'));
    window.utils.enableFormElement(window.map.mapFilters.querySelector('fieldset'));
    window.form.adFormInputAddress.value = window.utils.getElementPosition(window.map.mapPinMain, window.pin.PIN_MAIN_ENABLED, true);
    window.form.adForm.classList.remove('ad-form--disabled');
    disableMapFade(window.map.map);
    window.map.isPageActiveState = true;
  };

  var setPageInactiveState = function () {
    window.utils.disableFormElements(window.form.adFormFieldsets);
    window.utils.disableFormElements(window.map.mapFilters.querySelectorAll('select'));
    window.utils.disableFormElement(window.map.mapFilters.querySelector('fieldset'));
    window.form.adFormInputAddress.value = window.utils.getElementPosition(window.map.mapPinMain, window.pin.PIN_MAIN_DISABLED, false);
  };

  var onLoadDataSuccess = function (data) {
    window.data.generateSimilarOffers(data);
    window.pin.renderPins(data);
    setPageActiveState();
  };

  var onLoadDataError = function () {
    var errorBanner = document.querySelector('#error').content.querySelector('div');
    var main = document.querySelector('main');
    errorBanner.cloneNode(true);
    main.insertBefore(errorBanner, main.children[0]);
    setPageInactiveState();
  };

  var removePins = function () {
    while (mapPins.firstChild) {
      mapPins.removeChild(mapPins.firstChild);
    }
  };

  window.map.mapPinMain.addEventListener('mousedown', function () {
    if (!window.map.isPageActiveState) {
      window.backend.load(onLoadDataSuccess, onLoadDataError, window.backend.URL);
    }
  });

  document.addEventListener('keydown', function (evt) {
    if (evt.keyCode === window.utils.ENTER_KEY && evt.target === window.map.mapPinMain && !window.map.isPageActiveState) {
      window.backend.load(onLoadDataSuccess, onLoadDataError, window.backend.URL);
    }
  });

  setPageInactiveState();
})();
