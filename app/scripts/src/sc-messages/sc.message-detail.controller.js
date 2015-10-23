(function() {
  'use strict';

  angular
    .module('scMessages')
    .controller('ScMessageDetailCtrl', ScMessageDetailCtrl);

  ScMessageDetailCtrl.$inject = ['$stateParams', '$state', 'scMessage', '$ionicLoading', 'scUser', '$ionicHistory'];

  /* @ngInject */
  function ScMessageDetailCtrl($stateParams, $state, scMessage, $ionicLoading, scUser, $ionicHistory) {
    var vm = this;

    vm.user = scUser.getRootUser();

    vm.messageVars = {
      title: $state.current.data.tabTitle,
      messageParams: {
        messageId: $stateParams.messageId,
        commentDefaultDisplayLimit: scMessage.MAX_NUMBER_DISPLAY_DEFAULT_COMMENTS,
      },
      loadMessagesInProcess: true,
    };

    vm.message = [];

    vm.getMessage = getMessage;
    vm.composeMessage = composeMessage;
    vm.onSwipeRight = onSwipeRight;

    ////////////
    vm.getMessage();

    function getMessage() {
      vm.messageVars.loadMessagesInProcess = true;
      $ionicLoading.show();

      scMessage.getMessage(vm.messageVars.messageParams).then(
        function(result) {
          vm.message = result.message;
        }
      ).finally(function() {
        vm.messageVars.loadMessagesInProcess = false;
        $ionicLoading.hide();
     });
    } // End of getMessage

    function composeMessage(){
      $state.go('user.compose-message');
    } // End of composeMessage

    function onSwipeRight(){
      $ionicHistory.goBack();
    } // End of onSwipeRight

  }

  /*
  // es6 controller example : Do not remove this code.
  class ScMessageDetailCtrl {
      constructor(APP_GLOBALS, $stateParams, $state, scMessage, $ionicLoading) {
        this.scMessage = scMessage;
        this.$ionicLoading = $ionicLoading;

        this.messageVars = {
          title: $state.current.data.tabTitle,
          messageParams: {
            messageId: $stateParams.messageId,
            commentDefaultDisplayLimit: scMessage.MAX_NUMBER_DISPLAY_DEFAULT_COMMENTS,
          },
          loadMessagesInProcess: true,
        };

        this.message = [];

        this.APP_GLOBALS = APP_GLOBALS;

        // this.getMessage = getMessage;

        ////////////
        this.getMessage();

      } // End of constructor

      getMessage() {
        this.messageVars.loadMessagesInProcess = true;
        this.$ionicLoading.show();

        this.scMessage.getMessage(this.messageVars.messageParams)
          .then((result) => {
            this.message = result.message
          })
          .finally(() => {
            this.messageVars.loadMessagesInProcess = false;
            this.$ionicLoading.hide();
          });
      } // End of getMessage
  }
  ScMessageDetailCtrl.$inject = ['APP_GLOBALS', '$stateParams', '$state', 'scMessage', '$ionicLoading'];

  angular
    .module('scMessages')
    .controller('ScMessageDetailCtrl', ScMessageDetailCtrl);
  */

})();
