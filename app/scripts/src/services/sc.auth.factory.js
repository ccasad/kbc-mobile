(function() {
  'use strict';

  angular
    .module('kbcMobileApp.core')
    .factory('scAuth', authFactory);

  authFactory.$inject = ['$http', 'APP_GLOBALS', '$state', 'scUser', 'scStorage', 'scUtility', 'auth', '_', 'scAlert'];

  function authFactory($http, APP_GLOBALS, $state, scUser, scStorage, scUtility, auth, _, scAlert) {

    return {
      login: login,
      logout: logout,
      loginByAuth0UserId: loginByAuth0UserId,
      getSocialAccounts: getSocialAccounts
    };

    function login(loginCredentials) {
      var url = scUtility.getRestBaseUrl() + 'login';

      return $http.post(url, loginCredentials)
        .then(loginComplete)
        .catch(loginFailed);


      function loginComplete(response) {
        afterLoginTasks(response);

        //return response.data.data;
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

    function loginByAuth0UserId(params) {
      var url = scUtility.getRestBaseUrl() + 'user-login';

      return $http.post(url, params)
        .then(loginByAuth0UserIdSuccess)
        .catch(loginByAuth0UserIdFail);

      function loginByAuth0UserIdSuccess(response) {
        afterLoginTasks(response);
      }

      function loginByAuth0UserIdFail() {
        //console.log('Failed to login using auth0 ID');
        scAlert.error('There was an issue signing in. Please try again.');
      }

    }

    function getSocialAccounts() {
      return [
        {id: 'facebook', title: 'Facebook', classTitle: 'facebook', ionicButtonClass: 'positive'},
        {id: 'google-oauth2', title: 'Google', classTitle: 'googleplus', ionicButtonClass: 'assertive'},
        {id: 'linkedin', title: 'LinkedIn', classTitle: 'linkedin', ionicButtonClass: 'dark'},
        {id: 'twitter', title: 'Twitter', classTitle: 'twitter', ionicButtonClass: 'calm'},
      ];
    }

    function cleanup() {
      //ToDo: this needs to be uncommented. commenting out now since Jshint gives a warning saying scInstitution is not defined
      //if (_.isObject($rootScope.institution)) {
        //angular.extend($rootScope.institution, new scInstitution());
      //}

      // $rootScope.user = new scUser();
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

      // Check if user isCenterRep or isBusinessRep, if not give error msg and return
      if(!scUser.isCenterRep(user) && !scUser.isBusinessRep(user)) {
        var errorMsg = 'Incorrect email or password. Please try again!';
        scAlert.showAlert(errorMsg);
        return;
      }

      if (user && user instanceof scUser && user.id) {
        scStorage.set('user',user);
        // $rootScope.user = user;

        // need to clear the cache and history on login, as just clearing it on logout was giving unexpected results
        scUtility.clearCache();

        $state.go(APP_GLOBALS.appDefaultUserRoute);
      }
    }

  }

})();