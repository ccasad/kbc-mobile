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
          //scUser.updateRootUser();

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
        if (!response || !response.data || !response.data.status || !response.data.status || !response.data.status.success) {
          scAlert.showAlert('There was an issue registering. Please try again.');
          return;
        } else {
          if (response.data.data) {
            scAlert.showAlert('Your account has been created. You may now sign in!');
            $state.go(APP_GLOBALS.appDefaultRoute);
          }
        }
      }

      function failed() {
        var msg = 'There was an issue registering. Please try again.';
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

      function failed() {
        var msg = 'Issue resetting password.';
        return $q.reject(msg);
      }
    }
  }

})();