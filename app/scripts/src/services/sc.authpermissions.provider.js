(function() {
  'use strict';

  /*jshint strict:false, bitwise:false */

  angular
    .module('scDoMobileApp.core')
    .provider('scAuthPermissions', scAuthPermissions);

  scAuthPermissions.$inject = ['APP_GLOBALS'];

  function scAuthPermissions(APP_GLOBALS) {
    /*jshint validthis: true */

    this.userRoles = [];
    this.accessLevels = [];

    this.$get = function() {
      var self = this;
      return {
        userRoles: self.userRoles,
        accessLevels: self.accessLevels
      };
    };

    this.setRolesAndAccessLevels = function() {
      this.setUserRoles();
      this.setAccessLevels();
    };

    this.setUserRoles = function() {
      var bitMask = '01';
      var userRoles = {};
      var roles = APP_GLOBALS.roles;
      /*jshint forin: false */
      for (var role in roles) {
        var intCode = parseInt(bitMask, 2);
        userRoles[roles[role]] = {
          bitMask: intCode,
          title: roles[role]
        };
        bitMask = (intCode << 1 ).toString(2);
      }

      this.userRoles = userRoles;
    };

    this.setAccessLevels = function() {

      var accessLevelDeclarations = APP_GLOBALS.accessLevels;
      var userRoles = this.userRoles;
      var accessLevels = {};
      /*jshint forin: false */
      for (var level in accessLevelDeclarations) {

        if (typeof accessLevelDeclarations[level] === 'string') {
          if (accessLevelDeclarations[level] === '*') {
            var resultBitMask = '';
            /*jshint unused:false*/
            for (var r in userRoles) {
              resultBitMask += '1';
            }
            accessLevels[level] = {
              bitMask: parseInt(resultBitMask, 2)
            };
          } else {
            console.log('Access Control Error: Could not parse ' + accessLevelDeclarations[level] + ' as access definition for level ' + level);
          }
        } else {
          var resultBitMask1 = 0;
          for (var role in accessLevelDeclarations[level]) {
            if (userRoles.hasOwnProperty(accessLevelDeclarations[level][role])) {
              resultBitMask1 = resultBitMask1 | userRoles[accessLevelDeclarations[level][role]].bitMask;
            } else {
              console.log('Access Control Error: Could not find role ' + accessLevelDeclarations[level][role] + ' in registered roles while building access for ' + level);
            }
          }
          accessLevels[level] = {
            bitMask: resultBitMask1
          };
        }
      }

      this.accessLevels = accessLevels;
    };

  }

})();