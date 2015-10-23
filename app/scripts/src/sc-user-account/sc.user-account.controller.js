(function(){
  'use strict';

  angular
    .module('scUserAccount')
    .controller('ScUserAccountCtrl', ScUserAccountCtrl);

  ScUserAccountCtrl.$inject = ['scUser', 'scAuth', '$ionicActionSheet'];

  function ScUserAccountCtrl(scUser, scAuth, $ionicActionSheet) {
    var vm = this;

    vm.vars = {};
    vm.vars.user = scUser.getRootUser();

    vm.signOut = signOut;

    function signOut() {
      $ionicActionSheet.show({
        titleText: 'Are you sure you want to sign out?',
        destructiveText: '<i class="icon ion-log-out"></i> Sign Out',
        destructiveButtonClicked: function() {
          scAuth.logout();
        },
        cancelText: 'Cancel',
        cancel: function() {
          // add cancel code..
        },
        cssClass: 'sc-logout-actionsheet'
      });
    }

  }

})();