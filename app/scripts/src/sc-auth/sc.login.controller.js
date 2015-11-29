(function() {
  'use strict';

  angular
    .module('scAuth')
    .controller('ScLoginCtrl', ScLoginCtrl);

  ScLoginCtrl.$inject = ['$scope', '$timeout', 'scAuth', 'scAlert', 'scUtility', '$ionicPlatform'];

  function ScLoginCtrl($scope, $timeout, scAuth, scAlert, scUtility, $ionicPlatform) {
    var vm = this;

    vm.logo = true;

    vm.login = login;
    vm.runLogoAnimation = runLogoAnimation;

    ////////////
    
    $ionicPlatform.ready(function(){
      // will execute when device is ready, or immediately if the device is already ready.
      vm.isAnimationAvailable = scUtility.isAnimationAvailable();
      //vm.runLogoAnimation();
    });

    function login(isValid) {

      if(!isValid) {
        scAlert.error('There was an issue signing in.');
        return false;
      }

      var params = {
        email: vm.loginCredentials.email,
        password: vm.loginCredentials.password
      };

      scAuth.login(params);
    }

    function runLogoAnimation() {
      // wait a second before showing the animation
      var timer = $timeout(
        function() {
          vm.logo = true;
        },
        1500
      );

      // cancel the timer on destroy
      $scope.$on(
        '$destroy',
        function() {
          $timeout.cancel(timer);
        }
      );
    }

  }
})();
