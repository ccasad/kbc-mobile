(function(){
  'use strict';

  angular
    .module('scUserAccount')
    .controller('ScUserAccountCtrl', ScUserAccountCtrl);

  ScUserAccountCtrl.$inject = ['scUser', 'scAuth', 'scAlert', '$ionicActionSheet', '$scope', '$ionicPopup'];

  function ScUserAccountCtrl(scUser, scAuth, scAlert, $ionicActionSheet, $scope, $ionicPopup) {
    var vm = this;

    vm.user = scUser.getRootUser();

    vm.account = {
      showForm: false,
      formData: {},
      formFields: [],
      currentPassword: null,
    };

    vm.account.fields = {
      firstName: {
        key: 'firstName',
        type: 'stacked-input',
        defaultValue: vm.user.firstName,
        templateOptions: {
          type: 'text',
          label: 'First Name *',
          placeholder: 'Enter your first name',
          addonLeft: 'text',
          required: true
        }
      },
      lastName: {
        key: 'lastName',
        type: 'stacked-input',
        defaultValue: vm.user.lastName,
        templateOptions: {
          type: 'text',
          label: 'Last Name *',
          placeholder: 'Enter your last name',
          addonLeft: 'text',
          required: true
        }
      },
      newPassword: {
        key: 'newPassword',
        type: 'stacked-input',
        templateOptions: {
          type: 'password',
          label: 'New password',
          placeholder: 'Enter a new password',
          addonLeft: 'text',
          required: false
        }
      },
      confirmPassword: {
        key: 'confirmPassword',
        type: 'stacked-input',
        templateOptions: {
          type: 'password',
          label: 'Confirm password',
          placeholder: 'Confirm the new password',
          addonLeft: 'text',
          required: false
        }
      }
    };

    vm.setFormFields = setFormFields;
    vm.updateAccount = updateAccount;
    vm.signOut = signOut;
    vm.clearForm = clearForm;
    vm.showPasswordPopup = showPasswordPopup;

    ///////////////

    setFormFields();

    function setFormFields() {
      vm.account.formFields = [
        vm.account.fields.firstName,
        vm.account.fields.lastName,
        vm.account.fields.newPassword,
        vm.account.fields.confirmPassword
      ];
    }

    function updateAccount() {
      if (vm.account.currentPassword) {
        if (vm.account.formData.newPassword && (vm.account.formData.newPassword !== vm.account.formData.confirmPassword)) {
          scAlert.error('Your confirm password must match your new password.');
        }
        var params = {
          firstName: vm.account.formData.firstName,
          lastName: vm.account.formData.lastName,
          passwordNew: vm.account.formData.newPassword,
          passwordConfirm: vm.account.formData.confirmPassword,
          passwordCurrent: vm.account.currentPassword,
        };

        return scUser.updateAccount(params).then(function(response) {
          if (!response || !response.status || (response.status && !response.status.success)) {
            var message = '';
            if (response.status.msg) {
              message = response.status.msg;
            }
            scAlert.error(message);
          } else {
            scAlert.success('You profile information has been saved');
            vm.clearForm();
            scUser.updateRootUser();

            if (response.data) {
              vm.user.firstName = response.data.firstName;
              vm.user.lastName = response.data.lastName;
            }
          }
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
      vm.account.formData.newPassword = '';
      vm.account.formData.confirmPassword = '';
      vm.account.showForm = false;
    }

    function showPasswordPopup() {
      vm.account.currentPassword = '';

      $ionicPopup.show({
        template: '<input type="text" data-ng-model="vm.account.currentPassword" placeholder="Current password" class="sc-popup-textbox">',
        title: 'Enter your current password',
        scope: $scope,
        buttons: [
          { 
            text: 'Cancel'
          },
          {
            text: '<b>Ok</b>',
            type: 'button-balanced sc-form-button',
            onTap: function(e) {
              if (!vm.account.currentPassword) {
                //don't allow the user to close unless they enter a goal 
                e.preventDefault();
              } else {
                updateAccount();
                return vm.account.currentPassword;
              }
            }
          }
        ]
      }); 
    }
  }

})();