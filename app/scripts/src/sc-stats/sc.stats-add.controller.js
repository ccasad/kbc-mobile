(function(){
  'use strict';

  angular
    .module('scStats')
    .controller('ScStatsAddCtrl', ScStatsAddCtrl);

  ScStatsAddCtrl.$inject = ['scStats', 'scUser', 'scAlert', '_', '$state'];

  /* @ngInject */
  function ScStatsAddCtrl(scStats, scUser, scAlert, _, $state) {
    var vm = this;

    vm.user = scUser.getRootUser();

    vm.stats = {
    	list: [],
    	typeOptions: [],
    	formData: {},
    	formFields: [],
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
	    }
  	};

	  vm.getStats = getStats;
	  vm.getStat = getStat;
	  vm.saveStat = saveStat;
	  vm.cancel = cancel;
	  
    ////////////

    getStatOptions();

    function selectStat(statId) {
    	var stat = _.find(vm.stats.list, {id: statId});

    	vm.stats.fields.statValue.templateOptions.type = scStats.getStatFormElementType(stat.formElementId);
    	vm.stats.fields.statValue.templateOptions.label = 'Value for ' + stat.name + ' *';
    	vm.stats.fields.statValue.templateOptions.placeholder = stat.description;

    	vm.stats.fields.statInfo.templateOptions.label = 'Additional info for ' + stat.name;
    	vm.stats.fields.statInfo.templateOptions.placeholder = '(i.e. weight of dynamax ball)';

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
		    vm.stats.fields.statInfo
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
    			userId: vm.user.id,
    			statDate: vm.stats.formData.statDate,
    			statId: vm.stats.formData.statType,
    			statValue: vm.stats.formData.statValue,
    			statInfo: vm.stats.formData.statInfo
    		};

    		return scStats.updateUserStat(params).then(function() {
	        scAlert.success('The stat has been saved');
	        $state.go('user.stats-list');
	      });
    	}
    }

    function cancel() {

    }
  }

})();
