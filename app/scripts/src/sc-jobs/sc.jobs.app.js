(function() {
  'use strict';

  angular
    .module('scJobs', [
      'scDoMobileApp.core',
    ]);

  angular
    .module('scJobs')
    .config(constantConfiguration)
    .config(routeConfiguration);

  constantConfiguration.$inject = ['APP_GLOBALS'];

  function constantConfiguration(APP_GLOBALS) {
    angular
      .extend(APP_GLOBALS, {
        appJobsModuleDir: 'sc-jobs/',
      });
  }

  routeConfiguration.$inject = ['$stateProvider', 'APP_GLOBALS'];

  function routeConfiguration($stateProvider, APP_GLOBALS) {
    var componentPath = APP_GLOBALS.appModulesPath + APP_GLOBALS.appJobsModuleDir;

    $stateProvider
      .state('user.jobs', {
        //cache: false, // Or set via <ion-view cache-view="false" view-title="My Title!">
        url: '/jobs',
        views: {
          'user-jobs': {
            templateUrl: componentPath+'sc.jobs.view.html',
            controller: 'ScJobsCtrl as vm'
          }
        }
      });
  }

})();