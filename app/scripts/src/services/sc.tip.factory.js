(function() {
  'use strict';

  angular
    .module('scDoMobileApp.core')
    .factory('scTip', scTipFactory);

  scTipFactory.$inject = ['APP_GLOBALS', 'scUtility', '$http', '$filter', '_'];

  function scTipFactory(APP_GLOBALS, scUtility, $http, $filter, _) {

    scTip.MAX_NUMBER_DISPLAY_DEFAULT = 5;

    scTip.getTips = getTips;

    // Return constructor - this is what defines the actual injectable in the DI framework.
    return scTip;

    ////////////////

    // constructor
    function scTip() {

    }

    function getTips(filterParams) {

      var params = {
        tipTypeId: filterParams.tipTypeId,
      };

      // $http returns a promise, which has a then function, which also returns a promise
      var promise =
        $http.post(scUtility.getRestBaseUrl() + 'tips', params).then(
          function (response) { // success handler
            var tipsOut = [];

            if(!_.isObject(response.data.status) || response.data.status.success !== true) {
              console.log('There was an issue retrieving tips. Please try again.'); // ToDo : create ionic alert
              // scAlert.error('There was an issue retrieving messages. Please try again.');
            }

            var tipCount = null;
            if(_.isObject(response.data.data)) {
              tipCount = 0; //response.data.data.tipsCount;
              tipsOut = response.data.data; //response.data.data.tips; //var data = response.data, status = response.status, header = response.header, config = response.config;

              _.each(tipsOut, function(tip) {
                tip.imageSrc = scUtility.getImageUrl() + 'tip_of_the_day/' + tip.imageSrc;
              });

              //sort the messages by date/time
              tipsOut.sort(function(a,b){
                return b.articleDate - a.articleDate ;
              });

              tipsOut = _.compact(tipsOut); // remove empty array values + come back in future to identify from where they are coming.
            }
            return {result:response, tips:tipsOut, tipCount:tipCount};

          }, function (response) { // error handler
            console.log('There was an issue retrieving tips. Please try again.'); // ToDo : create ionic alert
            // scAlert.error('There was an issue retrieving messages. Please try again.');
            return {result:response, tips:[], tipCount:null}; // return empty messageStream
          }
        );

      // Return the promise to the controller
      return promise;

    } // End of getTips
  }

})();













































