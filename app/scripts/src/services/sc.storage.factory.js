(function() {
  'use strict';

  angular
  .module('scStorage',['scDoMobileApp.core'])
  .factory('scStorage', ['store',
    function(store) {
      return store.getNamespacedStore('scDoMobile');
    }
  ]);

})();