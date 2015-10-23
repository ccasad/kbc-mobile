(function() {
  'use strict';

  angular
    .module('scCircles', [
      'scDoMobileApp.core',
    ]);

  angular
    .module('scCircles')
    .config(constantConfiguration)
    .config(routeConfiguration);

  constantConfiguration.$inject = ['APP_GLOBALS'];

  function constantConfiguration(APP_GLOBALS) {
    angular
      .extend(APP_GLOBALS, {
        appCirclesModuleDir: 'sc-circles/',
      });
  } // End of constantConfiguration

  routeConfiguration.$inject = ['$stateProvider', 'APP_GLOBALS'];

  function routeConfiguration($stateProvider, APP_GLOBALS) {
    var componentPath = APP_GLOBALS.appModulesPath + APP_GLOBALS.appCirclesModuleDir;

    // Set up the various states which the app can be in.
    // Each state's controller can be found in componentPath/componentDir
    $stateProvider
      .state('user.circles', {
        // cache: false, // Or set via <ion-view cache-view="false" view-title="My Title!">
        url: '/circles',
        views: {
          'user-circles': {
            templateUrl: componentPath+'sc.circles.view.html',
            controller: 'ScCirclesCtrl as vm'
          }
        },
        data: {
          tabTitle: 'Circles',
          // circleTemplate: componentPath+'sc.circle.view.html',
        }
      });

      // .state('user.circle', {
      //   cache: false,
      //   url: '/circle/:circleId', //url: '/{id:[0-9]{1,8}}', // we can also add some constraint, like int id only
      //   views: {
      //     'user-circles': {
      //       templateUrl: componentPath+'sc.circle.view.html',
      //       controller: 'ScCircleCtrl as vm'
      //     }
      //   },
      //   data: {
      //     tabTitle: 'Circle',
      //   },
      //   resolve: {
      //     circleDetail: ['scCircles', '$stateParams', function(scCircles, $stateParams){
      //        return scCircles.getCircleById($stateParams.circleId);
      //    }],
      //   },
      // });

  } // End of routeConfiguration

})();

