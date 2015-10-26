(function() {
  'use strict';

  angular
    .module('scAuth', [
      'kbcMobileApp.core',
    ]);

  angular
    .module('scAuth')
    .run(authRunBlock)
    .config(routeConfiguration);

  authRunBlock.$inject = ['$rootScope', 'scUser', '$state'];

  function authRunBlock($rootScope, scUser, $state) {

    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
      var user = scUser.getRootUser();
      //$http.defaults.headers.common.USERTOKEN = user.token;
      if (!user.isAuthorized(toState.data.access)) {
        event.preventDefault();
        if(!user.isAuthenticated()) {
          $state.go('anon.login');
        } else {
          //$state.go(APP_GLOBALS.appDefaultUserRoute); 
          //$state.go(APP_GLOBALS.appDefaultUserRoute, {}, {notify:false});
          $state.go(toState.name, toParams, {notify: false}).then(function() {
            $rootScope.$broadcast('$stateChangeSuccess', toState, toParams, fromState, fromParams);
          });
        }
      }
    });

  }

  routeConfiguration.$inject = ['$stateProvider', 'APP_GLOBALS'];

  function routeConfiguration($stateProvider, APP_GLOBALS) {
    var componentPath = APP_GLOBALS.appModulesPath + 'sc-auth/';

    // Ionic uses AngularUI Router which uses the concept of states
    // Learn more here: https://github.com/angular-ui/ui-router
    // Set up the various states which the app can be in.
    // Each state's controller can be found in componentPath/componentDir
    $stateProvider

      .state('anon.login', {
        url: '/login',
        templateUrl: componentPath+'sc.login.view.html',
        controller: 'ScAuthCtrl as vm',
        // views: { // TODO
        //   'user-login': {
        //     templateUrl: componentPath+'sc.login.view.html',
        //     controller: 'ScAuthCtrl as vm'
        //   }
      });

  }

})();