(function() {
  'use strict';

  angular
    .module('kbcMobileApp.core')
    .filter('scIncrementByNumber', scIncrementByNumber);

  scIncrementByNumber.$inject = [];

  /* @ngInject */
  function scIncrementByNumber() {
    return function(value, incrementNumber) {
      return parseInt(value) + parseInt(incrementNumber);
    };
  }

})();