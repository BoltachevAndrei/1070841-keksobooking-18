'use strict';

var PINS_COUNT = 8;
var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var TYPES = ['palace', 'flat', 'house', 'bungalo'];
var MIN_PRICE = 100;
var MAX_PRICE = 1000;
var STEP_PRICE = 100;
var MIN_ROOMS_COUNT = 1;
var MAX_ROOMS_COUNT = 3;
var STEP_ROOMS_COUNT = 1;
var MIN_GUESTS_COUNT = 0;
var MAX_GUESTS_COUNT = 2;
var STEP_GUESTS_COUNT = 1;
var LOCATION_MIN_X = 0;
var LOCATION_MAX_X = 1150;
var LOCATION_MIN_Y = 130;
var LOCATION_MAX_Y = 630;
var LOCATION_STEP_X = 1;
var LOCATION_STEP_Y = 1;
var CHECK_IN = ['12:00', '13:00', '14:00'];
var CHECK_OUT = ['12:00', '13:00', '14:00'];
var PHOTOS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];
var PIN_WIDTH = 50;
var PIN_HEIGHT = 70;
var DESCRIPRION_PREFIX = 'Описание 0';
var DESCRIPTION_SUFFIX = '';
var AVATAR_PREFIX = 'img/avatars/user0';
var AVATAR_SUFFIX = '.png';
var TITLE_PREFIX = 'предложение 0';
var TITLE_SUFFIX = '';

var similarOffers = [];
var map = document.querySelector('.map');
var mapPins = document.querySelector('.map__pins');
var pinsTemplate = document.querySelector('#pin').content.querySelector('.map__pin');

var getRandomElement = function (sourceArray) {
  return sourceArray[Math.floor(Math.random() * sourceArray.length)];
};

var getRandomArray = function (sourceArray) {
  var resultArray = [];
  var tempArray = sourceArray.slice();
  var pickedElements = [];
  resultArray.length = Math.round(Math.random() * sourceArray.length);
  for (var i = 0; i < resultArray.length; i++) {
    pickedElements = tempArray.splice((Math.floor(Math.random() * tempArray.length)), 1);
    resultArray[i] = pickedElements[0];
  }
  return resultArray;
};

var generateString = function (text, prefix, suffix) {
  return prefix + text + suffix;
};

var generateNumber = function (min, max, step) {
  return Math.round((Math.random() * ((max - min) / step))) * step + min;
};

var generateSimilarOffers = function (count) {
  for (var i = 0; i < count; i++) {
    var similarOffer = {};
    var author = {};
    var offer = {};
    var location = {};
    author.avatar = generateString(i + 1, AVATAR_PREFIX, AVATAR_SUFFIX);
    location.x = generateNumber(LOCATION_MIN_X, LOCATION_MAX_X, LOCATION_STEP_X) + PIN_WIDTH / 2;
    location.y = generateNumber(LOCATION_MIN_Y, LOCATION_MAX_Y, LOCATION_STEP_Y) + PIN_HEIGHT;
    offer.title = generateString(i + 1, TITLE_PREFIX, TITLE_SUFFIX);
    offer.address = generateString(', ', location.x, location.y);
    offer.price = generateNumber(MIN_PRICE, MAX_PRICE, STEP_PRICE);
    offer.type = getRandomElement(TYPES);
    offer.room = generateNumber(MIN_ROOMS_COUNT, MAX_ROOMS_COUNT, STEP_ROOMS_COUNT);
    offer.guest = generateNumber(MIN_GUESTS_COUNT, MAX_GUESTS_COUNT, STEP_GUESTS_COUNT);
    offer.checkin = getRandomElement(CHECK_IN);
    offer.checkout = getRandomElement(CHECK_OUT);
    offer.feature = getRandomArray(FEATURES);
    offer.description = generateString(i + 1, DESCRIPRION_PREFIX, DESCRIPTION_SUFFIX);
    offer.photo = getRandomArray(PHOTOS);
    similarOffer.author = author;
    similarOffer.offer = offer;
    similarOffer.location = location;
    similarOffers[i] = similarOffer;
  }
};

var renderPins = function (count) {
  var pinsElement;
  var similarOffer = {};
  var fragment = document.createDocumentFragment();

  for (var i = 0; i < count; i++) {
    similarOffer = similarOffers[i];
    pinsElement = pinsTemplate.cloneNode(true);
    pinsElement.style = 'left: ' + (similarOffer.location.x - PIN_WIDTH / 2) + 'px; top: ' + (similarOffer.location.y - PIN_HEIGHT) + 'px;';
    pinsElement.querySelector('img').src = similarOffer.author.avatar;
    pinsElement.querySelector('img').alt = similarOffer.offer.title;
    fragment.appendChild(pinsElement);
  }
  mapPins.appendChild(fragment);
};

var showElement = function (element) {
  element.classList.remove('map--faded');
};

generateSimilarOffers(PINS_COUNT);
renderPins(PINS_COUNT);
showElement(map);
