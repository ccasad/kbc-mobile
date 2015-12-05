(function () {
  'use strict';

  angular
    .module('kbcMobileApp.core')
    .factory('scStats', scStatsFactory);

  scStatsFactory.$inject = ['$http', '$q', 'scUtility', 'APP_GLOBALS'];

  /* @ngInject */
  function scStatsFactory($http, $q, scUtility, APP_GLOBALS) {
    var service = {
      getStats: getStats,
      getStat: getStat,
      getUserStats: getUserStats,
      getUserStat: getUserStat,
      getAllUsersStats: getAllUsersStats,
      updateUserStat: updateUserStat,
      deleteUserStat: deleteUserStat,
      getStatFormElementType: getStatFormElementType
    };

    return service;

    function getStats() {
      return $http.get(scUtility.getRestBaseUrl()+'stats')
        .then(success)
        .catch(failed);

      function success(response) {
        return response.data;
      }

      function failed(error) {
        var msg = 'query for stats failed. ' + error.data.description;
        return $q.reject(msg);
      }
    }

    function getStat(statId) {
      return $http.get(scUtility.getRestBaseUrl()+'stat/'+statId)
        .then(success)
        .catch(failed);

      function success(response) {
        return response.data;
      }

      function failed(error) {
        var msg = 'query for stat failed. ' + error.data.description;
        return $q.reject(msg);
      }
    }

    function getUserStats(userId) {
      return $http.get(scUtility.getRestBaseUrl()+'user-stats/'+userId)
        .then(success)
        .catch(failed);

      function success(response) {
        return response.data;
      }

      function failed(error) {
        var msg = 'query for stats failed. ' + error.data.description;
        return $q.reject(msg);
      }
    }

    function getUserStat(userId, userStatId) {
      return $http.get(scUtility.getRestBaseUrl()+'user-stat/'+userId+'/'+userStatId)
        .then(success)
        .catch(failed);

      function success(response) {
        return response.data;
      }

      function failed(error) {
        var msg = 'query for stats failed. ' + error.data.description;
        return $q.reject(msg);
      }
    }

    function getAllUsersStats(params) {
      return $http.post(scUtility.getRestBaseUrl()+'all-users-stats', params)
        .then(success)
        .catch(failed);

      function success(response) {
        return response.data;
      }

      function failed(error) {
        var msg = 'query for all users stats failed. ' + error.data.description;
        return $q.reject(msg);
      }
    }

    function updateUserStat(params) {
      var action = 'add-user-stat';
      if (params.userStatId && params.userStatId.length) {
        action = 'update-user-stat';
      }

      return $http.post(scUtility.getRestBaseUrl()+action, params)
        .then(success)
        .catch(failed);

      function success(response) {
        return response.data;
      }

      function failed() {
        var msg = 'Issue saving user stat.';
        return $q.reject(msg);
      }
    }

    function deleteUserStat(userId, userStatId) {
      //since delete is a reserved keyword for JS, $http.delete fails in IE8, so we need to write delete in the format below
      if (userStatId) {
        return $http({
            method: 'DELETE',
            url: scUtility.getRestBaseUrl() + 'delete-user-stat/' + userStatId + '/' + userId
          })
          .then(success)
          .catch(failed);
      } else {
        failed();
      }

      function success(response) {
        return response.data;
      }

      function failed() {
        var msg = 'Issue deleting user stat.';
        return $q.reject(msg);
      }
    }

    function getStatFormElementType(id) {
      if (id < 1 && id > APP_GLOBALS.formElements.length) {
        return false;
      }
      return APP_GLOBALS.formElements[id-1].value;
    }
  }
})();
