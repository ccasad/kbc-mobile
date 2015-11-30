(function() {
  'use strict';

  angular
    .module('scAuth')
    .controller('ScForgotPasswordCtrl', ScForgotPasswordCtrl);

  ScForgotPasswordCtrl.$inject = ['$state', 'scAuth', 'scAlert'];

  function ScForgotPasswordCtrl($state, scAuth, scAlert) {
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

      return scAuth.resetPassword(params).then(function () {
        scAlert.success('A temporary password has been emailed to you.');
        $state.go('anon.login');
      });
    }
  }
})();
