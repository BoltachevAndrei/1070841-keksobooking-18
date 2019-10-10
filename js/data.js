'use strict';

(function () {
  window.data = {
    similarOffers: [],
    generateSimilarOffers: function (data) {
      for (var i = 0; i < data.length; i++) {
        var similarOffer = {};
        var author = {};
        var offer = {};
        var location = {};
        author.avatar = data[i].author.avatar;
        location.x = data[i].location.x;
        location.y = data[i].location.y;
        offer.title = data[i].offer.title;
        offer.address = data[i].offer.address;
        offer.price = data[i].offer.price;
        offer.type = data[i].offer.type;
        offer.room = data[i].offer.rooms;
        offer.guest = data[i].offer.guests;
        offer.checkin = data[i].offer.checkin;
        offer.checkout = data[i].offer.checkout;
        offer.feature = data[i].offer.features;
        offer.description = data[i].offer.Description;
        offer.photo = data[i].offer.photos;
        similarOffer.author = author;
        similarOffer.offer = offer;
        similarOffer.location = location;
        window.data.similarOffers[i] = similarOffer;
      }
    }
  };
})();
