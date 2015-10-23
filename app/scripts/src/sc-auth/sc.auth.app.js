(function() {
  'use strict';

  angular
    .module('scAuth', [
      'scDoMobileApp.core',
    ]);

  angular
    .module('scAuth')
    .run(authRunBlock)
    .run(auth0RunBlock)
    .config(authConfiguration)
    .config(routeConfiguration);

  authRunBlock.$inject = ['$rootScope', 'scUser', '$state', 'APP_GLOBALS'];

  function authRunBlock($rootScope, scUser, $state, APP_GLOBALS) {

    $rootScope.$on('$stateChangeStart', function(event, toState) {
      var user = scUser.getRootUser();
      //$http.defaults.headers.common.USERTOKEN = user.token;
      if (!user.isAuthorized(toState.data.access)) {
        event.preventDefault();
        if(!user.isAuthenticated()) {
          $state.go('anon.login');
        } else {
          $state.go(APP_GLOBALS.appDefaultUserRoute);
        }
      }
    });

  }

  auth0RunBlock.$inject = ['auth', '$rootScope', 'store', 'jwtHelper'];

  function auth0RunBlock(auth, $rootScope, store, jwtHelper) {

    // Hook auth0-angular to all the events it needs to listen to
    auth.hookEvents();

    // ToDo: we don't need this since we are not using auth0 tokens as a user authorization
    // This events gets triggered on refresh or URL change
    $rootScope.$on('$locationChangeStart', function() {
      if (!auth.isAuthenticated) {
        var token = store.get('token');
        if (token) {
          if (!jwtHelper.isTokenExpired(token)) {
            auth.authenticate(store.get('profile'), token);
          } else {
            // Either show Login page or use the refresh token to get a new idToken
            // $location.path('/');
            console.log('redirect to login');
          }
        }
      }
    });

    // $rootScope.$on('$locationChangeStart', function() {
    //   if (!auth.isAuthenticated) {
    //     var token = store.get('token');
    //     var refreshToken = store.get('refreshToken');
    //     if (token) {
    //       if (!jwtHelper.isTokenExpired(token)) {
    //         auth.authenticate(store.get('profile'), token);
    //       } else {
    //         auth.refreshIdToken(refreshToken).then(function(idToken) {
    //           store.set('token', idToken);
    //           auth.authenticate(store.get('profile'), idToken);
    //           return idToken;
    //         });
    //       }
    //     }
    //   }
    // });

  }

  authConfiguration.$inject = ['authProvider', '$httpProvider', 'APP_GLOBALS', 'jwtInterceptorProvider'];

  function authConfiguration(authProvider, $httpProvider, APP_GLOBALS, jwtInterceptorProvider) {

    authProvider.init({
      domain: APP_GLOBALS.auth0Domain,
      clientID: APP_GLOBALS.auth0ClientId,
      callbackURL: location.href,
      loginState: 'anon.login'
    });

    // ToDo: we don't need this since we are not using auth0 tokens as a user authorization
    // As JWTs expire, we'll use the refreshToken to get a new JWT if the one we have is expired.
    jwtInterceptorProvider.tokenGetter =  ['store', 'jwtHelper', 'auth', function (store, jwtHelper, auth) {
      var idToken = store.get('token');
      var refreshToken = store.get('refreshToken');
      // If no token return null
      if (!idToken || !refreshToken) {
        return null;
      }
      // If token is expired, get a new one
      if (jwtHelper.isTokenExpired(idToken)) {
        return auth.refreshIdToken(refreshToken).then(function(idToken) {
          store.set('token', idToken);
          return idToken;
        });
      } else {
        return idToken;
      }
    }];

    // As we're going to call an API we did,
    // we need to make sure we send the JWT token we receive on the login on every request.
    // For that, we need to do the add the jwtInterceptor to the list of $http interceptors.
    $httpProvider.interceptors.push('jwtInterceptor');

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