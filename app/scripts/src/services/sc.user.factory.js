(function() {
  'use strict';

  /*jshint strict:false, bitwise:false, validthis: true */

  angular
  .module('kbcMobileApp.core')
  .factory('scUser', userFactory);

  userFactory.$inject = ['scStorage', 'scAuthPermissions', 'APP_GLOBALS', '_', 'scUtility', '$http'];

  function userFactory(scStorage, scAuthPermissions, APP_GLOBALS, _, scUtility, $http) {

    scUser.userRoles = scAuthPermissions.userRoles;
    scUser.accessLevels = scAuthPermissions.accessLevels;

    scUser.RISK_LEVEL_HIGH = 1;
    scUser.RISK_LEVEL_MED = 2;
    scUser.RISK_LEVEL_LOW = 3;
    scUser.RISK_LEVEL_NONE = 4;

    scUser.STATUS_ACTIVE = 1;
    scUser.STATUS_INACTIVE = 2;

    scUser.isRole = isRole;

    scUser.isAdmin = isAdmin;
    scUser.isInstitutionAdmin = isInstitutionAdmin;
    scUser.isAdvisor = isAdvisor;
    scUser.isStudent = isStudent;
    scUser.isAngel = isAngel;
    scUser.isFamily = isFamily;
    scUser.isFriend = isFriend;
    scUser.isFamilyOrFriend = isFamilyOrFriend;
    scUser.isCenterRep = isCenterRep;
    scUser.isBusinessRep = isBusinessRep;

    scUser.setUser = setUser;
    scUser.getRootUser = getRootUser;
    scUser.updateRootUser = updateRootUser;
    scUser.getUserById = getUserById;

    scUser.prototype = {
      isAuthenticated: isAuthenticated,
      isAuthorized: isAuthorized,
      isStatusActive: isStatusActive
    };

    return scUser;

    // Define the constructor function.
    function scUser(id, firstName, lastName, email, token, role, institution, avatar, expectedGraduationDate, title, createdTime, riskLevelId, circles) {

      this.id = id;
      this.firstName = firstName;
      this.lastName = lastName;
      this.email = email;
      this.token = token;
      this.role = (role) ? role : scUser.userRoles.public;
      this.institution = institution;
      this.avatar = avatar;
      this.expectedGraduationDate = expectedGraduationDate;
      this.title = title;
      this.createdTime = createdTime;
      this.riskLevelId = riskLevelId;
      this.circles = circles;
    }

    function isAdmin(user) {
      return scUser.isRole(user, scUser.userRoles.admin);
    }

    function isInstitutionAdmin(user) {
      return scUser.isRole(user, scUser.userRoles.institutionadmin);
    }

    function isAdvisor(user) {
      return scUser.isRole(user, scUser.userRoles.advisor);
    }

    function isStudent(user) {
      return scUser.isRole(user, scUser.userRoles.student);
    }

    function isAngel(user) {
      return scUser.isRole(user, scUser.userRoles.angel);
    }

    function isFamily(user) {
      return scUser.isRole(user, scUser.userRoles.family);
    }

    function isFriend(user) {
      return scUser.isRole(user, scUser.userRoles.friend);
    }

    function isFamilyOrFriend(user) {
      return (scUser.isRole(user, scUser.userRoles.family) || scUser.isRole(user, scUser.userRoles.friend));
    }

    function isCenterRep(user) {
      return scUser.isRole(user, scUser.userRoles.centerrep);
    } // End of isCenterRep

    function isBusinessRep(user) {
      return scUser.isRole(user, scUser.userRoles.businessrep);
    } // End of isBusinessRep

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
          user.institution,
          user.avatar,
          user.expectedGraduationDate,
          user.title, //decodeURIComponent(escape(user.title)).replace(/\+/g,' ')
          user.createdTime,
          user.riskLevelId,
          user.circles
        );

        oUser.auth0SocialConnection = null;
        if(user.auth0SocialConnection) {
          oUser.auth0SocialConnection = user.auth0SocialConnection;
        }
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

      // var self = this;
      // var user;

      // if ($rootScope.user) {
      //   if (!($rootScope.user instanceof scUser)) {
      //     $rootScope.user = scUser.setUser(user);
      //   }
      // } else {
      //   user = scStorage.get('user') || new scUser();
      //   if (!(user instanceof scUser)) {
      //     $rootScope.user = self.setUser(user);
      //   } else {
      //     $rootScope.user = user;
      //   }
      // }
      // user = $rootScope.user;

      return user;
    }

    function updateRootUser() {
      var user = scUser.getRootUser();
      if(user.isAuthenticated()) {
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

      if(userId) {

        var url = scUtility.getRestBaseUrl() + 'user/';

        promise = $http.get(url + userId)
        .then(getUserByIdSuccess)
        .catch(getUserByIdFail);
      }

      return promise;

      function getUserByIdSuccess(response) {
        return response.data.data;
      }

      function getUserByIdFail(error) {
        //console.log('call to rest failed with status:'+ error.status, error);
        return {result: error};
      }

    }

  }

})();