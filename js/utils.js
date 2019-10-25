'use strict';

(function () {
  var DISABLED_ATTRIBUTE = {
    disabled: ''
  };
  var DEBOUNCE_INTERVAL = 500;

  window.utils = {
    ENTER_KEY: 13,
    ESC_KEY: 27,
    setElementAttribute: function (element, elementAttributes) {
      for (var elementAttribute in elementAttributes) {
        if (elementAttributes.hasOwnProperty(elementAttribute)) {
          element.setAttribute(elementAttribute, elementAttributes[elementAttribute]);
        }
      }
    },
    removeElementAttribute: function (element, elementAttributes) {
      for (var elementAttribute in elementAttributes) {
        if (elementAttributes.hasOwnProperty(elementAttribute)) {
          element.removeAttribute(elementAttribute);
        }
      }
    },
    disableFormElements: function (elements) {
      for (var element in elements) {
        if (elements.hasOwnProperty(element)) {
          window.utils.setElementAttribute(elements[element], DISABLED_ATTRIBUTE);
        }
      }
    },
    enableFormElements: function (elements) {
      for (var element in elements) {
        if (elements.hasOwnProperty(element)) {
          window.utils.removeElementAttribute(elements[element], DISABLED_ATTRIBUTE);
        }
      }
    },
    disableFormElement: function (element) {
      window.utils.setElementAttribute(element, DISABLED_ATTRIBUTE);
    },
    enableFormElement: function (element) {
      window.utils.removeElementAttribute(element, DISABLED_ATTRIBUTE);
    },
    getElementPosition: function (element, elementDimensions, isEnabled) {
      var prefix1 = 'top: ';
      var prefix2 = 'left: ';
      var suffix = 'px;';
      var style = element.getAttribute('style');
      var topStartIndex = style.indexOf(prefix1);
      var leftStartIndex = style.indexOf(prefix2);
      var topStopIndex = style.indexOf(suffix, topStartIndex);
      var leftStopIndex = style.indexOf(suffix, leftStartIndex);
      var top = parseInt(style.slice(topStartIndex + prefix1.length, topStopIndex), 10);
      var left = parseInt(style.slice(leftStartIndex + prefix2.length, leftStopIndex), 10);
      if (isEnabled) {
        return ((left + Math.round(elementDimensions.WIDTH / 2)) + ', ' + (top + elementDimensions.HEIGHT));
      }
      return ((left + Math.round(elementDimensions.WIDTH / 2)) + ', ' + (top + Math.round(elementDimensions.HEIGHT / 2)));
    },
    isEnterPressEvent: function (evt, action) {
      if (evt.keyCode === window.utils.ENTER_KEY) {
        action();
      }
    },
    isEscPressEvent: function (evt, action) {
      if (evt.keyCode === window.utils.ESC_KEY) {
        action();
      }
    },
    debounce: function (cb) {
      var lastTimeout = null;
      return function () {
        var parameters = arguments;
        if (lastTimeout) {
          window.clearTimeout(lastTimeout);
        }
        lastTimeout = window.setTimeout(function () {
          cb.apply(null, parameters);
        }, DEBOUNCE_INTERVAL);
      };
    }
  };
})();
