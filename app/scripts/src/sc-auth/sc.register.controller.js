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

    function register(form) {

      if(form.$invalid) {
        if (form.firstName.$invalid) {
          scAlert.error('There was an issue with your First Name.');
        } else if (form.lastName.$invalid) {
          scAlert.error('There was an issue with your Last Name.');
        } else if (form.email.$invalid) {
          scAlert.error('There was an issue with your Email.');
        } else if (form.password.$invalid) {
          scAlert.error('Your Password is required.');
        } else {
          scAlert.error('There was an issue with your registration.');
        }
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
