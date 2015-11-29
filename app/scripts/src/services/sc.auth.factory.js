(function() {
  'use strict';

  angular
    .module('kbcMobileApp.core')
    .factory('scAuth', authFactory);

  authFactory.$inject = ['$http', '$q', 'APP_GLOBALS', '$state', 'scUser', 'scStorage', 'scUtility', '_', 'scAlert'];

  function authFactory($http, $q, APP_GLOBALS, $state, scUser, scStorage, scUtility, _, scAlert) {

    return {
      login: login,
      logout: logout,
      register: register,
      resetPassword: resetPassword
    };

    function login(loginCredentials) {
      var url = scUtility.getRestBaseUrl() + 'login';

      return $http.post(url, loginCredentials)
        .then(success)
        .catch(failed);

      function success(response) {
        if (response.data.status && !response.data.status.success) {
          var msg = 'Incorrect email or password.';
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

      function failed() {
        scAlert.error('There was an issue signing in.');
      }
    }

    function logout() {
      var url = scUtility.getRestBaseUrl() + 'logout';

      return $http.post(url)
        .then(success)
        .catch(failed);

      function success() {
        scStorage.remove('user');
        scUtility.clearCacheHistory();

        $state.go('anon.login');
      }

      function failed() {
        scAlert.error('There was an issue signing out.');
      }
    }

    function register(params) {
      return $http.post(scUtility.getRestBaseUrl()+'register', params)
        .then(success)
        .catch(failed);

      function success(response) {
        return response.data;
      }

      function failed(error) {
        var msg = 'Issue registering. ' + error.data.description;
        return $q.reject(msg);
      }
    }

    function resetPassword(params) {
      return $http.post(scUtility.getRestBaseUrl()+'reset-password', params)
        .then(success)
        .catch(failed);

      function success(response) {
        return response.data;
      }

      function failed(error) {
        var msg = 'Issue resetting password. ' + error.data.description;
        return $q.reject(msg);
      }
    }
  }

})();