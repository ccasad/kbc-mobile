(function() {
  'use strict';

  angular
    .module('kbcMobileApp.core')
    .factory('scStats', scStatsFactory);

  scStatsFactory.$inject = ['$http', 'APP_GLOBALS', 'scUtility', 'scUser'];

  /* @ngInject */
  function scStatsFactory($http, APP_GLOBALS, scUtility, scUser) {
    var scJobs = {
      getJobsList: getJobsList,
    };

    return scJobs;

    ////////////////

    function getJobsList(jobsParams) {

      var params = {
        'userId': jobsParams.userId,
        'noOfDays': jobsParams.noOfDays,
        'employerId': (jobsParams.employerId) ? jobsParams.employerId : 0,

        'maxLimit': jobsParams.maxLimit,
        'skipNoRecords': (jobsParams.skipNoRecords) ? jobsParams.skipNoRecords : 0,

        'orderByField': (jobsParams.orderByField) ? jobsParams.orderByField : '',
        'orderByType': (jobsParams.orderByType) ? jobsParams.orderByType : '',

        'jobStatusCode': (jobsParams.jobStatusCode) ? jobsParams.jobStatusCode : '', // To search/filter by jobStatusCode
        'searchKeyword': (jobsParams.searchKeyword) ? jobsParams.searchKeyword : '', // To search/filter by JobTitleText
        'jobId': (jobsParams.jobId) ? jobsParams.jobId : '', // To search/filter by VOC Job Id
        'empJobId': (jobsParams.empJobId) ? jobsParams.empJobId : '', // To search/filter by Employer’s Job id
      };

      var promise = scUtility.getDefaultPromise();
      var user = scUser.getRootUser();

      if(user.id) {

        promise = $http.post(scUtility.getRestBaseUrl() + '/do/jobs-list', params).then(
          function(response) {
            return response.data;

          }, function() {
            return APP_GLOBALS.httpError;
          }
        );

      }
      return promise;
    }

  }

})();
