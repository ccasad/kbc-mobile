(function() {
  'use strict';

  angular
    .module('kbcMobileApp.core')
    .factory('scReports', reportFactory);

  reportFactory.$inject = ['$http', '$q', 'scUtility'];

  function reportFactory($http, $q, scUtility) {

    return {
      getReports: getReports,
      getReport: getReport,
    };

    function getReports() {
      return $http.get(scUtility.getRestBaseUrl()+'reports')
        .then(success)
        .catch(failed);

      function success(response) {
        return response.data;
      }

      function failed() {
        var msg = 'Issue retrieving reports';
        return $q.reject(msg);
      }
    }

    function getReport(id) {
      return $http.get(scUtility.getRestBaseUrl()+'report/'+id)
        .then(success)
        .catch(failed);

      function success(response) {
        return response.data;
      }

      function failed() {
        var msg = 'Issue retrieving report for id='+id;
        return $q.reject(msg);
      }
    }
  }

})();
