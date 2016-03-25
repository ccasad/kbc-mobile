(function(){
  'use strict';

  angular
    .module('scStats')
    .controller('ScStatsEditCtrl', ScStatsEditCtrl);

  ScStatsEditCtrl.$inject = ['scStats', 'scUser', 'scAlert', '_', '$state', '$ionicActionSheet', '$rootScope', 'scMoment', 'ionicDatePicker'];

  /* @ngInject */
  function ScStatsEditCtrl(scStats, scUser, scAlert, _, $state, $ionicActionSheet, $rootScope, scMoment, ionicDatePicker) {
    var vm = this;

    vm.user = scUser.getRootUser();

    vm.stats = {
    	list: [],
    	typeOptions: [],
    	formData: {
        statId: null,
        statDate: new Date(),
        statType: null,
        statValue: null,
        statInfo: null,
        statComment: null
      },
      statValueType: 'text',
      statValueDesc: '',
      isNew: true,
      title: 'New Stat',
      datePicker: {
        callback: function(val) {
          console.log('Date selected: '+val, new Date(val));
        }
      },
      selectableNames:  [
        { name : 'Mauro', role : 'black hat'}, 
        { name : 'Silvia', role : 'pineye'},
        { name : 'Merlino', role : 'little canaglia'}
      ],
      someSetModel: 'Mauro',
    };

    vm.selectStat = selectStat;
	  vm.getStats = getStats;
	  vm.getStat = getStat;
	  vm.saveStat = saveStat;
    vm.deleteUserStat = deleteUserStat;
	  vm.cancelForm = cancelForm;
    vm.openDatePicker = openDatePicker;

    ////////////

    getStatOptions();

    // edit mode
    if ($state.params.userStatId && $state.params.userStatId.length) {
      vm.stats.isNew = false;
      vm.stats.title = 'Edit Stat';
      vm.getUserStat = getUserStat($state.params.userStatId);
      vm.isInitial = true;
    }

    function selectStat() {
    	var stat = _.find(vm.stats.list, {id: vm.stats.formData.statType});

      if (!vm.isInitial) {
        vm.stats.statValueType = scStats.getStatFormElementType(stat.formElementId);
        vm.stats.statValueDesc = '- '+stat.description;
      }
      vm.isInitial = false;
    } 

    function getStatOptions() {
    	return getStats().then(function() {
    		
				_.each(vm.stats.list, function(stat) {
					vm.stats.typeOptions.push({name: stat.name, value: stat.id});
				});

        vm.stats.formData.statType = vm.stats.list[0].id; 
        selectStat();

				return vm.stats.typeOptions;
    	});
    }

    function getStats() {
    	return scStats.getStats().then(function (response) {
        vm.stats.list = response.data;
        return vm.stats.list;
      });
    }

    function getStat() {
    	if (!vm.statType) {
    		return;
    	}

    	return scStats.getStat(vm.statType).then(function (response) {
        vm.stats.list = response.data;
        return vm.stats.list;
      });
    }

    function saveStat() {
    	if (vm.stats.formData.statDate && vm.stats.formData.statType && vm.stats.formData.statValue) {
    		var params = {
          userStatId: $state.params.userStatId,
    			userId: vm.user.id,
    			statDate: vm.stats.formData.statDate,
    			statId: vm.stats.formData.statType,
    			statValue: vm.stats.formData.statValue,
    			statInfo: vm.stats.formData.statInfo,
          statComment: vm.stats.formData.statComment
    		};

    		return scStats.updateUserStat(params).then(function(response) {
          if (response.data && response.data.msg) {
            scAlert.success(response.data.msg);
            return;
          }
	        scAlert.success('The stat has been saved');

          if (!$state.params.userStatId) {
            vm.stats.formData.statDate = null;
            vm.stats.formData.statType = null;
            vm.stats.formData.statValue = null;
            vm.stats.formData.statInfo = null;
            vm.stats.formData.statComment = null;
            
            $state.go('user.stats-pr-list');
          }
	      });
    	}
    }

    function deleteUserStat() {

      $ionicActionSheet.show({
        buttons: [
          { text: 'Yes' },
          { text: 'No' }
        ],
        titleText: 'Delete this stat?',
        buttonClicked: function(index) {
          if (index === 0 && $state.params.userStatId && $state.params.userStatId.length) {
            scStats.deleteUserStat(vm.user.id, $state.params.userStatId).then(function(response) {
              if (response.data && response.data.msg) {
                scAlert.success(response.data.msg);
                return;
              }
              scAlert.success('The stat has been deleted');

              vm.stats.formData.statDate = null;
              vm.stats.formData.statType = null;
              vm.stats.formData.statValue = null;
              vm.stats.formData.statInfo = null;
              vm.stats.formData.statComment = null;
              
              var prevState = $rootScope.$previousState;
              if (prevState && prevState.from) {
                $state.go(prevState.from, prevState.fromParams);
              }
            });
          }
          return true;
        }
      });

      
    }

    function getUserStat(userStatId) {
      if (userStatId && userStatId.length) {
        return scStats.getUserStat(vm.user.id, userStatId).then(function(response) {
          if (!response || !response.data) {
            scAlert.success('Issue retrieving user stats.');
            return;
          }
          vm.stats.statValueType = scStats.getStatFormElementType(response.data.formElementId);
          vm.stats.statValueDesc = '- '+response.data.description;

          vm.stats.formData.statDate = (response.data.date) ? scMoment(response.data.date).toDate() : '';
          
          vm.stats.formData.statType = response.data.id;
          vm.stats.formData.statValue = response.data.value;
          vm.stats.formData.statInfo = response.data.info;
          vm.stats.formData.statComment = response.data.comment;
        });
      }
    }

    function cancelForm() {
      if (vm.stats.isNew) {
        $state.go('user.stats-pr-list');
      } else {
        var prevState = $rootScope.$previousState;
        if (prevState && prevState.from) {
          $state.go(prevState.from, prevState.fromParams);
        }
      } 
    }

    function openDatePicker() {
      ionicDatePicker.openDatePicker(vm.stats.datePicker);
    }
  }

})();
