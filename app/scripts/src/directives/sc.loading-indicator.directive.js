(function() {
  'use strict';

  // <div sc-loading-indicator="{{loading}}"></div>
  angular
  .module('kbcMobileApp.core')
  .directive('scLoadingIndicator', scLoadingIndicator);

  scLoadingIndicator.$inject = [];

  /* @ngInject */
  function scLoadingIndicator() {
    var directive = {
        link: link,
        restrict: 'A',
        template: '<div class="sc-loading-indicator" data-ng-show="loadingIndicatorVisible" >' +
                  '  <div class="ion-loading-c" data-ng-show="browserSupportsCSSProperty" >' +
                  '  </div>' +
                  '  <div class="text-center" data-ng-show="!browserSupportsCSSProperty">Loading...</div>' +
                  '</div>',
    };
    return directive;

    function link(scope, element, attrs) {
      var indicator = (String(attrs.scLoadingIndicator) === 'true') ? true : false;
      scope.loadingIndicatorVisible = indicator;

      var observer = function(value) {
        value = (String(value) === 'true') ? true : false;
        scope.loadingIndicatorVisible = value;
      };

      attrs.$observe('scLoadingIndicator', observer);

      scope.browserSupportsCSSProperty = true;
      // Assume, it's working for ionic cordova hybrid app.
      // if (!browserSupportsCSSProperty('animation')) {
      //   scope.browserSupportsCSSProperty = false; // fallback…
      // }

      // function browserSupportsCSSProperty(propertyName) {
      //   var elm = document.createElement('div');
      //   propertyName = propertyName.toLowerCase();

      //   if (elm.style[propertyName] !== undefined) {
      //     return true;
      //   }

      //   var propertyNameCapital = propertyName.charAt(0).toUpperCase() + propertyName.substr(1),
      //     domPrefixes = 'Webkit Moz ms O'.split(' ');

      //   for (var i = 0; i < domPrefixes.length; i++) {
      //     if (elm.style[domPrefixes[i] + propertyNameCapital] !== undefined) {
      //       return true;
      //     }
      //   }

      //   return false;
      // }

    }
  }
})();