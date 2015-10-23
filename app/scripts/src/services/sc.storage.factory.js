(function() {
  'use strict';

  angular
  .module('scStorage',['kbcMobileApp.core'])
  .factory('scStorage', ['store',
    function(store) {
      return store.getNamespacedStore('kbcMobile');
    }
  ]);

})();