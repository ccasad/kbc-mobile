(function(){
  'use strict';

  angular
    .module('scTools')
    .controller('ScToolsStatCtrl', ScToolsStatCtrl);

  ScToolsStatCtrl.$inject = ['scUser', 'scStats', 'scAlert', '$rootScope', '$state', '_'];

  /* @ngInject */
  function ScToolsStatCtrl(scUser, scStats, scAlert, $rootScope, $state, _) {
    var vm = this;

    vm.user = scUser.getRootUser();

    vm.stats = {
      statList: [],
      types: [{value: 1, name: 'Textual'}, {value: 2, name: 'Numeric'}],
      title: '',
      selectedStat: null,
      formData: {},
    };

    vm.getStats = getStats;
    vm.saveStat = saveStat;
    vm.cancelForm = cancelForm;

    //////////

    getStats();

    function getStats() {
      return scStats.getStats().then(function (response) {
        vm.stats.statList = response.data;

        if ($state.current.name === 'user.tools-stat-edit') {
          if ($state.params.statId && $state.params.statId.length) {
            vm.stats.title = 'Edit Stat';
            vm.stats.selectedStat = _.findWhere(vm.stats.statList, {'id': parseInt($state.params.statId)});
            vm.stats.formData.statName = vm.stats.selectedStat.name;
            vm.stats.formData.statDescription = vm.stats.selectedStat.description;
            vm.stats.formData.statType = vm.stats.selectedStat.formElementId;
          }
        } else if ($state.current.name === 'user.tools-stat-add') {
          vm.stats.title = 'Add Stat';
        }

        return vm.stats.statList;
      });
    }

    function saveStat() {
      if (vm.stats.formData.statName && vm.stats.formData.statDescription && vm.stats.formData.statType) {
        var params = {
          userId: vm.user.id,
          statId: ($state.params.statId) ? $state.params.statId : null,
          statName: vm.stats.formData.statName,
          statType: vm.stats.formData.statType,
          statDescription: vm.stats.formData.statDescription,
        };

        return scStats.updateStat(params).then(function(response) {
          if (response.data && response.data.msg) {
            scAlert.success(response.data.msg);
            return;
          }
          scAlert.success('The stat has been saved');

          if (!$state.params.statId) {
            vm.stats.formData.statName = null;
            vm.stats.formData.statType = null;
            vm.stats.formData.statDescription = null; 
          }
          $state.go('user.tools-stat-list');
        });
      }
    }

    function cancelForm() {
      if (vm.stats.isNew) {
        $state.go('user.tools-stat-list');
      } else {
        var prevState = $rootScope.$previousState;
        if (prevState && prevState.from) {
          $state.go(prevState.from, prevState.fromParams);
        }
      } 
    }
  }

})();