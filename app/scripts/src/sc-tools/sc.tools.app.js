(function() {
  'use strict';

  angular
    .module('scTools', [
      'kbcMobileApp.core',
    ]);

  angular
    .module('scTools')
    .config(routeConfiguration);

  routeConfiguration.$inject = ['$stateProvider', 'APP_GLOBALS'];

  function routeConfiguration($stateProvider, APP_GLOBALS) {
    var componentPath = APP_GLOBALS.appModulesPath + 'sc-tools/';

    $stateProvider
      .state('user.tools', {
        cache: false, // Or set via <ion-view cache-view="false" view-title="My Title!">
        url: '/tools',
        views: {
          'tools': {
            templateUrl: componentPath+'sc.tools.view.html',
            controller: 'ScToolsCtrl as vm'
          }
        }
      })
      .state('user.tools-stat-list', {
        cache: false, // Or set via <ion-view cache-view="false" view-title="My Title!">
        url: '/tools-stat-list/:statId',
        views: {
          'tools': {
            templateUrl: componentPath+'sc.tools-stat-list.view.html',
            controller: 'ScToolsStatCtrl as vm'
          }
        }
      })
      .state('user.tools-stat-add', {
        //cache: false, // Or set via <ion-view cache-view="false" view-title="My Title!">
        url: '/tools-stat-add',
        views: {
          'tools': {
            templateUrl: componentPath+'sc.tools-stat-edit.view.html',
            controller: 'ScToolsStatCtrl as vm'
          }
        }
      })
      .state('user.tools-stat-edit', {
        cache: false, // Or set via <ion-view cache-view="false" view-title="My Title!">
        url: '/tools-stat-edit/:statId',
        views: {
          'tools': {
            templateUrl: componentPath+'sc.tools-stat-edit.view.html',
            controller: 'ScToolsStatCtrl as vm'
          }
        }
      })
      .state('user.tools-report-detail', {
        cache: false, // Or set via <ion-view cache-view="false" view-title="My Title!">
        url: '/tools-report-detail/:reportId',
        views: {
          'tools': {
            templateUrl: componentPath+'sc.tools-report-detail.view.html',
            controller: 'ScToolsReportCtrl as vm'
          }
        }
      })
      .state('user.tools-report-list', {
        cache: false, // Or set via <ion-view cache-view="false" view-title="My Title!">
        url: '/tools-report-list/:reportId',
        views: {
          'tools': {
            templateUrl: componentPath+'sc.tools-report-list.view.html',
            controller: 'ScToolsReportCtrl as vm'
          }
        }
      });

  }

})();