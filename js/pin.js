'use strict';

(function () {
  var PIN = {
    WIDTH: 50,
    HEIGHT: 70
  };
  var PIN_MAIN_POSITION = {
    MIN: {
      X: 0,
      Y: 130
    },
    MAX: {
      X: 1200,
      Y: 630
    }
  };
  var PIN_MAIN_DISABLED = {
    WIDTH: 65,
    HEIGHT: 65
  };
  var PIN_MAIN_ENABLED = {
    WIDTH: 65,
    HEIGHT: 87
  };
  var PIN_MAIN_DEFAULT_POSITION = {
    LEFT: 570,
    TOP: 375
  };
  var pinsTemplate = document.querySelector('#pin').content.querySelector('.map__pin');
  var pinsContainer = document.querySelector('.map__pins');
  var pinMain = document.querySelector('.map__pin--main');
  var isPinMainDragged;
  var pinMainStartPosition;

  window.pin = {
    PINS_COUNT: 5,
    renderPins: function (offerData) {
      var count = Math.min(offerData.length, window.pin.PINS_COUNT);
      var fragment = document.createDocumentFragment();
      removePins();
      window.data.sortedOffers = offerData.slice();
      for (var i = 0; i < count; i++) {
        fragment.appendChild(renderPin(offerData[i]));
      }
      pinsContainer.appendChild(fragment);
    },
    setPageInactiveState: function () {
      window.utils.disableFormElements(window.form.adFormFieldsets);
      window.utils.disableFormElements(window.map.mapFilters.querySelectorAll('select'));
      window.utils.disableFormElement(window.map.mapFilters.querySelector('fieldset'));
      window.form.adFormInputAddress.value = window.utils.getElementPosition(pinMain, PIN_MAIN_DISABLED, false);
      window.form.adForm.classList.add('ad-form--disabled');
      window.map.isPageActiveState = false;
      setPinMainDefaultPosition();
      window.map.resetFilters();
      enableMapFade();
    },
    removePins: function () {
      var pins = pinsContainer.querySelectorAll('.map__pin');
      pins.forEach(function (element) {
        if (element !== pinMain) {
          element.parentNode.removeChild(element);
        }
      });
    }
  };

  var Coordinate = function (x, y) {
    this.x = x;
    this.y = y;
  };

  Coordinate.prototype.setX = function (x) {
    this.x = x;
  };

  Coordinate.prototype.setY = function (y) {
    this.y = y;
  };

  var setPinMainDefaultPosition = function () {
    pinMain.style = 'left: ' + PIN_MAIN_DEFAULT_POSITION.LEFT + 'px; top: ' + PIN_MAIN_DEFAULT_POSITION.TOP + 'px;';
  };

  var onPinEnterPress = function (evt) {
    window.utils.isEnterPressEvent(evt, function () {
      showCard(evt.currentTarget);
    });
  };

  var renderPin = function (offerData) {
    var pinsElement;
    var similarOffer = {};
    similarOffer = offerData;
    pinsElement = pinsTemplate.cloneNode(true);
    pinsElement.style = 'left: ' + (similarOffer.location.x - PIN.WIDTH / 2) + 'px; top: ' + (similarOffer.location.y - PIN.HEIGHT) + 'px;';
    pinsElement.querySelector('img').src = similarOffer.author.avatar;
    pinsElement.querySelector('img').alt = similarOffer.offer.title;
    pinsElement.addEventListener('click', function (evt) {
      showCard(evt.currentTarget);
    });
    pinsElement.addEventListener('keydown', onPinEnterPress);
    return pinsElement;
  };

  var disableMapFade = function () {
    window.map.map.classList.remove('map--faded');
  };

  var enableMapFade = function () {
    window.map.map.classList.add('map--faded');
  };

  var setPageActiveState = function () {
    window.utils.enableFormElements(window.form.adFormFieldsets);
    window.utils.enableFormElements(window.map.mapFilters.querySelectorAll('select'));
    window.utils.enableFormElement(window.map.mapFilters.querySelector('fieldset'));
    window.form.adFormInputAddress.value = window.utils.getElementPosition(pinMain, PIN_MAIN_ENABLED, true);
    window.form.adForm.classList.remove('ad-form--disabled');
    window.map.setFilterEventListeners();
    window.map.isPageActiveState = true;
    window.form.setGuestsValidValues();
    disableMapFade();
  };

  var onLoadDataSuccess = function (data) {
    window.data.generateSimilarOffers(data);
    window.pin.renderPins(data);
    window.form.setMinPrice();
    setPageActiveState();
  };

  var onLoadDataError = function () {
    var errorBanner = document.querySelector('#error').content.querySelector('div');
    var main = document.querySelector('main');
    errorBanner.cloneNode(true);
    main.insertBefore(errorBanner, main.children[0]);
    window.pin.setPageInactiveState();
  };

  var removePins = function () {
    var pins = pinsContainer.querySelectorAll('.map__pin:not(.map__pin--main)');
    pins.forEach(function (element) {
      element.parentNode.removeChild(element);
    });
  };

  document.addEventListener('keydown', function (evt) {
    if (evt.keyCode === window.utils.ENTER_KEY && evt.target === pinMain && !window.map.isPageActiveState) {
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

  var onPinMainMouseMove = function (moveEvt) {
    moveEvt.preventDefault();
    isPinMainDragged = true;
    var shift = new Coordinate(pinMainStartPosition.x - moveEvt.clientX, pinMainStartPosition.y - moveEvt.clientY);
    pinMainStartPosition.setX(moveEvt.clientX);
    pinMainStartPosition.setY(moveEvt.clientY);
    if ((pinMain.offsetTop - shift.y) >= (PIN_MAIN_POSITION.MIN.Y - PIN_MAIN_ENABLED.HEIGHT) && (pinMain.offsetTop - shift.y) <= (PIN_MAIN_POSITION.MAX.Y - PIN_MAIN_ENABLED.HEIGHT)) {
      pinMain.style.top = (pinMain.offsetTop - shift.y) + 'px';
    }
    if ((pinMain.offsetLeft - shift.x) > (PIN_MAIN_POSITION.MIN.X - PIN_MAIN_ENABLED.WIDTH / 2) && (pinMain.offsetLeft - shift.x) < (PIN_MAIN_POSITION.MAX.X - PIN_MAIN_ENABLED.WIDTH / 2)) {
      pinMain.style.left = (pinMain.offsetLeft - shift.x) + 'px';
    }
    window.form.adFormInputAddress.value = window.utils.getElementPosition(pinMain, PIN_MAIN_ENABLED, true);
  };

  var onPinMainMouseUp = function (upEvt) {
    upEvt.preventDefault();
    document.removeEventListener('mousemove', onPinMainMouseMove);
    document.removeEventListener('mouseup', onPinMainMouseUp);
    if (isPinMainDragged) {
      var onClickPreventDefault = function (stopEvt) {
        stopEvt.preventDefault();
        pinMain.removeEventListener('click', onClickPreventDefault);
      };
      pinMain.addEventListener('click', onClickPreventDefault);
    }
  };

  pinMain.addEventListener('mousedown', function (evt) {
    if (!window.map.isPageActiveState) {
      window.backend.load(onLoadDataSuccess, onLoadDataError, window.backend.URL);
    } else {
      evt.preventDefault();
      isPinMainDragged = false;
      pinMainStartPosition = new Coordinate(evt.clientX, evt.clientY);
      document.addEventListener('mousemove', onPinMainMouseMove);
      document.addEventListener('mouseup', onPinMainMouseUp);
    }
  });

  window.pin.setPageInactiveState();
})();
