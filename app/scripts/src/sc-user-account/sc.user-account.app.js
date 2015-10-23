(function() {
  'use strict';

  angular
    .module('scUserAccount', [
      'kbcMobileApp.core',
    ]);

  angular
    .module('scUserAccount')
    .config(routeConfiguration);

  routeConfiguration.$inject = ['$stateProvider', 'APP_GLOBALS'];

  function routeConfiguration($stateProvider, APP_GLOBALS) {
    var componentPath = APP_GLOBALS.appModulesPath + 'sc-user-account/';

    $stateProvider
      .state('user.account', {
        //cache: false, // Or set via <ion-view cache-view="false" view-title="My Title!">
        url: '/account',
        views: {
          'user-account': {
            templateUrl: componentPath+'sc.user-account.view.html',
            controller: 'ScUserAccountCtrl as vm'
          }
        }
      });
  }

})();