(function() {
  'use strict';

  angular
    .module('kbcMobileApp.core')
    .factory('scAuth', authFactory);

  authFactory.$inject = ['$http', 'APP_GLOBALS', '$state', 'scUser', 'scStorage', 'scUtility', 'auth', '_', 'scAlert'];

  function authFactory($http, APP_GLOBALS, $state, scUser, scStorage, scUtility, auth, _, scAlert) {

    return {
      login: login,
      logout: logout
    };

    function login(loginCredentials) {
      var url = scUtility.getRestBaseUrl() + 'login';

      return $http.post(url, loginCredentials)
        .then(loginComplete)
        .catch(loginFailed);

      function loginComplete(response) {
        afterLoginTasks(response);
      }

      function loginFailed() {
        // Catch and handle exceptions from success/error/finally functions
        //console.log('call to rest failed with status:'+ error.status, error);
        scAlert.error('There was an issue signing in. Please try again.');
      }

    }

    function logout() {
      var url = scUtility.getRestBaseUrl() + 'logout';

      return $http.post(url)
        .then(logoutComplete)
        .catch(logoutFailed);

      function logoutComplete() {
        auth.signout();
        cleanup();
        $state.go('anon.login');
      }

      function logoutFailed() {
        scAlert.error('There was an issue signing out.');
      }

    }

    function cleanup() {
      scStorage.remove('user');
      scUtility.clearCacheHistory();
    }

    //utility function to be invoked after successful login to do all the common tasks like setting localStorage and redirection
    function afterLoginTasks(response) {
      if (response.data.status && !response.data.status.success) {
        var msg = 'Incorrect email or password. Please try again';
        if(response.data.status.msg) {
          msg = response.data.status.msg;
        }
        scAlert.showAlert(msg);
        return;
      }
      var user = scUser.setUser(response.data.data);

      if (user && user instanceof scUser && user.id) {
        scStorage.set('user',user);

        // need to clear the cache and history on login, as just clearing it on logout was giving unexpected results
        scUtility.clearCache();

        $state.go(APP_GLOBALS.appDefaultUserRoute);
      }
    }

  }

})();