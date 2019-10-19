'use strict';

(function () {
  var pinsTemplate = document.querySelector('#pin').content.querySelector('.map__pin');
  var mapPins = document.querySelector('.map__pins');
  var mapPinMain = mapPins.querySelector('.map__pin--main');

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
      var count = Math.min(offerData.length, window.pin.PINS_COUNT);
      var fragment = document.createDocumentFragment();
      removePins();
      window.data.sortedOffers = offerData.slice();
      for (var i = 0; i < count; i++) {
        fragment.appendChild(renderPin(offerData[i]));
      }
      mapPins.appendChild(fragment);
    }
  };

  var onMapPinEnterPress = function (evt) {
    window.utils.isEnterPressEvent(evt, function () {
      showCard(evt.currentTarget);
    });
  };

  var renderPin = function (offerData) {
    var pinsElement;
    var similarOffer = {};
    similarOffer = offerData;
    pinsElement = pinsTemplate.cloneNode(true);
    pinsElement.style = 'left: ' + (similarOffer.location.x - window.pin.PIN.WIDTH / 2) + 'px; top: ' + (similarOffer.location.y - window.pin.PIN.HEIGHT) + 'px;';
    pinsElement.querySelector('img').src = similarOffer.author.avatar;
    pinsElement.querySelector('img').alt = similarOffer.offer.title;
    pinsElement.addEventListener('click', function (evt) {
      showCard(evt.currentTarget);
    });
    pinsElement.addEventListener('keydown', onMapPinEnterPress);
    return pinsElement;
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
    window.form.setGuestsValidValues();
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
    window.form.setMaxPrice();
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
    var pins = mapPins.querySelectorAll('.map__pin');
    pins.forEach(function (element) {
      if (element !== mapPinMain) {
        element.parentNode.removeChild(element);
      }
    });
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

  var showCard = function (element) {
    var parent = element.parentNode;
    var index = Array.prototype.indexOf.call(parent.children, element) - 2;
    window.card.renderCard(window.data.sortedOffers[index]);
    var card = document.querySelector('.map__card');
    var popupClose = card.querySelector('.popup__close');
    popupClose.addEventListener('click', function () {
      window.card.deleteCard();
    });
    document.addEventListener('keydown', window.card.onCardEscPress);
  };

  setPageInactiveState();
})();
