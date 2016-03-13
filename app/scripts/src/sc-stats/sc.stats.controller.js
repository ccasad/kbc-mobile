(function(){
  'use strict';

  angular
    .module('scStats')
    .controller('ScStatsCtrl', ScStatsCtrl);

  ScStatsCtrl.$inject = ['scUser', 'scStats', 'scAlert', '$ionicLoading', '$scope', '$state', '$ionicModal', '$ionicPopup', 'APP_GLOBALS', '_', 'scMoment'];

  /* @ngInject */
  function ScStatsCtrl(scUser, scStats, scAlert, $ionicLoading, $scope, $state, $ionicModal, $ionicPopup, APP_GLOBALS, _, scMoment) {
    var vm = this;

    var user = scUser.getRootUser();

    vm.stats = {
      list: [],
      statList: [],
      formFields: [],
      typeOptions: [],
      skipNoRecords: 0,
      maxLimit: 5,
      orderByFieldList: [
        {id: 'statId', name: 'Id', direction: 'DESC'},
        {id: 'statName', name: 'Name', direction: 'ASC'},
        {id: 'statDate', name: 'Date', direction: 'ASC'},
        {id: 'statValue', name: 'Value', direction: 'ASC'},
        {id: 'statInfo', name: 'Info', direction: 'DESC'},
      ],
      orderByField : 'statName',
      orderByType: 'ASC',
      isFilterVisible: true,
      loading: true,
      title: '',
      isChart: false,
      goal: '',
      newGoal: '',
    };

    vm.chart = {
      labels: [],
      series: ['Goal', 'Stat Performed'],
      data: [[]],
      colors: [
        {fillColor: 'rgba(206, 96, 84, 0)',
         strokeColor: 'rgba(206, 96, 84, 1)',
         pointColor: 'rgba(206, 96, 84, 0)',
         pointStrokeColor: '#fff',
         pointHighlightFill: '#fff',
         pointHighlightStroke: 'rgba(206, 96, 84, 0.8)'}, 
        {fillColor: 'rgba(151, 187, 205, 0.2)',
         strokeColor: 'rgba(151, 187, 205, 1)',
         pointColor: 'rgba(151, 187, 205, 1)',
         pointStrokeColor: '#fff',
         pointHighlightFill: '#fff',
         pointHighlightStroke: 'rgba(151, 187, 205, 0.8)'}, 
      ],
      startDate: null,
      stopDate: null,
    };

    vm.stats.formData = {};

    vm.stats.fields = {
      orderBy: {
        key: 'orderBy',
        type: 'select',
        defaultValue: 'statName',
        templateOptions: {
          label: 'Order By',
          options: [
            {name: 'Name', value: 'statName'},
            {name: 'Date', value: 'statDate'},
            {name: 'Value', value: 'statValue'}
          ]
        }
      },
      orderDir: {
        key: 'orderDir',
        type: 'toggle',
        templateOptions: {
          label: 'Ascending Order',
          toggleClass: 'balanced'
        },
        expressionProperties: {
          'templateOptions.label': function($viewValue, $modelValue, scope) {
            if (scope.model.orderDir) {
              return 'Descending Order';
            }
            return 'Ascending Order';
          }
        }
      }
    };

    vm.setStatsList = setStatsList;
    vm.getStats = getStats;
    vm.getMyStats = getMyStats;
    vm.getUserStats = getUserStats;
    vm.getUserStatGoal = getUserStatGoal;
    vm.showFilters = showFilters;
    vm.applyFilters = applyFilters;
    vm.hideFilters = hideFilters;
    vm.clearFilters = clearFilters;
    vm.showLoading = showLoading;
    vm.hideLoading = hideLoading;
    vm.showGoalPopup = showGoalPopup;

    ////////////

    getStatOptions();

    if ($state.current.name === 'user.stats-pr-list') {
      vm.setStatsList();
    }

    function getStats() {
      return scStats.getStats().then(function (response) {
        vm.stats.statList = response.data;
        return vm.stats.statList;
      });
    }

    function getStatOptions() {
      return getStats().then(function() {
        
        vm.stats.typeOptions.push({name: 'All', value: 'all'});
        
        _.each(vm.stats.statList, function(stat) {
          vm.stats.typeOptions.push({name: stat.name, value: stat.id});
        });

        setStatFields();

        if ($state.current.name === 'user.stats-stat-list') {
          if ($state.params.statId && $state.params.statId.length) {
            vm.stats.title = _.result(_.findWhere(vm.stats.statList, {'id': parseInt($state.params.statId)}), 'name');
            getUserStats($state.params.statId, null, null, false);
          }
        }

        return vm.stats.typeOptions;
      });
    }

    function setStatFields() {
      //vm.stats.fields.statId.templateOptions.options = vm.stats.typeOptions;

      vm.stats.formFields = [
        //vm.stats.fields.statId,
        vm.stats.fields.orderBy,
        vm.stats.fields.orderDir
      ];
    }

    function getMyStats() {
      vm.getUserStats(vm.stats.formData.statId, vm.stats.formData.orderBy, vm.stats.formData.orderDir, true);
    }

    function getUserStats(statId, orderBy, orderDir, prOnly) {
      var userId = user.id;
      statId = (!statId || statId === 'all') ? null : statId;
      orderBy = (orderBy) ? orderBy : 'statName';
      orderDir = (orderDir) ? 'DESC' : 'ASC';

      var params = {
        userId: userId,
        statId: statId,
        orderBy: orderBy,
        orderDir: orderDir,
        prOnly: prOnly
      };

      vm.showLoading();

      return scStats.getAllUsersStats(params).then(function (response) {
        vm.stats.list = response.data;
        vm.hideLoading();
        setChartStats();

        return vm.stats.list;
      });
    }

    function getUserStatGoal(statId) {
      var userId = user.id;
      
      if (!statId) {
        return false;
      }

      var params = {
        userId: userId,
        statId: statId,
      };

      return scStats.getUserStatGoal(params).then(function (response) {
        vm.stats.goal = response.data.goal;

        vm.chart.series[0] = 'Goal (Not set)';
        if (vm.stats.goal) {
          vm.chart.series[0] = 'Goal ('+vm.stats.goal+')';
        }

        var v = vm.stats.goal.replace(':', '.');

        vm.chart.data[0] = [];
        if (vm.stats.list.length < 2) {
          vm.chart.data[0].push(v);
        }

        _.each(vm.stats.list, function() {
          vm.chart.data[0].push(v);
        });

        return vm.stats.goal;
      });
    }

    function getStat(statId) {
      if (!statId) {
        return false;
      }

      return scStats.getStat(statId).then(function (response) {
        var stat = response.data;
        return stat;
      });
    }

    function setChartStats() {
      vm.chart.labels = [];
      vm.chart.data[1] = [];
      _.each(vm.stats.list, function(stat, index) {
        var d = getFormattedDateString(stat.statDate, index);
        vm.chart.labels.push(d);
        var v = stat.statValue.replace(':', '.');
        vm.chart.data[1].push(v);
      });

      if (vm.stats.list.length < 2) {
        vm.chart.labels.push(getFormattedDateString(null, 99999));
      }
      
      if ($state.current.name === 'user.stats-stat-list') {
        if ($state.params.statId && $state.params.statId.length) {
          getUserStatGoal($state.params.statId);
        }
      }
    }

    function getFormattedDateString(inDate, index) {
      var d = scMoment();
      if (inDate) {
        d = scMoment(inDate);
      }

      var outDate;
      if (index > 0 && d.month() > 0) {
        outDate = d.format('D MMM');
      } else {
        outDate = d.format('D MMM YY');
      }

      return outDate;
    }

    function setStatsList() {

      vm.getMyStats();

      $ionicModal.fromTemplateUrl( APP_GLOBALS.appModulesPath + APP_GLOBALS.appStatsModuleDir + 'sc.stats-filters-modal.view.html', {
        scope: $scope,
        animation: 'slide-in-up'
      }).then(function(modal) {
        $scope.modal = modal;
      });
      //Cleanup the modal when we're done with it!
      $scope.$on('$destroy', function() {
        $scope.modal.remove();
      });
      // Execute action on hide modal
      $scope.$on('modal.hidden', function() {
        // Execute action
      });
      // Execute action on remove modal
      $scope.$on('modal.removed', function() {
        // Execute action
      });

    } // End of setStatsList

    function applyFilters() {
      $scope.modal.hide();
      vm.stats.skipNoRecords =  0;
      vm.getMyStats();
    } // end of applyFilters

    function showFilters() {
      $scope.modal.show();
    } // End of showFilters

    function hideFilters() {
      $scope.modal.hide();
    } // end of hideFilters

    function clearFilters() {
      vm.stats.skipNoRecords =  0;
      vm.stats.orderByField = 'StatName';
      vm.stats.orderByType = 'ASC';
      vm.stats.formData.orderBy = 'StatName';
      vm.stats.formData.orderDir = 'ASC';

      vm.getMyStats();
      $scope.modal.hide();
    } // end of clearFilters

    function showLoading() {
      $ionicLoading.show({
        template: 'Loading...'
      });
    }

    function hideLoading(){
      $ionicLoading.hide();
    }

    function showGoalPopup() {
      if (vm.stats.goal) {
        vm.stats.newGoal = vm.stats.goal;
      }

      getStat($state.params.statId).then(function(stat){
        var statType = scStats.getStatFormElementType(stat.formElementId);
        var stepValue = (statType === 'number') ? 'step="any"' : '';
        var goalPopup = $ionicPopup.show({
          template: '<input type="'+statType+'" '+stepValue+' ng-model="vm.stats.newGoal" placeholder="Enter goal" class="sc-popup-textbox">',
          title: 'Enter your goal for<br>'+vm.stats.title,
          scope: $scope,
          buttons: [
            { text: 'Cancel' },
            {
              text: '<b>Save</b>',
              type: 'button-balanced sc-form-button',
              onTap: function(e) {
                if (!vm.stats.newGoal) {
                  //don't allow the user to close unless they enter a goal 
                  e.preventDefault();
                } else {
                  return vm.stats.newGoal;
                }
              }
            }
          ]
        }); 

        goalPopup.then(function(goalValue) {
          
          if (goalValue) {
            var userId = user.id;
          
            var params = {
              userId: userId,
              statId: $state.params.statId,
              goal: goalValue,
            };

            return scStats.updateUserStatGoal(params).then(function (response) {
              if (response.data && response.data.goal) {
                vm.stats.goal = response.data.goal;
                setChartStats();
                return vm.stats.goal;
              }
              return false;
            });
          }
        });
      });
    }
  }

})();