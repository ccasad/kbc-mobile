(function() {
  'use strict';

  angular
    .module('scAuth')
    .controller('ScForgotPasswordCtrl', ScForgotPasswordCtrl);

  ScForgotPasswordCtrl.$inject = ['scAuth', 'scAlert'];

  function ScForgotPasswordCtrl(scAuth, scAlert) {
    var vm = this;

    vm.resetPassword = resetPassword;

    //////////

    function resetPassword(isValid) {

      if(!isValid) {
        scAlert.error('There was an issue resetting your password.');
        return false;
      }

      var params = {
        email: vm.resetPasswordFields.email
      };

      scAuth.resetPassword(params);
    }
  }
})();
