(function(){
  'use strict';

  angular
  	.module('kbcMobileApp.core')
    .factory('scStorage', scStorageFactory);

  scStorageFactory.$inject = ['$window'];

  function scStorageFactory($window) {
    
    return {
      set: set,
      get: get,
      remove: remove
    };

    function set(key, value) {
    	$window.localStorage[key] = JSON.stringify(value);
    }

    function get(key) {
    	return JSON.parse($window.localStorage[key] || '{}');
    }

    function remove(key) {
    	$window.localStorage[key] = null;
    }
  }

})();
