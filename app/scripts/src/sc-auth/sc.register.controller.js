(function() {
  'use strict';

  angular
    .module('scAuth')
    .controller('ScRegisterCtrl', ScRegisterCtrl);

  ScRegisterCtrl.$inject = ['scAuth', 'scAlert'];

  function ScRegisterCtrl(scAuth, scAlert) {
    var vm = this;

    vm.register = register;

    //////////

    function register(isValid) {

      if(!isValid) {
        scAlert.error('There was an issue with your registration.');
        return false;
      }

      var params = {
        firstName: vm.registerFields.firstName,
        lastName: vm.registerFields.lastName,
        email: vm.registerFields.email,
        password: vm.registerFields.password
      };

      scAuth.register(params);
    }
  }
})();
