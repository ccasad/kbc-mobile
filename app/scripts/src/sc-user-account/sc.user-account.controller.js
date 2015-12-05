(function(){
  'use strict';

  angular
    .module('scUserAccount')
    .controller('ScUserAccountCtrl', ScUserAccountCtrl);

  ScUserAccountCtrl.$inject = ['scUser', 'scAuth', 'scAlert', '$ionicActionSheet'];

  function ScUserAccountCtrl(scUser, scAuth, scAlert, $ionicActionSheet) {
    var vm = this;

    vm.user = scUser.getRootUser();

    vm.account = {
      showForm: false,
      formData: {},
      formFields: [],
    };

    vm.account.fields = {
      currentPassword: {
        key: 'currentPassword',
        type: 'stacked-input',
        templateOptions: {
          type: 'password',
          label: 'Current password *',
          placeholder: 'Enter your current password',
          addonLeft: 'text',
          required: true
        }
      },
      newPassword: {
        key: 'newPassword',
        type: 'stacked-input',
        templateOptions: {
          type: 'password',
          label: 'New password *',
          placeholder: 'Enter a new password',
          addonLeft: 'text',
          required: true
        }
      },
      confirmPassword: {
        key: 'confirmPassword',
        type: 'stacked-input',
        templateOptions: {
          type: 'password',
          label: 'Confirm password *',
          placeholder: 'Confirm the new password',
          addonLeft: 'text',
          required: true
        }
      }
    };

    vm.setFormFields = setFormFields;
    vm.updateAccount = updateAccount;
    vm.signOut = signOut;
    vm.clearForm = clearForm;

    ///////////////

    setFormFields();

    function setFormFields() {
      vm.account.formFields = [
        vm.account.fields.currentPassword,
        vm.account.fields.newPassword,
        vm.account.fields.confirmPassword
      ];
    }

    function updateAccount() {
      if (vm.account.formData.currentPassword && vm.account.formData.newPassword && vm.account.formData.confirmPassword) {
        if (vm.account.formData.newPassword !== vm.account.formData.confirmPassword) {
          scAlert.error('Your confirm password must match your new password.');
        }
        var params = {
          passwordCurrent: vm.account.formData.currentPassword,
          passwordNew: vm.account.formData.newPassword,
          passwordConfirm: vm.account.formData.confirmPassword
        };

        return scUser.updateAccount(params).then(function() {
          scAlert.success('You password has been saved');
          vm.clearForm();
        });
      } else {
        scAlert.error('All fields are required.');
      }
    }

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

    function clearForm() {
      vm.account.formData.currentPassword = '';
      vm.account.formData.newPassword = '';
      vm.account.formData.confirmPassword = '';
      vm.account.showForm = false;
    }
  }

})();