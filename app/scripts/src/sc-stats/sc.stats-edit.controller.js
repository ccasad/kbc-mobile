(function(){
  'use strict';

  angular
    .module('scStats')
    .controller('ScStatsEditCtrl', ScStatsEditCtrl);

  ScStatsEditCtrl.$inject = ['scStats', 'scUser', 'scAlert', '_', '$state', '$previousState', '$ionicActionSheet'];

  /* @ngInject */
  function ScStatsEditCtrl(scStats, scUser, scAlert, _, $state, $previousState, $ionicActionSheet) {
    var vm = this;

    vm.user = scUser.getRootUser();

    vm.stats = {
    	list: [],
    	typeOptions: [],
    	formData: {},
    	formFields: [],
      isNew: true,
      title: 'New Stat'
    };

    vm.stats.fields = {
  		statDate: {
	      key: 'statDate',
	      type: 'stacked-input',
	      templateOptions: {
	      	type: 'date',
	      	label: 'Date *',
	      	addonLeft: 'text',
	      	required: true
	      }
	    },
  		statType: {
        key: 'statType',
        type: 'select',
        templateOptions: {
          label: 'Type *',
          required: true,
          options: [],
          onChange: function($viewValue) {
            selectStat($viewValue);
          }
        }
      },
      statValue: {
	      key: 'statValue',
	      type: 'stacked-input',
	      templateOptions: {
	      	type: 'text',
	      	label: 'Value *',
	      	required: true
	      },
	      expressionProperties: {
          'templateOptions.disabled': function($viewValue, $modelValue, scope) {
            if (scope.model.statType) {
              return false;
            }
            return true;
          }
        }
	    },
	    statInfo: {
	      key: 'statInfo',
	      type: 'stacked-input',
	      templateOptions: {
	      	type: 'text',
	      	label: 'Additional info'
	      },
	      expressionProperties: {
          'templateOptions.disabled': function($viewValue, $modelValue, scope) {
            if (scope.model.statValue) {
              return false;
            }
            return true;
          }
        }
	    },
      statComment: {
        key: 'statComment',
        type: 'stacked-input',
        templateOptions: {
          type: 'text',
          label: 'Comment'
        },
        expressionProperties: {
          'templateOptions.disabled': function($viewValue, $modelValue, scope) {
            if (scope.model.statValue) {
              return false;
            }
            return true;
          }
        }
      }
  	};

	  vm.getStats = getStats;
	  vm.getStat = getStat;
	  vm.saveStat = saveStat;
    vm.deleteUserStat = deleteUserStat;
	  vm.cancelForm = cancelForm;

    ////////////

    getStatOptions();

    // edit mode
    if ($state.params.userStatId && $state.params.userStatId.length) {
      vm.stats.isNew = false;
      vm.stats.title = 'Edit Stat';
      vm.getUserStat = getUserStat($state.params.userStatId);
    }

    function selectStat(statId) {
    	var stat = _.find(vm.stats.list, {id: statId});

    	vm.stats.fields.statValue.templateOptions.type = scStats.getStatFormElementType(stat.formElementId);
    	vm.stats.fields.statValue.templateOptions.label = 'Value for ' + stat.name + ' *';
    	vm.stats.fields.statValue.templateOptions.placeholder = stat.description;

    	if (stat.formElementId === 6) {
    		vm.stats.fields.statValue.validators = vm.stats.timeValidator;
    	}

    	vm.stats.fields.statInfo.templateOptions.label = 'Additional info for ' + stat.name;
    	vm.stats.fields.statInfo.templateOptions.placeholder = '(i.e. lbs, inches, )';

      vm.stats.fields.statComment.templateOptions.placeholder = 'Have anything else to mention?';

    	setStatFields();
    }

    function getStatOptions() {
    	return getStats().then(function() {
    		
				_.each(vm.stats.list, function(stat) {
					vm.stats.typeOptions.push({name: stat.name, value: stat.id});
				});

				setStatFields();

				return vm.stats.typeOptions;
    	});
    }

    function setStatFields() {
    	vm.stats.fields.statType.templateOptions.options = vm.stats.typeOptions;

    	vm.stats.formFields = [
		  	vm.stats.fields.statDate,
			  vm.stats.fields.statType,
		    vm.stats.fields.statValue,
		    vm.stats.fields.statInfo,
        vm.stats.fields.statComment
		  ];
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
              
              $previousState.go();
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
          vm.stats.formData.statDate = (response.data.date) ? new Date(response.data.date+' 00:00:00') : '';
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
        $state.go('user.stats-pr-list');
        //$previousState.go();
      } 
    }
  }

})();
