'use strict';

(function () {
  var cardTemplate = document.querySelector('#card').content.querySelector('.map__card');

  var renderOfferType = function (offerType) {
    var offerTypes = {
      'palace': 'Дворец',
      'flat': 'Квартира',
      'house': 'Дом',
      'bungalo': 'Бунгало'
    };
    return offerTypes[offerType];
  };

  var renderPhoto = function (offerPhoto, card) {
    var photo = card.querySelector('.popup__photo');
    if (offerPhoto.length === 0) {
      photo.parentNode.removeChild(photo);
    } else if (offerPhoto.length === 1) {
      photo.src = offerPhoto[0];
    } else if (offerPhoto.length > 1) {
      photo.src = offerPhoto[0];
      for (var i = 1; i < offerPhoto.length; i++) {
        var newPhoto = photo.cloneNode(true);
        newPhoto.src = offerPhoto[i];
        photo.parentNode.appendChild(newPhoto);
      }
    }
  };

  var renderFeature = function (offerFeature, card) {
    var features = card.querySelectorAll('.popup__feature');
    var count = card.querySelectorAll('.popup__feature').length;
    for (var i = 0; i < count; i++) {
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

  window.card = {
    renderCard: function (similarOffer) {
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
      window.map.map.insertBefore(card, window.map.mapFilters);
    }
  };
})();
