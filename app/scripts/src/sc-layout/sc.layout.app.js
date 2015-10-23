(function() {
  'use strict';

  angular
    .module('scLayout', [
      'kbcMobileApp.core',
    ]);

  angular
    .module('scLayout')
    .config(constantConfiguration);

  constantConfiguration.$inject = ['APP_GLOBALS'];

  function constantConfiguration(APP_GLOBALS) {
    angular
      .extend(APP_GLOBALS, {
        appLayoutModuleDir: 'sc-layout/',
      });
  }

})();

