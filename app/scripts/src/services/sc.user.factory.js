(function() {
  'use strict';

  /*jshint strict:false, bitwise:false, validthis: true */

  angular
  .module('kbcMobileApp.core')
  .factory('scUser', userFactory);

  userFactory.$inject = ['scStorage', 'scAuthPermissions', 'scAlert', 'APP_GLOBALS', '_', 'scUtility', '$http'];

  function userFactory(scStorage, scAuthPermissions, scAlert, APP_GLOBALS, _, scUtility, $http) {

    scUser.userRoles = scAuthPermissions.userRoles;
    scUser.accessLevels = scAuthPermissions.accessLevels;

    scUser.STATUS_ACTIVE = 1;
    scUser.STATUS_INACTIVE = 2;

    scUser.isRole = isRole;
    scUser.isAdmin = isAdmin;

    scUser.setUser = setUser;
    scUser.getRootUser = getRootUser;
    scUser.updateRootUser = updateRootUser;
    scUser.getUserById = getUserById;
    scUser.updateAccount = updateAccount;

    scUser.prototype = {
      isAuthenticated: isAuthenticated,
      isAuthorized: isAuthorized,
      isStatusActive: isStatusActive
    };

    return scUser;

    // Define the constructor function.
    function scUser(id, firstName, lastName, email, token, role, createdTime) {
      this.id = id;
      this.firstName = firstName;
      this.lastName = lastName;
      this.email = email;
      this.token = token;
      this.role = (role) ? role : scUser.userRoles.public;
      this.createdTime = createdTime;
    }

    function isAdmin(user) {
      return scUser.isRole(user, scUser.userRoles.admin);
    }

    function isRole(user, role) {
      var valid = false;
      var oUser;

      if (user === undefined) {
        oUser = scUser.getRootUser();
      } else {
        oUser = user;
      }

      if (oUser && oUser.id && oUser.role) {
        valid = oUser.role.title === role.title;
      }

      return valid;
    }

    function setUser(user) {
      var oUser;

      if (user) {
        oUser =  new scUser(
          user.id,
          user.firstName,
          user.lastName,
          user.email,
          user.token,
          user.role,
          user.createdTime
        );
      }

      return oUser;
    }

    function getRootUser() {
      var self = this;
      var user;

      user = scStorage.get('user') || new scUser();
      if (!(user instanceof scUser)) {
        user = self.setUser(user);
      }

      return user;
    }

    function updateRootUser() {
      var user = scUser.getRootUser();
      if (user.isAuthenticated()) {
        scUser.getUserById(user.id).then(function(result) {
          user = scUser.setUser(result);
          if (user && user instanceof scUser && user.id) {
            scStorage.set('user',user);
            // $rootScope.user = user;
          }
        });
      }

      scUtility.clearCache();
    }

    function isAuthenticated() {
      var self = this;
      var valid = false;
      var accessLevels = APP_GLOBALS.accessLevels;

      if (self.id && self.role) {
        valid = _.contains(accessLevels.user, self.role.title);
      }

      return valid;
    }

    function isAuthorized(accessLevel, role) {
      var self = this;

      var val;
      if (role === undefined) {
        role = self.role;
      }

      if(_.isArray(accessLevel)){
        var chk = _.filter(accessLevel, function(accessLevel){ return accessLevel.bitMask & role.bitMask; });
        val = _.size(chk) > 0 ? true: false;
      } else {
        val = accessLevel.bitMask & role.bitMask;
      }
      return val;
    }

    function isStatusActive() {
      var self = this;
      var active = false;

      if (self.id && self.institution) {
        active = self.institution[0].statusId === scUser.STATUS_ACTIVE;
      }
      return active;
    }

    function getUserById(userId) {

      var promise = scUtility.getDefaultPromise();

      if (userId) {
        var url = scUtility.getRestBaseUrl() + 'user/';

        promise = $http.get(url + userId)
        .then(success)
        .catch(failed);
      }

      return promise;

      function success(response) {
        return response.data.data;
      }
      function failed(error) {
        return {result: error};
      }
    }

    function updateAccount(params) {

      var user = scUser.getRootUser();

      params.userId = user.id;

      if (user.id) {
        return $http.post(scUtility.getRestBaseUrl() + 'update-account', params)
          .then(complete)
          .catch(failed);
      } else {
        failed();
        return scUtility.getDefaultPromise();
      }
      
      function complete(response) {
        return response.data;
      }

      function failed() {
        scAlert.error('There was an issue saving your account information.');
      }
    }
  }

})();