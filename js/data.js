'use strict';

(function () {
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

  window.data = {
    similarOffers: [],
    generateSimilarOffers: function (count) {
      for (var i = 0; i < count; i++) {
        var similarOffer = {};
        var author = {};
        var offer = {};
        var location = {};
        author.avatar = window.utils.generateString(i + 1, AVATAR.PREFIX, AVATAR.SUFFIX);
        location.x = window.utils.generateNumber(LOCATION.X.MIN, LOCATION.X.MAX, LOCATION.X.STEP) + window.pin.PIN.WIDTH / 2;
        location.y = window.utils.generateNumber(LOCATION.Y.MIN, LOCATION.Y.MAX, LOCATION.Y.STEP) + window.pin.PIN.HEIGHT;
        offer.title = window.utils.generateString(i + 1, TITLE.PREFIX, TITLE.SUFFIX);
        offer.address = window.utils.generateString(', ', location.x, location.y);
        offer.price = window.utils.generateNumber(PRICE.MIN, PRICE.MAX, PRICE.STEP);
        offer.type = window.utils.getRandomElement(TYPES);
        offer.room = window.utils.generateNumber(ROOM.MIN, ROOM.MAX, ROOM.STEP);
        offer.guest = window.utils.generateNumber(GUEST.MIN, GUEST.MAX, GUEST.STEP);
        offer.checkin = window.utils.getRandomElement(CHECK.IN);
        offer.checkout = window.utils.getRandomElement(CHECK.OUT);
        offer.feature = window.utils.getRandomArray(FEATURES);
        offer.description = window.utils.generateString(i + 1, DESCRIPTION.PREFIX, DESCRIPTION.SUFFIX);
        offer.photo = window.utils.getRandomArray(PHOTOS);
        similarOffer.author = author;
        similarOffer.offer = offer;
        similarOffer.location = location;
        window.data.similarOffers[i] = similarOffer;
      }
    }
  };
})();
