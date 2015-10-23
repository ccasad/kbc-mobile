(function() {
  'use strict';

  angular
    .module('scAuth')
    .controller('ScAuthCtrl', ScAuthCtrl);

  ScAuthCtrl.$inject = ['auth', '$state', '$scope', '$timeout', 'store', 'scAuth', 'scAlert', 'scUtility', '$ionicPlatform'];

  function ScAuthCtrl(auth, $state, $scope, $timeout, store, scAuth, scAlert, scUtility, $ionicPlatform) {
    var vm = this;
    vm.login = login;
    vm.loginWithSocialAccount = loginWithSocialAccount;
    vm.socialAccounts = scAuth.getSocialAccounts();
    vm.logo = false;
    vm.runLogoAnimation = runLogoAnimation;
    ////////////
    $ionicPlatform.ready(function(){
      // will execute when device is ready, or immediately if the device is already ready.
      vm.isAnimationAvailable = scUtility.isAnimationAvailable();
      vm.runLogoAnimation();
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

    function loginWithSocialAccount(socialAccount) {
      auth.signin({
        // authParams: {
        //   scope: 'openid offline_access', // This asks for the refresh token so that the user never has to log in again
        //   device: 'Mobile device' // This is the device name
        // },
        popup: true, // add popup: true if you want the google page to open in a popup // instead of doing a redirect
        connection: socialAccount,
        popupOptions: {scrollbars: 'yes'},
        // // scope: 'openid profile'
      },function() { // profile, token, accessToken, state, refreshToken
        // TODO Success callback
        // console.log('auth0 login success'); // console.log(auth.profile); console.log(auth.accessToken); console.log(auth.idToken); console.log(auth.state);
        //   store.set('profile', profile);
        //   store.set('token', token);
        //   store.set('refreshToken', refreshToken);

        /*jshint camelcase: false */
        var params = {
          auth0UserId: auth.profile.user_id
        };
        scAuth.loginByAuth0UserId(params);
        //scAuth.login({email: 'rachel.hale63@example.com',password: '12345'});

      }, function(error) {
        // console.log('There was an issue while attempting to sign in. Please try again.');
        console.log(error);
      });

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