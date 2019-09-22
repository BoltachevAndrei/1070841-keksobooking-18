'use strict';

var PINS_COUNT = 8;
var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var TYPES = ['palace', 'flat', 'house', 'bungalo'];
var PHOTOS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];

var PRICE = {
  MIN: 100,
  MAX: 1000,
  STEP: 100
};

var ROOM = {
  MIN: 1,
  MAX: 3,
  STEP: 1
};

var GUEST = {
  MIN: 0,
  MAX: 2,
  STEP: 1
};

var LOCATION = {
  X: {
    MIN: 0,
    MAX: 1150,
    STEP: 1
  },
  Y: {
    MIN: 130,
    MAX: 630,
    STEP: 1
  }
};

var PIN = {
  WIDTH: 50,
  HEIGHT: 70
};

var DESCRIPTION = {
  PREFIX: 'Описание 0',
  SUFFIX: ''
};

var AVATAR = {
  PREFIX: 'img/avatars/user0',
  SUFFIX: '.png'
};

var TITLE = {
  PREFIX: 'предложение 0',
  SUFFIX: ''
};

var CHECK = {
  IN: ['12:00', '13:00', '14:00'],
  OUT: ['12:00', '13:00', '14:00']
};

var similarOffers = [];
var map = document.querySelector('.map');
var mapPins = document.querySelector('.map__pins');
var mapFilters = document.querySelector('.map__filters-container');
var pinsTemplate = document.querySelector('#pin').content.querySelector('.map__pin');
var cardTemplate = document.querySelector('#card').content.querySelector('.map__card');

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
    author.avatar = generateString(i + 1, AVATAR.PREFIX, AVATAR.SUFFIX);
    location.x = generateNumber(LOCATION.X.MIN, LOCATION.X.MAX, LOCATION.X.STEP) + PIN.WIDTH / 2;
    location.y = generateNumber(LOCATION.Y.MIN, LOCATION.Y.MAX, LOCATION.Y.STEP) + PIN.HEIGHT;
    offer.title = generateString(i + 1, TITLE.PREFIX, TITLE.SUFFIX);
    offer.address = generateString(', ', location.x, location.y);
    offer.price = generateNumber(PRICE.MIN, PRICE.MAX, PRICE.STEP);
    offer.type = getRandomElement(TYPES);
    offer.room = generateNumber(ROOM.MIN, ROOM.MAX, ROOM.STEP);
    offer.guest = generateNumber(GUEST.MIN, GUEST.MAX, GUEST.STEP);
    offer.checkin = getRandomElement(CHECK.IN);
    offer.checkout = getRandomElement(CHECK.OUT);
    offer.feature = getRandomArray(FEATURES);
    offer.description = generateString(i + 1, DESCRIPTION.PREFIX, DESCRIPTION.SUFFIX);
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
    pinsElement.style = 'left: ' + (similarOffer.location.x - PIN.WIDTH / 2) + 'px; top: ' + (similarOffer.location.y - PIN.HEIGHT) + 'px;';
    pinsElement.querySelector('img').src = similarOffer.author.avatar;
    pinsElement.querySelector('img').alt = similarOffer.offer.title;
    fragment.appendChild(pinsElement);
  }
  mapPins.appendChild(fragment);
};

var renderOfferType = function (offerType) {
  var type;
  switch (offerType) {
    case 'palace':
      type = 'Дворец';
      break;
    case 'flat':
      type = 'Квартира';
      break;
    case 'house':
      type = 'Дом';
      break;
    case 'bungalo':
      type = 'Бунгало';
      break;
  }
  return type;
};

var renderPhoto = function (offerPhoto, card) {
  var photo = card.querySelector('.popup__photo');
  if (offerPhoto.length === 0) {
    photo.parentNode.removeChild(photo);
  } else if (offerPhoto.length === 1) {
    photo.src = offerPhoto[0];
  } else if (offerPhoto.length > 1) {
    photo.src = offerPhoto[0];
    for (var k = 1; k < offerPhoto.length; k++) {
      var newPhoto = photo.cloneNode(true);
      newPhoto.src = offerPhoto[k];
      photo.parentNode.appendChild(newPhoto);
    }
  }
};

var renderFeature = function (offerFeature, card) {
  var features = card.querySelectorAll('.popup__feature');
  for (var i = card.querySelectorAll('.popup__feature').length - 1; i >= 0; i--) {
    var classes = features[i].getAttribute('class');
    var removeElement = features[i];
    var remove = true;
    for (var j = 0; j < offerFeature.length; j++) {
      if (classes.includes('popup__feature--' + offerFeature[j])) {
        remove = false;
        break;
      }
    }
    if (remove) {
      removeElement.parentNode.removeChild(removeElement);
    }
  }
};

var renderCard = function (similarOffer) {
  var card = cardTemplate.cloneNode(true);
  card.querySelector('.popup__title').textContent = similarOffer.offer.title;
  card.querySelector('.popup__text--address').textContent = similarOffer.offer.address;
  card.querySelector('.popup__text--price').innerHTML = similarOffer.offer.price + '&#x20bd;<span>/ночь</span>';
  card.querySelector('.popup__type').textContent = renderOfferType(similarOffer.offer.type);
  card.querySelector('.popup__text--capacity').textContent = similarOffer.offer.room + ' комнаты для ' + similarOffer.offer.guest + ' гостей';
  card.querySelector('.popup__text--time').textContent = 'Заезд после ' + similarOffer.offer.checkin + ', выезд до ' + similarOffer.offer.checkout;
  renderFeature(similarOffer.offer.feature, card);
  renderPhoto(similarOffer.offer.photo, card);
  card.querySelector('.popup__description').textContent = similarOffer.offer.description;
  card.querySelector('.popup__avatar').src = similarOffer.author.avatar;
  map.insertBefore(card, mapFilters);
};

var showElement = function (element) {
  element.classList.remove('map--faded');
};

generateSimilarOffers(PINS_COUNT);
renderPins(PINS_COUNT);
renderCard(similarOffers[0]);
showElement(map);
