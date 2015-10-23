(function() {
    'use strict';

    /*global moment:false */
    angular
      .module('scMoment')
      .constant('scMoment', moment)
      .config(localeConfiguration)
      .filter('scDateFormat', scDateFormat)
      .filter('scDateFormatNoTime', scDateFormatNoTime);

    localeConfiguration.$inject = ['scMoment'];

    function localeConfiguration(scMoment) {
      // Moment.js config [optional]
      scMoment.locale('en', {
        calendar : {
          lastDay : '[Yesterday,] LT',
          sameDay : 'LT', //'[Today,] LT',
          nextDay : '[Tomorrow,] LT',
          lastWeek : '[Last] ddd[,] LT',
          nextWeek : 'lll', //'dddd[,] LT',
          sameElse : function () {
            // Same year
            if(this.year() === scMoment().year()) {
              return 'MMM D[,] LT';
            }
            return 'lll';
          }, //'lll'
        }
      });
    }

    scDateFormat.$inject = ['scMoment'];

    function scDateFormat(scMoment) {
      return function(dateString) {
        // return scMoment(dateString).fromNow();
        // return moment(dateString).subtract(10, 'days').calendar(); // 12/16/2014
        // return moment(dateString).subtract(6, 'days').calendar();  // Last Saturday at 4:52 PM
        // return moment(dateString).subtract(3, 'days').calendar();  // Last Tuesday at 4:52 PM
        // return moment(dateString).subtract(1, 'days').calendar();  // Yesterday at 4:52 PM
        // return scMoment(dateString).calendar();   // Today at 4:53 PM
        // return scMoment(dateString).format('ll');
        return scMoment(dateString).calendar();

      };
    }

    function scDateFormatNoTime(scMoment) {
      return function(dateString) {
        return scMoment(dateString).format('MMM D, YYYY');
      };
    }

})();
