(function() {
  'use strict';

  angular
    .module('scDoMobileApp')
    .config(routeConfiguration);

  routeConfiguration.$inject = ['$stateProvider', '$urlRouterProvider', 'scAuthPermissionsProvider', 'APP_GLOBALS'];

  function routeConfiguration($stateProvider, $urlRouterProvider, scAuthPermissionsProvider, APP_GLOBALS) {
    var componentPath = 'scripts/src/';

    scAuthPermissionsProvider.setRolesAndAccessLevels();
    var access = scAuthPermissionsProvider.accessLevels;

    // Ionic uses AngularUI Router which uses the concept of states
    // Learn more here: https://github.com/angular-ui/ui-router
    // Set up the various states which the app can be in.
    // Each state's controller can be found in componentPath/componentDir
    $stateProvider

      // setup an abstract state for the anon(Non Logged In) user
      .state('anon', {
        abstract: true,
        template: '<ion-nav-view></ion-nav-view>',
        data: {
          access: access.anon
        }
      })

      // setup an abstract state for the user
      .state('user', {
        // url: '/user',
        abstract: true,
        // template: '<div ui-view></div>',
        templateUrl: componentPath+'sc-layout/sc.tabs.view.html',
        data: {
          access: access.user,
          // requiresLogin: true
        }
      });

    // this method prevents angularjs from going into infinite loop on $stateChangeStart
    // http://stackoverflow.com/questions/25065699/why-does-angularjs-with-ui-router-keep-firing-the-statechangestart-event
    $urlRouterProvider.otherwise( function($injector) {
      var $state = $injector.get('$state');
      $state.go(APP_GLOBALS.appDefaultRoute);
    });

  }

})();