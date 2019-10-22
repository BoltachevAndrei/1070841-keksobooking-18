'use strict';

(function () {
  var FORM_ATTRIBUTES = {
    method: 'post',
    enctype: 'multipart/form-data',
    action: 'https://js.dump.academy/keksobooking',
    autocomplete: 'off'
  };
  var INPUT_TITLE_ATTRIBUTES = {
    minlength: 30,
    maxlength: 100,
    required: ''
  };
  var INPUT_PRICE_ATTRIBUTES = {
    max: 1000000,
    required: ''
  };
  var housingTypeToMinPrice = {
    'bungalo': 0,
    'flat': 1000,
    'house': 5000,
    'palace': 10000
  };
  var roomsToGuests = {
    '1 комната': ['для 1 гостя'],
    '2 комнаты': ['для 1 гостя', 'для 2 гостей'],
    '3 комнаты': ['для 1 гостя', 'для 2 гостей', 'для 3 гостей'],
    '100 комнат': ['не для гостей']
  };
  var READONLY_ATTRIBUTE = {
    readonly: ''
  };
  var DISABLED_ATTRIBUTE = {
    disabled: ''
  };

  var adForm = document.querySelector('.ad-form');
  var adFormSubmit = adForm.querySelector('.ad-form__submit');
  var adFormRooms = adForm.querySelector('#room_number');
  var adFormGuests = adForm.querySelector('#capacity');
  var adFormTitle = adForm.querySelector('#title');
  var adFormAddress = adForm.querySelector('#address');
  var adFormHousingType = adForm.querySelector('#type');
  var adFormPrice = adForm.querySelector('#price');
  var adFormCheckin = adForm.querySelector('#timein');
  var adFormCheckout = adForm.querySelector('#timeout');
  var saveDataSuccessBanner = document.querySelector('#success').content.querySelector('.success');
  var saveDataErrorBanner = document.querySelector('#error').content.querySelector('.error');

  var setElementValidValues = function (element, map) {
    for (var i = 0; i < element.children.length; i++) {
      window.utils.setElementAttribute(element.children[i], DISABLED_ATTRIBUTE);
      for (var j = 0; j < map.length; j++) {
        if (map[j] === element.children[i].textContent) {
          window.utils.removeElementAttribute(element.children[i], DISABLED_ATTRIBUTE);
        }
      }
    }
  };

  var getElementValidValues = function (element, map) {
    var validValues;
    for (var i = 0; i < element.children.length; i++) {
      if (element.children[i].value === element.value) {
        validValues = map[element.children[i].textContent];
      }
    }
    return validValues;
  };

  var getElementTextValue = function (element) {
    var textValue = '';
    for (var i = 0; i < element.children.length; i++) {
      if (element.children[i].value === element.value) {
        textValue = element.children[i].textContent;
      }
    }
    return textValue;
  };

  var checkElementValuesValidity = function (element1, element2, map) {
    var isValid = true;
    var validElementValues = getElementValidValues(element1, map);
    if ((validElementValues.indexOf(getElementTextValue(element2))) < 0) {
      isValid = false;
    }
    return isValid;
  };

  var createBanner = function (element) {
    var banner = element.cloneNode(true);
    document.querySelector('main').insertBefore(banner, document.querySelector('main').firstChild);
  };

  var deleteBanner = function (element) {
    var banner = document.querySelector('main').querySelector('.' + element);
    if (banner) {
      banner.parentNode.removeChild(banner);
      document.removeEventListener('keydown', onBannerPressEsc);
    }
  };

  var onBannerPressEsc = function (evt, banner) {
    window.utils.isEscPressEvent(evt, function () {
      window.pin.setPageInactiveState();
      deleteBanner(banner);
    });
  };

  var onSaveDataSuccess = function () {
    createBanner(saveDataSuccessBanner);
    var banner = document.querySelector('main').querySelector('.success');
    document.addEventListener('keydown', function (evt) {
      onBannerPressEsc(evt, 'success');
    });
    banner.addEventListener('click', function () {
      deleteBanner('success');
    });
    window.pin.setPageInactiveState();
    adForm.reset();
    window.pin.removePins();
    window.card.deleteCard();
  };

  var onSaveDataError = function () {
    createBanner(saveDataErrorBanner);
    var banner = document.querySelector('main').querySelector('.error');
    var errorButton = banner.querySelector('.error__button');
    document.addEventListener('keydown', function (evt) {
      onBannerPressEsc(evt, 'error');
    });
    banner.addEventListener('click', function () {
      deleteBanner('error');
    });
    errorButton.addEventListener('click', function () {
      deleteBanner('error');
    });
    errorButton.focus();
    window.pin.setPageInactiveState();
    adForm.reset();
    window.pin.removePins();
    window.card.deleteCard();
  };

  adFormSubmit.addEventListener('click', function () {
    if (!checkElementValuesValidity(adFormRooms, adFormGuests, roomsToGuests)) {
      adFormGuests.setCustomValidity('Выбранное значение поля недоступно, необходимо выбрать доступное значение');
    } else {
      adFormGuests.setCustomValidity('');
    }
  });

  adForm.addEventListener('submit', function (evt) {
    evt.preventDefault();
    window.backend.save(onSaveDataSuccess, onSaveDataError, new FormData(adForm), window.backend.URL);
  });

  var onHousingTypeChange = function () {
    window.form.setMinPrice();
  };

  var onCheckinChange = function () {
    adFormCheckout.value = adFormCheckin.value;
  };

  var onCheckoutChange = function () {
    adFormCheckin.value = adFormCheckout.value;
  };

  var onRoomsChange = function () {
    window.form.setGuestsValidValues();
  };

  window.utils.setElementAttribute(adForm, FORM_ATTRIBUTES);
  window.utils.setElementAttribute(adFormTitle, INPUT_TITLE_ATTRIBUTES);
  window.utils.setElementAttribute(adFormPrice, INPUT_PRICE_ATTRIBUTES);
  window.utils.setElementAttribute(adFormAddress, READONLY_ATTRIBUTE);
  adFormHousingType.addEventListener('change', onHousingTypeChange);
  adFormCheckin.addEventListener('change', onCheckinChange);
  adFormCheckout.addEventListener('change', onCheckoutChange);
  adFormRooms.addEventListener('change', onRoomsChange);

  window.form = {
    adForm: adForm,
    adFormFieldsets: adForm.querySelectorAll('fieldset'),
    adFormInputAddress: adForm.querySelector('#address'),
    setMinPrice: function () {
      var minPrice = {
        min: housingTypeToMinPrice[adFormHousingType.value]
      };
      window.utils.setElementAttribute(adFormPrice, minPrice);
      adFormPrice.placeholder = minPrice.min;
    },
    setGuestsValidValues: function () {
      setElementValidValues(adFormGuests, getElementValidValues(adFormRooms, roomsToGuests));
    }
  };
})();
