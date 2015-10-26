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

    function getUserStat(userId, statId) {
      return $http.get(scUtility.getRestBaseUrl()+'user-stat/'+userId+'/'+statId)
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
      if (params.action === 'update') {
        action = 'update-user-stat';
      }

      return $http.post(scUtility.getRestBaseUrl()+action, params)
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

    function getStatFormElementType(id) {
      if (id < 1 && id > APP_GLOBALS.formElements.length) {
        return false;
      }
      return APP_GLOBALS.formElements[id-1].value;
    }
  }
})();


// (function() {
//   'use strict';

//   angular
//     .module('kbcMobileApp.core')
//     .factory('scStats', scStatsFactory);

//   scStatsFactory.$inject = ['$http', 'APP_GLOBALS', 'scUtility', 'scUser'];

//   /* @ngInject */
//   function scStatsFactory($http, APP_GLOBALS, scUtility, scUser) {
//     var scJobs = {
//       getJobsList: getJobsList,
//     };

//     return scJobs;

//     ////////////////

//     function getJobsList(jobsParams) {

//       var params = {
//         'userId': jobsParams.userId,
//         'noOfDays': jobsParams.noOfDays,
//         'employerId': (jobsParams.employerId) ? jobsParams.employerId : 0,

//         'maxLimit': jobsParams.maxLimit,
//         'skipNoRecords': (jobsParams.skipNoRecords) ? jobsParams.skipNoRecords : 0,

//         'orderByField': (jobsParams.orderByField) ? jobsParams.orderByField : '',
//         'orderByType': (jobsParams.orderByType) ? jobsParams.orderByType : '',

//         'jobStatusCode': (jobsParams.jobStatusCode) ? jobsParams.jobStatusCode : '', // To search/filter by jobStatusCode
//         'searchKeyword': (jobsParams.searchKeyword) ? jobsParams.searchKeyword : '', // To search/filter by JobTitleText
//         'jobId': (jobsParams.jobId) ? jobsParams.jobId : '', // To search/filter by VOC Job Id
//         'empJobId': (jobsParams.empJobId) ? jobsParams.empJobId : '', // To search/filter by Employer’s Job id
//       };

//       var promise = scUtility.getDefaultPromise();
//       var user = scUser.getRootUser();

//       if(user.id) {

//         promise = $http.post(scUtility.getRestBaseUrl() + '/do/jobs-list', params).then(
//           function(response) {
//             return response.data;

//           }, function() {
//             return APP_GLOBALS.httpError;
//           }
//         );

//       }
//       return promise;
//     }

//   }

// })();
