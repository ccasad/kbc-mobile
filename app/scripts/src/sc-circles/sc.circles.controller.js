(function() {
  'use strict';

  angular
    .module('scCircles')
    .controller('ScCirclesCtrl', ScCirclesCtrl);

  ScCirclesCtrl.$inject = ['$state', 'APP_GLOBALS', 'scCircles'];

  /* @ngInject */
  function ScCirclesCtrl($state, APP_GLOBALS, scCircles) {
    var vm = this;

    vm.circles = {
      title: $state.current.data.tabTitle,
      cirCatId: APP_GLOBALS.circles.forum.catId,
      loading: true,
      list: [],
      noCirclesText: 'No Circles Found',
    };

    vm.getCirclesList = getCirclesList;

    ////////////

    vm.getCirclesList();

    function getCirclesList() {
      vm.circles.loading = true;

      var additionalParams = null;
      // var additionalParams = {
      //   getCircleMsgCount: false,
      //   getCircleMemberCount: false,
      // };

      scCircles.getCirclesByCategory(vm.circles.cirCatId, additionalParams).then(function(response){
        if(response.circles) {
          vm.circles.list = response.circles;
        }
        vm.circles.loading = false;
      });

    } // End of getCirclesList


  }

})();
