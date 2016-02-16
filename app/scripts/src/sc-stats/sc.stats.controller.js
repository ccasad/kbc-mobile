(function(){
  'use strict';

  angular
    .module('scStats')
    .controller('ScStatsCtrl', ScStatsCtrl);

  ScStatsCtrl.$inject = ['scUser', 'scStats', 'scAlert', '$ionicLoading', '$scope', '$state', '$ionicModal', 'APP_GLOBALS', '_', 'scMoment'];

  /* @ngInject */
  function ScStatsCtrl(scUser, scStats, scAlert, $ionicLoading, $scope, $state, $ionicModal, APP_GLOBALS, _, scMoment) {
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
    };

    vm.chart = {
      labels: [],
      series: ['one'],
      data: [[]],
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
    vm.showFilters = showFilters;
    vm.applyFilters = applyFilters;
    vm.hideFilters = hideFilters;
    vm.clearFilters = clearFilters;
    vm.showLoading = showLoading;
    vm.hideLoading = hideLoading;

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

    function setChartStats() {
      vm.chart.labels = [];
      vm.chart.data[0] = [];
      _.each(vm.stats.list, function(stat, index) {
        var d = getFormattedDateString(stat.statDate, index);
        vm.chart.labels.push(d);
        var v = stat.statValue.replace(':', '.');
        vm.chart.data[0].push(v);
      });
    }

    function getFormattedDateString(inDate, index) {
      var d = scMoment(inDate);

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
  }

})();