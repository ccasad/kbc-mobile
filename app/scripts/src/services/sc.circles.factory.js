(function() {
  'use strict';

  angular
    .module('kbcMobileApp.core')
    .factory('scCircles', scCirclesFactory);

  scCirclesFactory.$inject = ['$http', 'scUtility', 'scAlert', '_'];

  function scCirclesFactory($http, scUtility, scAlert, _) {
    var scCircles = {
      // getCirclesList: getCirclesList,
      getCirclesByCategory: getCirclesByCategory,
      getCircleById: getCircleById,
    };

    return scCircles;

    // function getCirclesList() {
    //   var promise = scUtility.getDefaultPromise();
    //   return promise;

    // } // end of getCirclesList


    function getCirclesByCategory(cirCatId, additionalParams) {
        var promise = scUtility.getDefaultPromise();

        // Check for all required params
        if(!cirCatId) {
          scAlert.error('Missing Circle Category Id.');
          return promise;
        }

        var params = {
          cirCatId: cirCatId,
          getCircleMsgCount: false,
          getCircleMemberCount: false
        };

        if(additionalParams) {
          params.getCircleMsgCount = additionalParams.getCircleMsgCount !== null ? additionalParams.getCircleMsgCount : false;
          params.getCircleMemberCount = additionalParams.getCircleMemberCount !== null ? additionalParams.getCircleMemberCount : false;
        }

        // #http call (if all params are available)
        promise = $http.post(scUtility.getRestBaseUrl() + 'get-circles-by-category', params).then(
          function(response) {
            if(!_.isObject(response.data.status) || response.data.status.success !== true) {
              scAlert.error(response.data.status.msg);
            }
            return {result:response, circles:response.data.data};
          }, function(response) {
            scAlert.error('There was an issue retrieving Circles. Please try again.');
            return {result:response, circles:[]}; // return empty
          }
        );
        return promise;

      } // end of getCirclesByCategory


      function getCircleById(circleId) {

        var promise = scUtility.getDefaultPromise();

        if(!circleId) {
          scAlert.error('Missing Circle Id.');
          return promise;
        }

        promise = $http.get(scUtility.getRestBaseUrl() + 'get-circle-by-id/' + circleId).then(
          function(response) {
            if(!_.isObject(response.data.status) || response.data.status.success !== true) {
              scAlert.error(response.data.status.msg);
            }
            return {result:response, circle:response.data.data};
          }, function(response) {
            scAlert.error('There was an issue retrieving Circle. Please try again.');
            return {result:response, circle:{}}; // return empty
          }
        );

        return promise;
      } // end of getCircleById

  }

})();