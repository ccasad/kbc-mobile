(function() {
  'use strict';

  angular
    .module('scStats', [
      'kbcMobileApp.core',
    ]);

  angular
    .module('scStats')
    .config(constantConfiguration)
    .config(routeConfiguration);

  constantConfiguration.$inject = ['APP_GLOBALS'];

  function constantConfiguration(APP_GLOBALS) {
    angular
      .extend(APP_GLOBALS, {
        appStatsModuleDir: 'sc-stats/',
      });
  }

  routeConfiguration.$inject = ['$stateProvider', 'APP_GLOBALS'];

  function routeConfiguration($stateProvider, APP_GLOBALS) {
    var componentPath = APP_GLOBALS.appModulesPath + APP_GLOBALS.appStatsModuleDir;

    $stateProvider
      .state('user.stats-list', {
        cache: false, // Or set via <ion-view cache-view="false" view-title="My Title!">
        url: '/stats',
        views: {
          'user-stats': {
            templateUrl: componentPath+'sc.stats.view.html',
            controller: 'ScStatsCtrl as vm'
          }
        }
      })
      .state('user.stats-add', {
        //cache: false, // Or set via <ion-view cache-view="false" view-title="My Title!">
        url: '/stats-add',
        views: {
          'user-stats-add': {
            templateUrl: componentPath+'sc.stats-edit.view.html',
            controller: 'ScStatsEditCtrl as vm'
          }
        }
      })
      .state('user.stats-edit', {
        cache: false, // Or set via <ion-view cache-view="false" view-title="My Title!">
        url: '/stats-edit/:userStatId',
        views: {
          'user-stats': {
            templateUrl: componentPath+'sc.stats-edit.view.html',
            controller: 'ScStatsEditCtrl as vm'
          }
        }
      });
  }

})();
