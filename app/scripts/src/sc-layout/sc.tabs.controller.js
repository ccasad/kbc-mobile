(function() {
  'use strict';

  angular
    .module('scLayout')
    .controller('ScTabsCtrl', ScTabsCtrl);

  ScTabsCtrl.$inject = ['scMessage', 'scUser', 'APP_GLOBALS', '$interval', '$scope', 'scUtility'];

  /* @ngInject */
  function ScTabsCtrl(scMessage, scUser, APP_GLOBALS, $interval, $scope, scUtility) {
    var vm = this;

    vm.user = scUser.getRootUser();
    vm.tabsVars = {
      unreadMessageCount: 0,
    };

    vm.getUnreadMessageCount = getUnreadMessageCount;
    vm.configUnreadMessageCountPolling = configUnreadMessageCountPolling;

    ////////////

    vm.getUnreadMessageCount();
    vm.configUnreadMessageCountPolling();

    function getUnreadMessageCount() {
      if(scUtility.isAppOnFocus()) {
        scMessage.getRootUserUnreadMessageCount().then(
          function(result) {
            vm.tabsVars.unreadMessageCount = result.unreadMessagesCount;
          }
        ).finally(function() {
        });
      }
    } // End of getUnreadMessageCount

    function configUnreadMessageCountPolling(){
      if(APP_GLOBALS.pollingEnabled && !angular.isDefined(unreadMessageCountPolling) && !scUser.isAdmin(vm.user) && !scUser.isInstitutionAdmin(vm.user)) {

        // Start/Set unreadMessageCount polling
        var unreadMessageCountPolling = $interval(vm.getUnreadMessageCount, APP_GLOBALS.pollingInterval); //$interval.cancel(unreadMessageCountPolling);

        // Stop/Unset unreadMessageCount polling
        $scope.$on('$destroy', function(){
          if (angular.isDefined(unreadMessageCountPolling)) {
            $interval.cancel(unreadMessageCountPolling);
            unreadMessageCountPolling = undefined;
          }
        });
      }
    } // End of configUnreadMessageCountPolling

    // function scOnResume() {
    //   console.log('scOnResumeCatch');
    //   // vm.configUnreadMessageCountPolling();
    // }

    // function scOnPause() {
    //   console.log('scOnPauseCatch');
    //   // var unreadMessageCountPolling;
    //   // if (angular.isDefined(unreadMessageCountPolling)) {
    //   //   $interval.cancel(unreadMessageCountPolling);
    //   //   unreadMessageCountPolling = undefined;
    //   // }
    // }

  }

})();
