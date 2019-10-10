'use strict';

(function () {
  var generateSimilarOffer = function (offerData) {
    var similarOffer = {};
    var author = {};
    var offer = {};
    var location = {};
    author.avatar = offerData.author.avatar;
    location.x = offerData.location.x;
    location.y = offerData.location.y;
    offer.title = offerData.offer.title;
    offer.address = offerData.offer.address;
    offer.price = offerData.offer.price;
    offer.type = offerData.offer.type;
    offer.room = offerData.offer.rooms;
    offer.guest = offerData.offer.guests;
    offer.checkin = offerData.offer.checkin;
    offer.checkout = offerData.offer.checkout;
    offer.feature = offerData.offer.features;
    offer.description = offerData.offer.Description;
    offer.photo = offerData.offer.photos;
    similarOffer.author = author;
    similarOffer.offer = offer;
    similarOffer.location = location;
    return similarOffer;
  };

  window.data = {
    similarOffers: [],
    generateSimilarOffers: function (offerData) {
      for (var i = 0; i < offerData.length; i++) {
        window.data.similarOffers[i] = generateSimilarOffer(offerData[i]);
      }
    }
  };
})();
