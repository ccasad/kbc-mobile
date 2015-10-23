(function() {
    'use strict';

    angular
        .module('kbcMobileApp.core')
        .factory('scUtility', scUtilityFactory);

    scUtilityFactory.$inject = ['APP_ENV_GLOBALS', 'APP_GLOBALS', '$filter', '$ionicHistory', '$q', '$rootScope'];

    /* @ngInject */
    function scUtilityFactory(APP_ENV_GLOBALS, APP_GLOBALS, $filter, $ionicHistory, $q, $rootScope) {
        var scUtility = {
            getMainUrl: getMainUrl,
            getRestBaseUrl: getRestBaseUrl,
            getImageUrl: getImageUrl,
            getSystemAdminId: getSystemAdminId,
            mysqlTimeStampToDate: mysqlTimeStampToDate,
            getAllMonths: getAllMonths,
            // getYearRange: getYearRange, // ToDo: Update to remove 'for' loop
            getCurrentTimeStamp: getCurrentTimeStamp,
            getCurrentMonth: getCurrentMonth,
            getCurrentYear: getCurrentYear,
            formatPhone: formatPhone,
            clearCache: clearCache,
            clearHistory: clearHistory,
            clearCacheHistory: clearCacheHistory,
            getDefaultPromise: getDefaultPromise,
            isAnimationAvailable: isAnimationAvailable,
            isAppOnFocus: isAppOnFocus,
            isNetworkAvailable: isNetworkAvailable,
        };
        return scUtility;

        ////////////////

        function getMainUrl() {
          var url = APP_ENV_GLOBALS.protocol + APP_ENV_GLOBALS.mainSubDomain + APP_ENV_GLOBALS.subDomainDelimiter + APP_ENV_GLOBALS.host; //  + '/'
          return url;
        }

        function getRestBaseUrl() {
          var url = scUtility.getMainUrl() + APP_GLOBALS.restBaseUrl;
          return url;
        }

        function getImageUrl() {
          var url = scUtility.getMainUrl() + APP_GLOBALS.imageUrl;
          return url;
        }

        function getSystemAdminId() {
          return APP_GLOBALS.systemAdminId;
        }

        function mysqlTimeStampToDate(timestamp) {
          if(typeof timestamp === 'string' && timestamp !== null) {
            //function parses mysql datetime string and returns javascript Date object
            //input has to be in this format: 2007-06-05 15:26:02
            var regex=/^([0-9]{2,4})-([0-1][0-9])-([0-3][0-9]) (?:([0-2][0-9]):([0-5][0-9]):([0-5][0-9]))?$/;
            var parts=timestamp.replace(regex,'$1 $2 $3 $4 $5 $6').split(' ');
            return new Date(parts[0],parts[1]-1,parts[2],parts[3],parts[4],parts[5]); //.toISOString();
          }
          return null;
        }

        function getAllMonths() {
          return [
            { fullName: 'January', shortName: 'Jan', val: 1 },
            { fullName: 'February', shortName: 'Feb', val: 2 },
            { fullName: 'March', shortName: 'Mar', val: 3 },
            { fullName: 'April', shortName: 'Apr', val: 4 },
            { fullName: 'May', shortName: 'May', val: 5 },
            { fullName: 'June', shortName: 'Jun', val: 6 },
            { fullName: 'July', shortName: 'Jul', val: 7 },
            { fullName: 'August', shortName: 'Aug', val: 8 },
            { fullName: 'September', shortName: 'Sept', val: 9 },
            { fullName: 'October', shortName: 'Oct', val: 10 },
            { fullName: 'November', shortName: 'Nov', val: 11 },
            { fullName: 'December', shortName: 'Dec', val: 12 }
          ];
        }

        // function getYearRange(identifyCurrentYear, back, forward) {
        //   var utilIdentifyCurrentYear = false;
        //   var utilBack = 0;
        //   var utilForward = 0;

        //   if (typeof identifyCurrentYear != 'undefined' && (identifyCurrentYear)) {
        //     utilIdentifyCurrentYear = true;
        //   }

        //   if (back) {
        //     utilBack = back;
        //   }

        //   if (forward) {
        //     utilForward = forward;
        //   }

        //   var yearRange = [];

        //   var currentYear = parseInt($filter('date')(new Date().getTime(), 'yyyy'));

        //   for(var i = utilBack; i >= 1; i--) {
        //     (utilIdentifyCurrentYear) ? yearRange.push({val: currentYear - i}) : yearRange.push(currentYear - i);
        //   }

        //   (utilIdentifyCurrentYear) ? yearRange.push({val: currentYear, currYear: true}) : yearRange.push(currentYear);

        //   for(var j = 1; j <= utilForward; j++) {
        //     (utilIdentifyCurrentYear) ? yearRange.push({val: currentYear + j}) : yearRange.push(currentYear + j);
        //   }

        //   return yearRange;
        // }

        function getCurrentTimeStamp() {
          return new Date().getTime();
        }

        function getCurrentMonth(format) {
          //https://docs.angularjs.org/api/ng/filter/date
          if (format === 'MMMM' || format === 'MMM' || format === 'MM' || format === 'M') {
            return $filter('date')(new Date().getTime(), format);
          }
          return 'Invalid angular format';
        }

        function getCurrentYear(format) {
          //https://docs.angularjs.org/api/ng/filter/date
          if (format === 'yyyy' || format === 'yy' || format === 'y') {
            return $filter('date')(new Date().getTime(), format);
          }
          return 'Invalid angular format';
        }

        function formatPhone(phoneNo) {

          phoneNo = phoneNo.replace(/[^0-9]/g, '');
          phoneNo = phoneNo.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');

          // var separator = '-';
          // phoneNo = phoneNo.replace(/\s+/g, "");
          // phoneNo = phoneNo.substr(0, 3) + separator + phoneNo.substr(3, 3) + separator + phoneNo.substr(6,4);

          return phoneNo;
        }

        function clearCache() {
          $ionicHistory.clearCache();
        }

        function clearHistory() {
          $ionicHistory.clearHistory();
        }

        function clearCacheHistory() {
          $ionicHistory.clearCache();
          $ionicHistory.clearHistory();
        }

        function getDefaultPromise(msg) {
          var defaultPromise = {};
          defaultPromise.status = {};
          defaultPromise.status.success = false;

          if(msg){
            defaultPromise.status.msg = msg;
          }

          return $q.when(defaultPromise);
        }

        // Use this function only inside ionic Platform ready events
        function isAnimationAvailable() {
          // ionic.Platform.ready(function(){
          //   // will execute when device is ready, or immediately if the device is already ready.
          // }
          var isAnimation = true;
          var deviceInformation = $rootScope.deviceInfo; //$cordovaDevice.getDevice(); //ionic.Platform.device();

          if(deviceInformation.platform && deviceInformation.platform === 'Android') {
            var androidVersion = deviceInformation.version;

            var androidVersionKeys = androidVersion.split('.');
            if(parseInt(androidVersionKeys[0]) === 4){
              if(parseInt(androidVersionKeys[1]) < 1){
                isAnimation = false;
              }
            }else if(parseInt(androidVersionKeys[0]) < 4){
              isAnimation = false;
            }

          }

          return isAnimation;
        }

        function isAppOnFocus() {
          return $rootScope.isAppOnFocus;
        }

        function isNetworkAvailable() {
          return $rootScope.isNetworkAvailable;
        }

    }
})();