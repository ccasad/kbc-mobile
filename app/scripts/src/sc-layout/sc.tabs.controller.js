(function() {
  'use strict';

  angular
    .module('scLayout')
    .controller('ScTabsCtrl', ScTabsCtrl);

  ScTabsCtrl.$inject = ['scUser'];

  /* @ngInject */
  function ScTabsCtrl(scUser) {
    var vm = this;

    var user = scUser.getRootUser();

    vm.isAdmin = scUser.isAdmin(user);

    //////////

  }

})();
