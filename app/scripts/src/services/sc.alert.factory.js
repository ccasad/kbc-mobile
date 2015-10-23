(function(){
  'use strict';

  angular.module('scDoMobileApp.core')
    .factory('scAlert', alertFactory);

  alertFactory.$inject = ['$rootScope', '$cordovaToast'];

  function alertFactory($rootScope, $cordovaToast) {
    var scAlert = {
      showAlert: showAlert,
      error: showError,
      warning: showWarning,
      success: showSuccess,
      info: showInfo,
    };

    return scAlert;

    function showAlert(message, duration, position) {

      if(!message) {
        message = 'There was an error.';
      }
      if(!duration) {
        duration = 'long'; // 'short', 'long'
      }
      if(!position) {
        position = 'center'; // 'top', 'center', 'bottom'
      }

      console.log(message);
      if ($rootScope.deviceInfo && $rootScope.deviceInfo.platform && $rootScope.deviceInfo.platform.length > 0) {
        $cordovaToast.show(message, duration, position);
      }
      
      // $cordovaToast
      //   .show(message, duration, position)
      //   .then(function(success) {
      //     // success
      //   }, function (error) {
      //     // error
      //   });

    }

    function showError(message, data, duration, position) {
      scAlert.showAlert(message, duration, position);
      // $log.error('Error: ' + message, data);
      // $log.debug('debug');
      // scLog.error();
    }

    function showWarning(message, data, duration, position) {
      scAlert.showAlert(message, duration, position);
    }

    function showSuccess(message, data, duration, position) {
      scAlert.showAlert(message, duration, position);
    }

    function showInfo(message, data, duration, position) {
      scAlert.showAlert(message, duration, position);
    }

  }

})();