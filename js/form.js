'use strict';

(function () {
  var FORM_ATTRIBUTES = {
    method: 'post',
    enctype: 'multipart/form-data',
    action: 'https://js.dump.academy/keksobooking',
    autocomplete: 'off'
  };

  var adForm = document.querySelector('.ad-form');
  var adFormSubmit = adForm.querySelector('.ad-form__submit');
  var adFormRoomNumber = adForm.querySelector('#room_number');
  var adFormCapacity = adForm.querySelector('#capacity');

  window.utils.setElementAttribute(adForm, FORM_ATTRIBUTES);

  adFormSubmit.addEventListener('click', function () {
    if (adFormRoomNumber.value !== adFormCapacity.value) {
      adFormCapacity.setCustomValidity('Количество гостей должно соответствовать количеству комнат');
    } else {
      adFormCapacity.setCustomValidity('');
    }
  });

  window.form = {
    adForm: adForm,
    adFormFieldsets: adForm.querySelectorAll('fieldset'),
    adFormInputAddress: adForm.querySelector('#address')
  };
})();
